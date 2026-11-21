// Validates the 1:1 Confluence documentation tree in docs/ (AltexSoft + SDD), exports Markdown/XHTML bundles
// and publishes pages to Confluence 8.4.5 (devtools.wi.pb.edu.pl/confluence).
//
//   npm run docs:check                                   # structure, required documents, internal links (CI)
//   npm run docs:export                                  # write .artifacts/confluence-export (MD + XHTML + manifest)
//   npm run docs:publish -- --dry-run                    # show the page tree that would be published
//   npm run docs:publish -- --changed-since develop --only-existing
//                                                        # update only pages changed since a git ref that already exist
//
// Page selection (export and publish): --include <path or glob> (repeatable) and/or --changed-since <git ref>.
// Parent README pages are added automatically. --only-existing never creates new pages in Confluence.
// The token comes from CONFLUENCE_PERSONAL_TOKEN (the npm script loads .env); never put it on the command line.
// WARNING: docs/README.md replaces the content of the space home page.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname } from 'node:path';
import { parseArgs } from 'node:util';
import { readText, rel, repoPath, ROOT, run, syncOutputs } from '../lib.ts';

const DOCS_DIR = repoPath('docs');
const EXPORT_DIR = repoPath('.artifacts/confluence-export');
const DEFAULT_CONFLUENCE_URL = 'https://devtools.wi.pb.edu.pl/confluence';
const DEFAULT_SPACE_NAME_HINT = '2026PT GCDC'; // space of team "Gra sieciowa" (key PT2026GCGS)
const HOME = '__SPACE_HOME__';

const EXPECTED_SECTIONS: Record<string, string> = {
  '00-przewodnik-i-setup': '00. Przewodnik i konfiguracja środowiska',
  '01-dokumentacja-systemowa': '01. Dokumentacja produktowa — systemowa (PRD i SAD)',
  '02-dokumentacja-uzytkownika': '02. Dokumentacja produktowa — użytkownika i wdrożenia',
  '03-dokumentacja-procesowa': '03. Dokumentacja procesowa i zarządcza',
  '04-system-agentow-ai': '04. System agentów AI i SDD',
  '05-szablony': '05. Biblioteka szablonów dokumentacji',
  '99-archiwum-zrodel': '99. Archiwum źródeł (tylko do odczytu)',
};

const SUBSECTION_TITLES: Record<string, string> = {
  '01-dokumentacja-systemowa/07-decyzje-adr': '1.7 Decyzje architektoniczne (ADR)',
  '03-dokumentacja-procesowa/02-backlog': '3.2 Rejestr produktu i eksport do Jiry PB',
  '03-dokumentacja-procesowa/03-scrum-i-spotkania': '3.3 Ceremonie Scrum, raporty sprintów i spotkania zespołu',
  '03-dokumentacja-procesowa/04-badania-i-analizy': '3.4 Badania techniczne i analizy porównawcze',
};

