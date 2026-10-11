// 2026年10月11日，ユーザー提供の通常広告用素材001を採用．
// 提供された固定文言・リンク・計測画像を保持する．
export const quoteMaterial = Object.freeze({
  materialId: '001',
  url: 'https://px.a8.net/svt/ejp?a8mat=4BCKBS+DN6MUQ+3LME+5YJRM',
  impressionUrl: 'https://www17.a8.net/0.gif?a8mat=4BCKBS+DN6MUQ+3LME+5YJRM',
  linkText: '【住宅用太陽光発電】ソーラーパートナーズ',
  provider: 'ソーラーパートナーズ',
  materialVerified: true
});

export function quoteActionFor() {
  return Object.freeze({
    label: quoteMaterial.materialVerified ? quoteMaterial.linkText : '無料見積もり（準備中）',
    disabled: !quoteMaterial.materialVerified,
    description: '屋根や工事条件に合わせて，設置できる設備と導入費用を確認します．',
    ...(quoteMaterial.materialVerified ? { url: quoteMaterial.url } : {})
  });
}
