# frontend

ハレトクの公開Webサイトです．

## 目的

> **結論：frontendは，「太陽光，結局いくら得？」に対し，概算結果，根拠および見積もり導線を順に示す静的Webサイトである．**

`business-research`のサービス要件と，`backend`の計算・データ仕様を表示可能な形にする．住宅用太陽光の導入を一律に推奨せず，得にならない概算結果もそのまま表示する．

## 構成

> **結論：frontendは，公開画面，backendから受け取る公開データおよび自動検査を分離する．**

| 場所 | 役割 |
|---|---|
| `site/` | シミュレーター，詳細記事，共通表示およびホスティング処理 |
| `data/` | backendの公開成果物の受取，読込および版確認 |
| `qa/` | backend基準ケース，計算，HTML，リンクおよび統合の検査 |

Vite，Wrangler，Sitesおよびパッケージ管理がルートから設定を発見できるよう，`.openai/`，`vite.config.js`，`wrangler.jsonc`および`package.json`はルートに置くが，責任上は`site`の公開処理に属する．詳細は[site](site/README.md)，[data](data/README.md)および[qa](qa/README.md)を参照する．

## 人間とAIの役割分担

> **結論：AIが実装，データ反映および自動検査を担当し，人間は公開画面のUX，文章，情報の優先順位および見た目を判断する．**

通常，人間がJSON，テストfixtureおよび実装コードを直接編集する運用は想定しない．`data/input/`はbackendが生成した公開成果物を受け取り，`qa/`は自動検査とbackend基準計算との一致確認を担当する．人間は実ブラウザで公開画面を確認し，UX，文章，情報の優先順位および見た目に関する判断を[画面設計](site/docs/画面設計.md)へ反映する．

## 更新・確認手順

> **結論：通常の画面開発はローカルサーバーで反復し，公開可能な単位が完成した場合だけQA，ビルドおよびデプロイへ進む．**

通常の開発では，次の手順を繰り返す．

1. 必要な場合は，backendの`dist/output/public-data.json`と`metadata.json`を`data/input/`へ，`calculation-cases.json`を`qa/fixtures/`へ反映する．
2. `pnpm run dev`でローカル開発サーバーを起動する．
3. frontendを変更し，`http://localhost:5173/`を実ブラウザで確認する．
4. 変更と確認を繰り返し，開発中はローカルサーバーと`node_modules/`を維持する．

複数の変更が公開可能な単位として完成した場合，またはユーザーが公開を明示的に依頼した場合だけ，次へ進む．

1. `pnpm test`で計算，公開データ，HTMLおよびリンクを自動検査する．
2. `pnpm run build`で公開成果物を生成・検査する．
3. 必要な公開確認を行った後，デプロイする．

初回または依存関係の更新後は，事前に次を実行する．

```bash
pnpm install
```

frontendはbackendの公開成果物だけを使用し，内部データまたは秘密情報へ接続しない．ファイルの役割と版確認は[実装方針](site/docs/実装方針.md)，公開処理は[site](site/README.md)を参照する．`haretoku.jp`のDNSは公開内容の確認後に接続し，開発中の確認用公開では変更しない．
