# data

## 役割

> **結論：dataは，backendの公開成果物を受け取り，版を検証してsiteへ提供する．**

`input/`にはbackendの`dist/output/`から受け取った`public-data.json`と`metadata.json`を置く．`src/data-loader.js`は両ファイルを読み込み，`schema_version`と`data_version`の一致を確認する．秘密情報，未確認データおよびbackendの内部処理用データを含めない．

## QA用データ

> **結論：実行時に不要なbackend基準計算ケースはdataではなく`qa/fixtures/`へ置く．**

`calculation-cases.json`は画面表示には使用せず，frontend計算とbackend基準計算の一致確認だけに使用する．
