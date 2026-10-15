/* The existing GTM container owns GA4. Do not add a second GA4 config/page_view. */
(function () {
  'use strict';
  var panel = document.getElementById('analytics-choice');
  if (!panel || window.__pagAnalyticsChoice) return;
  window.__pagAnalyticsChoice = true;
  var key = 'cookie_consent'; // Retain choices made on the previous site.
  var measurementId = 'G-K67F088N0D';
  var containerId = 'GTM-5RQQ559V';
  var loaded = false;
  var choice = null;
  var privacy = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  var publicPage = !/^\/(account|admin|auth|checkout|membership|api|cart|dashboard|email-confirmed|history|referral|saved|search|settings|submit-prompt|ai-credits-exhausted|ai|ask-scout|certification|scout|templates|submit)(\/|$)/.test(location.pathname);
  var production = location.hostname === 'www.promptandgo.ai' || location.hostname === 'promptandgo.ai';
  var status = document.getElementById('analytics-status');
  try { choice = localStorage.getItem(key); } catch (_) { /* Ask without persisting. */ }

  function gtag() { window.dataLayer.push(arguments); }
  function start() {
    if (loaded || privacy || !publicPage || !production || choice !== 'accepted') return;
    loaded = true;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('set', { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname, page_referrer: document.referrer ? new URL(document.referrer).origin : '' });
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + containerId;
    document.head.appendChild(script);
  }
  function forgetCookies() {
    document.cookie.split(';').forEach(function (entry) {
      var name = entry.trim().split('=')[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', ';domain=' + location.hostname, ';domain=.promptandgo.ai'].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax';
      });
    });
  }
  function choose(value) {
    choice = value;
    try { localStorage.setItem(key, value); } catch (_) { /* This visit only. */ }
    panel.hidden = true;
    if (value === 'accepted') start();
    else {
      window['ga-disable-' + measurementId] = true;
      if (loaded) gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      forgetCookies();
      // Unload the container as well as withdrawing storage consent.
      if (loaded) location.reload();
    }
  }
  document.querySelectorAll('[data-analytics-choice]').forEach(function (button) {
    button.addEventListener('click', function () { choose(button.getAttribute('data-analytics-choice')); });
  });
  document.querySelectorAll('[data-analytics-settings]').forEach(function (button) {
    button.addEventListener('click', function () {
      status.textContent = privacy ? 'Your browser privacy preference keeps analytics off.' : choice === 'accepted' ? 'Analytics is currently allowed.' : 'Analytics is currently off.';
      panel.hidden = false;
      panel.querySelector('button').focus();
    });
  });
  window.addEventListener('storage', function (event) {
    if (event.key === key && event.newValue !== choice) choose(event.newValue === 'accepted' ? 'accepted' : 'declined');
  });
  panel.hidden = privacy || !publicPage || !production || choice === 'accepted' || choice === 'declined';
  start();
})();
