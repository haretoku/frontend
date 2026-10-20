# v0.5.0本番配信の独立検収（2026年10月20日）

## 判定と対象

> **結論：本番配信内容の独立検収はPASS．D02の112成果物と31正規URLを承認版へ対応づけ，説明できない差・欠落は0件．D03の実操作は親担当の記録へ接続する．**

- 公開commit：`3299e108171f2e81cdbd1ec4b927feb51a6a42cf`．親担当から[GitHub Actions 39416943893](https://github.com/haretoku/frontend/actions/runs/39416943893)のbuild・deploy success通知を受領した後に取得を開始した．
- 正式origin：`https://haretoku.jp`．独立担当：`/root/v050_release_review`．本番112成果物，正規31URL，共通ヘッダー34ページ，公開JSON6点，転送・廃止URL・404，広告属性をread-only HTTPで確認した．
- 取得時刻：2026-10-20T11:45:33.114Z．詳細は[v050-production-checks.json](v050-production-checks.json)．`overallPassed: true`．
- 公開前のコード・保存・達成・同一文書移動の独立検収は[v050-release-independent-review.md](v050-release-independent-review.md)を再利用する．本番バイトが同じ対象へ対応するため，再度の実装編集や全入力の計算再試験は行っていない．
- 本独立担当は本体編集，タグ／Release操作，外部申込み，ブラウザ操作，補助サーバー起動を行っていない．一時のHTTP検査用ファイルは使用後に削除した．

## D02：URL・全成果物・正式入口

> **結論：112／112配信物を一対一で照合し，全34共通ヘッダーから正式な歩き方モジュールへの接続を確認した．**

|対象|結果・根拠|
|---|---|
|全112成果物|全件200．対応不明0，未対応のローカル成果物0，説明不能な内容差0．HTML／JS／CSS／SVG／JSON／画像／PDFのcontent-typeも正常|
|正規31URL|全件200，canonicalが正式origin・対象pathに一致．noindex 0，開発origin・確認用banner・試作経路・localhost等の混入0|
|共通ヘッダー34ページ|各HTMLのJS参照とその依存をたどり，正式保存キー `haretoku-walkthrough-v1` とパネル表示処理を含むentryへ34／34で到達．入口だけが公開用から漏れる問題なし|
|TOPタイトル|titleとog:titleが「はれトク｜わが家の太陽光・蓄電池えらび」に一致．TOP復帰のJSは公開候補と対応．その他ページのメタ情報も成果物照合で保持|
|JSON6点|全件200，application/json，ローカル承認版とバイト完全一致．診断用データの改変なし|
|画像・PDF|画像・PDF等のバイナリーは承認版とバイト完全一致．記事別共有画像，ハレナ，ブランド関連SVG，旧互換OG，favicon，チェックシートPDFを含めて対応した．SVGの改行差だけは後節で根拠を特定|
|sitemap・robots・設定|sitemap.xml・robots.txt・CNAME・.nojekyllを取得・照合．sitemapの31正規URLを検査対象にした|
|正規化転送|`http://haretoku.jp/` と `https://www.haretoku.jp/` はともに301で `https://haretoku.jp/` へ転送|
|廃止URLと404|旧solar，旧solar-profit-conditions，旧pages配下の5経路と任意の不存在経路の計8件は404．本番404.htmlとバイト一致し，noindex,followあり|

## WindowsとCIの差の説明

> **結論：改行と，その内容hashに連動する2資産の名称差だけで全差分を説明できる．**

112件の内訳は，バイト完全一致73件，CR除去だけで一致21件，CR除去とVite参照名対応で一致18件．バイナリーは正規化していない．Vite名は，末尾8文字のcontent hashを除いたbasenameが一致する一意の候補へ個別対応した．異なる内容を同一とみなす包括的な文字列除去は行っていない．

- Windows：`title-art-CxXD5rU-.svg`，`journey-Dbednyri.js`．
- 本番：`title-art-DaW-V9L4.svg`，`journey-CePVgnBL.js`．
- 本番title-artは `git show 3299e108:site/map/assets/title-art.svg` のバイトと完全一致．SHA-256は両者とも `c996ba2c758ed645f16e619b20a37ee189d5ee4f7d85a9fc1dcf7823c18881f9`．WindowsとのCR差でSVGのhash名が変わり，その参照を含むjourneyとHTMLの名前が連動して変わる．CI artifact自体をダウンロードしたものではなく，公開バイト・公開commit内source・Windows成果物の3者で説明した．
- ローカル集合SHA-256：`6008ae651a720ffd95069c66a1736e3be5aeff708f0dd683411a1d375b71587d`．本番集合SHA-256：`5492eb33284fc969ebe568c6964a483c2bdc6162a6b99f4f16ca36cfadc49d4c`．各pathと個別SHAのJSON配列から算出し，本番側はpathのlocaleCompare順に並べた．同じバイト集合という表現はしない．

## D03：変更接続・広告・操作の責任分離

> **結論：変更した表示・導線の配信は承認内容と一致．操作と実受信の確認は，配信検収と区別する．**

- 一括見積もり解説記事は比較表が初期open，3社カードが存在し，広告計測画像は計2件．比較表側の画像を重ねて追加していない．2広告社の既存URL，`sponsored nofollow noopener noreferrer`，別タブ属性，`referrerpolicy="no-referrer"` を確認．グリエネは通常リンク属性を維持した．
- TOPの相談カード＋比較表の画像構成は，公開前レビューでv0.4.1と同じ4件（2＋2）と確認済み．当該描画コード・広告素材と配信JSの一致を再利用する．本独立HTTP検収でDOMを生成して数えたものではない．
- 初回案内，7項目＋記事1本，メニュー排他，正式保存，移動先強調，リセット等の公開JS／CSSと，34入口の接続を確認した．PC／スマホの実際の表示と操作，既存保存データの再読込み確認は親担当の本番検収へ接続する．
- GAコード・広告固定識別子・送信条件の変更はなく，成果物照合と公開前の不変範囲のPASSを再利用する．実際のGA受信や広告申込み・成果発生を新規に確認したとは扱わない．

## 指摘と引渡し

> **結論：本独立検収の範囲に未解消のMUST・RECOMMEND・NITSはない．外部反映と公開操作の結果は親担当が集約する．**

|優先度|残件数|内容|
|---|---|---|
|MUST|0|HTTP配信・成果物・変更接続の確認範囲に阻害なし|
|RECOMMEND|0|追加修正提案なし|
|NITS|0|追加指摘なし|

D01・D04，D03の本番ブラウザ操作，TOPタイトル変更に対応するGoogle更新依頼・共有表示等のE項目は親担当がQAへ記録する．本番の配信PASSを，検索・LINEの新タイトル表示や外部作業の全完了へ読み替えない．
