// 廃止した条件別記事と旧節URLを，現行の基礎収支記事へつなぐ．
const destinations = {
  "payback": "economics-calculation",
  "profit-baseline": "economics-calculation",
  "profit-overview-factors": "economics-personal-check",
  "profit-overview-home": "economics-personal-check",
  "cost-conditions": "costs",
  "initial-outlay": "costs",
  "energy-comparison": "overview",
  "profit-energy": "overview",
  "suitability-illustration-caption": "energy-conditions",
  "suitability": "energy-conditions",
  "factors": "energy-conditions",
  "household-comparison": "energy-conditions",
  "battery-comparison": "installation-cost",
  "battery-profit": "installation-cost",
  "battery-comparison-conditions": "installation-cost",
  "battery-economics-comparison": "installation-cost",
  "battery-comparison-note": "installation-cost",
  "period-conditions": "lifecycle-cost",
  "evaluation-period": "lifecycle-cost"
};
function followLegacySection() {
  const retired = /^\/guides\/solar-profit-conditions\/(?:index\.html)?$/.test(location.pathname);
  const anchor = location.hash.slice(1);
  const destination = Object.hasOwn(destinations, anchor) ? destinations[anchor] : null;
  if (!retired && !destination) return;
  const target = new URL('/guides/solar-economics/', location.origin);
  target.search = location.search;
  target.hash = destination ? '#' + destination : location.hash;
  location.replace(target.href);
}
followLegacySection();
window.addEventListener('hashchange', followLegacySection);
