export function requireMunicipality(input, publicData) {
  if (!publicData.prefectures.some((item) => item.code === input.prefectureCode)) {
    throw new Error("都道府県を選択してください．");
  }
  if (!input.municipalityCode) throw new Error("市区町村を選択してください．");
  const municipality = (publicData.municipalities ?? []).find((item) => item.municipality_code === input.municipalityCode);
  if (!municipality || municipality.prefecture_code !== input.prefectureCode) {
    throw new Error("市区町村を確認し，選択し直してください．都道府県と市区町村の組合せが無効です．");
  }
  return municipality;
}

export function populateMunicipalitySelect({ prefecture, municipality, municipalityField, municipalityHelp }, publicData, preferredCode = null) {
  const items = (publicData?.municipalities ?? []).filter((item) => item.prefecture_code === prefecture.value);
  const option = document.createElement("option");
  option.value = "";
  option.textContent = !prefecture.value ? "都道府県を選択してください" : items.length ? "市区町村を選択してください" : "市区町村データは未収集です";
  municipality.replaceChildren(option);
  municipality.disabled = !items.length;
  municipalityField.hidden = !prefecture.value;
  for (const item of items) {
    const choice = document.createElement("option");
    choice.value = item.municipality_code;
    choice.textContent = item.municipality_name;
    municipality.append(choice);
  }
  municipalityHelp.textContent = !prefecture.value ? "都道府県を選ぶと，対応する市区町村を選択できます．" : items.length
    ? "市区町村を選択してください．選択だけで補助金の利用が確定するわけではありません．"
    : "この都道府県の市区町村データは未収集のため，現在は診断できません．補助金0円や制度なしを意味しません．";
  if (items.some((item) => item.municipality_code === preferredCode)) municipality.value = preferredCode;
  return municipality.value || null;
}
