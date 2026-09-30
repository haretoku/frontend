# site

## 役割

> **結論：siteは，利用者が操作・閲覧する画面と，その画面を公開するための薄いホスティング処理を管理する．**

| 場所 | 役割 |
|---|---|
| `index.html` | トップの診断入力，4分類の代表記事，運営方針および副見積もり導線 |
| `guides/` | はれトクガイド一覧と4記事の正規ページ |
| `solar/` | ガイド一覧の共通処理・画像メタデータ・スタイル及び旧一覧URLの転送 |
| `simulator/` | 独立した診断画面，画面制御およびbackend仕様に一致するブラウザ計算 |
| `pages/` | 計算方法・運営方針及び旧記事URLの互換ページ |
| `articles/` | 詳細記事へのデータ反映と記事固有の表示 |
| `shared/` | 全画面で共用するスタイルと画像 |
| `hosting/` | GitHub Pages向け生成・検査及び従来検証用Sitesの処理 |
| `docs/` | グランドデザイン，画面設計および実装方針 |

## 公開設定

> **結論：ルートのVite，WranglerおよびSites設定も，責任上はsiteの公開処理に属する．**

本番はGitHub Pagesを使い，`vite.pages.config.js`と`hosting/finalize-pages.js`・`verify-pages.js`で生成・検査する．公開は承認後の手動実行とし，[タグと公開の区別](../README.md#コミットタグと公開の区別)に従う．以下のSites／Worker設定はローカル開発・従来検証用として保持する．

外部ツールが設定を発見できるよう，`.openai/hosting.json`，`vite.config.js`，`wrangler.jsonc`および`package.json`はリポジトリのルートに置く．ビルド時だけ`prepare-build.js`がSites設定をViteルートへ渡し，`finalize-build.js`が成果物をルートの`dist/`へ配置する．実行時の採算計算はブラウザ内で行い，`hosting/worker.js`は静的ファイルを返すだけとする．
