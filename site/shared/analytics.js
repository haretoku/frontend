import { analyticsConfig } from "./analytics-config.js";
import { createAnalytics } from "./analytics-core.js";

// 通常のdev／旧Sitesビルドでは本番ホストでも動かさない．Pagesビルドだけがtrueを定義する．
const productionBuild = import.meta.env?.PROD === true && import.meta.env?.VITE_HARETOKU_PAGES_BUILD === true;
const analytics = typeof window === "undefined" ? null : createAnalytics({
  config: analyticsConfig, productionBuild, window, document
});

export function recordDiagnosisComplete() {
  try { return analytics?.diagnosisComplete() ?? false; }
  catch { return false; } // 計測の失敗で診断処理を中断しない．
}
