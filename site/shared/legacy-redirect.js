// GitHub PagesではHTTP 301を設定できないため，旧URLの検索条件・節を保持して移動する．
const link = document.querySelector('link[rel="canonical"]');
if (link) {
  const target = new URL(new URL(link.getAttribute('href'), location.origin).pathname, location.origin);
  target.search = location.search;
  target.hash = location.hash;
  location.replace(target.href);
}
