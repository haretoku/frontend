# v0.4.1公開前の独立検収（2026年10月20日）

## 判定と対象

> **結論：独立検収で発見した画像の過包含と表示証跡の不足は解消した．コード・記事・確認済み表示の修正残件は0件であり，v0.4.1の公開対象commit・版情報の固定と公開承認が残る．**

- 独立担当：`/root/v041_release_readiness_review`．実装担当と別の担当がread-onlyで確認し，本報告だけを保存した．
- 対象：`local/share-card-20261017`，HEAD `f490033cf691d59fb39235c6114959532250d85f` と未コミット変更．記事9本の改稿，自家消費の画像・共通CSS化，記事一覧画像・共有メタ，数値バインディング，計算方法説明，静的配布処理が主な公開差分．
- 公開ベースと今回の切戻し候補：v0.4.0の公開commit `1737bb92c27665f7da51aac8d484f443258619fa`．v0.4.0が使った旧切戻し先v0.3.6と区別する．
- 初回成果物：`dist-pages` 175ファイル・34HTML・正規31URL．集合SHA256 `cdacbf6dddb3cd536906c74e779e196ecfa341631b38c09c4cc65f1500ebdb0f`．
- 最終成果物：M1・R1修正後は112ファイル・正規31URL，集合SHA256 `a1555864b6495e3f409daf2a85a733e295b44c976195d1d68743a6fc7b210ccf`．親担当の[検証記録](v041-readiness-verification.json)のfiles・集合SHA・全112ファイルSHAが最終対象を示す．初回値は指摘の発見時点を識別する履歴としてのみ記す．
- 本番公開，commit・push・tag，外部送信，ASP／Search Console操作は実施していない．新しいサーバー・長期補助プロセスの起動なし．

## 初回指摘と手順残

> **結論：初回のM1・M2は下記の限定再検収で解消した．残るMUSTはP01とP10の公開手順であり，未解決のコード不具合とは区別する．**

1. **MUST M1／P01・P06：選外OG画像が公開対象へ混入する．** `site/solar/src/guides.js` の広い`import.meta.glob("../../shared/assets/*.{png,webp,svg}", {eager:true,...})`が，記事一覧に採用していない画像もbundle参照に含める．sourceのOG候補38点に対してcatalog採用は10点だが，選外28点すべてを内容SHAでdistへ照合できた．選外原図の合計は1,274,648 bytes．例は`og-guide-disaster-20261018-NiORTGAQ.png`，`og-guide-disaster-20261019-v2-B5WHAdSa.png`，`og-guide-solar-electricity-savings-20261019-v5-npN0WE4l.png`など．固定名の採用10点は正しいが，この過包含は既存ビルド検査を通過する．**最小修正案：原図は保持し，catalogのimage.srcで参照する画像だけをimport/bundle参照へ含める．選外OGと不要な旧写真の出力除外を確認する．** 修正後は対象の一覧接続検査・本番build・成果物検査とSHA記録を更新する．
2. **MUST M2／P04：変更後のスマホ幅の確認を補う．** 維持費・見積もりの最終PC／360px証跡は再利用できる．収支の新しい累積図，設置費の新しい図2／3，FIT改稿，申請・自己負担・停電の最終差分は，QAに「スマホ実画面は未検査／今回範囲外」が残る．過去版のPC／360px検収を変更後まで拡張しない．親担当が現在のprivate開発版で変更後のページ幅・図表・画像・導線を限定確認中．実端末での確認とviewport変更は区別し，実端末の新規全件確認を今回必須とはしない．
3. **MUST／P01：公開対象の版とcommitを固定する．** package.versionは`0.4.0`，CHANGELOG先頭もv0.4.0のまま．これは準備途中であって実行時の機能不具合ではない．v0.4.1の変更範囲，採用資産，除外範囲，切戻し先と検収SHAを固定し，承認された保存・同期工程で対象commitを確定する．
4. **MUST／P10：対象版の公開承認は未取得．** 人間レビュー10／10の完成稿承認と，本番公開の承認を区別する．質問「v041としてリリースできる状態か？」を公開指示へ読み替えない．上記の公開前MUSTを解消した具体的な候補を提示してから，必要な公開承認を扱う．

