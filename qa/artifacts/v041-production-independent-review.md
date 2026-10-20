# v0.4.1本番配信の独立検収（2026年10月20日）

## 判定と対象

> **結論：D02はPASS．D03は独立した配信内容の検査・不変表示の既存PASSと親担当の本番操作確認を組み合わせ，変更影響範囲でPASSとする．MUST／RECOMMEND／NITSの新規指摘は0件である．**

- 公開commit：`eb309c3f58b52d5db29e28dc1ead3af8c491894b`．親担当が[GitHub Actions 39385498758](https://github.com/haretoku/frontend/actions/runs/39385498758)のcompleted／success，head_sha一致，更新時刻2026-10-20T07:17:41Zを確認した．本独立検収では本番HTTPSの実配信を別途確認した．
- 正式origin：`https://haretoku.jp`．独立担当：`/root/v041_release_readiness_review`．本番112成果物，正規31URL，採用記事OG10点，旧URLと404，正規化転送をread-onlyで検査した．
- 公開前の比較対象：112ファイルのWindows成果物，集合SHA256 `a1555864b6495e3f409daf2a85a733e295b44c976195d1d68743a6fc7b210ccf`．[公開前検証記録](v041-readiness-verification.json)と[公開前独立報告](v041-readiness-independent-review.md)の不変範囲を再利用した．
- 各URL・HTTP応答・content-type・SHA・ローカル対応・メタ・OG・旧URL・確認範囲は[v041-production-checks.json](v041-production-checks.json)に保存した．source編集，Git操作，Google送信，新規ブラウザー／補助サーバーの起動は行っていない．

## D02：URL・配信物・画像・PDF

> **結論：本番112成果物を公開前112ファイルへ一対一に対応づけられ，説明できない配信内容差・欠落は0件である．**

|確認対象|結果と根拠|
|---|---|
|正式31URL|全件200．canonicalが正式originと対象pathに一致．title・description・OG参照はローカルと個別に一致．正規ページのnoindex 0，private開発origin・QA識別子・既知の秘密鍵／token形式の検出0|
|sitemap・robots・配信設定|sitemap.xml・robots.txt・CNAME・.nojekyllは正常取得．正規31URLの一致と404の検索除外を確認|
|記事10点のOG|全件200，image/png，1200×630．採用source PNGとバイト完全一致．公開前に独立目視した同じ画像なので，画像内容のPASSを再利用|
|TOP共有・旧互換URL|新旧PNG，旧写真URLのJPEG，faviconを取得し公開前採用資産へ照合．旧写真URLで旧写真を配信していない|
|主要JS／CSS／公開JSON|実配信HTMLの参照先を取得し，公開前の対応ファイルと照合．診断・一覧・共通ヘッダー・GA・公開データの欠落なし．公開データ本体はバイト一致|
|PDF|`/assets/contractor-checksheet-DmgL5J0n.pdf`が200／application/pdf，公開前PDFとバイト完全一致．SHA256 `83816ce8cadaa141db74d06ea694987379eeabe4144d9a9e4ee7fe1b05177c70`|
|データの入口|`/data/index.html`と`/data/subsidies/index.html`も正常200で配信物照合．記事からのデータ参照先を含めて確認|
|転送|`http://haretoku.jp/`と`https://www.haretoku.jp/`は301で`https://haretoku.jp/`へ正規化|
|廃止経路と404|`/solar/`，`/guides/solar-profit-conditions/`，旧pages配下のelectricity-sales／costs-maintenance／subsidies／disaster／quotes-contractorsの7経路と任意の不存在経路は全件404．配信404.htmlと同一内容，noindex,followあり|

本番112点のうち，73点はWindows成果物とバイト完全一致，21点はCRを除いたテキストが一致，18点はCRとViteのcontent hash名を正規化したテキストが一致した．画像・PDF等のバイナリーは正規化していない．本番実配信のpath／SHA集合を別に保持し，そのJSON配列に対するSHA256は`f7ca6fae6b7543219bdcf6a3bf125d0f3196bb99b68c0a904d6db69f259a22eb`．計算法は検証JSONに明記した．Windows版の集合SHAと同一とは表現しない．

設置費CSSは初回取得で503となったが，同じURLの限定再取得では200となり，内容も公開前CSSと完全一致した．一時応答と区別し，継続する欠落とは判定しない．JSの静的文字列探索ではテンプレート式・論理的な画像キー・download名をURLと誤認した探索用404があった．それらは実配信資産URLとして採用せず，検証JSONのexploratoryNonUrlProbesへ分離した．実際の112配信物の最終HTTP失敗は0件である．

## WindowsとLinuxの差の特定

> **結論：2資産のhash名差は公開commitのSVG改行差とその参照先の変化で説明でき，別内容・別commitの公開を示すものではない．**

- Windows：`title-art-CxXD5rU-.svg`，`journey-DS4NepUu.js`．本番：`title-art-DaW-V9L4.svg`，`journey-C9bgfaKj.js`．それ以外の配信ファイルも個別に対応づけ，一意に対応できない成果物は残っていない．
- 本番title-art SVGは，`git show eb309c3:site/map/assets/title-art.svg`の取得バイトと完全一致した．Windows版SVGとの相違はCRの有無だけ．SVGのcontent hash名が変わり，その参照を含むjourney JSと参照HTMLのhash名が連動して変わる．
- HTMLにはWindowsビルドで複数のCRがLF前に残る箇所があり，本番はLFとなる．CR除去と上記の参照名の対応づけ後，112ファイル中に説明できない内容差は0件．CI artifactのダウンロードを行ったとは扱わず，本番バイト・commit内source・Windows成果物の3者で相違を特定した．

## D03：変更画面と主要操作

> **結論：本番の変更内容・主要接続・既存保存状態の再読込みが確認され，公開前の不変PC／360px検収と整合する．実施者と未実施範囲を分けて記録する．**

- 独立担当はHTTPと公開成果物を照合し，記事10本と一覧に最新本文・日付・メタ・共有画像・専用資産が配信されていることを確認した．記事本文・図表・ハレナまとめ・導線の内容承認，公開前のPC／360px表示は，対象内容が不変なので既存PASSを再利用した．
- 親担当が本番見積もり記事で最新のA社／B社比較表と10月20日の更新日を確認し，末尾CTAを実クリックして`/guides/choosing-installer/`へ到達した．独立担当自身も[v041-production-quotes.png](v041-production-quotes.png)を目視し，提示額・別途足場・総額，A社130万円／B社135万円の列対応と，周囲本文の表示に切れ・重なりがないことを確認した．
- 親担当が本番のPDFリンクで上記PDFとA4案内を確認した．また維持費`#roof-renewal`の診断範囲注記を確認し，「はれトク診断」を実クリックして`/simulator/`へ到達した．
- 親担当が既存保存条件・選択プランを変更せずに読み込み，再読込み後にも入力表示・選択・結果・累積グラフが維持されることを確認した．具体的な入力値・金額・個人情報をこの公開QAへ記録していない．新規申込みや既存保存入力の上書きは行っていない．
- 独立担当が行ったのは配信内容・sourceとの照合，既存検収の対象対応確認と保存画面の目視であり，親担当によるブラウザー直接操作を独立担当本人の操作とは扱わない．本番のスマホ実端末や全記事・全入力の新規総巡回は行っていない．
- GAと広告は承認版から実装・送信条件・固定識別子が不変．旧本番の受信検収と非送信検査を同範囲で再利用する．新しいGA受信確認や検索・SNS共有表示を今回新規PASSにしたものではない．

## 指摘と引渡し

> **結論：配信・変更影響範囲に新規指摘はなく，公開後のGoogle／共有等の処理は親担当へ継続して引き渡す．**

|優先度|残件数|内容|
|---|---|---|
|MUST|0|D02・D03の今回確認範囲に阻害なし|
|RECOMMEND|0|追加修正の提案なし|
|NITS|0|追加指摘なし|

親担当が公開タグv0.4.1と[GitHub Release](https://github.com/haretoku/frontend/releases/tag/v0.4.1)を公開commitへ固定した旨を受領した．D01・D04，Search Console等のE項目の集約は親担当が既存QAへ記録する．本番配信のPASSを検索掲載・SNS共有・外部反映全完了へ読み替えない．本独立担当は補助プロセスを起動していない．
