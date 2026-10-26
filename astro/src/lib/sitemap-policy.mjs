// These templates declare slash-free canonicals explicitly. Keep the sitemap
// aligned with those existing URLs without changing other pages' canonicals.
export function canonicalSitemapEntry(entry) {
  const url = new URL(entry.url);
  if (/^\/(?:library\/[^/]|packs\/[^/]|(?:models|optimize)\/?$)/.test(url.pathname)) {
    url.pathname = url.pathname.replace(/\/$/, '');
    return { ...entry, url: url.href };
  }
  return entry;
}
