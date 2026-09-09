/**
 * content-quality-gate.mjs - the SEO/AEO bar for promptandgo.ai, enforced
 * before a draft is turned into a migration.
 *
 * WHY THIS EXISTS
 * ----------------
 * Audited on 2026-08-27: the /tips/ articles already live in production run
 * 34 to 673 words, ship zero structured data, and the seed migration that
 * created most of them held under 1,000 words total across six full
 * articles. That is exactly the thin-and-duplicative shape that costs a
 * young site its crawl budget, and it shipped because nothing checked a
 * draft before it became a row.
 *
 * This module is adapted from the proven gate at
 * ~/ai-factory/packages/dev-gates/content-quality-gate.mjs, which was built
 * from specific incidents across UDO/UCO/AIIN (62 unworked rows, 111 of 125
 * UCO vet pages shipping the wrong species' copy, three sites missing a
 * stub-phrase list entirely). The core checks (thin content, stub phrases,
 * house style, unverified figures) are unchanged in spirit. What's added
 * here is specific to promptandgo's own quality bar, which asks for more
 * than the estate floor: 1,000+ words, 3+ external citations, 5+ concrete
 * data points, 3+ headings, per the brief this pipeline was built against.
 *
 * THE CONTRACT
 * ------------
 * Nothing becomes a migration without passing gateTip/gateGlossaryTerm
 * first. On failure, the caller fixes the draft and re-gates. This gate
 * never lowers its own bar to let a draft through.
 *
 * Usage:
 *   import { gateTip, gateGlossaryTerm, TIP_PROFILE } from './content-quality-gate.mjs';
 *   const verdict = gateTip(draft);
 *   if (!verdict.ok) { throw new Error(describeVerdict(verdict)); }
 */

import { HARD_PHRASES } from './stub-phrases.mjs';

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

export const TIP_PROFILE = {
  name: 'promptandgo-tip',
  minWords: 1000,
  minExternalLinks: 3,
  minDataPoints: 5,
  minHeadings: 3,
};

export const GLOSSARY_PROFILE = {
  name: 'promptandgo-glossary',
  // Glossary entries are definitions, not articles: short by design. The
  // floor here guards against a one-line stub, not against brevity.
  minWords: 80,
  minSources: 1,
};

const MAX_HEADLINE = 200;
const MIN_DEK = 50;
const MAX_DEK = 158;

/**
 * How much of a body may overlap a cited source, measured on 8-word
 * shingles. Above this it reads as restatement, not analysis: exactly what
 * a reader could get by clicking through to the source themselves.
 */
