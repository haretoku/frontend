# v0.5.1 ハレナ原本・ロゴ・faviconの公開前独立検収

## 判定と対象

> **結論：公開前の独立検収はPASS．採用済みキャラクターの原本と派生素材の関係，31正規URLのfavicon参照，公開物の非混入を確認し，修正を要するMUST・RECOMMEND・NITSはない．**

- 確認日：2026年10月20日．独立担当：`/root/v051_icon_release_review`．開始HEAD：`f08fb0627f6502087c1a05470e87dfc217dacc03`．候補版：`package.json`の`0.5.1`．Gitコミット前の作業ツリーを，後掲SHA-256で固定した．ユーザーの公開承認は親担当から受領した．
- 対象：`design/characters/`の3ファイル，2本の生成スクリプト，`sun-face.svg`，faviconのSVG・PNG，版番号，関連する画面設計・実装方針・CHANGELOG・QAの差分．コード・Git・本番を変更していない．本報告だけを新規保存した．
- `site/hosting/finalize-review.js`と旧未採用画像等は既存WIPとして公開対象外．公開用のVite設定・後処理は不変である．親担当は公開コミットのallowlistと最終差分を別途固定する．

## 原本・生成・小サイズ

> **結論：似た太陽図形ではなく，従来の記事・MAPで採用済みのハレナ画像そのものから生成されている．原本を加工したものへ置き換えていない．**

|確認|結果と根拠|
|---|---|
|ハレナ原本|1254×1254，透過PNG．`harena.png`と現行`navigator.png`，開始HEAD内の`navigator.png`の3者がバイト一致|
|博士原本|1254×1254，透過PNG．`professor.png`と現行`professor-chibi.png`，開始HEAD内の同ファイルがバイト一致|
|生成の独立再現|原本を1280×1280面の`220 225 820 820`表示窓で256×256へ書き出した結果をメモリー上で独立再現し，SVG内のPNGとバイト一致．原本・配信用ファイルを書き換えていない|
|SVGの外部依存|ロゴとfaviconのSVGはバイト一致．画像参照は埋込み`data:image/png;base64,`1件のみ．外部URL，スクリプト，別画像依存なし|
|96×96 PNG|現在のSVGをsharpで96×96へ変換したメモリー上の結果と，採用PNGがバイト一致．PNG署名・寸法・透過を確認|
|小サイズ|原本と[16・32・96 pxの確認画像](v051-harena-master-sizes.png)を独立に目視した．8方向の光と顔が原本に一致し，先端欠けなし．16 pxでは顔の細部は小さいが輪郭・顔の位置を保ち，32・96 pxでは目と口を判別できる|
|原本管理文書|原本の出所・無加工コピー・寸法・SHA・派生手順・原本を上書きしない規則を記載．編集可能な制作データを取得したという誤記なし|

## 公開用成果物と不変範囲

> **結論：公開用112ファイル・31正規URLの構成は保たれ，キャラクター原本やQA・内部MDは配信されない．計算・記事・データ・広告・導線の変更はない．**

- 親担当の`test:public`ログを読取り確認：145件PASS，FAIL・skip・cancelは0．`build:pages`ログは112ファイル・正規31URL，公開データ13.0.0同一，ローカル参照・QA非混入でPASS．重複ビルドは実施していない．ログのSHAは後掲．
- ビルド済みsitemapの31 URLを独立に列挙し，各HTMLのfaviconを確認した．全件がSVG `/assets/favicon-BmMVSVLw.svg`とPNG `https://haretoku.jp/favicon.png`を参照する．SVGの配信バイトは採用SVGと一致し，固定`dist-pages/favicon.png`も採用PNGと一致する．SVGのファイル名はCIの改行差で変わり得るため，公開後は名前だけでなく内容も照合する．
- `dist-pages`を再帰列挙し，112ファイルのうち`design/`・`qa/`・内部MD・生成スクリプトの混入は0．`publicDir:false`と明示的な入力・資産後処理の構成も読取り確認した．原本は非配信だが，従来からの配信用navigator／博士は意図どおり保持する．
- `site/map`・`site/shared`・`site/guides`・`data`・`.config`・lockfileの追跡差分は3つのアイコン資産だけ．計算・公開データ・記事本文・広告URL／計測・操作コードに差分はない．未追跡の旧素材を公開する資産走査の追加もない．
- 不変範囲の検収は[v0.5.0公開前独立検収](v050-release-independent-review.md)と[v0.5.0本番独立検収](v050-production-independent-review.md)を再利用する．対象は計算・データ・記事・広告・GA・導線・保存・歩き方等の不変コード／素材であり，今回変更するアイコンの配信結果まで以前のPASSで代替していない．

## SHA-256

> **結論：以下のバイトを本独立検収の対象とした．**

|ファイル|SHA-256|
|---|---|
|`design/characters/harena.png`，`site/map/assets/navigator.png`|`1cfc6cd08c52ee36e60d4f37261ce6b219112a9c731658c6de191118d5e544fb`|
|`design/characters/professor.png`，`site/map/assets/professor-chibi.png`|`cd752bd66b6710e403c69cd9756c6cbf00ac5a1c459ae3d39052fbc14e01f069`|
|`site/map/assets/sun-face.svg`，`site/shared/assets/favicon.svg`|`558e837accce56ac69644f56c744790e4a342faa2f4de65bc7eb47ac71eb5e94`|
|`site/shared/assets/favicon-96.png`，`dist-pages/favicon.png`|`b97e71632febfa997e483b4fb070f4d3d9d1d3862d8ba8b88f6251e0bb3853a5`|
|`qa/generate-character-assets.mjs`|`301adc9a949fa1c5b1a580137c3737253102ae01d2db376d79b9c446f3db4126`|
|`qa/generate-favicon.mjs`|`01d1cff96a1f12a37614fcf02c407454d7e4dd3930bb837c5e7e1bdbe11cdca9`|
|`package.json`|`ef0abd489712cd0b1085092d7559b18f0aa73751021695f98ca3eb737d5a74a5`|
|`qa/artifacts/v051-harena-master-sizes.png`|`825f951f02705a0384574b2c437de9213495cd8497a50ead7e8a695b05a5b671`|
|`qa/artifacts/v051-release-test.log`|`19c86f331410e4470cbbc74a918ffb2e7f7068662fb928888f0e2e5b3ed89c02`|
|`qa/artifacts/v051-release-build.log`|`3bf71b2c38f9a8e103d06bb8b10fc8572ea5e398038148d8aba5765dd2133bc5`|

## 指摘・限界・引渡し

> **結論：独立検収範囲の修正指摘は0件．本番配信・ブラウザ表示・Googleの再取得は親担当の公開工程で別途確認する．**

|優先度|件数|結果|
|---|---|---|
|MUST|0|公開を妨げるコード・素材・配布構成の不整合なし|
|RECOMMEND|0|追加修正提案なし|
|NITS|0|追加指摘なし|

PC／スマホの実画面確認は親担当へ分担した．本担当はブラウザ操作・補助プロセス起動・Googleへの申請・Git操作・公開操作を行っていない．確認したQAと画面設計の「本番未実施」は公開前時点の記録として整合するが，公開後に親担当が公開コミット・実行結果・タグ／Release・文書の状態をそろえる．Google検索アイコンの実表示や，既存のTOP更新依頼未受理の解消は本報告のPASSに含めない．
