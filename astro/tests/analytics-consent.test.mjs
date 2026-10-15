import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
const code = readFileSync(new URL('../public/analytics-consent.js', import.meta.url), 'utf8');
function setup({ choice = null, hostname = 'www.promptandgo.ai', pathname = '/', privacy = false, dnt = null, storageFails = false } = {}) {
  const scripts = [], writes = [], handlers = {};
  const panel = { hidden: true, querySelector: () => ({ focus() {} }) };
  const status = { textContent: '' };
  const button = (name) => ({ addEventListener: (_, fn) => { handlers[name] = fn; }, getAttribute: () => name });
  const document = { referrer: '', cookie: '_ga=old; _ga_K67F088N0D=old; session=keep', getElementById: id => id === 'analytics-choice' ? panel : status, querySelectorAll: selector => selector === '[data-analytics-choice]' ? [button('accepted'), button('declined')] : [button('settings')], createElement: () => ({}), head: { appendChild: script => scripts.push(script) } };
  let reloads = 0;
  const location = { hostname, pathname, origin: 'https://' + hostname, reload: () => reloads++ };
  const window = { addEventListener: (name, fn) => { handlers[name] = fn; } };
  const context = vm.createContext({ window, document, location, navigator: { globalPrivacyControl: privacy, doNotTrack: dnt }, localStorage: { getItem: () => { if (storageFails) throw Error('storage'); return choice; }, setItem: (key, value) => { if (storageFails) throw Error('storage'); writes.push([key, value]); } }, URL, Date });
  vm.runInContext(code, context);
  return { window, document, panel, status, scripts, writes, handlers, run: () => vm.runInContext(code, context), reloads: () => reloads };
}
test('fresh visitor gets a real choice and no Google requests', () => { const s = setup(); assert.equal(s.panel.hidden, false); assert.equal(s.scripts.length, 0); });
test('accepted consent loads only the existing GTM, with denied ads before loading', () => {
  const s = setup(); s.handlers.accepted(); s.handlers.accepted(); s.run();
  assert.equal(s.scripts.length, 1); assert.equal(s.scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-5RQQ559V');
  const rows = s.window.dataLayer;
  assert.equal(Object.prototype.toString.call(rows[0]), '[object Arguments]');
  assert.equal(rows[0][2].analytics_storage, 'denied');
  assert.equal(rows[2][2].analytics_storage, 'granted');
  for (const row of [rows[0], rows[2]]) for (const field of ['ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(row[2][field], 'denied');
  assert.equal(rows.filter(row => row[0] === 'config' || row[0] === 'event').length, 0);
  assert.equal(rows.at(-1).event, 'gtm.js'); assert.deepEqual(s.writes[0], ['cookie_consent', 'accepted']);
});
test('legacy accepted choice is retained', () => { const s = setup({choice:'accepted'}); assert.equal(s.scripts.length,1); assert.equal(s.panel.hidden,true); });
test('legacy declined choice remains off, can reopen and accept', () => { const s = setup({choice:'declined'}); assert.equal(s.scripts.length,0); assert.equal(s.panel.hidden,true); s.handlers.settings(); assert.equal(s.panel.hidden,false); s.handlers.accepted(); assert.equal(s.scripts.length,1); });
test('decline then accept in same visit enables collection once', () => { const s=setup(); s.handlers.declined(); s.handlers.settings(); s.handlers.accepted(); assert.equal(s.scripts.length,1); assert.equal(s.window['ga-disable-G-K67F088N0D'],false); });
test('withdrawal disables GA, persists rejection and reloads to unload tags', () => { const s=setup({choice:'accepted'}); s.handlers.settings(); s.handlers.declined(); assert.equal(s.window['ga-disable-G-K67F088N0D'],true); assert.equal(s.window.dataLayer.at(-1)[2].analytics_storage,'denied'); assert.equal(s.reloads(),1); assert.deepEqual(s.writes.at(-1),['cookie_consent','declined']); });
for (const options of [{privacy:true},{dnt:'1'},{hostname:'preview.promptandgo-astro.pages.dev'},{hostname:'localhost'},{pathname:'/account'},{pathname:'/auth/reset'},{pathname:'/admin'}, ...['checkout/success','membership/success','cart','dashboard','email-confirmed','history','referral','saved','search','settings','submit-prompt','ai-credits-exhausted','ai/studio','ask-scout','certification','scout','templates','submit'].map(path => ({pathname:'/' + path}))]) test('suppressed visit '+JSON.stringify(options),()=>{ const s=setup({...options,choice:'accepted'}); s.handlers.accepted(); assert.equal(s.scripts.length,0); });
test('unavailable storage fails closed until explicit consent',()=>{ const s=setup({storageFails:true}); assert.equal(s.scripts.length,0); s.handlers.accepted(); assert.equal(s.scripts.length,1); });
test('public layout includes consent UI and public settings, no duplicate direct GA',()=>{
 const layout=readFileSync(new URL('../src/layouts/Layout.astro',import.meta.url),'utf8');
 const ui=readFileSync(new URL('../src/components/AnalyticsConsent.astro',import.meta.url),'utf8');
 const footer=readFileSync(new URL('../src/components/Footer.astro',import.meta.url),'utf8');
 assert.match(layout,/<AnalyticsConsent\s*\/>/); assert.match(ui,/data-analytics-choice="declined"/); assert.match(ui,/data-analytics-choice="accepted"/); assert.match(footer,/data-analytics-settings/); assert.doesNotMatch(code,/gtag\/js|gtag\('config'|virtualPageview/);
 const headers=readFileSync(new URL('../public/_headers',import.meta.url),'utf8'); assert.match(headers,/script-src 'self' https:\/\/www.googletagmanager.com/); assert.doesNotMatch(headers,/unsafe-inline|unsafe-eval/);
});

test('withdrawal in another tab disables and unloads tracking',()=>{const s=setup({choice:'accepted'});s.handlers.storage({key:'cookie_consent',newValue:'declined'});assert.equal(s.window['ga-disable-G-K67F088N0D'],true);assert.equal(s.reloads(),1);});
