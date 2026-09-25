const ORIGIN = "https://haretoku.jp";
const PAGES = Object.freeze({
  "/": { id: "home", title: "はれトク", article: false },
  "/solar/": { id: "guides", title: "はれトクガイド", article: false },
  "/simulator/": { id: "diagnosis", title: "はれトク診断", article: false },
  ...Object.fromEntries([
    ["electricity-sales", "太陽光の収支"], ["subsidies", "補助金"],
    ["disaster", "停電への備え"], ["quotes-contractors", "見積もり"],
    ["policy", "はれトクの方針"], ["calculation-method", "計算方法・使用データ"]
  ].map(([id, title]) => [`/pages/${id}.html`, { id, title, article: !["policy", "calculation-method"].includes(id) }]))
});

export function canonicalPath(path) {
  if (["/index.html", "/solar/index.html", "/simulator/index.html"].includes(path)) return path.replace("index.html", "");
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
  const noop = Object.freeze({ active: false, diagnosisComplete() { return false; } });
  if (!analyticsAllowed(config, win.location.href, productionBuild)) return noop;
  try {
    const path = canonicalPath(new URL(win.location.href).pathname);
    const page = PAGES[path];
    const context = Object.freeze({
      page_location: ORIGIN + path,
      page_referrer: cleanReferrer(doc.referrer),
      page_title: page.title,
      page_id: page.id
    });
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
    function event(name) {
      // 呼出元から値を受け取らない．入力・金額・URL・リンク文字列を渡す経路を作らない．
      gtag("event", name, { ...context, send_to: config.measurementId });
    }
    event("page_view");
    if (page.article) event("article_view");
    let started = false, completed = false;
    if (page.article) doc.addEventListener("click", e => {
      if (e.defaultPrevented || (e.button !== undefined && e.button !== 0) || started) return;
      const link = e.target?.closest?.("a[href]");
      if (!link || link.hasAttribute("download") || link.getAttribute("aria-disabled") === "true") return;
      try {
        const target = new URL(link.href, win.location.href);
        if (target.origin !== ORIGIN || canonicalPath(target.pathname) !== "/simulator/") return;
        started = true;
        event("article_diagnosis_click");
      } catch { /* 不正なリンクは計測しない． */ }
    });
    const script = doc.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`;
    doc.head.append(script);
    return Object.freeze({
      active: true,
      diagnosisComplete() {
        if (path !== "/simulator/" || completed) return false;
        completed = true;
        event("diagnosis_complete");
        return true;
      }
    });
  } catch { return noop; }
}
