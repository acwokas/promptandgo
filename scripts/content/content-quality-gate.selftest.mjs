/**
 * Self-test for content-quality-gate.mjs. Run with:
 *   node scripts/content/content-quality-gate.selftest.mjs
 * Exits non-zero on any failed assertion.
 */
import { gateTip, gateGlossaryTerm, TIP_PROFILE, GLOSSARY_PROFILE, describeVerdict } from './content-quality-gate.mjs';

let failures = 0;
function check(name, cond) {
  if (!cond) {
    failures++;
    console.error(`FAIL: ${name}`);
  } else {
    console.log(`ok: ${name}`);
  }
}

// --- a thin stub should fail on multiple axes at once
const stub = {
  title: 'Coming Soon',
  meta_description: 'This page is coming soon, check back later for more tips on prompting AI models effectively.',
  body_html: '<p>We are building this section. Stay tuned.</p>',
  sources: [],
};
const stubVerdict = gateTip(stub);
check('stub content fails the gate', !stubVerdict.ok);
check('stub content flags THIN_CONTENT', stubVerdict.failures.some((f) => f.code === 'THIN_CONTENT'));
check('stub content flags STUB_PHRASE', stubVerdict.failures.some((f) => f.code === 'STUB_PHRASE'));
check('stub content flags NO_SOURCES', stubVerdict.failures.some((f) => f.code === 'NO_SOURCES'));
check('stub content flags TOO_FEW_LINKS', stubVerdict.failures.some((f) => f.code === 'TOO_FEW_LINKS'));
check('stub content flags TOO_FEW_HEADINGS', stubVerdict.failures.some((f) => f.code === 'TOO_FEW_HEADINGS'));

// --- a dash in copy should fail
const dashed = {
  title: 'A Fine Title',
  meta_description: 'A meta description of a reasonable length that sits comfortably inside the SERP window today.',
  body_html: '<h2>One</h2><p>Some text with an em dash — right there.</p>'.repeat(1),
  sources: [{ label: 'x', url: 'https://example.com' }],
};
check('em dash fails the gate', !gateTip(dashed).ok);
check('em dash flags DASH', gateTip(dashed).failures.some((f) => f.code === 'DASH'));

// --- a well-formed, sufficiently long draft with real structure should pass
// everything except deliberately-thin word count, proving the gate does not
// false-positive on ordinary well-formatted prose.
function longBody() {
  const para = Array.from({ length: 20 }, (_, i) =>
    `This is sentence number ${i + 1} of a paragraph written to reach the word floor without repeating a single phrase banned by the stub list, and without using an em dash anywhere in it at all today.`,
  ).join(' ');
  return [
    '<h2>Getting started</h2>',
    `<p>${para} According to <a href="https://example.com/docs">the documentation</a>, the context window is 200,000 tokens and the API accepts up to 4,096 output tokens per call, a limit unchanged since 2024.</p>`,
    '<h2>Worked example</h2>',
    `<p>${para} A benchmark run in 2025 reported a 12 percent improvement, and a second source cited $2,500 in monthly savings, both figures drawn from <a href="https://example.org/paper">a published paper</a>.</p>`,
    '<h3>Common mistakes</h3>',
    `<p>${para} A third external reference is linked <a href="https://example.net/guide">here</a> for further reading, and a fourth data point, 500,000 users, appears in the same paragraph.</p>`,
  ].join('');
}
const good = {
  title: 'How To Do The Thing Well',
  meta_description: 'A meta description of a reasonable length that sits comfortably inside the SERP window today.',
  body_html: longBody(),
  sources: [
    { label: 'Docs', url: 'https://example.com/docs' },
    { label: 'Paper', url: 'https://example.org/paper' },
    { label: 'Guide', url: 'https://example.net/guide' },
  ],
};
const goodVerdict = gateTip(good);
check(`well-formed long draft passes (${describeVerdict(goodVerdict)}, failures: ${goodVerdict.failures.map((f) => f.code).join(',') || 'none'})`, goodVerdict.ok);

// --- glossary: a real, sourced entry should pass; an unsourced one should fail
const glossaryOk = gateGlossaryTerm({
  slug: 'few-shot-prompting',
  term: 'Few-Shot Prompting',
  shortDefinition: 'Few-shot prompting means including a small number of worked examples in a prompt so the model copies their format and style in its response.',
  body: [
    'Instead of describing the desired output in the abstract, a few-shot prompt shows two or three input and output pairs before asking the model to continue the pattern on a new input.',
    'This works well for locking in a specific tone, structure, or format that is hard to specify precisely in plain instructions alone, and it usually takes fewer attempts than iterating on wording.',
  ],
  sources: [{ label: 'Example docs', url: 'https://example.com/few-shot' }],
});
check('sourced glossary term passes', glossaryOk.ok);

const glossaryBad = gateGlossaryTerm({
  slug: 'Bad Slug Here',
  term: '',
  shortDefinition: '',
  body: [],
  sources: [],
});
check('unsourced empty glossary term fails', !glossaryBad.ok);
check('unsourced glossary term flags NO_SOURCES', glossaryBad.failures.some((f) => f.code === 'NO_SOURCES'));

if (failures > 0) {
  console.error(`\n${failures} assertion(s) failed.`);
  process.exit(1);
} else {
  console.log('\nAll assertions passed.');
}
