import { CALCULATION_IMPLEMENTED } from "./calculator.js";
import { loadFrontendData } from "../../../data/src/data-loader.js";

const form = document.querySelector("#estimate-form");
const prefecture = document.querySelector("#prefecture");
const municipalityField = document.querySelector("[data-municipality-field]");
const municipality = document.querySelector("#municipality");
const municipalityHelp = document.querySelector("#municipality-help");
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

function setMunicipalityPlaceholder(text) {
  const option = document.createElement("option");
  option.value = "";
  option.textContent = text;
  municipality.replaceChildren(option);
}

function updateMunicipalities() {
  setMunicipalityPlaceholder("都道府県を選択してください");
  municipality.disabled = true;
  municipalityField.hidden = !prefecture.value;

  if (!prefecture.value || !frontendData) {
    municipalityHelp.textContent = "都道府県を選ぶと，対応する市区町村を確認できます．";
    return;
  }

  const municipalities = (frontendData.publicData.municipalities ?? [])
    .filter((item) => item.prefecture_code === prefecture.value);
  municipalityField.hidden = false;

  if (!municipalities.length) {
    setMunicipalityPlaceholder("市区町村データは未収集です");
    municipalityHelp.textContent = "市区町村の補助金が0円という意味ではありません．市区町村を選択せず，従来どおり診断できます．";
    return;
  }

  setMunicipalityPlaceholder("選択しない");
  const fragment = document.createDocumentFragment();
  for (const item of municipalities) {
    const option = document.createElement("option");
    option.value = item.municipality_code;
    option.textContent = item.municipality_name;
    fragment.append(option);
  }
  municipality.append(fragment);
  municipality.disabled = false;
  municipalityHelp.textContent = "選ぶと市区町村の公開情報を診断条件へ引き継ぎます．選択しなくても診断できます．";
}

function updateAvailability() {
  const initialized = frontendData?.publicData.data_version !== "uninitialized";
  calculateButton.disabled = !(frontendData && initialized && CALCULATION_IMPLEMENTED);
  formMessage.textContent = calculateButton.disabled ? "検証済みデータの準備後に利用できます．" : "";
  formMessage.hidden = !calculateButton.disabled;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (calculateButton.disabled || !form.reportValidity()) return;
  const target = new URL("simulator/", window.location.href);
  target.searchParams.set("prefecture", prefecture.value);
  if (!municipality.disabled && municipality.value) target.searchParams.set("municipality_code", municipality.value);
  if (monthlyElectricityBill.value !== "") target.searchParams.set("monthlyElectricityBill", monthlyElectricityBill.value);
  target.searchParams.set("from", "top");
  window.location.assign(target);
});

prefecture.addEventListener("change", updateMunicipalities);

try {
  frontendData = await loadFrontendData();
  populatePrefectures(frontendData.publicData.prefectures);
  updateMunicipalities();
  dataStatus.textContent = `公開データ版：${frontendData.metadata.data_version}`;
} catch (error) {
  dataStatus.textContent = error instanceof Error ? error.message : "公開データを確認できませんでした．";
}

updateAvailability();