const MAX_SOURCE_OVERLAP = 0.40;

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function textOf(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function words(s) {
  return textOf(s).split(/\s+/).filter(Boolean);
}

function shingles(s, n = 8) {
  const w = words(s).map((x) => x.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
}

/** Figures a reader would take as fact and act on: currency, percentages, large formatted numbers. */
function figuresIn(text) {
  const out = new Set();
  for (const m of text.matchAll(/(?:S?\$\s?[\d,]+(?:\.\d+)?(?:\s?(?:million|billion|m|bn|k))?)/gi)) {
    out.add(m[0].replace(/\s+/g, ' ').trim());
  }
  for (const m of text.matchAll(/\d+(?:\.\d+)?\s?(?:per cent|percent|%)/gi)) {
    out.add(m[0].replace(/\s+/g, ' ').trim());
  }
  for (const m of text.matchAll(/\b\d{1,3}(?:,\d{3})+\b/g)) out.add(m[0]);
  return [...out];
}

function figureKey(f) {
  return String(f)
    .toLowerCase()
    .replace(/s?\$/g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '')
    .replace(/percent|per cent/g, '%');
}

/**
 * Broader than figuresIn(): counts anything a reader would read as a
 * concrete, checkable data point rather than a vague claim. This is
 * promptandgo's own "5+ data points" content-richness bar, distinct from
 * figuresIn()'s narrower fabrication-verification role below. A dated fact
 * ("as of March 2026") or a named limit ("32,000 token context window")
 * counts here even though it isn't currency or a percentage.
 */
function dataPointsIn(text) {
  const out = new Set();
  for (const f of figuresIn(text)) out.add(f);
  for (const m of text.matchAll(
    /\b\d+(?:\.\d+)?\s?(?:million|billion|thousand|trillion|tokens?|characters?|words?|parameters?)\b/gi,
  )) {
    out.add(m[0].replace(/\s+/g, ' ').trim().toLowerCase());
  }
  // Bare counts of three or more digits, or small counts followed by a unit
  // word, that figuresIn() does not already catch (it requires comma
  // grouping for bare numbers).
  for (const m of text.matchAll(/\b\d{2,}\b/g)) out.add(m[0]);
  // Dated facts: "in 2024", "since 2023", "as of March 2026".
  for (const m of text.matchAll(/\b(?:in|since|as of)\s+(?:[A-Z][a-z]+\s+)?(?:19|20)\d{2}\b/g)) {
    out.add(m[0].trim().toLowerCase());
  }
  return [...out];
}

function externalLinksIn(bodyHtml, ownDomain = 'promptandgo.ai') {
  const out = new Set();
  for (const m of String(bodyHtml || '').matchAll(/href\s*=\s*"(https?:\/\/[^"]+)"/gi)) {
    const url = m[1];
    if (!url.includes(ownDomain)) out.add(url);
  }
  return [...out];
}

function headingsIn(bodyHtml) {
  const h2 = (String(bodyHtml || '').match(/<h2[\s>]/gi) || []).length;
  const h3 = (String(bodyHtml || '').match(/<h3[\s>]/gi) || []).length;
  return h2 + h3;
}

function fail(code, detail, remediable = true) {
  return { code, detail, remediable };
}

// ---------------------------------------------------------------------------
// tip gate
// ---------------------------------------------------------------------------

/**
 * @param {object} row      the draft about to become a migration. Expects
 *                           title, meta_title, meta_description, body_html,
 *                           sources: [{label, url}].
 * @param {object} [profile] TIP_PROFILE by default.
 * @param {object} [ctx]
 * @param {string} [ctx.sourceText]  combined plain text of the cited sources,
 *                                    when the caller already fetched them.
 *                                    Enables the fabrication/restatement checks.
 * @returns {{ok:boolean, failures:Array, warnings:Array, stats:object}}
 */
export function gateTip(row, profile = TIP_PROFILE, ctx = {}) {
  const failures = [];
  const warnings = [];
  const body = row.body_html ?? row.bodyHtml ?? '';
  const headline = row.title ?? row.meta_title ?? '';
  const dek = row.meta_description ?? '';
  const bodyText = textOf(body);
  const wordCount = words(body).length;

  if (!headline.trim()) failures.push(fail('NO_HEADLINE', 'empty title', false));
  if (headline.length > MAX_HEADLINE) {
    failures.push(fail('HEADLINE_TOO_LONG', `${headline.length} chars, cap is ${MAX_HEADLINE}`));
  }
  if (!dek || !String(dek).trim()) {
    failures.push(fail('NO_DEK', 'no meta_description, so the page ships with no meta description or og:description'));
  } else if (String(dek).length < MIN_DEK || String(dek).length > MAX_DEK) {
    failures.push(fail('DEK_LENGTH', `meta_description is ${String(dek).length} chars, want ${MIN_DEK} to ${MAX_DEK}`));
  }

  if (!Array.isArray(row.sources) || row.sources.length === 0) {
    failures.push(fail('NO_SOURCES', 'no sources array, citations cannot be verified', false));
  } else {
    for (const s of row.sources) {
      if (!s.url || !/^https?:\/\//.test(s.url)) {
        failures.push(fail('BAD_SOURCE_URL', `source "${s.label || '?'}" has no valid absolute URL`, false));
      }
    }
  }

  for (const img of body.match(/<img[^>]*>/gi) ?? []) {
    const hasAlt = /\balt\s*=/.test(img);
    const emptyAlt = /\balt\s*=\s*(""|'')/.test(img);
    const decorative = /aria-hidden\s*=\s*("true"|'true')/.test(img);
    if (!hasAlt) failures.push(fail('IMG_NO_ALT', `img with no alt attribute: ${img.slice(0, 70)}`));
    else if (emptyAlt && !decorative) {
      failures.push(fail('IMG_EMPTY_ALT', `alt="" without aria-hidden: ${img.slice(0, 70)}`));
    }
  }

  // --- thin content.
  if (wordCount < profile.minWords) {
    failures.push(fail('THIN_CONTENT', `${wordCount} words, floor is ${profile.minWords}`));
  }

  // --- external citations, promptandgo's own bar.
  const externalLinks = externalLinksIn(body);
  if (externalLinks.length < profile.minExternalLinks) {
    failures.push(
      fail('TOO_FEW_LINKS', `${externalLinks.length} external link(s) in body, floor is ${profile.minExternalLinks}`),
    );
  }

  // --- headings, promptandgo's own bar.
  const headingCount = headingsIn(body);
  if (headingCount < profile.minHeadings) {
    failures.push(fail('TOO_FEW_HEADINGS', `${headingCount} h2/h3 headings, floor is ${profile.minHeadings}`));
  }

  // --- data points, promptandgo's own bar.
  const dataPoints = dataPointsIn(bodyText);
  if (dataPoints.length < profile.minDataPoints) {
    failures.push(fail('TOO_FEW_DATA_POINTS', `${dataPoints.length} data point(s) found, floor is ${profile.minDataPoints}`));
  }

  // --- stubs and placeholders.
  const lowerAll = `${headline} ${dek} ${bodyText}`.toLowerCase();
  for (const p of HARD_PHRASES) {
    if (lowerAll.includes(p)) failures.push(fail('STUB_PHRASE', `banned placeholder phrase: "${p}"`));
  }

  // --- house style (CLAUDE.md: no em dashes in copy; extended to en dashes and emoji).
  if (/[—–]/.test(`${headline} ${dek} ${bodyText}`)) {
    failures.push(fail('DASH', 'em or en dash in copy, use commas, colons, parentheses or full stops'));
  }
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(`${headline} ${dek} ${bodyText}`)) {
    failures.push(fail('EMOJI', 'emoji in copy'));
  }

  // --- fabrication and restatement, when the caller supplies fetched source text.
  const stats = { wordCount, externalLinks: externalLinks.length, headings: headingCount, dataPoints: dataPoints.length, sourceOverlap: null };
  const figures = figuresIn(bodyText);

  if (ctx.sourceText) {
    const srcKeys = new Set(figuresIn(ctx.sourceText).map(figureKey));
    const unverified = figures.filter((f) => !srcKeys.has(figureKey(f)));
    stats.unverifiedFigures = unverified.length;
    if (unverified.length) {
      warnings.push(
        `${unverified.length} figure(s) in the body were not found verbatim in the supplied source text: ` +
          unverified.slice(0, 5).join(', ') +
          '. Confirm these were read from the cited source, not invented.',
      );
    }

    const bodyShingles = shingles(bodyText);
    if (bodyShingles.size) {
      const srcShingles = shingles(ctx.sourceText);
      let shared = 0;
      for (const s of bodyShingles) if (srcShingles.has(s)) shared++;
      const overlap = shared / bodyShingles.size;
      stats.sourceOverlap = Number(overlap.toFixed(3));
      if (overlap > MAX_SOURCE_OVERLAP) {
        failures.push(
          fail(
            'RESTATES_SOURCE',
            `${(overlap * 100).toFixed(0)}% of the body is near-verbatim from a source, cap is ` +
              `${MAX_SOURCE_OVERLAP * 100}%. This is a restatement, not analysis.`,
          ),
        );
      }
    }
  }

  return { ok: failures.length === 0, failures, warnings, stats };
}

