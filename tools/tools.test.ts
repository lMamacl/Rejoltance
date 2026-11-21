import { describe, expect, it } from 'vitest';
import { csvText } from './backlog/gen-jira-csv.ts';
import { formatInline, toStorageXhtml } from './confluence/sync-confluence.ts';

describe('Jira CSV', () => {
  it('quotes only fields that need it and doubles quotes', () => {
    expect(csvText(['a', 'b'], [['plain', 'with, comma'], ['say "hi"', 'line\nbreak']])).toBe('a,b\nplain,"with, comma"\n"say ""hi""","line\nbreak"\n');
  });
});

describe('Markdown -> Confluence storage XHTML', () => {
  it('converts inline code, links and emphasis and escapes HTML', () => {
    expect(formatInline('**Bold** `a<b` [docs](../x.md) [site](https://example.com) *it* <br/>')).toBe(
      '<strong>Bold</strong> <code>a&lt;b</code> <strong>docs</strong> (<code>../x.md</code>) <a href="https://example.com">site</a> <em>it</em> <br />',
    );
  });

  it('skips the first H1, keeps the source banner and renders tables, lists and code', () => {
    const xhtml = toStorageXhtml('# Title\n\n## Part\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n- one\n- two\n\n```ts\nconst x = 1;\n```\n', 'docs/x.md', false);

    expect(xhtml).toContain('<code>docs/x.md</code>');
    expect(xhtml).not.toContain('<h1>');
    expect(xhtml).toContain('<h2>Part</h2>');
    expect(xhtml).toContain('<td><p>1</p></td>');
    expect(xhtml).toContain('<ul><li>one</li><li>two</li></ul>');
    expect(xhtml).toContain('<![CDATA[const x = 1;]]>');
  });
});