const REQUIRED_CORE_FILES = [
  'README.md',
  '00-przewodnik-i-setup/README.md',
  '00-przewodnik-i-setup/01-szybki-start-i-instalacja.md',
  '00-przewodnik-i-setup/02-architektura-dokumentacji-sdd.md',
  '00-przewodnik-i-setup/03-proces-pracy-i-git-scrum.md',
  '00-przewodnik-i-setup/04-sciaga-komend.md',
  '00-przewodnik-i-setup/05-slownik-pojec.md',
  '00-przewodnik-i-setup/06-decyzje-otwarte-i-zalozenia.md',
  '00-przewodnik-i-setup/07-plan-wdrozenia-i-migracji.md',
  '01-dokumentacja-systemowa/README.md',
  '01-dokumentacja-systemowa/01-prd-wymagania-produktu.md',
  '01-dokumentacja-systemowa/02-specyfikacja-regul-gry.md',
  '01-dokumentacja-systemowa/03-indeks-regul-r-nn.md',
  '01-dokumentacja-systemowa/04-rozbieznosci-prototypu.md',
  '01-dokumentacja-systemowa/05-sad-architektura-systemu.md',
  '01-dokumentacja-systemowa/06-stos-technologiczny.md',
  '01-dokumentacja-systemowa/07-decyzje-adr/README.md',
  '01-dokumentacja-systemowa/08-mapa-kodu-i-modulow.md',
  '01-dokumentacja-systemowa/09-kontrakty-i-api.md',
  '01-dokumentacja-systemowa/10-ux-design-i-przeplywy.md',
  '01-dokumentacja-systemowa/11-strategia-testow-qa.md',
  '02-dokumentacja-uzytkownika/README.md',
  '02-dokumentacja-uzytkownika/01-podrecznik-gracza.md',
  '02-dokumentacja-uzytkownika/02-instrukcja-wdrozenia-i-utrzymania.md',
  '03-dokumentacja-procesowa/README.md',
  '03-dokumentacja-procesowa/01-dip-dokument-inicjujacy.md',
  '03-dokumentacja-procesowa/02-backlog/README.md',
  '03-dokumentacja-procesowa/02-backlog/BACKLOG.md',
  '04-system-agentow-ai/README.md',
  '04-system-agentow-ai/01-architektura-i-konfiguracja-agentow.md',
  '04-system-agentow-ai/02-katalog-rol-i-wbudowanych-skilli.md',
  '04-system-agentow-ai/03-jak-pisac-specyfikacje-openspec.md',
  '04-system-agentow-ai/04-warsztat-tworzenie-agentow-skilli-i-kart.md',
  '05-szablony/README.md',
  '05-szablony/naglowek-strony-confluence.md',
  '05-szablony/szablon-prd.md',
  '05-szablony/szablon-sad.md',
  '05-szablony/szablon-tdd.md',
];

// ------------------------------------------------------------------------------------------- validation

const walkMarkdown = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true })
    .flatMap((d) => (d.isDirectory() ? walkMarkdown(`${dir}/${d.name}`) : d.name.endsWith('.md') ? [`${dir}/${d.name}`] : []))
    .sort();

function stripCodeFences(markdown: string): string {
  let inFence = false;
  return markdown
    .split('\n')
    .filter((line) => {
      if (line.trim().startsWith('```')) {
        inFence = !inFence;
        return false;
      }
      return !inFence;
    })
    .join('\n');
}

