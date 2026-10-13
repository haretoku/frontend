import { CALCULATION_IMPLEMENTED } from "./calculator.js";
import { loadFrontendData } from "../../../data/src/data-loader.js";

import { validateLocation } from "./location-input.js";



const form = document.querySelector("#estimate-form");
const prefecture = document.querySelector("#prefecture");
const monthlyElectricityBill = document.querySelector("#monthly-electricity-bill");
const calculateButton = document.querySelector("#calculate-button");
const formMessage = document.querySelector("#form-message");
const subsidyDataLink = document.querySelector("#top-subsidy-data-link");
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

function updateSubsidyDataLink() {
  const params = new URLSearchParams();
  const data = frontendData?.publicData;
  if (data?.prefectures.some(p => p.code === prefecture.value)) {
    params.set('prefecture', prefecture.value);
  }
  subsidyDataLink.href = '/data/subsidies/' + (params.size ? '?' + params : '');
}

function updateAvailability() {
  const initialized = frontendData?.publicData.data_version !== "uninitialized";
  const ready = frontendData && initialized && CALCULATION_IMPLEMENTED;
  calculateButton.disabled = !ready;
  formMessage.textContent = dataLoadFailed ? "使用データを読み込めないため，現在は診断できません．時間をおいて再読み込みしてください．" : !ready ? "検証済みデータの準備後に利用できます．" : "";
  formMessage.hidden = !formMessage.textContent;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (calculateButton.disabled || !form.reportValidity()) return;
  try {
    validateLocation({ prefectureCode: prefecture.value }, frontendData.publicData);
  } catch (error) {
    formMessage.hidden = false;
    formMessage.textContent = error.message;
    return;
  }
  const target = new URL("simulator/", window.location.href);
  target.searchParams.set("prefecture", prefecture.value);
  if (monthlyElectricityBill.value !== "") target.searchParams.set("monthlyElectricityBill", monthlyElectricityBill.value);
  target.searchParams.set("from", "top");
  window.location.assign(target);
});

prefecture.addEventListener("change", () => {updateAvailability();updateSubsidyDataLink();});
window.addEventListener("pageshow", updateSubsidyDataLink);

try {
  frontendData = await loadFrontendData();
  populatePrefectures(frontendData.publicData.prefectures);
  updateSubsidyDataLink();
} catch {
  dataLoadFailed = true;
}

updateAvailability();
