import { CALCULATION_IMPLEMENTED } from "./calculator.js";
import { loadFrontendData } from "../../../data/src/data-loader.js";

const form = document.querySelector("#estimate-form");
const prefecture = document.querySelector("#prefecture");
const monthlyElectricityBill = document.querySelector("#monthly-electricity-bill");
const calculateButton = document.querySelector("#calculate-button");
const formMessage = document.querySelector("#form-message");
const dataStatus = document.querySelector("#data-status");
let frontendData = null;

function populatePrefectures(prefectures) {
  const fragment = document.createDocumentFragment();
  for (const item of prefectures) {
    const option = document.createElement("option");
    option.value = item.code;
    option.textContent = item.name;
    fragment.append(option);
  }
  prefecture.append(fragment);
}

function updateAvailability() {
  const initialized = frontendData?.publicData.data_version !== "uninitialized";
  calculateButton.disabled = !(frontendData && initialized && CALCULATION_IMPLEMENTED);
  formMessage.textContent = calculateButton.disabled ? "検証済みデータの準備後に利用できます．" : "都道府県を選択して分析へ進んでください．";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (calculateButton.disabled || !form.reportValidity()) return;
  const target = new URL("simulator/", window.location.href);
  target.searchParams.set("prefecture", prefecture.value);
  if (monthlyElectricityBill.value !== "") target.searchParams.set("monthlyElectricityBill", monthlyElectricityBill.value);
  target.searchParams.set("from", "top");
  window.location.assign(target);
});

try {
  frontendData = await loadFrontendData();
  populatePrefectures(frontendData.publicData.prefectures);
  dataStatus.textContent = `公開データ版：${frontendData.metadata.data_version}`;
} catch (error) {
  dataStatus.textContent = error instanceof Error ? error.message : "公開データを確認できませんでした．";
}

updateAvailability();