## 再利用した記事検収とハッシュ

> **結論：記事の内容承認を取り消す差分は見つからず，7記事はQA／独立報告の最終HTML SHAと直接一致し，他3記事は不変本文と限定変更の記録で照合できる．**

|記事slug|現在HTML SHA256|再利用元と確認範囲|
|---|---|---|
|self-consumption|`b027a34f60bf6cbcc2b2bd00dfa2aef59da5a7cef20e2e66d8d77252bb5d9874`|v0.4.0比のHTML差分はOGメタ2箇所だけ．改行を正規化したmainは公開版と一致．CSSは共通化差分があるため表示は今回の対象に含める|
|solar-electricity-savings|`60076e61148176af40b29c44dd68db3cb94eac68ef27b01e17f25d7ad01d64a9`|QAのarticle_savings_reviewと承認済み表現整理を再利用．main SHA `51d30d21cbe34b15ca3fbe578230ccce498b166c67106469646e2892e1d96d69`はpayment-wallet-change-20261019.jsonの最終画像変更前後一致記録と一致|
|solar-fit|`f5453fd291c94ba916ffc6ef2c98eedd743944e6c08601f013464cd280e6adf4`|QAのarticle_fit_review，その後の承認済み1段落139→68字短縮・共有画像更新を再利用．現在の短縮段落も読取り，契約単価・終了日と中古住宅購入で期間をリセットしない説明を保持していることを確認|
|solar-economics|`83269818bb03f007a7b93a2dfa172e324b1fadca2198a24692a5f0bd9c68a294`|QAのarticle_economics_review最終SHAと一致．本文・図・累積計算のPASS再利用|
|solar-installation-cost|`d6f588932e308f954b4a5ad390b2d7ebbe6f3fe1af4bfc64f1f6aa052fb35833`|QAのinstallation_article_review最終SHAと一致．原資料保存画像の費目照合PASSと税区分未確認の限定を保持|
|subsidies|`d4e445982588d3113c2f916858443bf02c61cab06a9d2c0de5993b8a1a15e544`|subsidies-final-independent-review.mdと一致|
|subsidy-amount|`1a46d4246cf847bd4497863bcc957925759d4593684c5015912676eda3e294d4`|subsidy-amount-final-independent-review.mdの指摘解消後SHAと一致|
|disaster|`a844a8dc42ba0e22db733cdd7931cac5743a66f6397891fb81cf25f99d9ab73f`|disaster-final-independent-review.mdと一致|
|solar-maintenance-cost|`dae4188c077e8164a2180a5e7a42dddc422ebf56d9df915b3aa2d68679bb0a5a`|maintenance-final-independent-review.mdと一致．専用CSS `3cd136c657ca44ba64dc3534613f74b931364b03015c7d045056c7a0ccf856b3`も一致|
|quotes-contractors|`3b90af6343fde7f9e2e4f32ffe2f865a24a93523b0ef7d96c3043fa2a8f2e1d8`|quotes-final-independent-review.mdと一致|

quotes-final-other-articles-before.jsonに記録された自家消費・電気代・FITのHTML SHAも，今回の現在値と一致．計算方法HTML SHA `2d06b53b7c7a1b140b9c4d7f7252e93e55eed236d07187c48cb0939681a55d15`は維持費最終独立報告と一致．既存の数値・一次根拠PASSは変更なしの範囲を再利用し，この検収で原典を新規に全取得したとは扱わない．

## 初回の公開成果物確認と不変範囲

> **結論：正式URL・内部接続・採用OG・PDF互換と主要機能の不変性は確認できた．初回に不合格とした選外資産の同梱は，末尾の限定再検収で解消した．**

