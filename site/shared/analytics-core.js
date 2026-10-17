import {journeyRoutes,journeyPageId} from '../map/routes.js';
import { quoteMaterial } from './quote-config.js';
import {consultationProviderForUrl} from '../map/consultation-view.js';
const ORIGIN = "https://haretoku.jp";
const QUOTE_PLACEMENTS = new Set(['fixed_bar', 'article_body', 'diagnosis_result', 'map_consultation', 'map_comparison', 'article_comparison']);
const CONSULT_PLACEMENTS = new Set(['map', 'article', 'map_comparison', 'article_comparison']);
const PAGES = Object.freeze({
  ...Object.fromEntries(Object.entries(journeyRoutes).filter(([id])=>!['map','estimate'].includes(id)).map(([id,path])=>[path,{id:`guide_${id.replaceAll('-','_')}`,title:"太陽光と蓄電池のガイド",article:true}])),
  "/": { id: "home", title: "はれトク", article: false },
  "/guides/": { id: "guides", title: "はれトクガイド", article: false },
  "/press/": { id: "press", title: "プレスリリース", article: false },
  "/simulator/": { id: "diagnosis", title: "はれトク診断", article: false },
  "/data/": { id: "data", title: "はれトクデータ", article: false, data: true },
  "/data/subsidies/": { id: "data_subsidies", title: "太陽光・蓄電池の補助金", article: false, data: true },
  ...Object.fromEntries([
    ["electricity-sales", "太陽光の収支"], ["subsidies", "補助金"],
    ["disaster", "停電への備え"], ["quotes-contractors", "見積もり"],
    ["solar-electricity-savings", "太陽光による電気代の削減"], ["solar-fit", "FIT制度"],
    ["solar-installation-cost", "太陽光の設置費"], ["solar-maintenance-cost", "太陽光の維持費"],
    ["subsidy-amount", "自宅の補助額"], ["electricity-support-end", "電気代支援終了による負担増"],
    ["policy", "はれトクの方針"], ["calculation-method", "計算方法・使用データ"]
  ].map(([id, title]) => [["policy", "calculation-method"].includes(id) ? `/pages/${id}.html` : `/guides/${id === "electricity-sales" ? "solar-economics" : id}/`, { id, title, article: !["policy", "calculation-method"].includes(id) }]))
});

export function canonicalPath(path) {
  if (path.endsWith("/index.html") && PAGES[path.replace("index.html", "")]) return path.replace("index.html", "");
  return PAGES[path] ? path : null;
}

export function cleanReferrer(value) {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return "";
    const path = canonicalPath(url.pathname);
    // 外部サイトは検索語等がパスに入る場合もあるためoriginだけにする．
    return url.origin === ORIGIN && path ? ORIGIN + path : url.origin;
  } catch { return ""; }
}

export function analyticsAllowed(config, href, productionBuild) {
  try {
    const url = new URL(href);
    return productionBuild === true && config.enabled === true
      && config.enhancedMeasurementDisabled === true
      && /^G-[A-Z0-9]{6,}$/.test(config.measurementId)
      && url.origin === ORIGIN && Boolean(canonicalPath(url.pathname));
  } catch { return false; }
}

