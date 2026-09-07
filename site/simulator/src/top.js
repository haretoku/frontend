import { CALCULATION_IMPLEMENTED } from "./calculator.js";
import { loadFrontendData } from "../../../data/src/data-loader.js";

import { requireMunicipality, populateMunicipalitySelect } from "./location-input.js";

const form = document.querySelector("#estimate-form");
const prefecture = document.querySelector("#prefecture");
const municipalityField = document.querySelector("[data-municipality-field]");
const municipality = document.querySelector("#municipality");
const municipalityHelp = document.querySelector("#municipality-help");
const monthlyElectricityBill = document.querySelector("#monthly-electricity-bill");
const calculateButton = document.querySelector("#calculate-button");
const formMessage = document.querySelector("#form-message");
const returnToForm = document.querySelector("[data-return-to-form]");
let frontendData = null;
let dataLoadFailed = false;

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

function updateMunicipalities() {
  populateMunicipalitySelect({ prefecture, municipality, municipalityField, municipalityHelp, showUnselected: true }, frontendData?.publicData);
  const unsupported = Boolean(prefecture.value && municipality.disabled);
  municipalityHelp.textContent = unsupported ? "この都道府県は現在，診断に対応していません．" : "";
  municipalityHelp.hidden = !unsupported;
  if (unsupported) municipality.options[0].textContent = "選択できません";
  updateAvailability();
}

function updateAvailability() {
  const initialized = frontendData?.publicData.data_version !== "uninitialized";
  const ready = frontendData && initialized && CALCULATION_IMPLEMENTED;
  calculateButton.disabled = !ready || Boolean(prefecture.value && municipality.disabled);
  formMessage.textContent = dataLoadFailed ? "使用データを読み込めないため，現在は診断できません．時間をおいて再読み込みしてください．" : !ready ? "検証済みデータの準備後に利用できます．" : "";
  formMessage.hidden = !formMessage.textContent;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (calculateButton.disabled || !form.reportValidity()) return;
  try {
    requireMunicipality({ prefectureCode: prefecture.value, municipalityCode: municipality.value }, frontendData.publicData);
  } catch (error) {
    formMessage.hidden = false;
    formMessage.textContent = error.message;
    return;
  }
  const target = new URL("simulator/", window.location.href);
  target.searchParams.set("prefecture", prefecture.value);
  if (!municipality.disabled && municipality.value) target.searchParams.set("municipality_code", municipality.value);
  if (monthlyElectricityBill.value !== "") target.searchParams.set("monthlyElectricityBill", monthlyElectricityBill.value);
  target.searchParams.set("from", "top");
  window.location.assign(target);
});

prefecture.addEventListener("change", updateMunicipalities);

returnToForm.addEventListener("click", (event) => {
  event.preventDefault();
  const target = !prefecture.value || municipality.disabled ? prefecture
    : !municipality.value ? municipality
      : monthlyElectricityBill.validity.valid && !calculateButton.disabled ? calculateButton : monthlyElectricityBill;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: "center" });
});

try {
  frontendData = await loadFrontendData();
  populatePrefectures(frontendData.publicData.prefectures);
  updateMunicipalities();
} catch {
  dataLoadFailed = true;
}

updateAvailability();
