# site

## 役割

> **結論：siteは，利用者が操作・閲覧する画面と，その画面を公開するための薄いホスティング処理を管理する．**

| 場所 | 役割 |
|---|---|
| `index.html` | トップの分析入力，3分類の代表記事，運営方針および副見積もり導線 |
| `simulator/` | 独立した分析画面，画面制御およびbackend仕様に一致するブラウザ計算 |
| `pages/` | 計算根拠と判断材料を説明する6つの詳細ページ |
| `articles/` | 詳細記事へのデータ反映と記事固有の表示 |
| `shared/` | 全画面で共用するスタイルと画像 |
| `hosting/` | ビルド済み静的ファイルの配信とSites向け成果物の配置 |
| `docs/` | 画面設計と実装方針 |

## 公開設定

> **結論：ルートのVite，WranglerおよびSites設定も，責任上はsiteの公開処理に属する．**

外部ツールが設定を発見できるよう，`.openai/hosting.json`，`vite.config.js`，`wrangler.jsonc`および`package.json`はリポジトリのルートに置く．ビルド時だけ`prepare-build.js`がSites設定をViteルートへ渡し，`finalize-build.js`が成果物をルートの`dist/`へ配置する．実行時の採算計算はブラウザ内で行い，`hosting/worker.js`は静的ファイルを返すだけとする．