// テスト時はwindow/documentを差し替え，Googleへ接続せず送信予定コマンドを検証する．
export function createAnalytics({ config, productionBuild, window: win, document: doc }) {
  const noop = Object.freeze({ active: false, diagnosisComplete() { return false; }, journeyAction() { return false; } });
  if (!analyticsAllowed(config, win.location.href, productionBuild)) return noop;
  try {
    const resolvePath = () => {
      const url = new URL(win.location.href);
      if (url.origin !== ORIGIN || !canonicalPath(url.pathname)) return null;
      return journeyRoutes[journeyPageId(url)] ?? canonicalPath(url.pathname);
    };
    let path = resolvePath();
    let page = PAGES[path];
    const pageContext = () => Object.freeze({
      page_location: ORIGIN + path,
      page_referrer: cleanReferrer(doc.referrer),
      page_title: page.title,
      page_id: page.id
    });
    let context = pageContext();
    const flags = {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      // 入力URLのutm値をGA側で自動解釈させない．このサイトではキャンペーン計測を行わない．
      campaign_id: "", campaign_source: "", campaign_medium: "",
      campaign_name: "", campaign_term: "", campaign_content: ""
    };
    win.dataLayer = win.dataLayer || [];
    function gtag() { win.dataLayer.push(arguments); }
    gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    gtag("set", { ...flags, ...context });
    gtag("js", new Date());
    gtag("config", config.measurementId, { ...flags, ...context });
    function event(name, placement, fields = {}) {
      // 呼出元で検証した固定列挙値だけを追加し，入力・金額・リンク文字列は送信しない．
      gtag("event", name, { ...context, send_to: config.measurementId, ...(QUOTE_PLACEMENTS.has(placement) ? { quote_placement: placement } : {}), ...fields });
    }
    event("page_view");
    if (page.article) event("article_view");
    let started = false, completed = false;
    const recordedActions = new Set();
    win.addEventListener?.('hashchange', () => {
      try {
        const nextPath = resolvePath();
        if (!nextPath || nextPath === path) return;
        path = nextPath;page = PAGES[path];context = pageContext();
        started = false;completed = false;recordedActions.clear();
        gtag('set',context);
        event('page_view');
        if (page.article) event('article_view');
      } catch { /* 計測失敗で旧入口からの画面移動を止めない． */ }
    });
    const trackLink = e => {
      const auxiliary = e.type === 'auxclick';
      if (e.defaultPrevented || (auxiliary ? e.button !== 1 : e.button !== undefined && e.button !== 0)) return;
      const link = e.target?.closest?.("a[href]");
      if (!link || link.hasAttribute("download") || link.getAttribute("aria-disabled") === "true") return;
      try {
        const target = new URL(link.href, win.location.href);
        const providerId = link.getAttribute('data-consult-provider');
        const consultPlacement = link.getAttribute('data-consult-placement');
        const provider = consultationProviderForUrl(providerId,target.href);
        if (provider && CONSULT_PLACEMENTS.has(consultPlacement)
          && (consultPlacement === 'map' || consultPlacement === 'map_comparison' ? path === '/' : page.article || path === '/simulator/')) {
          event('consultation_click', undefined, {provider_id:provider.id, consultation_placement:consultPlacement});
          // 広告成果の既存イベントも維持する．相談全社のイベントとは別指標．
          if (provider.id === 'solar-partners' && target.href === provider.url) event('quote_click', consultPlacement.endsWith('_comparison') ? consultPlacement : consultPlacement === 'map' ? 'map_consultation' : 'diagnosis_result');
          return;
        }
        const placement = link.getAttribute('data-quote-placement');
        if (target.href === quoteMaterial.url && QUOTE_PLACEMENTS.has(placement)) {
          event('quote_click', placement);
          return;
        }
        if (auxiliary || !(page.article || page.data) || started) return;
        if (target.origin !== ORIGIN || !(canonicalPath(target.pathname) === "/simulator/" || canonicalPath(target.pathname) === "/" && target.hash === "#estimate")) return;
        started = true;
        event(page.data ? "data_diagnosis_click" : "article_diagnosis_click");
      } catch { /* 不正なリンクは計測しない． */ }
    };
    doc.addEventListener('click', trackLink);
    doc.addEventListener('auxclick', trackLink);
    const script = doc.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
    doc.head.append(script);
    return Object.freeze({
      active: true,
      journeyAction(action, value) {
        if (action === 'map_step_click' && path === '/' && [0,1,2,3,4].includes(value)) {
          event(action, undefined, {chapter_id:String(value)});
          return true;
        }
        if (action === 'goal_consultation_click' && path === '/') {
          event(action);
          return true;
        }
        if (action === 'plan_change' && path === '/simulator/') {
          event(action);
          return true;
        }
        const chapter = Object.entries(journeyRoutes).find(([,route]) => route === path)?.[0];
        const chapterEnd = {try:0,estimate:1,disaster:2,installation:3,compare:4};
        const oneTime = action === 'diagnosis_start' && path === '/simulator/'
          || action === 'chapter_complete' && Object.hasOwn(chapterEnd,chapter) && value === chapterEnd[chapter];
        if (!oneTime || recordedActions.has(action)) return false;
        recordedActions.add(action);
        event(action, undefined, action === 'chapter_complete' ? {chapter_id:String(value)} : {});
        return true;
      },
      diagnosisComplete() {
        if (!["/", "/simulator/"].includes(path) || completed) return false;
        completed = true;
        event("diagnosis_complete");
        return true;
      }
    });
  } catch { return noop; }
}
