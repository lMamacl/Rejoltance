// Backlog (docs/03-dokumentacja-procesowa/02-backlog/backlog.toml) -> Jira Server/DC CSV import files + summary.
//
//   npm run backlog          # validate and write outputs
//   npm run backlog:check    # validate; fail if outputs are stale (CI)
//
// Outputs (generated, do not edit):
//   jira-01-epics.csv   import FIRST (epics; "Epic Name" is what stories link to)
//   jira-02-issues.csv  import SECOND (stories + sub-tasks; sub-tasks reference "Issue Id" of the story)
//   BACKLOG.md          summary: capacity per sprint, stories per epic
//
// Validation: unique ids, user-story fields, GIVEN/WHEN/THEN acceptance criteria, Fibonacci story points,
// tasks of at most 4 h, rule ids that exist in openspec/specs, the Story column of 03-indeks-regul-r-nn.md,
// and team capacity per sprint. Items that already have a Jira key (jira = "REJ-12") are left out of the CSV.
import { readdirSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { parse } from 'smol-toml';
import { readText, rel, repoPath, run, syncOutputs } from '../lib.ts';

const BACKLOG_DIR = repoPath('docs/03-dokumentacja-procesowa/02-backlog');
const SOURCE = `${BACKLOG_DIR}/backlog.toml`;
const SPECS_DIR = repoPath('openspec/specs');
const RULES_INDEX = repoPath('docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md');

const FIBONACCI = new Set([1, 2, 3, 5, 8, 13]);
const MAX_TASK_HOURS = 4;
const PRIORITY: Record<string, string> = { W0: 'Highest', W1: 'High', W2: 'Medium', W3: 'Low' };
const WAVE_NAME: Record<string, string> = { W0: 'fundament', W1: 'MVP (semestr 1)', W2: 'pełna gra (semestr 2)', W3: 'dodatki' };

interface Task { title?: string; h?: number; jira?: string }
interface Story {
  id?: string; title?: string; as_a?: string; i_want?: string; so_that?: string; acceptance?: string[];
  sp?: number; wave?: string; sprint?: string; rules?: string[]; task?: Task[]; estimate_h?: number; jira?: string;
}
interface Epic { id?: string; name?: string; component?: string; description?: string; owner?: string; jira?: string; story?: Story[] }
interface Sprint { id: string; start?: string; end?: string; weeks?: number; goal?: string; semester?: number }
interface Backlog {
  meta: { project_key?: string; team_size?: number; hours_per_person_week?: number; buffer?: number; estimate_format?: string };
  sprint: Sprint[];
  epic: Epic[];
}

/** Python's `{:g}` for the numbers used here (hours): no trailing zeros. */
const fmtHours = (h: number): string => String(Number(h.toPrecision(6)));
const storyHours = (story: Story): number => (story.task?.length ? story.task.reduce((sum, t) => sum + (t.h ?? 0), 0) : Number(story.estimate_h ?? 0));
const semesterOf = (sprint: Sprint | undefined): number => sprint?.semester ?? 1;

function knownRules(): Set<string> {
  const rules = new Set<string>();
  for (const dir of readdirSync(SPECS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    let text: string;
    try {
      text = readText(`${SPECS_DIR}/${dir.name}/spec.md`);
    } catch {
      continue;
    }
    for (const m of text.matchAll(/^### Requirement: (R-\d+)/gm)) rules.add(m[1]);
  }
  return rules;
}

/** (rule, story) pairs from the Story column of 03-indeks-regul-r-nn.md. */
function rulesIndexLinks(): [string, string][] {
  const pairs: [string, string][] = [];
  for (const line of readText(RULES_INDEX).split('\n')) {
    const cells = line.trim().replace(/^\|+|\|+$/g, '').split('|').map((c) => c.trim());
    if (cells.length >= 6 && /^R-\d+$/.test(cells[0]) && /^E\d-S\d+$/.test(cells[4])) pairs.push([cells[0], cells[4]]);
  }
  return pairs;
}

function validate(data: Backlog): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const meta = data.meta ?? {};
  const sprints = new Map((data.sprint ?? []).map((s) => [s.id, s]));
  const rules = knownRules();
  const seen = new Set<string>();
  const storiesById = new Map<string, Story>();

  if (meta.estimate_format !== 'seconds' && meta.estimate_format !== 'jira') errors.push("meta.estimate_format must be 'seconds' or 'jira'");

  for (const epic of data.epic ?? []) {
    const eid = epic.id ?? '?';
    for (const key of ['id', 'name', 'component', 'description'] as const) if (!epic[key]) errors.push(`epic ${eid}: missing '${key}'`);
    if (seen.has(eid)) errors.push(`duplicate id ${eid}`);
    seen.add(eid);

    for (const story of epic.story ?? []) {
      const sid = story.id ?? '?';
      const at = `story ${sid}`;
      if (seen.has(sid)) errors.push(`duplicate id ${sid}`);
      seen.add(sid);
      storiesById.set(sid, story);
      if (!sid.startsWith(`${eid}-S`)) errors.push(`${at}: id must start with '${eid}-S'`);
      for (const key of ['title', 'as_a', 'i_want', 'so_that'] as const) if (!story[key]) errors.push(`${at}: missing '${key}'`);
      const acceptance = story.acceptance ?? [];
      if (acceptance.length === 0) errors.push(`${at}: needs at least one acceptance criterion`);
      for (const crit of acceptance) {
        if (!['GIVEN', 'WHEN', 'THEN'].every((w) => crit.includes(w))) errors.push(`${at}: acceptance criterion must contain GIVEN, WHEN and THEN: '${crit.slice(0, 60)}'`);
      }
      if (story.sp === undefined || !FIBONACCI.has(story.sp)) errors.push(`${at}: sp must be one of [${[...FIBONACCI].join(', ')}]`);
      if (!story.wave || !(story.wave in PRIORITY)) errors.push(`${at}: wave must be one of [${Object.keys(PRIORITY).join(', ')}]`);
      if (!story.sprint || !sprints.has(story.sprint)) errors.push(`${at}: unknown sprint '${story.sprint}'`);
      const tasks = story.task ?? [];
      if (tasks.length && story.estimate_h !== undefined) errors.push(`${at}: use either tasks or estimate_h, not both`);
      if (!tasks.length && !story.estimate_h) errors.push(`${at}: needs tasks or estimate_h`);
      tasks.forEach((task, i) => {
        if (!task.title) errors.push(`${at} task ${i + 1}: missing title`);
        const h = task.h ?? 0;
        if (!(h > 0 && h <= MAX_TASK_HOURS)) errors.push(`${at} task ${i + 1}: h must be in (0, ${MAX_TASK_HOURS}] (got ${h})`);
      });
      for (const rule of story.rules ?? []) if (!rules.has(rule)) errors.push(`${at}: rule ${rule} not found in openspec/specs`);
    }
  }

  for (const [rule, sid] of rulesIndexLinks()) {
    const story = storiesById.get(sid);
    if (!story) errors.push(`03-indeks-regul-r-nn.md: ${rule} points to unknown story ${sid}`);
    else if (!(story.rules ?? []).includes(rule)) errors.push(`03-indeks-regul-r-nn.md: ${rule} points to ${sid}, but ${sid} does not list ${rule} in rules`);
  }

  const team = (meta.team_size ?? 6) * (meta.hours_per_person_week ?? 5);
  for (const [sid, sprint] of sprints) {
    if (semesterOf(sprint) !== 1) continue;
    const capacity = team * (sprint.weeks ?? 2);
    const planned = data.epic.flatMap((e) => e.story ?? []).filter((s) => s.sprint === sid).reduce((sum, s) => sum + storyHours(s), 0);
    const limit = capacity * (1 - (meta.buffer ?? 0.1));
    if (planned > capacity) errors.push(`sprint ${sid}: planned ${fmtHours(planned)} h exceeds capacity ${fmtHours(capacity)} h`);
    else if (planned > limit) warnings.push(`sprint ${sid}: planned ${fmtHours(planned)} h is above the buffered limit ${fmtHours(limit)} h`);
  }
  return { errors, warnings };
}

/** RFC 4180 CSV like Python's csv.writer (minimal quoting, LF line endings). */
export const csvText = (header: string[], rows: string[][]): string =>
  [header, ...rows].map((row) => row.map((f) => (/[",\r\n]/.test(f) ? `"${f.replaceAll('"', '""')}"` : f)).join(',')).join('\n') + '\n';

const estimate = (h: number, fmt: string): string => (fmt === 'seconds' ? String(Math.round(h * 3600)) : `${fmtHours(h)}h`);

function buildOutputs(data: Backlog): Map<string, string> {
  const fmt = data.meta.estimate_format!;
  const sprintOf = new Map(data.sprint.map((s) => [s.id, s]));
  const epicRows: string[][] = [];
  const issueRows: string[][] = [];

  for (const epic of data.epic) {
    const name = `${epic.id} ${epic.name}`;
    if (!epic.jira) {
      epicRows.push([epic.id!, 'Epic', name, name,
        `${epic.description}\n\nWłaściciel: ${epic.owner ?? '-'}\nŹródło: docs/03-dokumentacja-procesowa/02-backlog/backlog.toml`, 'rejoltance', epic.component!]);
    }
    const epicName = epic.jira || name;
    for (const story of epic.story ?? []) {
      const sprintLabel = semesterOf(sprintOf.get(story.sprint!)) === 1 ? `sprint-${story.sprint!.slice(1)}` : 'semestr-2';
      const labels = ['rejoltance', story.wave!.toLowerCase(), sprintLabel];
      const description =
        `Jako ${story.as_a} chcę ${story.i_want}, aby ${story.so_that}.\n\n` +
        'Kryteria akceptacji:\n' + story.acceptance!.map((c) => `- ${c}`).join('\n') + '\n\n' +
        (story.rules?.length ? `Reguły: ${story.rules.join(', ')} (docs/01-dokumentacja-systemowa/03-indeks-regul-r-nn.md)\n` : '') +
        `Fala: ${story.wave} (${WAVE_NAME[story.wave!]}) · Źródło: backlog.toml (${story.id})`;
      const tasks = story.task ?? [];
      if (!story.jira) {
        issueRows.push([story.id!, '', 'Story', `${story.id} ${story.title}`, epicName, description, String(story.sp),
          tasks.length ? '' : estimate(storyHours(story), fmt), PRIORITY[story.wave!], ...labels, epic.component!]);
      }
      tasks.forEach((task, i) => {
        if (task.jira) return;
        issueRows.push([`${story.id}-T${i + 1}`, story.id!, 'Sub-task', `${story.id}-T${i + 1} ${task.title}`, '',
          `Część ${story.id} ${story.title}.`, '', estimate(task.h!, fmt), PRIORITY[story.wave!], ...labels, epic.component!]);
      });
    }
  }

  return new Map([
    [`${BACKLOG_DIR}/jira-01-epics.csv`, csvText(['Issue Id', 'Issue Type', 'Summary', 'Epic Name', 'Description', 'Labels', 'Component/s'], epicRows)],
    [`${BACKLOG_DIR}/jira-02-issues.csv`, csvText(['Issue Id', 'Parent Id', 'Issue Type', 'Summary', 'Epic Link', 'Description', 'Story Points',
      'Original Estimate', 'Priority', 'Labels', 'Labels', 'Labels', 'Component/s'], issueRows)],
    [`${BACKLOG_DIR}/BACKLOG.md`, summary(data)],
  ]);
}

function summary(data: Backlog): string {
  const meta = data.meta;
  const team = meta.team_size! * meta.hours_per_person_week!;
  const lines = [
    '# Backlog — podsumowanie (generowane)',
    '',
    '<!-- GENERATED by tools/backlog/gen-jira-csv.ts from docs/03-dokumentacja-procesowa/02-backlog/backlog.toml - edit the source, not this file. -->',
    '',
    `Pojemność: ${meta.team_size} os. × ${meta.hours_per_person_week} h/tydz., bufor ${Math.trunc(meta.buffer! * 100)}%. Godziny story = suma tasków albo \`estimate_h\`.`,
    '',
    '## Sprinty',
    '',
    '| Sprint | Daty | Cel | Pojemność [h] | Zaplanowane [h] | SP | Wykorzystanie |',
    '|---|---|---|---|---|---|---|',
  ];
  const stories = data.epic.flatMap((e) => e.story ?? []);
  const sprintOf = (s: Story) => data.sprint.find((sp) => sp.id === s.sprint);
  const sum = (list: Story[], f: (s: Story) => number) => list.reduce((acc, s) => acc + f(s), 0);

  for (const sprint of data.sprint) {
    const inSprint = stories.filter((s) => s.sprint === sprint.id);
    const hours = sum(inSprint, storyHours);
    const sp = sum(inSprint, (s) => s.sp ?? 0);
    const [capacity, dates, usage] =
      semesterOf(sprint) === 1
        ? [String(team * sprint.weeks!), `${sprint.start} – ${sprint.end}`, `${Math.round((hours / (team * sprint.weeks!)) * 100)}%`]
        : ['—', 'semestr 2', '—'];
    lines.push(`| ${sprint.id} | ${dates} | ${sprint.goal} | ${capacity} | ${fmtHours(hours)} | ${sp} | ${usage} |`);
  }

  const semester1 = stories.filter((s) => semesterOf(sprintOf(s)) === 1);
  const later = stories.filter((s) => semesterOf(sprintOf(s)) !== 1);
  lines.push(
    '',
    `**Semestr 1:** ${semester1.length} story, ${sum(semester1, (s) => s.sp ?? 0)} SP, ${fmtHours(sum(semester1, storyHours))} h. ` +
      `**Poniżej linii cięcia (semestr 2):** ${later.length} story, ${sum(later, (s) => s.sp ?? 0)} SP, ${fmtHours(sum(later, storyHours))} h.`,
    '',
  );
  for (const epic of data.epic) {
    lines.push(`## ${epic.id} ${epic.name}`, '', `${epic.description} Właściciel: ${epic.owner ?? '-'}.`, '',
      '| Story | Tytuł | Sprint | Fala | SP | h | Reguły |', '|---|---|---|---|---|---|---|');
    for (const s of epic.story ?? []) {
      lines.push(`| ${s.id} | ${s.title} | ${s.sprint} | ${s.wave} | ${s.sp} | ${fmtHours(storyHours(s))} | ${(s.rules ?? []).join(', ') || '—'} |`);
    }
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

const isMain = process.argv[1]?.replaceAll('\\', '/').endsWith('tools/backlog/gen-jira-csv.ts');
if (isMain) {
  run(() => {
    const { values } = parseArgs({ options: { check: { type: 'boolean', default: false } } });
    const data = parse(readText(SOURCE)) as unknown as Backlog;
    const { errors, warnings } = validate(data);
    for (const w of warnings) console.log(`warning: ${w}`);
    if (errors.length) {
      console.log('Backlog errors:');
      for (const e of errors) console.log(`  - ${e}`);
      return 1;
    }

    const outputs = buildOutputs(data);
    const stale = syncOutputs(outputs, values.check);
    if (values.check) {
      for (const path of stale) console.log(`stale: ${rel(path)} (run: npm run backlog)`);
      if (!stale.length) console.log('OK: backlog valid, outputs up to date');
      return stale.length ? 1 : 0;
    }
    const issues = outputs.get(`${BACKLOG_DIR}/jira-02-issues.csv`)!;
    const stories = issues.split('\n').filter((l) => /^[^,]*,[^,]*,Story,/.test(l)).length;
    console.log(`Wrote ${stale.length} file(s); ${stories} stories in the Jira CSV`);
    return 0;
  });
}