- 親担当の公開用test:publicは128／128 PASS，build:pagesもPASS．ログは[v041-readiness-tests.log](v041-readiness-tests.log)と[v041-readiness-build.log](v041-readiness-build.log)．同じ対象・条件の結果を再利用し，独立担当が二重実行したとは扱わない．
- 独立機械検査：34HTMLの内部fragment参照513件に欠落0．HTMLにprivate開発origin，appgprj／appgdep識別子，localhost経路，既知の秘密鍵・AWS／GitHub token形式の検出0．ファイル名にtrial／prototype／fixture／QA経路はないが，採用判定されていないOG画像28点の混入は名称検査だけでは検出できない．
- 既存ビルド検査の正式origin，31URLのcanonical／sitemap，robots，404のnoindex，配信allowlist，内部ファイル参照，GA有効化条件，受領公開JSONとのバイト一致を確認した．正規ページのnoindexと確認用originの残存はない．
- 採用OG10点はすべてPNG・1200×630，catalog・HTMLメタの参照と固定配布実体が一致し，source画像とバイト一致．TOPと旧PNG／JPEG共有URL，favicon 96×96は既存の互換資産照合PASSを再利用．小サイズの可読性は既存の画像単体・一覧実画面証跡を再利用し，実SNSキャッシュの更新成功とは区別する．
- 独立担当自身も今回catalogに採用されたOG10点を原画像で全件目視した．2案の比較，プラス・費用の天びん，申請書，見積書，太陽光→蓄電池→照明，財布と飛ぶ硬貨，FITの段階価格，パネル付き住宅と工事，パネルとレンチが各主題と対応し，主役とサイト名の欠落・重なりなし．主要要素は中央630角の範囲へ収まり，文字の細かい説明は置かれていない．電気代と自己負担はユーザー承認済みの同一画像である．この原画像目視は実共有サービスの表示検査ではない．
- PDFは`assets/contractor-checksheet-DmgL5J0n.pdf`の1件で，`%PDF-1.4`署名を確認．旧`/map/assets/contractor-checksheet.pdf`を現hashed配布URLへ置換する処理とHTML参照存在検査はPASS．PDF本文そのものは不変なので既存検収を再利用．
- v0.4.0から現在まで`data/`，`site/map/`，`site/simulator/`，GA実装・設定，CI・lockfileにtracked差分なし．記事数値は新しいMAP算式ではなく既存`calculateJourneyEstimate`を呼ぶバインディングへ整合した変更．数値同期・累積グラフ検査を128件PASSに含む．
- 記事10本のA8／Rentracks等の広告直リンクは0件で公開ベースから増減なし．広告掲載ページTOPと`/guides/quote-services/`，素材，広告URL・計測画像・送信ルールは不変なので，v0.4.0のP08と既存ASP登録2URLのPASSを再利用できる．記事から`/guides/choosing-installer/`への通常導線を新規広告と数えない．
- GAは固定route IDと通常のhrefを使ってarticle_view／article_diagnosis_clickへ接続し，個人入力・金額を送らない既存実装と128件内の計測テストを再利用．旧data-quote-start等の削除は記事UI変更だが，広告イベント用固定IDの新設ではない．GA実受信は既存の未確認残件のままであり，実装PASSへ混ぜない．

## RECOMMENDとNITS

> **結論：一覧と本文の更新日2件の改善は採用・修正済みであり，RECOMMEND・NITSの残件はない．**

- **RECOMMEND R1（解消済み）**：`articles.json`のquotes-contractorsとsolar-maintenance-costは初回metaValueが2026-10-18だったが，2026-10-20へ修正し，本文timeとの一致を独立確認した．金額・本文内容・広告の変更なし．
- **NITS**：追加なし．

## 版別QAへ反映する素案

> **結論：公開前のP01〜P10を以下の最終状態で既存QAへ集約し，残るP01・P10を版固定と公開承認の工程で完了させる．**

