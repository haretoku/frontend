# frontend

ハレトクの公開Webサイトです．

## 目的

> **結論：frontendは，「太陽光，結局いくら得？」に対し，概算結果，根拠および見積もり導線を順に示す静的Webサイトである．**

`business-research`のサービス要件と，`backend`の計算・データ仕様を表示可能な形にする．住宅用太陽光の導入を一律に推奨せず，得にならない概算結果もそのまま表示する．

## 基本構成

> **結論：frontendは，利用者向けサイト，backendとのデータ連携および品質検査の3機能に分ける．**

| 場所 | 役割 |
|---|---|
| `site/` | シミュレーター，詳細記事，共通表示およびホスティング処理 |
| `data/` | backendの公開成果物の受取，読込および版確認 |
| `qa/` | backend基準ケース，計算，HTML，リンクおよび統合の検査 |

Vite，Wrangler，Sitesおよびパッケージ管理がルートから設定を発見できるよう，`.openai/`，`vite.config.js`，`wrangler.jsonc`および`package.json`はルートに置くが，責任上は`site`の公開処理に属する．詳細は[site](site/README.md)，[data](data/README.md)および[qa](qa/README.md)を参照する．

## ユーザー体験

> **結論：主画面は，「一目で判断→詳細で納得→見積もりで精緻化」の順に構成する．**

結果は，採算の結論，費用・経済効果の内訳，前提・詳細情報の順に表示する．見積もり導線は，結論付近，内訳後および詳細情報後に置く．

## backendとの連携

> **結論：frontendは，backendが生成した公開データだけを受け取り，内部データまたは秘密情報へ接続しない．**

初期段階では，backendの`dist/output/public-data.json`と`dist/output/metadata.json`を`data/input/`へ，`dist/output/calculation-cases.json`を`qa/fixtures/`へ手動で反映する．詳細は[実装方針](site/docs/実装方針.md)を参照する．

## 現在の状態

> **結論：検証済み公開データとbackend基準計算を使用し，3シナリオの概算結果と6つの詳細ページを表示する．**

都道府県と任意の月間電気料金から，下振れ，標準および上振れの20年間の概算利益を表示する．計算方法，費用，売電，補助金，防災および施工業者の詳細を結果から確認できる．frontendの計算結果は，47都道府県と入力境界ケースについてbackendが生成した固定テストケースとの一致を確認する．

## ローカル確認

> **結論：ES ModulesとJSON読込を使用するため，ローカルWebサーバーを起動して確認する．**

```bash
pnpm run dev
```

Viteが表示するローカルURLを開く．

## 公開確認

> **結論：開発中は所有者限定の確認用URLへ公開し，画面と導線が固まった後に`haretoku.jp`を一般公開へ接続する．**

確認用URLのビルドにはViteとCloudflare Workers互換の静的配信設定を用いる．アプリケーション自体は引き続きHTML，CSSおよびブラウザJavaScriptであり，フレームワーク，データベースおよび秘密情報は追加しない．

```bash
pnpm install
pnpm run build
pnpm run preview
```

計算テストは次のコマンドで実行する．

```bash
pnpm test
```

`haretoku.jp`のDNSは，公開内容の確認後にホスティング先へ接続する．開発中の確認用公開ではDNSを変更しない．
