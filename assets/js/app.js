import { CALCULATION_IMPLEMENTED, calculateEstimate } from "./calculator.js";
import { loadFrontendData } from "./data-loader.js";
import { PREFECTURES } from "./prefectures.js";

const elements = {
  form: document.querySelector("#estimate-form"),
  prefecture: document.querySelector("#prefecture"),
  monthlyElectricityBill: document.querySelector("#monthly-electricity-bill"),
  calculateButton: document.querySelector("#calculate-button"),
  formMessage: document.querySelector("#form-message"),
  dataStatus: document.querySelector("#data-status")
};

let frontendData = null;

function populatePrefectures() {
  const fragment = document.createDocumentFragment();

  for (const prefecture of PREFECTURES) {
    const option = document.createElement("option");
    option.value = prefecture;
    option.textContent = prefecture;
    fragment.append(option);
  }

  elements.prefecture.append(fragment);
}

function isInitialized(data) {
  return data.publicData.data_version !== "uninitialized";
}

function updateAvailability() {
  const available = Boolean(frontendData) && isInitialized(frontendData) && CALCULATION_IMPLEMENTED;
  elements.calculateButton.disabled = !available;

  if (!frontendData) {
    return;
  }

  if (!isInitialized(frontendData)) {
    elements.formMessage.textContent = "検証済みデータの準備後に利用できます．";
    return;
  }

  if (!CALCULATION_IMPLEMENTED) {
    elements.formMessage.textContent = "基準計算の実装後に利用できます．";
    return;
  }

  elements.formMessage.textContent = "都道府県を選択して概算結果を確認してください．";
}

function readInput() {
  const monthlyElectricityBill = elements.monthlyElectricityBill.value;

  return {
    prefecture: elements.prefecture.value,
    monthlyElectricityBill: monthlyElectricityBill === "" ? null : Number(monthlyElectricityBill)
  };
}

async function initialize() {
  populatePrefectures();

  try {
    frontendData = await loadFrontendData();
    elements.dataStatus.textContent = `公開データ版：${frontendData.metadata.data_version}`;
  } catch (error) {
    elements.dataStatus.textContent = error instanceof Error ? error.message : "公開データを確認できませんでした．";
  }

  updateAvailability();
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!frontendData || !CALCULATION_IMPLEMENTED) {
    updateAvailability();
    return;
  }

  calculateEstimate(readInput(), frontendData.publicData);
});

initialize();