function validateTree(): { errors: string[]; mdFiles: string[] } {
  const errors: string[] = [];
  const dirs = new Set(readdirSync(DOCS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name));
  for (const d of [...dirs].filter((d) => !(d in EXPECTED_SECTIONS)).sort()) errors.push(`docs/${d}: unexpected top-level directory (breaks 1:1 Confluence mapping)`);
  for (const d of Object.keys(EXPECTED_SECTIONS).filter((d) => !dirs.has(d)).sort()) errors.push(`docs/${d}: missing expected 1:1 Confluence section directory`);
  for (const req of REQUIRED_CORE_FILES) if (!existsSync(`${DOCS_DIR}/${req}`)) errors.push(`docs/${req}: missing required core AltexSoft/SDD document`);

  const mdFiles = walkMarkdown(DOCS_DIR).filter((p) => !p.includes('/99-archiwum-zrodel/') && !p.includes('/test-import/'));
  for (const md of mdFiles) {
    for (const m of stripCodeFences(readText(md)).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = m[1].trim();
      if (!target || /^(https?:|mailto:|#)/.test(target) || target.includes('<') || target.includes('⟩')) continue;
      const pathPart = target.split('#')[0].trim();
      if (pathPart && !existsSync(`${dirname(md)}/${pathPart}`)) errors.push(`${rel(md)}: broken relative link -> '${target}'`);
    }
  }
  return { errors, mdFiles };
}

// ----------------------------------------------------------------------------------------- selection

/** Glob matched from the right, like Python's Path.match: `*` within a segment, `**` across segments. */
function globMatches(path: string, pattern: string): boolean {
  const source = pattern
    .split('**')
    .map((part) => part.replace(/[.+^${}()|[\]\\]/g, '\\$&').replaceAll('*', '[^/]*').replaceAll('?', '[^/]'))
    .join('.*');
  return new RegExp(`(^|/)${source}$`).test(path);
}

function changedSince(ref: string): string[] {
  const out = execFileSync('git', ['diff', '--name-only', ref, '--', 'docs'], { cwd: ROOT, encoding: 'utf8' });
  return out.split('\n').filter((p) => p.endsWith('.md')).map((p) => repoPath(p));
}

function selectPages(mdFiles: string[], patterns: string[], sinceRef: string | undefined): { errors: string[]; pages: string[] } {
  const errors: string[] = [];
  const known = new Set(mdFiles);
  const selected = new Set<string>();

  for (const raw of patterns) {
    const pattern = raw.replaceAll('\\', '/');
    const matches = mdFiles.filter((p) => rel(p) === pattern || p.slice(DOCS_DIR.length + 1) === pattern || globMatches(p, pattern));
    if (matches.length === 0) errors.push(`--include pattern matched no active Markdown pages: ${raw}`);
    for (const m of matches) selected.add(m);
  }
  if (sinceRef) for (const p of changedSince(sinceRef)) if (known.has(p)) selected.add(p);

  for (const page of [...selected]) {
    for (let dir = dirname(page); dir.startsWith(DOCS_DIR); dir = dirname(dir)) {
      if (known.has(`${dir}/README.md`)) selected.add(`${dir}/README.md`);
      if (dir === DOCS_DIR) break;
    }
  }
  return { errors, pages: [...selected].sort() };
}

// --------------------------------------------------------------------------------------- conversion

function resolveTitleAndParent(md: string): { title: string; parent: string | null; depth: number } {
  const relDocs = md.slice(DOCS_DIR.length + 1);
  const parts = relDocs.split('/');
  if (relDocs === 'README.md') return { title: HOME, parent: null, depth: 0 };

  const section = EXPECTED_SECTIONS[parts[0]];
  if (parts.length === 2 && parts[1] === 'README.md') return { title: section, parent: HOME, depth: 1 };
  if (parts.length === 3 && parts[2] === 'README.md') return { title: SUBSECTION_TITLES[`${parts[0]}/${parts[1]}`] ?? parts[1], parent: section, depth: 2 };

  let title = (readText(md).match(/^#\s+(.+)$/m)?.[1].trim() ?? parts.at(-1)!.replace(/\.md$/, '')).replace(/`([^`]+)`/g, '$1');
  if (relDocs === '03-dokumentacja-procesowa/02-backlog/BACKLOG.md') title = '3.2.1 Zestawienie pojemności sprintów i lista zadań (BACKLOG)';
  else if (relDocs === '03-dokumentacja-procesowa/02-backlog/instrukcja-importu-jira.md') title = '3.2.2 Instrukcja importu plików CSV do Jiry PB';

  if (parts.length === 2) return { title, parent: section, depth: 2 };
  return { title, parent: SUBSECTION_TITLES[`${parts[0]}/${parts[1]}`] ?? section, depth: 3 };
}

/** Python's html.escape (quote=True). */
const esc = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');

/** Inline Markdown (code spans, links, bold, italic, <br/>) -> XHTML. */
export function formatInline(input: string): string {
  const placeholders: string[] = [];
  const hold = (fragment: string) => `@@PH_${placeholders.push(fragment) - 1}@@`;

  let text = input.replace(/<br\s*\/?>/gi, () => hold('<br />'));
  text = text.replace(/`([^`]+)`/g, (_, code: string) => hold(`<code>${esc(code)}</code>`));
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
    const url = href.trim();
    return hold(/^(https?:|mailto:)/.test(url) ? `<a href="${esc(url)}">${esc(label)}</a>` : `<strong>${esc(label)}</strong> (<code>${esc(url)}</code>)`);
  });
  text = esc(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
  for (let i = placeholders.length - 1; i >= 0; i--) text = text.replaceAll(`@@PH_${i}@@`, placeholders[i]);
  return text;
}

const TABLE_SEPARATOR = /^\|?[\s:-]+\|[\s|:-]*$/;
const UL = /^[-*]\s+(.+)$/;
const OL = /^\d+\.\s+(.+)$/;
const cells = (row: string) => row.replace(/^\|+|\|+$/g, '').split('|').map((c) => c.trim());

/** A project Markdown document -> Confluence 8.4.5 storage XHTML. */
export function toStorageXhtml(markdown: string, relRepo: string, isIndex: boolean): string {
  const lines = markdown.split('\n');
  const out = [
    '<ac:structured-macro ac:name="info"><ac:rich-text-body>' +
      `<p><strong>Synchronizacja 1:1 z repozytorium Git:</strong> <code>${esc(relRepo)}</code></p>` +
      '</ac:rich-text-body></ac:structured-macro>',
  ];
  let i = 0;
  let skippedH1 = false;

  while (i < lines.length) {
    const stripped = lines[i].trim();
    if (!stripped || (stripped.startsWith('<!--') && stripped.endsWith('-->'))) {
      i++;
      continue;
    }
    if (/^-{3,}$/.test(stripped)) {
      out.push('<hr />');
      i++;
      continue;
    }
    if (stripped.startsWith('```')) {
      const lang = stripped.slice(3).trim() || 'none';
      const code: string[] = [];
      for (i++; i < lines.length && !lines[i].trim().startsWith('```'); i++) code.push(lines[i]);
      i++;
      if (lang === 'mermaid') out.push('<p><em>Diagram przepływu (Mermaid):</em></p>');
      out.push(
        '<ac:structured-macro ac:name="code">' +
          `<ac:parameter ac:name="language">${esc(['mermaid', 'text', 'ascii'].includes(lang) ? 'none' : lang)}</ac:parameter>` +
          `<ac:plain-text-body><![CDATA[${code.join('\n').replaceAll(']]>', ']]]]><![CDATA[>')}]]></ac:plain-text-body></ac:structured-macro>`,
      );
      continue;
    }
    const heading = stripped.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      i++;
      if (level === 1 && !skippedH1) {
        skippedH1 = true;
        continue;
      }
      out.push(`<h${level}>${formatInline(heading[2].trim())}</h${level}>`);
      continue;
    }
    if (stripped.startsWith('>')) {
      const quote: string[] = [];
      for (; i < lines.length && lines[i].trim().startsWith('>'); i++) {
        const clean = lines[i].trim().replace(/^>\s?/, '');
        if (clean) quote.push(formatInline(clean));
      }
      if (quote.length) out.push(`<blockquote><p>${quote.join('<br />')}</p></blockquote>`);
      continue;
    }
    if (stripped.includes('|') && i + 1 < lines.length && TABLE_SEPARATOR.test(lines[i + 1].trim())) {
      const header = cells(stripped);
      const rows: string[][] = [];
      for (i += 2; i < lines.length && lines[i].trim().includes('|'); i++) rows.push(cells(lines[i].trim()));
      out.push('<table><thead><tr>');
      for (const h of header) out.push(`<th><p>${formatInline(h)}</p></th>`);
      out.push('</tr></thead><tbody>');
      for (const row of rows) {
        out.push('<tr>');
        for (let c = 0; c < header.length; c++) out.push(`<td><p>${formatInline(row[c] ?? '')}</p></td>`);
        out.push('</tr>');
      }
      out.push('</tbody></table>');
      continue;
    }
    const isUl = UL.test(stripped);
    if (isUl || OL.test(stripped)) {
      const pattern = isUl ? UL : OL;
      const tag = isUl ? 'ul' : 'ol';
      const items: string[] = [];
      while (i < lines.length) {
        const cur = lines[i].trim();
        const item = cur.match(pattern);
        if (item) items.push(formatInline(item[1]));
        else if (items.length && lines[i].startsWith('  ') && cur) items[items.length - 1] += ` ${formatInline(cur)}`;
        else break;
        i++;
      }
      out.push(`<${tag}>${items.map((it) => `<li>${it}</li>`).join('')}</${tag}>`);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length) {
      const cur = lines[i].trim();
      if (!cur || /^(```|#|>|---)/.test(cur) || UL.test(cur) || OL.test(cur) || (cur.includes('|') && i + 1 < lines.length && TABLE_SEPARATOR.test(lines[i + 1].trim()))) break;
      para.push(formatInline(cur));
      i++;
    }
    if (para.length) out.push(`<p>${para.join(' ')}</p>`);
  }

  if (isIndex) {
    out.push('<h2>Podstrony w tej sekcji (Drzewo Confluence)</h2><ac:structured-macro ac:name="children"><ac:parameter ac:name="all">true</ac:parameter></ac:structured-macro>');
  }
  return out.join('\n');
}

interface Page {
  title: string;
  parent: string | null;
  depth: number;
  relDocs: string;
  relRepo: string;
  markdown: string;
  xhtml: string;
}

function buildPlan(mdFiles: string[]): Page[] {
  return mdFiles
    .map((md) => {
      const markdown = readText(md);
      const relRepo = rel(md);
      return { ...resolveTitleAndParent(md), relDocs: md.slice(DOCS_DIR.length + 1), relRepo, markdown, xhtml: toStorageXhtml(markdown, relRepo, md.endsWith('/README.md')) };
    })
    .sort((a, b) => a.depth - b.depth || (a.relDocs < b.relDocs ? -1 : a.relDocs > b.relDocs ? 1 : 0));
}

/** Export bundle. The header names only the source file, so a page changes only when its content changes. */
function exportBundle(selected: string[], allPages: string[]): number {
  const outputs = new Map<string, string>();
  for (const page of buildPlan(selected)) {
    outputs.set(`${EXPORT_DIR}/${page.relDocs}`, `<!-- CONFLUENCE 1:1 EXPORT | Source: ${page.relRepo} -->\n${page.markdown}`);
    outputs.set(`${EXPORT_DIR}/${page.relDocs.replace(/\.md$/, '.xhtml')}`, `${page.xhtml}\n`);
  }
  // The manifest always describes the whole tree, even when only some pages are exported.
  const manifest = buildPlan(allPages).map((p) => ({
    title: p.title,
    parent_title: p.parent,
    depth: p.depth,
    repo_path: p.relRepo,
    export_md_path: rel(`${EXPORT_DIR}/${p.relDocs}`),
    export_xhtml_path: rel(`${EXPORT_DIR}/${p.relDocs.replace(/\.md$/, '.xhtml')}`),
  }));
  outputs.set(
    `${EXPORT_DIR}/manifest.json`,
    `${JSON.stringify({ confluence_url: DEFAULT_CONFLUENCE_URL, space_name_hint: DEFAULT_SPACE_NAME_HINT, total_pages: manifest.length, pages: manifest }, null, 2)}\n`,
  );
  const written = syncOutputs(outputs, false);

  // A full export also removes pages that no longer exist in docs/.
  let removed = 0;
  if (selected.length === allPages.length && existsSync(EXPORT_DIR)) {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(`${dir}/${d.name}`) : [`${dir}/${d.name}`]));
    for (const file of walk(EXPORT_DIR).filter((f) => !outputs.has(f))) {
      rmSync(file);
      removed++;
    }
  }
  console.log(`OK: exported ${selected.length} page(s); ${written.length} file(s) changed${removed ? `, ${removed} removed` : ''} in ${rel(EXPORT_DIR)}/`);
  return 0;
}

// ------------------------------------------------------------------------------------------ publish

interface ContentResult { id: string; title: string; version?: { number: number } }

class ConfluenceClient {
  readonly #base: string;
  readonly #headers: Record<string, string>;

  constructor(baseUrl: string, auth: { token?: string; user?: string; password?: string }) {
    this.#base = baseUrl.replace(/\/+$/, '');
    this.#headers = { Accept: 'application/json', 'Content-Type': 'application/json; charset=utf-8', 'X-Atlassian-Token': 'no-check' };
    if (auth.token) this.#headers.Authorization = `Bearer ${auth.token}`;
    else if (auth.user && auth.password) this.#headers.Authorization = `Basic ${Buffer.from(`${auth.user}:${auth.password}`).toString('base64')}`;
    else throw new Error('No credentials: set CONFLUENCE_PERSONAL_TOKEN (e.g. in .env) or CONFLUENCE_USER and CONFLUENCE_PASSWORD.');
  }

  async request<T>(method: string, path: string, params?: Record<string, string>, payload?: unknown): Promise<T> {
    const url = `${this.#base}${path}${params ? `?${new URLSearchParams(params)}` : ''}`;
    const response = await fetch(url, { method, headers: this.#headers, body: payload === undefined ? undefined : JSON.stringify(payload), signal: AbortSignal.timeout(30_000) });
    const text = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status} on ${method} ${url}: ${text.slice(0, 400)}`);
    return (text ? JSON.parse(text) : {}) as T;
  }

  async resolveSpace(spaceKey: string | undefined): Promise<{ key: string; name: string; homepageId: string }> {
    if (spaceKey) {
      const space = await this.request<{ key: string; name: string; homepage: { id: string } }>('GET', `/rest/api/space/${encodeURIComponent(spaceKey)}`, { expand: 'homepage' });
      return { key: space.key, name: space.name, homepageId: String(space.homepage.id) };
    }
    const { results = [] } = await this.request<{ results?: { key: string; name: string; homepage?: { id: string } }[] }>('GET', '/rest/api/space', { limit: '100', expand: 'homepage' });
    const match = results.find((s) => s.name.toLowerCase().includes(DEFAULT_SPACE_NAME_HINT.toLowerCase()) || s.key.toLowerCase().includes('gcdc'));
    if (!match?.homepage) throw new Error(`Could not auto-detect space '${DEFAULT_SPACE_NAME_HINT}'. Available: ${results.map((s) => `${s.key} (${s.name})`).join(', ')}. Pass --space-key.`);
    return { key: match.key, name: match.name, homepageId: String(match.homepage.id) };
  }

  async findPage(spaceKey: string, title: string): Promise<ContentResult | undefined> {
    const { results = [] } = await this.request<{ results?: ContentResult[] }>('GET', '/rest/api/content', { spaceKey, title, expand: 'version,ancestors' });
    return results[0];
  }

  async upsertPage(spaceKey: string, title: string, xhtml: string, parentId: string, existing: ContentResult | undefined): Promise<string> {
    const body = { storage: { value: xhtml, representation: 'storage' } };
    if (existing) {
      await this.request('PUT', `/rest/api/content/${existing.id}`, undefined, {
        id: existing.id, type: 'page', title, space: { key: spaceKey }, ancestors: [{ id: parentId }],
        version: { number: (existing.version?.number ?? 1) + 1, minorEdit: true }, body,
      });
      return existing.id;
    }
    const created = await this.request<{ id: string }>('POST', '/rest/api/content', undefined, { type: 'page', title, space: { key: spaceKey }, ancestors: [{ id: parentId }], body });
    return String(created.id);
  }

  async updateHomepage(spaceKey: string, homepageId: string, xhtml: string): Promise<void> {
    const home = await this.request<ContentResult>('GET', `/rest/api/content/${homepageId}`, { expand: 'version' });
    await this.request('PUT', `/rest/api/content/${homepageId}`, undefined, {
      id: homepageId, type: 'page', title: home.title, space: { key: spaceKey },
      version: { number: (home.version?.number ?? 1) + 1, minorEdit: true }, body: { storage: { value: xhtml, representation: 'storage' } },
    });
  }
}

async function publish(pages: string[], opts: { url: string; spaceKey?: string; dryRun: boolean; onlyExisting: boolean; insecure: boolean }): Promise<number> {
  const plan = buildPlan(pages);
  if (opts.dryRun) {
    console.log(`DRY-RUN: ${plan.length} pages prepared for Confluence 8.4.5 (${opts.url})${opts.onlyExisting ? ' — pages missing in Confluence will be skipped' : ''}:\n`);
    for (const p of plan) console.log(`${'  '.repeat(p.depth)}- [${p.depth}] ${p.title}  <-- parent: ${p.parent ?? '(Root Space)'}  (${p.relRepo})`);
    return 0;
  }
  if (opts.insecure) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const client = new ConfluenceClient(opts.url, {
    token: process.env.CONFLUENCE_PERSONAL_TOKEN,
    user: process.env.CONFLUENCE_USER,
    password: process.env.CONFLUENCE_PASSWORD,
  });
  const space = await client.resolveSpace(opts.spaceKey ?? process.env.CONFLUENCE_SPACE_KEY);
  console.log(`Connected to Confluence space: ${space.key} ('${space.name}', homepage id=${space.homepageId})`);

  const ids = new Map<string, string>([[HOME, space.homepageId]]);
  let skipped = 0;
  for (const [n, page] of plan.entries()) {
    const at = `[${n + 1}/${plan.length}]`;
    if (page.title === HOME) {
      await client.updateHomepage(space.key, space.homepageId, page.xhtml);
      console.log(`${at} Updated space home page (id=${space.homepageId})`);
      continue;
    }
    const existing = await client.findPage(space.key, page.title);
    if (!existing && opts.onlyExisting) {
      skipped++;
      console.log(`${at} Skipped (not in Confluence, --only-existing): '${page.title}'`);
      continue;
    }
    const parentId = ids.get(page.parent ?? HOME) ?? space.homepageId;
    const id = await client.upsertPage(space.key, page.title, page.xhtml, parentId, existing);
    ids.set(page.title, id);
    console.log(`${at} ${existing ? 'Updated' : 'Created'}: '${page.title}' (id=${id}, parent_id=${parentId})`);
  }
  console.log(`\nDone: ${plan.length - skipped} page(s) published to '${space.name}' (${space.key})${skipped ? `, ${skipped} skipped` : ''}.`);
  return 0;
}

// ---------------------------------------------------------------------------------------------- main

const isMain = process.argv[1]?.replaceAll('\\', '/').endsWith('tools/confluence/sync-confluence.ts');
if (isMain) {
  run(async () => {
    const { values } = parseArgs({
      options: {
        check: { type: 'boolean', default: false },
        export: { type: 'boolean', default: false },
        publish: { type: 'boolean', default: false },
        'dry-run': { type: 'boolean', default: false },
        include: { type: 'string', multiple: true, default: [] },
        'changed-since': { type: 'string' },
        'only-existing': { type: 'boolean', default: false },
        url: { type: 'string', default: process.env.CONFLUENCE_URL ?? DEFAULT_CONFLUENCE_URL },
        'space-key': { type: 'string' },
        insecure: { type: 'boolean', default: false },
      },
    });

    const { errors, mdFiles } = validateTree();
    if (errors.length) {
      console.log('Confluence 1:1 validation errors:');
      for (const e of errors) console.log(`  - ${e}`);
      return 1;
    }

    let selected = mdFiles;
    if ((values.publish || values.export) && (values.include.length || values['changed-since'])) {
      const selection = selectPages(mdFiles, values.include, values['changed-since']);
      if (selection.errors.length) {
        console.log('Confluence page selection errors:');
        for (const e of selection.errors) console.log(`  - ${e}`);
        return 1;
      }
      selected = selection.pages;
      console.log(`Selected ${selected.length} page(s) for ${values.publish ? 'publication' : 'export'}.`);
    }

    if (values.export) exportBundle(selected, mdFiles);
    if (values.publish) {
      return publish(selected, {
        url: values.url!, spaceKey: values['space-key'], dryRun: values['dry-run'], onlyExisting: values['only-existing'], insecure: values.insecure,
      });
    }
    if (!values.export) {
      const sections = Object.keys(EXPECTED_SECTIONS).length;
      console.log(`OK: Confluence 1:1 tree valid (${sections} sections, ${REQUIRED_CORE_FILES.length} core AltexSoft/SDD files, ${mdFiles.length} active Markdown pages, 0 broken links)`);
    }
    return 0;
  });
}

