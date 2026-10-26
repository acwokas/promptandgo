import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalSitemapEntry } from '../src/lib/sitemap-policy.mjs';

test('sitemap matches existing explicit prompt, category, pack and tool canonicals', () => {
  for (const path of ['/library/education/', '/library/education/focus/', '/packs/starter/', '/models/', '/optimize/']) {
    const entry = { url: `https://www.promptandgo.ai${path}`, lastmod: '2026-10-01' };
    const result = canonicalSitemapEntry(entry);
    assert.equal(result.url, entry.url.slice(0, -1));
    assert.equal(result.lastmod, entry.lastmod);
    assert.equal(entry.url.endsWith('/'), true);
    assert.deepEqual(canonicalSitemapEntry(result), result);
  }
});

test('keeps the homepage and default page canonicals unchanged', () => {
  for (const path of ['/', '/about/', '/library/', '/packs/', '/tips/example/']) {
    const entry = { url: `https://www.promptandgo.ai${path}` };
    assert.deepEqual(canonicalSitemapEntry(entry), entry);
  }
});
