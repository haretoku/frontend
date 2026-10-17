// 2026年10月11日，ユーザー提供の通常広告用素材038「自由テキスト」を採用．
// 提供された自由テキスト素材のリンク・計測画像を組で保持する．
export const quoteMaterial = Object.freeze({
  materialId: '038',
  url: 'https://px.a8.net/svt/ejp?a8mat=4BCKBS+DN6MUQ+3LME+66H9E',
  impressionUrl: 'https://www11.a8.net/0.gif?a8mat=4BCKBS+DN6MUQ+3LME+66H9E',
  linkText: '無料見積もり',
  provider: 'ソーラーパートナーズ',
  materialVerified: true
});

// 2026年10月17日，提携済みタイナビの通常広告用素材027「自由テキスト」を管理画面で確認．
export const tainaviMaterial = Object.freeze({
  materialId: '027',
  url: 'https://px.a8.net/svt/ejp?a8mat=4BEH5B+8YOYNM+2AG2+644DU',
  impressionUrl: 'https://www14.a8.net/0.gif?a8mat=4BEH5B+8YOYNM+2AG2+644DU',
  linkText: '無料見積もり',
  provider: 'タイナビ',
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