// ---------------------------------------------------------------------------
// glossary gate
// ---------------------------------------------------------------------------

/**
 * @param {object} term  {term, shortDefinition, body: string[], sources: [{label, url}]}
 */
export function gateGlossaryTerm(term, profile = GLOSSARY_PROFILE) {
  const failures = [];
  const warnings = [];
  const bodyText = [term.shortDefinition, ...(term.body || [])].join(' ');
  const wordCount = words(bodyText).length;

  if (!term.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(term.slug)) {
    failures.push(fail('BAD_SLUG', `slug "${term.slug}" is not kebab-case`, false));
  }
  if (!term.term || !term.term.trim()) failures.push(fail('NO_TERM', 'empty term name', false));
  if (!term.shortDefinition || !term.shortDefinition.trim()) {
    failures.push(fail('NO_SHORT_DEFINITION', 'no shortDefinition, used as meta description and schema.org description', false));
  }
  if (!Array.isArray(term.body) || term.body.length === 0) {
    failures.push(fail('NO_BODY', 'no body paragraphs', false));
  }
  if (!Array.isArray(term.sources) || term.sources.length < profile.minSources) {
    failures.push(fail('NO_SOURCES', `${(term.sources || []).length} source(s), floor is ${profile.minSources}`, false));
  } else {
    for (const s of term.sources) {
      if (!s.url || !/^https?:\/\//.test(s.url)) {
        failures.push(fail('BAD_SOURCE_URL', `source "${s.label || '?'}" has no valid absolute URL`, false));
      }
    }
  }
  if (wordCount < profile.minWords) {
    failures.push(fail('THIN_CONTENT', `${wordCount} words, floor is ${profile.minWords}`));
  }

  const lowerAll = bodyText.toLowerCase();
  for (const p of HARD_PHRASES) {
    if (lowerAll.includes(p)) failures.push(fail('STUB_PHRASE', `banned placeholder phrase: "${p}"`));
  }
  if (/[—–]/.test(bodyText)) {
    failures.push(fail('DASH', 'em or en dash in copy, use commas, colons, parentheses or full stops'));
  }
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(bodyText)) {
    failures.push(fail('EMOJI', 'emoji in copy'));
  }

  return { ok: failures.length === 0, failures, warnings, stats: { wordCount } };
}

/** One-line summary for a log or an alert body. */
export function describeVerdict(v) {
  if (v.ok) return `PASS (${v.stats.wordCount}w${'externalLinks' in v.stats ? `, ${v.stats.externalLinks} links, ${v.stats.headings} headings, ${v.stats.dataPoints} data points` : ''})`;
  return `FAIL: ${v.failures.map((f) => f.code).join(', ')}`;
}
