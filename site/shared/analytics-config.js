// 測定IDの取得だけでは有効にしない．GA4側の拡張計測OFFとポリシーを確認後に切り替える．
export const analyticsConfig = Object.freeze({
  measurementId: "G-CK29TBEBPC",
  enabled: true,
  enhancedMeasurementDisabled: true
});
