# v0.5.0公開前独立レビュー

## 判定と対象

> **結論：コード差分の独立レビューはPASS．同一文書内の見積もり移動で強調されない不具合を修正し，回帰検査4件を通過した．実画面と本番公開の検収は実装担当の記録へ接続する．**

- 実施日：2026年10月20日．担当：実装担当とは別の `v050_release_review`．
- 比較基準：v0.4.1，`eb309c3f58b52d5db29e28dc1ead3af8c491894b`．作業HEAD：`438c719a5f83f0cf7961ac7652b15c3873e76b2b`＋未コミットのv0.5.0候補．
- 対象：正式組込みした `site/shared/walkthrough/` 全10ファイル，共通ヘッダー・ブランド表示，MAPの相談3社カードと比較表，関連34HTML，開発用ビルド設定，保存の説明．計算モデル・公開データは変更対象に含まれない．
- タイトル追検収を含む最終26ファイルを，相対パス昇順に「パス＋NUL＋ファイル内容」を連結したSHA-256：`b51002e51d4655a73f8977b4e2e66c67fa5c2ecbc46bb960655c2f55fcc06d1e`．26ファイルは後節に列挙．初回21実装ファイルの判定時ハッシュは `fe67a1bc42d17977f51ab6de5fbf1e38262d67936f3b69d536b346a13880be14`．
- 対象外：旧版QA，未使用の旧画像，ブラウザ実操作，ASP・Search Consoleの外部操作，本番公開．今回のレビューはこれらの完了を意味しない．

## 指摘と修正確認

> **結論：未解消のMUSTはない．RECOMMEND・NITSの追加指摘はない．**

|優先度|箇所・再現|影響・処置|最終判定|
|---|---|---|---|
|MUST|`target.js` 初期評価時だけの目印受取り．TOPの歩き方から `/#map-consultation` へ移動すると，同一文書のhash変更ではモジュールが再実行されない|相談先へスクロールしてもボタンが光らない．既に同じhashの再選択でも案内できない．`hashchange` と専用イベントで強調開始を再実行する形へ実装担当が修正|解消|
|MUST（上記修正に伴う確認）|`panel.js` の同一pathname/hash選択時に目印を先に消費し，通常のhref再読込を続ける場合|TOPから同URLの読む項目を選ぶと，再読込後に目印が残らない．無修飾の同URLクリックは既定再読込を止め，その場で強調する形へ実装担当が修正|解消|

修正後の独立回帰検査は `qa/tests/walkthrough-target.test.js` に保存し，`node --test qa/tests/walkthrough-target.test.js` の4件全件PASS．初期文書の受取り，同一文書hash移動，同hash再選択，同URLの読む項目，Ctrlクリックの既定動作，後描画，タイマー・監視の終了を確認した．DOMとブラウザAPIはスタブであり，実ブラウザ検査の代替ではない．

## 確認範囲と根拠

> **結論：公開入口・保存・達成・相談導線の差分に，修正済み指摘以外の不整合を認めなかった．**

