// 2026年10月2日，A8素材038と提携情報を確認済み．自由文言の例外許可と本番コードの扱いは未確定．
// 仮表示はViteの開発実行かつloopbackに限定し，ビルドでは有効にしない．
export const quoteMaterial = Object.freeze({
  url: 'https://px.a8.net/svt/ejp?a8mat=4BCKBS+DN6MUQ+3LME+66H9E',
  impressionUrl: 'https://www12.a8.net/0.gif?a8mat=4BCKBS+DN6MUQ+3LME+66H9E',
  provider: 'ソーラーパートナーズ',
  materialVerified: false
});

export function quotePreviewEnabled(development, hostname) {
  return development === true && ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
}

export function quoteActionFor(development, hostname) {
  const enabled = quotePreviewEnabled(development, hostname);
  return Object.freeze({
    label: enabled ? '無料見積もり' : '無料見積もり（準備中）',
    disabled: !enabled,
    description: '屋根や工事条件に合わせて，設置できる設備と導入費用を確認します．',
    ...(enabled ? { url: quoteMaterial.url, preview: true } : {})
  });
}
