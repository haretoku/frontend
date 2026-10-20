# v0.5.1 本番配信の独立検収

## 判定と対象

> **結論：D02の独立配信検収はPASS．全31正規URLの参照と新ハレナ画像を承認版へ対応づけ，原本・QAの非配信と正規化・404を確認した．**

- 確認日：2026年10月20日．独立担当：`/root/v051_icon_release_review`．対象origin：`https://haretoku.jp`．取得時刻：`2026-10-20T12:24:24.889Z`．
- 公開commit：`948f8d192f4cd20f1a92ccccc5eb93628a135598`．親担当から[Pages実行39421736963](https://github.com/haretoku/frontend/actions/runs/39421736963)のSuccess通知を受けて取得した．D01の実行結果の判定は親担当へ接続する．
- [機械検収結果](v051-production-checks.json)の`overallPassed`は`true`．SHA-256：`232e4a002ac9b42aab9448875debaca97a23723ac04879dcabd5fd7471eb3e87`．合計43 HTTP取得（sitemap1，正規31，画像2，非配信・404代表7，正規化2）を行い，不変の全112資産は再取得していない．
- 本担当は本体・Git・本番設定を変更していない．検収JSONと本報告のみ保存した．ブラウザ・補助サーバーは使用していない．

## 正規URLと画像

> **結論：全31正規URLでロゴ・faviconが新しいハレナへそろい，本番SVGと96×96 PNGは公開commitのバイトと完全一致した．**

|対象|結果|
|---|---|
|sitemap|200，正規URL31件|
|正規URL|31／31が200，canonicalが自身の正式URLと一致，robotsのnoindexなし．開発origin・localhost・原本／QA経路の混入0|
|favicon参照|31／31がSVG `/assets/favicon-BmMVSVLw.svg`と固定PNG `https://haretoku.jp/favicon.png`を参照．PNGには`96x96`指定あり|
|ロゴ参照|31／31の`brand__mark`がそのページのfavicon SVGと同じURLを参照|
|SVG|200，`image/svg+xml`．本番SVG＝公開commit内favicon.svg＝公開commit内sun-face.svg．埋込みPNGだけを参照し，外部画像依存なし|
|PNG|200，`image/png`．固定`/favicon.png`＝公開commit内favicon-96.png．PNG署名・96×96寸法を確認|

SVGのSHA-256は3者とも`558e837accce56ac69644f56c744790e4a342faa2f4de65bc7eb47ac71eb5e94`，PNGは両者とも`b97e71632febfa997e483b4fb070f4d3d9d1d3862d8ba8b88f6251e0bb3853a5`．Windows／CIのCR差を許容する補助比較も保持したが，今回の画像は改行正規化を使わず完全一致している．ファイル名だけで同一判定していない．

## 非配信・正規化・404

> **結論：原本やQAは公開されず，HTTP／wwwは正式HTTPSへ転送される．存在しないURLはサイトの404を返す．**

|確認URL|結果|
|---|---|
|`/design/characters/harena.png`，`/design/characters/professor.png`，`/design/characters/README.md`|3件とも404，noindex,follow|
|`/qa/artifacts/v051-release-independent-review.md`，`/qa/generate-character-assets.mjs`|2件とも404，noindex,follow|
|`/v051-independent-not-found`|404，noindex,follow|
|`/404.html`|200，noindex,follow．上述6件の404応答本文とバイト一致|
|`http://haretoku.jp/`，`https://www.haretoku.jp/`|2件とも301，Locationは`https://haretoku.jp/`|

404本文のSHA-256は`2287acaefc8a136f9edcc277775853a6eb90ccb38e7e0edc4ede54bb609d3e33`．初回の集計条件では`/404.html`自体にも404を要求してfalseとなったが，これは検査側の条件誤りである．取得済みのHTTP結果に基づき，`/404.html`は200，存在しないURLは404という条件へ修正した．サイト改修・再取得は行っていない．

## 再利用範囲と限界

> **結論：計算・公開データ・記事・広告・導線の不変性を確認し，v0.5.0の本番検収を再利用する．実画面とGoogle検索への反映は別に確認する．**

`3299e108171f2e81cdbd1ec4b927feb51a6a42cf`（v0.5.0公開commit）と今回commitを比較した．`site`・`data`・`.config`・lockfileの差分は，画面設計・実装方針と3つのアイコン資産だけ．計算，公開6JSON，記事本文，広告，計測，導線，保存・歩き方等は不変であり，[v0.5.0本番独立検収](v050-production-independent-review.md)と[v0.5.1公開前独立検収](v051-release-independent-review.md)の該当PASSを再利用する．既存112資産の取得や計算入力全件試験を再実施したとは扱わない．

|優先度|残件数|内容|
|---|---|---|
|MUST|0|独立HTTP配信検収の範囲に不整合なし|
|RECOMMEND|0|追加の修正指摘なし|
|NITS|0|追加の修正指摘なし|

親担当はD03のPC／スマホ表示とD04の公開タグ・Release・文書更新を別途記録する．本番の画像配信PASSをGoogle検索の新アイコン表示完了へ読み替えない．Googleの再取得依頼・受理・実表示は外部運用の記録へ接続する．