- 公開接続：正式 `entry.js` を共通ヘッダーへ1回接続し，開発専用の注入を除去．公開生成物の全34共通ヘッダーHTMLについて，JS依存をたどり歩き方の表示・正式保存処理へ到達することを独立機械検査した．34／34一致．生成HTMLに `prototypes/walkthrough`，`localhost:5173`，`review-notice`，確認用noindex文字列の混入なし．この生成物検査は機能修正前の同一接続部分を対象とし，接続不変部分のPASSとして再利用する．
- 保存：正式キー `haretoku-walkthrough-v1` は既存MAP保存と分離．旧試作v3は有効な全達成を保持し，v2は意味が同じ診断・見積もり・記事だけを引き継ぐ．正式保存後は旧キーを優先しない．リセットは正式・旧進捗を消し，初回案内履歴を消さない．保存不能時の進捗メモリ継続と案内抑制を確認．
- 達成：マップ5章＋診断＋見積もりの7項目と，別枠の記事1本を集計．章は既存MAP表示の完了状態を参照し，診断結果と説明末尾を区別．見積もりは既存の相談先リンク操作で記録．手動の完了チェックはない．
- 表示・操作の実装：初期閉，メニューとの排他，閉じるボタンのフォーカス復帰，読み上げ用の達成状態・進捗値，初回ハレナ案内6.5秒と履歴分離，枠色を参照する発光，動きを減らすCSSを確認．実画面の開閉・フォーカス・スマホ幅は実装担当が検収する．
- 相談3社：掲載URL・素材・広告属性・参照元抑制は既存設定を保持．記事のカードと比較表でIDを分離．記事は比較表を初期openにし，カードとの二重追加を避け，広告計測画像は従前同様の2件．TOPは既存カード2件＋比較表2件の計4件であり，v0.4.1から画像数は増えていない．TOPまで2件とする検査ではない．GAは共通 `analytics-core.js` の既存処理を保持し，対象リンクに適用した計測が `return` するため，追加カードから同じクリックを二重送信する新経路はない．
- 公開範囲：正式モジュールは既存記事データを参照するが，QAやfixtureを実行時に取り込まない．外部へ入力値を渡すコード追加なし．計算ロジック・補助金データは変更なし．TOPのtitle／og:titleの追加変更は後節で追検収した．
- 既存検査の再利用：実装担当の関連43検査・公開140検査・`build:pages` PASSを同範囲の根拠として再利用し，独立側では上記差分読解・生成接続確認・新規4回帰検査を追加した．最終変更後のビルド・全体件数・実画面・リリース版固定は版別QAへ記録する．

## 版識別のファイル一覧

> **結論：下記26ファイルの内容が最終判定対象であり，後続変更は影響範囲を再確認する．**

`.config/vite.review.config.js`，`package.json`，`site/map/consultation-view.js`，`site/map/journey.js`，`site/map/map.css`，`site/map/provider-comparison-view.js`，`site/map/reading-view.js`，`site/pages/policy.html`，`site/shared/site-header-template.js`，`site/shared/site-header.css`，`site/shared/styles/main.css`，および `site/shared/walkthrough/` の `entry.js`，`first-visit.js`，`navigation.js`，`panel.css`，`panel.js`，`reset.css`，`state.js`，`target.css`，`target.js`，`tracker.js`．

タイトル追検収で `site/index.html`，`site/docs/実装方針.md`，`qa/tests/journey-bootstrap.test.js`，`CHANGELOG.md`，`site/hosting/verify-pages.js` を追加した．

## TOPタイトルの追加検収

> **結論：ブランド先頭へのタイトル統一はPASS．TOP以外の生成記事タイトル・OGタイトル・正規URLの変更はない．**

本人の追加依頼として実装担当から受領した範囲を追検収した．TOPのHTML title・og:titleと，`journey.js` のTOP復帰時 `document.title` は，いずれも「はれトク｜わが家の太陽光・蓄電池えらび」に一致する．マップ内の看板は変更せず，現行仕様とCHANGELOGにも同じタイトルを記録している．未解消のMUST・RECOMMEND・NITSはない．

全34ソースHTMLを作業HEADと機械比較し，title・og:title・canonical・og:urlの変更がTOPのtitleとog:titleの2件だけであることを独立確認した．`node --test --test-name-pattern='TOPのtitle' qa/tests/journey-bootstrap.test.js` は対象1件PASS．その他の前回レビューは再利用する．検索・LINE側の実際のタイトル反映は，配信内容の確認とは別に公開後の外部確認項目へ記録する．

最終ビルドで使用する `site/hosting/verify-pages.js` 45–46行の2件の期待文字列も同じ新タイトルへ変更したことを追加確認した．変更は期待文字列のみで，TOP限定の検査条件・assert・他ページの検証は維持されている．実装担当の最終 `build:pages` PASS（112ファイル・31URL）を再利用する．