|ID|最終判定|根拠と残件|
|---|---|---|
|P01|未確認|v0.4.1の版情報・採用範囲・公開候補commitを固定する．切戻し候補は公開v0.4.0を特定済み|
|P02|PASS|10記事の人間レビュー承認，記事別独立内容検収と現SHA／限定差分の照合，数値同期・計算方法の一致を再利用|
|P03|PASS|修正後128検査と本番build 112ファイル／正規31URLがPASS．集合SHA `a1555864b6495e3f409daf2a85a733e295b44c976195d1d68743a6fc7b210ccf`を検証記録へ固定|
|P04|PASS（変更影響範囲）|既存PC検収，維持費・見積もりの最終PC／360pxと，今回の他8記事360px全体・19図表の目視を組み合わせる．実端末の操作検査ではない|
|P05|PASS（公開前の独立検収範囲）|記事内容の不変範囲を再利用し，公開差分全体のM1・M2を独立に再確認して解消．版固定後に対象SHAの対応を保持する|
|P06|PASS|正式URL・内部fragment513件・PDF・noindex・QA文書非混入に加え，選外OG28点の内容SHA一致物が公開成果物から除外されたことを確認|
|P07|PASS（実装・既存表示範囲）|採用OG10点とメタ・形式・寸法・バイト一致，TOP旧URL互換と画像可読性の既存証跡を再利用．実SNS表示は公開後別項目|
|P08|PASS（再利用）|広告素材・掲載2ページ・URL・計測画像不変．記事10本に広告直リンクの増減なし|
|P09|PASS（実装・再利用）|GAの固定ID・通常導線識別・非送信条件と公開計測テストを再利用．本番実受信は未確認残件として区別|
|P10|未確認|対象版の本番公開承認は未取得．完成稿承認と区別|

D01〜D04とE01〜E06は本番公開後の工程である．変更した検索タイトル・説明・共有画像に応じたE02，実検索・実共有表示のE03／E04，既存GA実受信等の後処理は，公開成功とは別に継続管理する．新たなASP掲載URL変更がなければE01は既存登録の再利用を記録できる．

## 指摘解消後の限定再検収

> **結論：M1・M2・R1を解消し，新たなコード・記事・表示のMUST／RECOMMEND／NITSは0件である．公開候補の保存・版固定・公開承認と，本番公開後の検査は未実施のままとする．**

- **M1解消**：`guides.js`のimport対象は記事10サムネ＋報道記事1画像の計11点に限定された．catalogの全image.srcとの集合一致を独立検査しPASS．原図38点はローカルへ保持され，選外28点と内容SHAが一致するファイルは112件の公開成果物中0件．OG出力は採用固定10点だけで，広域globによる旧候補・不要写真の同梱を除いた．
- **検査更新のレビュー**：`public-integrity.test.js`は広域globの文字列固定を廃止し，import対象とcatalog採用画像の集合一致を確認する．現11画像の追加漏れ・過包含を検出でき，今回の変更目的に適合する．親担当の修正後test:public 128／128 PASS，build:pages 112ファイル／正規31URL PASSを再利用．内部fragmentは独立に再確認して513件欠落0．
- **M2解消**：親担当が本番用`dist-pages`のローカル配信から8記事を360px幅で取得した．[計測記録](v041-mobile-checks.json)は全記事でdocumentWidth345px≦viewport360px，画像読込み失敗0．独立担当は同記録のfullPageProofに指定した`v041-mobile-{slug}-full.png`8枚を原寸detailで全体目視し，19図表を含むリード・目次・各章本文・表・新しい累積図・条件カード・ハレナのまとめ・末尾導線に欠落・重なり・ページ外のはみ出しなし．
- **証跡の限界**：初回の派生図表抜粋19枚は，上側を含まないものがあったため合否根拠に採用せず，親担当が削除した．正本は保持されたfull PNG8枚である．収支の図題・単位・回収年・交換年の下落，設置費の見出し・全3条件カード，FITのstep1〜4，自己負担の契約前〜入金の全4段階，自家消費の図題・比較値・昼夜の全構成をfullで確認した．抜粋の切り出し範囲を本体の表示欠損とは扱わない．独立担当の操作は保存画像の目視とソース・成果物照合であり，ブラウザ直接操作・実端末検査とは区別する．
- **R1解消**：一覧の更新日2件は本文と同じ2026-10-20になった．記事HTML・内容の承認済みSHAは変わらない．
- 再検収時のsource SHA256：`site/solar/src/guides.js`=`3231c6bd4b567fe0090adf8a57591da0109e17529889f200973c15b32783ef38`，`qa/tests/public-integrity.test.js`=`fd6156bb53d2bad9a80ec31f0266aabc4a28d776eb0cec5eac7b3279d8454841`，`site/solar/data/articles.json`=`ecfe20532c0a185db14ee02ff743ae0bbafe56540513cef9a085e5fd54a3b575`．記事本文・MAP算式・公開データ・広告・GAコードの追加変更はない．
