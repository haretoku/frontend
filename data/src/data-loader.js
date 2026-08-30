const PUBLIC_DATA_URL = new URL("../input/public-data.json", import.meta.url);
const METADATA_URL = new URL("../input/metadata.json", import.meta.url);

async function loadJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`公開データを取得できませんでした：${response.status}`);
  }

  return response.json();
}

function validateVersion(publicData, metadata) {
  if (publicData.schema_version !== metadata.schema_version) {
    throw new Error("公開データとメタデータのスキーマ版が一致しません．");
  }

  if (publicData.data_version !== metadata.data_version) {
    throw new Error("公開データとメタデータのデータ版が一致しません．");
  }
}

export async function loadFrontendData() {
  const [publicData, metadata] = await Promise.all([
    loadJson(PUBLIC_DATA_URL),
    loadJson(METADATA_URL)
  ]);

  validateVersion(publicData, metadata);

  return { publicData, metadata };
}
