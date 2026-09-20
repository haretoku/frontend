export function validateLocation(input, publicData) {
  if (!publicData.prefectures.some((item) => item.code === input.prefectureCode)) {
    throw new Error("都道府県を選択してください．");
  }
  if (!input.municipalityCode) return null;
  const municipality = (publicData.municipalities ?? []).find((item) => item.municipality_code === input.municipalityCode);
  if (!municipality || municipality.prefecture_code !== input.prefectureCode) {
    throw new Error("市区町村を確認し，選択し直してください．都道府県と市区町村の組合せが無効です．");
  }
  return municipality;
}

export function populateMunicipalitySelect({ prefecture, municipality, municipalityField, municipalityHelp, showUnselected = false, unselectedLabel = "選択しない（都道府県のみ）" }, publicData, preferredCode = null) {
  const items = (publicData?.municipalities ?? []).filter((item) => item.prefecture_code === prefecture.value);
  const option = document.createElement("option");
  option.value = "";
  option.textContent = !prefecture.value ? "都道府県を選択してください" : items.length ? unselectedLabel : "市区町村データは未収集です";
  municipality.replaceChildren(option);
  municipality.disabled = !items.length;
  municipalityField.hidden = !prefecture.value && !showUnselected;
  for (const item of items) {
    const choice = document.createElement("option");
    choice.value = item.municipality_code;
    choice.textContent = item.municipality_name;
    municipality.append(choice);
  }
  municipalityHelp.textContent = !prefecture.value ? "都道府県を選ぶと，対応する市区町村を選択できます．" : items.length
    ? "市区町村は任意です．選択すると地域限定の都道府県制度と，対応済みの市区町村制度を判定できます．"
    : "市区町村の一覧は準備中です．都道府県だけで診断できます．";
  if (items.some((item) => item.municipality_code === preferredCode)) municipality.value = preferredCode;
  return municipality.value || null;
}
