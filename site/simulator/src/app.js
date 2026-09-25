import { recordDiagnosisComplete } from "../../shared/analytics.js";
import { setupMobileActions } from "./mobile-actions.js";
import { housingInput, housingLabel, housingContract, configureHousingInput } from "./housing-input.js";
import { cashflowMarkers, groupMarkerTargets } from "./chart-markers.js";
import { conciseFukuokaAssumption, conciseKochiAssumption, conciseEhimeAssumption, conciseKagawaAssumption, housingScopeAssumption, conciseTokushimaAssumption, conciseYamaguchiAssumption, conciseHiroshimaAssumption, conciseOkayamaAssumption, conciseShimaneAssumption, designatedContractAssumption, readableSubsidyAssumption, noncashBenefitDescription, subsidyGroups, subsidyLevelAmounts, subsidyGovernmentLabel, subsidyResearchMessage, prefectureResearchMessage } from "./subsidy-presentation.js";
import { CALCULATION_IMPLEMENTED, calculateEstimate } from "./calculator.js";
import { loadFrontendData } from "../../../data/src/data-loader.js";
import { validateLocation, populateMunicipalitySelect } from "./location-input.js";
import { cashflowChartLayout, formatEnergyRate, subsidyReasonPresentation, energyRoutes, financialTotals, endpointResult, conclusionBreakdown, compactYen, scenarioSubsidyCondition, hasUnconfirmedSubsidy, mainSubsidyPresentation, subsidyBreakdownReason, scenarioRecoveryPresentation, energyBreakdownPresentation } from "./result-presentation.js";
import { degradationLabel, degradationDescription, outageReferencePresentation, formatBatteryCapacity } from "./battery-presentation.js";
import { applicationStatusLabel } from "./municipal-information.js";

let housingAgeSelection;
function housingDisplayContract() {
  const contract = housingContract(frontendData.publicData.calculation.housing_age_input);
  const labels = { existing: 'すでに建っている家に設置', new: '新築する家に設置' };
  return { ...contract, options: contract.options.map(item => ({ ...item, label: labels[item.value] ?? item.label })) };
}
const elements = {
  housingAge: document.querySelector("#housing-age"),
  form: document.querySelector("#estimate-form"),
  prefecture: document.querySelector("#prefecture"),
  municipalityField: document.querySelector("[data-municipality-field]"),
  municipality: document.querySelector("#municipality"),
  municipalityHelp: document.querySelector("#municipality-help"),
  monthlyElectricityBill: document.querySelector("#monthly-electricity-bill"),
  formMessage: document.querySelector("#form-message"),
  calculator: document.querySelector(".calculator"),
  calculatorExpanded: document.querySelector("[data-calculator-expanded]"),
  calculatorCollapsed: document.querySelector("[data-calculator-collapsed]"),
  conditionSummary: document.querySelector("[data-condition-summary]"),
  changeConditionsButton: document.querySelector("[data-change-conditions]"),
  roofOrientation: document.querySelector("#roof-orientation"),
  daytimeOccupancyOptions: document.querySelector("[data-daytime-occupancy-options]"),
  equipmentOptions: document.querySelector("#equipment-package"),
  batteryCapacityControl: document.querySelector("[data-battery-capacity-control]"),
  batteryCapacitySlider: document.querySelector("#battery-capacity"),
  batteryCapacityOutput: document.querySelector("[data-battery-capacity-output]"),
  batteryCapacityScale: document.querySelector("[data-battery-capacity-scale]"),
  batteryCapacityHelp: document.querySelector("[data-battery-capacity-help]"),
  batteryCapacityStatus: document.querySelector("[data-battery-capacity-status]"),
  detailConditionSummary: document.querySelector("[data-detail-condition-summary]"),
  dataStatus: document.querySelector("#data-status"),
  result: document.querySelector("#estimate-result"),
  resultTitle: document.querySelector("#result-title"),
  resultEconomicBenefit: document.querySelector("[data-result-economic-benefit]"),
  resultSubsidyNote: document.querySelector("[data-result-subsidy-note]"),
  resultSolarCost: document.querySelector("[data-result-solar-cost]"),
  resultSelfConsumption: document.querySelector("[data-result-self-consumption]"),
  resultSalesIncome: document.querySelector("[data-result-sales-income]"),
  resultSubsidy: document.querySelector("[data-result-subsidy]"),
  resultMaintenanceCost: document.querySelector("[data-result-maintenance-cost]"),
  resultPowerConditionerCost: document.querySelector("[data-result-power-conditioner-cost]"),
  resultProfit: document.querySelector("[data-result-profit]"),
  resultGeneration: document.querySelector("[data-result-generation]"),
  resultConsumption: document.querySelector("[data-result-consumption]"),
  resultSelfConsumptionRate: document.querySelector("[data-result-self-consumption-rate]"),
  resultSelfSufficiencyRate: document.querySelector("[data-result-self-sufficiency-rate]"),
  resultDirectSelfConsumed: document.querySelector("[data-result-direct-self-consumed]"),
  resultBatteryDelivered: document.querySelector("[data-result-battery-delivered]"),
  resultBatteryLoss: document.querySelector("[data-result-battery-loss]"),
  resultPurchased: document.querySelector("[data-result-purchased]"),
  resultExported: document.querySelector("[data-result-exported]"),
  municipalSubsidyTitle: document.querySelector("[data-municipal-subsidy-title]"),
  municipalSubsidySummary: document.querySelector("[data-municipal-subsidy-summary]"),
  municipalIncluded: document.querySelector("[data-municipal-included]"),
  municipalIncludedList: document.querySelector("[data-municipal-included-list]"),
  municipalExcluded: document.querySelector("[data-municipal-excluded]"),
  municipalExcludedList: document.querySelector("[data-municipal-excluded-list]"),
  resultBatteryCost: document.querySelector("[data-result-battery-cost]"),
  batteryYearly: document.querySelector("[data-battery-yearly]"),
  batteryDegradationControl: document.querySelector("[data-battery-degradation-control]"),
  batteryDegradationSelect: document.querySelector("#battery-degradation-scenario"),
  batteryDegradationAssumption: document.querySelector("[data-battery-degradation-assumption]"),
  batteryDegradationDescription: document.querySelector("[data-battery-degradation-description]"),
  batteryOutageReference: document.querySelector("[data-battery-outage-reference]"),
  batteryOutageCapacity: document.querySelector("[data-battery-outage-capacity]"),
  batteryOutageEnergy: document.querySelector("[data-battery-outage-energy]"),
  batteryCapacityChart: document.querySelector("[data-battery-capacity-chart]"),
  batteryCapacityDescription: document.querySelector("[data-battery-capacity-description]"),
  batteryCapacityInitial: document.querySelector("[data-battery-capacity-initial]"),
  batteryCapacityYear1: document.querySelector("[data-battery-capacity-year1]"),
  batteryCapacityYear10: document.querySelector("[data-battery-capacity-year10]"),
  batteryCapacityYear20: document.querySelector("[data-battery-capacity-year20]"),
  batteryCapacityYear30: document.querySelector("[data-battery-capacity-year30]"),
  capacitySlider: document.querySelector("#system-capacity"),
  capacityOutput: document.querySelector("[data-capacity-output]"),
  capacityStatus: document.querySelector("[data-capacity-status]"),
  cashflowChart: document.querySelector("[data-cashflow-chart]"),
  cashflowDescription: document.querySelector("[data-cashflow-description]"),
  resultDisclosures: document.querySelectorAll("[data-result-disclosure]")
};

let frontendData = null;
let latestResult = null;
let selectedScenarioId = "standard";
let batteryDegradationSelection = null;

function recoverInvalidDegradationSelection() {
  const contract = frontendData?.publicData.calculation.battery_degradation_input;
  if (contract && batteryDegradationSelection !== null
    && !contract.options.includes(batteryDegradationSelection)) {
    batteryDegradationSelection = null;
    elements.formMessage.textContent = "URLの容量劣化条件を確認できませんでした．条件を確認して再計算すると，保守的な仮定で診断できます．";
  }
}

function populatePrefectures(prefectures) {
  const fragment = document.createDocumentFragment();

  for (const prefecture of prefectures) {
    const option = document.createElement("option");
    option.value = prefecture.code;
    option.textContent = prefecture.name;
    fragment.append(option);
  }

  elements.prefecture.append(fragment);
}

function updateMunicipalities(preferredCode = null) {
  const selected = populateMunicipalitySelect({ ...elements, unselectedLabel: "市区町村を選択（任意）" }, frontendData?.publicData, preferredCode);
  elements.municipalityHelp.hidden = !elements.prefecture.value || !elements.municipality.disabled;
  return selected;
}


const equipmentEditor = document.querySelector('#equipment-editor');
const equipmentEditButton = document.querySelector('[data-edit-equipment]');
const equipmentMessage = document.querySelector('[data-equipment-message]');
function updateEquipmentSummary() {
  const battery = selectedEquipmentPackage() === 'solar_plus_standard_battery';
  document.querySelector('[data-equipment-summary]').replaceChildren(...['設備構成：' + (battery ? '太陽光＋蓄電池' : '太陽光のみ'), '太陽光パネルの容量：' + Number(elements.capacitySlider.value).toFixed(1) + ' kW', ...(battery ? ['蓄電池の定格容量：' + Number(elements.batteryCapacitySlider.value).toFixed(1) + ' kWh'] : [])].map(text => Object.assign(document.createElement('span'), { className: 'condition-summary-line', textContent: text })));
}
function setEquipmentEditing(editing) {
  equipmentEditor.hidden = !editing;
  document.querySelector('[data-equipment-summary-row]').hidden = editing;
  setConditionButton(equipmentEditButton, '導入設備', editing);
}
equipmentEditButton.addEventListener('click', () => {
  if (equipmentEditor.hidden) { setEquipmentEditing(true); return; }
  if (latestResult && !applyLiveConditions()) return;
  updateEquipmentSummary();
  setEquipmentEditing(false);
});

function populateRoofOrientations(detailInputs) {
  const orientation = detailInputs.find((item) => item.input_name === "roof_orientation");
  if (!orientation) return;
  const fragment = document.createDocumentFragment();
  for (const item of orientation.options) {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    fragment.append(option);
  }
  elements.roofOrientation.replaceChildren(fragment);
  elements.roofOrientation.value = orientation.default_option;
}

function populateDaytimeOccupancy(daytimeOccupancy) {
  const fragment = document.createDocumentFragment();
  for (const option of daytimeOccupancy.options) {
    const label = document.createElement("label");
    label.className = "occupancy-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "daytimeOccupancy";
    input.value = option.value;
    input.checked = option.value === daytimeOccupancy.default_option;
    const content = document.createElement("span");
    content.className = "occupancy-option__content";
    const title = document.createElement("strong");
    title.textContent = option.label;
    const description = document.createElement("small");
    description.textContent = option.definition;
    content.append(title, description);
    label.append(input, content);
    fragment.append(label);
  }
  elements.daytimeOccupancyOptions.replaceChildren(fragment);
}

function selectedDaytimeOccupancy() {
  return elements.daytimeOccupancyOptions.querySelector("input:checked")?.value ?? null;
}

function selectDaytimeOccupancy(value) {
  const option = elements.daytimeOccupancyOptions.querySelector(`input[value="${value}"]`);
  if (option) option.checked = true;
}

function selectedEquipmentPackage() {
  return elements.equipmentOptions.value || null;
}

function selectEquipmentPackage(value) {
  elements.equipmentOptions.value = value;
  document.querySelector("[data-equipment-premise]").hidden = value !== "solar_plus_standard_battery";
  const batteryApplicable = frontendData?.publicData.calculation.battery_capacity_input
    ?.applicable_equipment_package === value;
  elements.batteryCapacityControl.hidden = !batteryApplicable;
  elements.batteryCapacitySlider.disabled = !batteryApplicable;
}

function configureBatteryCapacityInput(contract) {
  elements.batteryCapacitySlider.min = String(contract.minimum);
  elements.batteryCapacitySlider.max = String(contract.maximum);
  elements.batteryCapacitySlider.step = String(contract.multiple_of);
  elements.batteryCapacitySlider.value = String(contract.default);
  elements.batteryCapacitySlider.dataset.unit = contract.unit;
  elements.batteryCapacityOutput.textContent = `${Number(contract.default).toFixed(1)} ${contract.unit}`;
  elements.batteryCapacityScale.replaceChildren(
    Object.assign(document.createElement("span"), { textContent: `${Number(contract.minimum).toFixed(1)} ${contract.unit}` }),
    Object.assign(document.createElement("span"), { textContent: `${Number(contract.maximum).toFixed(1)} ${contract.unit}` })
  );
  elements.batteryCapacityHelp.textContent = `${Number(contract.minimum).toFixed(1)}～${Number(contract.maximum).toFixed(1)} ${contract.unit}を，${Number(contract.multiple_of).toFixed(1)} ${contract.unit}刻みで比較できます．`;
}

function setBatteryCapacityValue(value) {
  elements.batteryCapacitySlider.value = String(value);
  elements.batteryCapacityOutput.textContent = `${Number(value).toFixed(1)} ${elements.batteryCapacitySlider.dataset.unit}`;
}

function normalizeEquipmentPackage(value, calculation) {
  return calculation.equipment_packages.includes(value)
    ? value
    : calculation.default_equipment_package;
}

function normalizeDaytimeOccupancy(value, daytimeOccupancy) {
  return daytimeOccupancy.options.some((option) => option.value === value)
    ? value
    : daytimeOccupancy.default_option;
}

function isInitialized(data) {
  return data.publicData.data_version !== "uninitialized";
}

function updateAvailability() {
  const available = Boolean(frontendData) && isInitialized(frontendData) && CALCULATION_IMPLEMENTED;
  elements.prefecture.disabled = !available;

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

  elements.formMessage.textContent = "";
}

function readInput() {
  housingInput(housingAgeSelection, frontendData.publicData.calculation.housing_age_input);
  validateLocation({ prefectureCode: elements.prefecture.value, municipalityCode: elements.municipality.value }, frontendData.publicData);
  const billControl = elements.monthlyElectricityBill;
  if (!billControl.validity.valid) {
    const error = new Error('電気代は0以上の整数で入力してください．空欄なら地域標準値を使います．');
    error.control = billControl;
    throw error;
  }
  const monthlyElectricityBill = billControl.value;

  return {
    housingAge: housingAgeSelection,
    prefectureCode: elements.prefecture.value,
    municipalityCode: elements.municipality.disabled || !elements.municipality.value
      ? null
      : elements.municipality.value,
    monthlyElectricityBillYen: monthlyElectricityBill === "" ? null : Number(monthlyElectricityBill),
    systemCapacityKw: Number(elements.capacitySlider.value),
    equipmentPackage: selectedEquipmentPackage(),
    batteryDegradationScenario: selectedEquipmentPackage() === "solar_plus_standard_battery"
      ? batteryDegradationSelection : null,
    batteryCapacityKwh: selectedEquipmentPackage() === frontendData.publicData.calculation
      .battery_capacity_input.applicable_equipment_package
      ? Number(elements.batteryCapacitySlider.value)
      : null,
    daytimeOccupancy: selectedDaytimeOccupancy(),
    detailConditions: { roof_orientation: elements.roofOrientation.value }
  };
}

function inputFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const prefectureCode = params.get("prefecture") ?? "";
  const municipalityCode = params.get("municipality_code");
  const monthlyBill = params.get("monthlyElectricityBill");
  const capacity = params.get("systemCapacityKw");
  const roofOrientation = params.get("roofOrientation");
  const daytimeOccupancy = params.get("daytimeOccupancy");
  const equipmentPackage = params.get("equipment_package");
  const batteryCapacityParameter = frontendData.publicData.calculation.battery_capacity_input.url_parameter_name;
  const batteryCapacity = params.get(batteryCapacityParameter);
  return {
    housingAge: params.get(housingContract(frontendData.publicData.calculation.housing_age_input).url_parameter_name) ?? undefined,
    prefectureCode,
    municipalityCode,
    monthlyElectricityBillYen: monthlyBill === null || monthlyBill === "" ? null : Number(monthlyBill),
    systemCapacityKw: capacity === null || capacity === "" ? null : Number(capacity),
    equipmentPackage,
    batteryDegradationScenario: frontendData.publicData.calculation.battery_degradation_input
      ? params.get(frontendData.publicData.calculation.battery_degradation_input.url_parameter_name) : null,
    batteryCapacityKwh: batteryCapacity === null || batteryCapacity === "" ? null : Number(batteryCapacity),
    daytimeOccupancy,
    detailConditions: roofOrientation ? { roof_orientation: roofOrientation } : undefined
  };
}

function writeInputToLocation(input) {
  const target = new URL(window.location.href);
  target.search = "";
  if (input.housingAge != null) target.searchParams.set(housingContract(frontendData.publicData.calculation.housing_age_input).url_parameter_name, housingInput(input.housingAge, frontendData.publicData.calculation.housing_age_input).value);
  target.searchParams.set("prefecture", input.prefectureCode);
  if (input.municipalityCode) {
    target.searchParams.set("municipality_code", input.municipalityCode);
  }
  if (input.monthlyElectricityBillYen !== null) {
    target.searchParams.set("monthlyElectricityBill", String(input.monthlyElectricityBillYen));
  }
  target.searchParams.set("systemCapacityKw", String(input.systemCapacityKw));
  target.searchParams.set("equipment_package", input.equipmentPackage);
  const degradationContract = frontendData.publicData.calculation.battery_degradation_input;
  if (degradationContract && input.equipmentPackage === degradationContract.applicable_equipment_package
    && input.batteryDegradationScenario !== null) {
    target.searchParams.set(degradationContract.url_parameter_name, input.batteryDegradationScenario);
  }
  if (
    input.equipmentPackage === frontendData.publicData.calculation.battery_capacity_input.applicable_equipment_package
    && input.batteryCapacityKwh !== null
  ) {
    target.searchParams.set(
      frontendData.publicData.calculation.battery_capacity_input.url_parameter_name,
      String(input.batteryCapacityKwh)
    );
  }
  if (input.detailConditions?.roof_orientation) {
    target.searchParams.set("roofOrientation", input.detailConditions.roof_orientation);
  }
  if (input.daytimeOccupancy) {
    target.searchParams.set("daytimeOccupancy", input.daytimeOccupancy);
  }
  target.searchParams.set("scenario", selectedScenarioId);
  target.searchParams.set("from", "analysis");
  window.history.replaceState(null, "", target);
}

const yenFormatter = new Intl.NumberFormat("ja-JP");

function formatYen(value, rounded = true) {
  if (rounded && value !== 0 && Math.abs(value) < 1000) return `${value < 0 ? "−" : ""}1,000円未満`;
  const display = rounded ? Math.round(Math.abs(value) / 1000) * 1000 * Math.sign(value) : value;
  return `${yenFormatter.format(display)}円`;
}

function formatSignedYen(value, direction = "auto") {
  if (!Number.isFinite(value)) {
    return "未確認";
  }
  if (value === 0) {
    return "0円";
  }
  const sign = direction === "cost" || (direction === "auto" && value < 0)
    ? "−"
    : "＋";
  return `${sign}${formatYen(Math.abs(value))}`;
}

function formatProfit(value) {
  return formatSignedYen(value);
}

function renderCashflowAmount(element, value, direction = "auto") {
  element.textContent = formatSignedYen(value, direction);
  const tone = !Number.isFinite(value) || value === 0
    ? "neutral"
    : direction === "cost" || (direction === "auto" && value < 0)
      ? "negative"
      : "positive";
  for (const name of ["positive", "negative", "neutral"]) {
    element.classList.toggle(`cashflow-amount--${name}`, name === tone);
  }
}

function renderBreakdownAmount(element, value, direction = "cost") {
  renderCashflowAmount(element, value, direction);
}

function renderInlineCashflowAmount(element, prefix, value) {
  const amount = document.createElement("span");
  amount.className = "cashflow-inline-amount";
  renderCashflowAmount(amount, value);
  element.replaceChildren(document.createTextNode(prefix), amount);
}

function formatCapacity(value) {
  return `${Number(value).toFixed(1)} kW`;
}

function normalizeCapacity(value, fallback) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  const minimum = Number(elements.capacitySlider.min);
  const maximum = Number(elements.capacitySlider.max);
  const step = Number(elements.capacitySlider.step);
  const clamped = Math.min(maximum, Math.max(minimum, value));
  return Math.round(clamped / step) * step;
}

function formatCompactYen(value) {
  const absolute = Math.abs(value);
  if (absolute >= 10_000) {
    return `${value < 0 ? "−" : ""}${yenFormatter.format(Math.round(absolute / 10_000))}万円`;
  }
  return `${value < 0 ? "−" : ""}${formatYen(absolute)}`;
}

function formatBasicConditions(result) {
  const bill = `電気代：${formatYen(result.input.monthly_electricity_bill_yen, false)}／月`;
  const location = result.input.municipality_name
    ? `${result.input.prefecture_name}${result.input.municipality_name}`
    : result.input.prefecture_name;
  const solarCapacity = result.input.system_capacity_kw === undefined
    ? "4.0 kW"
    : formatCapacity(result.input.system_capacity_kw);
  const batterySelected = result.input.equipment_package === "solar_plus_standard_battery";
  const equipment = batterySelected ? "太陽光＋蓄電池" : "太陽光のみ";
  const batteryCapacity = batterySelected
    ? `・蓄電池 ${Number(result.input.battery_capacity_kwh).toFixed(1)} kWh`
    : "";
  return [`地域：${location}`, bill, `${equipment}・太陽光 ${solarCapacity}${batteryCapacity}`];
}

function renderDetailSummary(lines) {
  elements.detailConditionSummary.replaceChildren(...lines.map(text => Object.assign(document.createElement('span'), { className: 'condition-summary-line', textContent: text })));
}
function updateDetailConditionSummary(result) {
  const orientation = result.input.detail_conditions?.find(
    (item) => item.input_name === "roof_orientation"
  );
  const summary = [
    "新築・既存：" + housingLabel(result.input.housing_age, housingDisplayContract()),
    orientation ? `屋根の方角：${orientation.label}` : null,
    result.input.daytime_occupancy ? `平日昼間の在宅状況：${result.input.daytime_occupancy.value === "unknown_standard" ? "標準設定" : result.input.daytime_occupancy.label}` : null
  ].filter(Boolean);
  renderDetailSummary(summary);
}

function updateCurrentHousingSummary() {
  if (!frontendData) return;
  const occupancy = selectedDaytimeOccupancy();
  const label = frontendData.publicData.calculation.daytime_occupancy.options.find(item => item.value === occupancy)?.label;
  renderDetailSummary(["新築・既存：" + housingLabel(elements.housingAge.value, housingDisplayContract()), '屋根の方角：' + elements.roofOrientation.selectedOptions[0].textContent, '平日昼間の在宅状況：' + (occupancy === 'unknown_standard' ? '標準設定' : label)]);
}
function collapseCalculator(result, keepEditor = false) {

  const lines = formatBasicConditions(result).slice(0, 2).map((text) => {
    const line = document.createElement("span");
    line.textContent = text;
    return line;
  });
  const billAmount = document.createElement("strong");
  billAmount.textContent = `${formatYen(result.input.monthly_electricity_bill_yen, false)}／月`;
  lines[1].replaceChildren(document.createTextNode("月々の電気代："), billAmount);
  if (result.input.used_default_monthly_electricity_bill) {
    const note = document.createElement("small");
    note.textContent = "地域平均";
    lines[1].append(note);
  }
  elements.conditionSummary.replaceChildren(...lines);
  if (!keepEditor) {
    elements.calculatorExpanded.hidden = true;
    elements.calculatorCollapsed.hidden = false;
    elements.calculator.classList.add("calculator--collapsed");
  }
  elements.changeConditionsButton.hidden = false;
  setConditionButton(elements.changeConditionsButton, '地域・電気代', !elements.calculatorExpanded.hidden);
}

function expandCalculator() {
  elements.calculatorCollapsed.hidden = true;
  elements.calculatorExpanded.hidden = false;
  elements.calculator.classList.remove('calculator--collapsed');
  setConditionButton(elements.changeConditionsButton, '地域・電気代', true);
}

function renderBrandOutcome(element, prefix, outcome, suffix = "", decorate = true) {
  const outcomeElement = document.createElement("span");
  outcomeElement.className = decorate && outcome === "トク" ? "brand-word" : "";
  outcomeElement.textContent = outcome;
  element.replaceChildren(
    document.createTextNode(prefix),
    outcomeElement,
    document.createTextNode(suffix)
  );
}

function subsidyStatusFor(scenario, input) {
  if (scenario.subsidy_status) {
    return scenario.subsidy_status;
  }
  if (input.subsidy_capacity_verified === false) {
    return "unverified";
  }
  return scenario.subsidy_yen > 0 ? "applied" : "not_applicable";
}

function renderScenarios(scenarios, input) {
  const scenario = scenarios.find(item => item.scenario === selectedScenarioId);
  document.querySelector('#scenario-select').value = selectedScenarioId;
  for (const option of document.querySelector('#scenario-select').options) {
    const assumption = frontendData.publicData.scenarios.find(item => item.scenario === option.value);
    const growth = Number((assumption.electricity_price_growth_rate * 100).toFixed(3));
    option.textContent = { downside: '下振れ', standard: '標準', upside: '上振れ' }[option.value] + '｜電気代' + (growth > 0 ? '+' : '') + growth + '%/年｜補助金' + (option.value === 'downside' ? 'なし' : 'あり想定');
  }
}

function renderSubsidyRows(list, rows) {
  list.replaceChildren();
  if (!rows.length) {
    const empty = document.createElement('li');
    empty.textContent = 'この一覧に掲載する制度はありません．地域の確認状況は上記をご確認ください．';
    list.append(empty);
  }
  for (const row of rows) {
    const item = document.createElement('li');
    item.dataset.subsidyRecord = row.id;
    const heading = document.createElement('strong');
    const equipment = { solar: '太陽光', battery: '蓄電池', solar_battery: '太陽光・蓄電池', package_bonus: '組合せ加算' }[row.target_equipment];
    heading.textContent = `${subsidyGovernmentLabel(row.government_level)}${equipment ? equipment + '：' : ''}${row.program_name}`;
    const status = document.createElement('p');
    status.textContent = `受付状態：${applicationStatusLabel(row)}`;
    const calculation = document.createElement('p');
    calculation.textContent = row.included ? `利用を想定する額：${formatYen(row.amount_yen)}` : Number.isFinite(row.amount_yen) ? row.amount_yen > 0 ? `参考額（今回の算入対象外）：${formatYen(row.amount_yen)}` : '今回の算入額：0円' : '試算額：未確定';
    const noncash = noncashBenefitDescription(row);
    if (row.included && noncash) calculation.textContent = '経済便益への算入額：' + formatYen(row.amount_yen, false) + '相当（非現金）';
    item.append(heading, status, calculation);
    const contractAssumption = designatedContractAssumption(row);
    const regionalAssumption = conciseFukuokaAssumption(row) || conciseKochiAssumption(row) || conciseEhimeAssumption(row) || conciseKagawaAssumption(row) || conciseTokushimaAssumption(row) || conciseYamaguchiAssumption(row) || conciseHiroshimaAssumption(row) || conciseOkayamaAssumption(row) || conciseShimaneAssumption(row);
    const housingAssumption = housingScopeAssumption(row);
    const conciseAssumption = [housingAssumption, regionalAssumption || (housingAssumption ? '住宅・設備・申請などの条件を満たす想定です．適用条件と補助額は，自治体へ確認してください．' : '')].filter(Boolean).join(' ');
    if(row.included && noncash){const benefit=document.createElement('p');benefit.textContent=noncash;item.append(benefit);}
    if(row.included && row.id==='nagano-20205-row-42-2-2026') {
      const note=document.createElement('p');
      note.textContent='蓄電池の税込対象費用は，他の併用可能な補助金を控除する前の額で計算します．補助額は1kWh当たり20万円と対象費用の3分の2の小さい額を千円未満切捨てとします．他の国庫財源による補助との併用は禁止されています．';
      item.append(note);
    }
    const branchExclusions = (row.calculation_assumptions ?? []).filter(text => /蓄電池枝.*算入しない/.test(text));
    if (row.included && branchExclusions.length) {
      const branchNote = document.createElement('p');
      branchNote.textContent = branchExclusions.join(' ');
      item.append(branchNote);
    }
    const eligibilityPremises = (row.required_confirmations ?? []).filter(text => /充足.*仮定|申請前確認条件/.test(text));
    if (row.included && (conciseAssumption || contractAssumption || row.calculation_assumptions?.some(text => /入力(?:項目)?にない|入力外|仮定|概算前提|解釈|半額上限|設置後/.test(text)) || eligibilityPremises.length)) {
      const premise = document.createElement('p');
      const tokyo = row.id === 'tokyo-residential-solar-2026-audit';
      const readable = readableSubsidyAssumption;
      const assumptions = [...new Set([...(row.calculation_assumptions ?? []), ...eligibilityPremises].map(readable))];
      premise.textContent = '条件付き概算：' + (conciseAssumption || contractAssumption || (tokyo ? '対象製品・工法に指定条件があります．詳細は施工会社へ確認してください．架台・防水の加算は含めていません．' : assumptions.join(' ')));
      item.append(premise);
      const confirmationText = [...new Set((row.required_confirmations ?? []).filter(text => !text.includes('実読') && !eligibilityPremises.includes(text)).map(readable))].filter(text => !assumptions.includes(text)).join(' ');
      if (!tokyo && !conciseAssumption && confirmationText) {
        const confirmation = document.createElement('p');
        confirmation.textContent = '要確認事項：' + confirmationText;
        item.append(confirmation);
      }
      const detail = document.createElement('a');
      detail.href = '../pages/calculation-method.html#subsidy-program-' + encodeURIComponent(row.id);
      detail.textContent = 'この制度の計算条件・確認事項';
      item.append(detail);
    }
    if (row.branch_statuses?.length) {
      status.textContent = row.branch_statuses.map(branch => ({solar:'太陽光',battery:'蓄電池'}[branch.branch_id] ?? '対象設備') + '：' + (branch.application_status === 'closed' ? '受付終了' : applicationStatusLabel(branch))).join('／');
    }
    if (row.included && row.benefit_type === 'noncash_points_equivalent') {
      const benefit = document.createElement('p');
      benefit.textContent = '非現金のポイント等の額面10万円相当を経済便益に算入しています．地域協力店等の2倍条件と税抜・値引後の本体価格10万円超を満たす適格製品の採用を仮定しています．';
      item.append(benefit);
    }
    if (!row.included) {
      const reason = document.createElement('p');
      reason.textContent = row.reason;
      item.append(reason);
    }
    if (row.official_url) {
      const link = document.createElement('a');
      link.href = row.official_url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = heading.textContent + ' ↗';
      heading.replaceChildren(link);
    }
    list.append(item);
  }
}

function renderMunicipalSubsidy(result, scenario) {
  const municipality = frontendData.publicData.municipalities.find(item => item.municipality_code === result.input.municipality_code);
  const exploration = frontendData.publicData.municipality_subsidy_exploration?.find(item => item.municipality_code === result.input.municipality_code);
  const groups = subsidyGroups(result, scenario, municipality);
  const names = municipality?.candidate_program_names ?? [];
  const summaryCovered = names.length > 0 && names.every(name => [...groups.included, ...groups.excluded].some(row => row.program_name === name));
  elements.municipalSubsidySummary.textContent = [
    prefectureResearchMessage(scenario.subsidy_breakdown?.prefecture_program_status ?? result.input.prefecture_program_status),
    subsidyResearchMessage(scenario.subsidy_breakdown?.municipality_program_status ?? result.input.municipality_program_status, exploration),
    typeof municipality?.candidate_summary === 'string' && !summaryCovered ? municipality.candidate_summary : ''
  ].filter(Boolean).join(' ');
  renderSubsidyRows(elements.municipalIncludedList, groups.included);
  renderSubsidyRows(elements.municipalExcludedList, groups.excluded);
  renderSubsidyRows(document.querySelector('[data-subsidy-reference-list]'), groups.references);
  document.querySelector('[data-subsidy-references]').hidden = groups.references.length === 0;
  elements.municipalSubsidySummary.hidden = !elements.municipalSubsidySummary.textContent;
}
function renderBatteryYearly(result) {
  const batterySelected = result.input.equipment_package === "solar_plus_standard_battery";
  elements.batteryYearly.hidden = !batterySelected;
  const degradation = result.energy.battery_degradation;
  const contract = frontendData.publicData.calculation.battery_degradation_input;
  const available = batterySelected && Boolean(contract && degradation?.scenario_id);
  elements.batteryDegradationControl.hidden = !available;
  elements.batteryDegradationSelect.disabled = !available;
  if (available) {
    const scenarios = frontendData.publicData.calculation.battery_system.degradation_scenarios;
    if (!elements.batteryDegradationSelect.options.length) {
      elements.batteryDegradationSelect.replaceChildren(...scenarios.map((scenario) => {
        const option = document.createElement("option");
        option.value = scenario.id;
        option.textContent = degradationLabel(scenario);
        return option;
      }));
    }
    elements.batteryDegradationSelect.value = degradation.scenario_id;
    elements.batteryDegradationAssumption.textContent = `今回の収支の前提：${degradationLabel({ ...degradation, id: degradation.scenario_id })}`;
    elements.batteryDegradationDescription.textContent = degradationDescription(degradation);
  }
  const outage = batterySelected ? outageReferencePresentation(frontendData.publicData.calculation.battery_system.outage_reference) : null;
  elements.batteryOutageReference.hidden = !outage;
  if (outage) {
    elements.batteryOutageCapacity.textContent = outage.label;
    elements.batteryOutageEnergy.textContent = outage.energy;
  }
  if (!batterySelected) {
    elements.batteryCapacityChart.replaceChildren();
    return;
  }
  const nominalCapacity = Number(result.input.battery_capacity_kwh);
  const annual = result.energy.annual_energy_flows.map((flow) => ({
    year: Number(flow.year),
    capacity: Number(flow.battery_usable_capacity_kwh)
  }));
  const points = [{ year: 0, capacity: nominalCapacity }, ...annual];
  const width = Math.min(720, elements.batteryCapacityChart.clientWidth || 720);
  const height = 260;
  const margin = { top: 20, right: 30, bottom: 44, left: 76 };
  elements.batteryCapacityChart.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (year) => margin.left + (year / 30) * plotWidth;
  const y = (capacity) => margin.top + (1 - capacity / nominalCapacity) * plotHeight;
  const chart = elements.batteryCapacityChart;
  chart.replaceChildren();
  chart.append(
    createSvgElement("line", { x1: margin.left, y1: margin.top, x2: margin.left, y2: height - margin.bottom, class: "battery-capacity-chart__axis" }),
    createSvgElement("line", { x1: margin.left, y1: height - margin.bottom, x2: width - margin.right, y2: height - margin.bottom, class: "battery-capacity-chart__axis" })
  );
  for (const year of [0, 10, 20, 30]) {
    const tick = createSvgElement("line", { x1: x(year), y1: height - margin.bottom, x2: x(year), y2: height - margin.bottom + 6, class: "battery-capacity-chart__axis" });
    const label = createSvgElement("text", { x: x(year), y: height - 16, class: "battery-capacity-chart__label", "text-anchor": "middle" });
    label.textContent = year === 0 ? "導入時" : `${year}年後`;
    chart.append(tick, label);
  }
  for (const capacity of [0, nominalCapacity]) {
    const label = createSvgElement("text", { x: margin.left - 10, y: y(capacity) + 4, class: "battery-capacity-chart__label", "text-anchor": "end" });
    label.textContent = `${capacity.toFixed(1)} kWh`;
    chart.append(label);
  }
  if (outage && outage.capacity <= nominalCapacity) {
    chart.append(createSvgElement("line", { x1: x(0), y1: y(outage.capacity), x2: x(30), y2: y(outage.capacity), class: "battery-capacity-chart__reference" }));
    const label = createSvgElement("text", { x: x(0) + 4, y: y(outage.capacity) - 8, class: "battery-capacity-chart__label" });
    label.textContent = `24時間の一例 ${outage.label}`;
    chart.append(label);
  }
  const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.year)} ${y(point.capacity)}`).join(" ");
  chart.append(createSvgElement("path", { d: pathData, class: "battery-capacity-chart__line" }));
  for (const point of points.filter(({ year }) => [10, 20, 30].includes(year))) {
    chart.append(createSvgElement("circle", { cx: x(point.year), cy: y(point.capacity), r: 5, class: "battery-capacity-chart__point" }));
  }
  const capacities = new Map(points.map((point) => [point.year, point.capacity]));
  elements.batteryCapacityInitial.textContent = `${formatBatteryCapacity(nominalCapacity)} kWh`;
  elements.batteryCapacityYear1.textContent = `${formatBatteryCapacity(capacities.get(1))} kWh`;
  elements.batteryCapacityYear10.textContent = `${formatBatteryCapacity(capacities.get(10))} kWh`;
  elements.batteryCapacityYear20.textContent = `${formatBatteryCapacity(capacities.get(20))} kWh`;
  elements.batteryCapacityYear30.textContent = `${formatBatteryCapacity(capacities.get(30))} kWh`;
  elements.batteryCapacityDescription.textContent = `導入時${formatBatteryCapacity(nominalCapacity)} kWh，初年度${formatBatteryCapacity(capacities.get(1))} kWh，10年後${formatBatteryCapacity(capacities.get(10))} kWh，20年後${formatBatteryCapacity(capacities.get(20))} kWh，30年後${formatBatteryCapacity(capacities.get(30))} kWhです．15年目末60％は保証下限に整合する保守的感度パスで，各年は年末容量をその年の計算に用います．16～30年は年率係数を継続した数学的外挿であり，一次資料の実測値・保証値ではありません．`;
  if (available) {
    elements.batteryCapacityDescription.textContent = `導入時${formatBatteryCapacity(nominalCapacity)} kWh，初年度${formatBatteryCapacity(capacities.get(1))} kWh，10年後${formatBatteryCapacity(capacities.get(10))} kWh，20年後${formatBatteryCapacity(capacities.get(20))} kWh，30年後${formatBatteryCapacity(capacities.get(30))} kWhです．${degradationDescription(degradation)}`;
  }
  if (outage) elements.batteryCapacityDescription.textContent += `冷蔵庫・照明・スマホ24時間の一例は${outage.label}です．満充電，残量0％まで使用，太陽光補充なしの参考条件です．`;
}

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}

function zeroIntersections(series) {
  const intersections = [];
  for (let index = 1; index < series.length; index += 1) {
    const previous = series[index - 1];
    const current = series[index];
    const previousValue = previous.cumulative_profit_yen;
    const currentValue = current.cumulative_profit_yen;
    const direction = previousValue < 0 && currentValue >= 0
      ? "up"
      : previousValue >= 0 && currentValue < 0
        ? "down"
        : null;
    if (!direction) continue;
    const change = currentValue - previousValue;
    const fraction = change === 0 ? 0 : -previousValue / change;
    intersections.push({
      year: previous.year + fraction * (current.year - previous.year),
      value: 0,
      direction
    });
  }
  return intersections;
}

function paybackIntersection(series) {
  return zeroIntersections(series).findLast((intersection) => intersection.direction === "up") ?? null;
}

function annualCashflowSeries(scenario) {
  if (scenario.annual_cash_flows?.length) {
    if (!Number.isFinite(scenario.net_initial_outlay_yen)
      || scenario.annual_cash_flows.some((row) => !Number.isFinite(row.cumulative_cash_flow_yen))) {
      return [];
    }
    return [
      {
        year: 0,
        cumulative_profit_yen: -scenario.net_initial_outlay_yen,
        maintenance_and_replacement_cost_yen: 0
      },
      ...scenario.annual_cash_flows.map((row) => ({
        year: row.year,
        cumulative_profit_yen: row.cumulative_cash_flow_yen,
        maintenance_and_replacement_cost_yen: row.maintenance_and_replacement_cost_yen,
        electricity_savings_yen: row.electricity_savings_yen,
        sales_income_yen: row.sales_income_yen
      }))
    ];
  }
  return scenario.yearly_cash_flow ?? [];
}

function chartCashflowSeries(scenario) {
  const annualSeries = annualCashflowSeries(scenario);
  if (!scenario.annual_cash_flows?.length) {
    return annualSeries;
  }

  const chartSeries = [annualSeries[0]];
  let previousCumulative = annualSeries[0].cumulative_profit_yen;
  for (const point of annualSeries.slice(1)) {
    if (point.maintenance_and_replacement_cost_yen > 0) {
      chartSeries.push({
        year: point.year - 0.12,
        cumulative_profit_yen: previousCumulative
          + point.electricity_savings_yen
          + point.sales_income_yen,
        isBeforeLifecycleCost: true
      });
    }
    chartSeries.push(point);
    previousCumulative = point.cumulative_profit_yen;
  }
  return chartSeries;
}

const cashflowDetail = document.querySelector('#cashflow-detail');
let activeChartMarker = null;
let activeChartLines = [];
let chartDetailMode = null;
let chartHoverTimer = null;
function cancelChartHoverClose() { clearTimeout(chartHoverTimer); }
function scheduleChartHoverClose() {
  cancelChartHoverClose();
  chartHoverTimer = setTimeout(() => {
    if (chartDetailMode === 'hover' && !activeChartMarker?.matches(':hover') && !cashflowDetail.matches(':hover')) closeCashflowDetail();
  }, 300);
}
function closeCashflowDetail(restoreFocus = false) {
  cancelChartHoverClose();
  if (restoreFocus && activeChartMarker?.isConnected) activeChartMarker.focus({ preventScroll: true });
  activeChartMarker?.setAttribute('aria-expanded', 'false');
  cashflowDetail.hidden = true;
  activeChartMarker = null;
  chartDetailMode = null;
}
function showCashflowDetail(marker, lines, mode = chartDetailMode) {
  if (mode === 'hover' && (chartDetailMode === 'fixed' || chartDetailMode === 'focus')) return;
  cancelChartHoverClose();
  chartDetailMode = mode;
  document.querySelector("[data-close-cashflow-detail]").hidden = mode === "hover";
  activeChartMarker?.setAttribute('aria-expanded', 'false');
  activeChartMarker = marker;
  activeChartLines = lines;
  marker.setAttribute('aria-expanded', 'true');
  const content = document.querySelector('[data-cashflow-detail-content]');
  content.replaceChildren(...lines.map(text => { const p = document.createElement('p'); p.textContent = text; return p; }));
  cashflowDetail.hidden = false;
  const bounds = marker.getBoundingClientRect();
  const box = cashflowDetail.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  cashflowDetail.style.left = Math.max(8, Math.min(bounds.left, viewportWidth - box.width - 8)) + 'px';
  const below = bounds.bottom + 10;
  cashflowDetail.style.top = Math.max(8, Math.min(below + box.height <= viewportHeight ? below : bounds.top - box.height - 10, viewportHeight - box.height - 8)) + 'px';
}
cashflowDetail.addEventListener('pointerenter', cancelChartHoverClose);
cashflowDetail.addEventListener('pointerleave', scheduleChartHoverClose);
cashflowDetail.addEventListener('focusin', () => { chartDetailMode = 'focus'; cancelChartHoverClose(); });
document.querySelector('[data-close-cashflow-detail]').addEventListener('click', () => closeCashflowDetail(true));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !cashflowDetail.hidden) { event.preventDefault(); closeCashflowDetail(true); } });
document.addEventListener('pointerdown', event => { if (!cashflowDetail.hidden && !event.target.closest('.cashflow-detail, .cashflow-marker-target')) closeCashflowDetail(); });
window.addEventListener('scroll', () => { if (activeChartMarker) showCashflowDetail(activeChartMarker, activeChartLines); }, { passive: true });
const compactViewport = window.matchMedia('(max-width: 40rem)');
const mobileConditionsToggle = document.querySelector('[data-mobile-conditions-toggle]');
mobileConditionsToggle.addEventListener('click', () => {
  const open = mobileConditionsToggle.getAttribute('aria-expanded') !== 'true';
  mobileConditionsToggle.setAttribute('aria-expanded', String(open));
  mobileConditionsToggle.textContent = open ? '条件を閉じる' : '条件を変更';
  elements.calculator.classList.toggle('mobile-conditions-open', open);
});
function updateMobileConditionsSummary(result) {
  const location = result.input.prefecture_name + (result.input.municipality_name || '');
  const battery = result.input.equipment_package === 'solar_plus_standard_battery'
    ? '・蓄電池' + Number(result.input.battery_capacity_kwh).toFixed(1) + 'kWh' : '';
  const equipmentLine = location + '・太陽光' + Number(result.input.system_capacity_kw).toFixed(1) + 'kW' + battery;
  const scenarioLine = { downside: '下振れ・補助金なし', standard: '標準・補助金あり想定', upside: '上振れ・補助金あり想定' }[selectedScenarioId];
  document.querySelector('[data-mobile-conditions-summary]').replaceChildren(
    ...[equipmentLine, scenarioLine].map(text => Object.assign(document.createElement('span'), {
      className: 'mobile-conditions-summary-line', textContent: text,
    }))
  );
}


window.addEventListener('resize', () => {

  closeCashflowDetail();
  if (latestResult && !elements.result.hidden) {
    const selected = latestResult.scenarios.find(scenario => scenario.scenario === selectedScenarioId);
    renderCashflow(latestResult.scenarios, selected, latestResult.input.equipment_package);
  }
});

function renderCashflow(scenarios, selectedScenario, equipmentPackage) {
  closeCashflowDetail();
  const markerTargets = [];
  const endpoint = endpointResult(selectedScenario);
  const pendingLabel = () => {
    const label = createSvgElement('text', { x: 12, y: 32, class: 'cashflow-endpoint-label is-neutral' });
    label.textContent = '30年間の収支：' + endpoint.text;
    elements.cashflowChart.setAttribute('viewBox', '0 0 280 70');
    elements.cashflowChart.replaceChildren(label);
  };
  const availableScenarios = scenarios.filter((scenario) => annualCashflowSeries(scenario).length);
  if (!availableScenarios.length) {
    pendingLabel();
    elements.cashflowDescription.textContent = "補助金額が未確認のため，累積損益と回収時点は確定できません．";
    return;
  }

  const selectedSeries = annualCashflowSeries(selectedScenario);
  if (!selectedSeries.length) {
    pendingLabel();
    elements.cashflowDescription.textContent = "補助金額が未確認のため，選択中シナリオの累積損益と回収時点は確定できません．下振れシナリオでは補助金0円の結果を確認できます．";
    return;
  }

  const labels = { downside: "下振れ", standard: "標準", upside: "上振れ" };
  const width = Math.min(720, elements.cashflowChart.clientWidth || 720);
  const height = 280;
  const endpointLabel = createSvgElement('text', { class: 'cashflow-endpoint-label' + (endpoint.value < 0 ? ' is-negative' : endpoint.value === 0 ? ' is-neutral' : ''), 'data-endpoint-value': endpoint.value });
  endpointLabel.textContent = endpoint.text;
  elements.cashflowChart.append(endpointLabel);
  const estimatedLabelWidth = [...endpoint.text].reduce((sum, char) => sum + (/[^\x00-\x7f]/.test(char) ? 14 : 8), 0);
  const labelWidth = endpointLabel.getBBox().width || estimatedLabelWidth;
  const compactChart = compactViewport.matches;
  const chartLayout = cashflowChartLayout(width, labelWidth, compactChart);
  const { padding } = chartLayout;
  elements.cashflowChart.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const values = availableScenarios.flatMap((scenario) => (
    chartCashflowSeries(scenario).map((point) => point.cumulative_profit_yen)
  ));
  const minimum = Math.min(0, ...values);
  const maximum = Math.max(0, ...values);
  const range = Math.max(maximum - minimum, 1);
  const x = (year) => padding.left + (year / 30) * (width - padding.left - padding.right);
  const y = (value) => padding.top + ((maximum - value) / range) * (height - padding.top - padding.bottom);
  const fragment = document.createDocumentFragment();

  // Keep nearby zero/extreme labels apart without moving the data or grid lines.
  let previousLabelY = -Infinity;
  for (const value of [...new Set([minimum, 0, maximum])].sort((a, b) => b - a)) {
    const labelY = Math.max(y(value) + 4, previousLabelY + 22);
    previousLabelY = labelY;
    const line = createSvgElement("line", {
      x1: padding.left,
      x2: width - padding.right,
      y1: y(value),
      y2: y(value),
      class: value === 0 ? "cashflow-chart__zero" : "cashflow-chart__grid"
    });
    const label = createSvgElement("text", {
      x: padding.left - 12,
      y: labelY,
      "text-anchor": "end",
      class: "cashflow-chart__label"
    });
    label.textContent = formatCompactYen(value);
    fragment.append(line, label);
  }

  const selectedChartSeries = chartCashflowSeries(selectedScenario);
  const selectedLinePoints = selectedChartSeries
    .map((point) => `${x(point.year)},${y(point.cumulative_profit_yen)}`)
    .join(" ");
  fragment.append(createSvgElement("polygon", {
    points: `${x(0)},${y(0)} ${selectedLinePoints} ${x(30)},${y(0)}`,
    class: `cashflow-chart__area cashflow-chart__area--${selectedScenario.scenario}`
  }));

  const orderedScenarios = [
    ...availableScenarios.filter((scenario) => scenario.scenario !== selectedScenario.scenario),
    selectedScenario
  ];
  for (const scenario of orderedScenarios) {
    const linePoints = chartCashflowSeries(scenario)
      .map((point) => `${x(point.year)},${y(point.cumulative_profit_yen)}`)
      .join(" ");
    fragment.append(createSvgElement("polyline", {
      points: linePoints,
      class: `cashflow-chart__line cashflow-chart__line--${scenario.scenario} ${scenario.scenario === selectedScenario.scenario ? "is-selected" : "is-muted"}`
    }));
  }

  for (const year of [0, 10, 20, 30]) {
    const point = selectedSeries.find((item) => item.year === year);
    const yearLabel = createSvgElement("text", {
      x: x(year),
      y: height - 12,
      "text-anchor": "middle",
      class: "cashflow-chart__label"
    });
    yearLabel.textContent = `${year}年`;
    fragment.append(yearLabel);
  }

  for (const point of cashflowMarkers(selectedScenario)) {
    fragment.append(createSvgElement('circle', { cx: x(point.year), cy: y(point.value), r: point.costs.length ? 4 : 5, class: point.costs.length ? 'cashflow-chart__lifecycle-cost' : 'cashflow-chart__dot' }));
    const lines = point.costs.length
      ? [point.year + '年目・費用発生', ...point.costs.map(cost => cost.label + '：' + formatYen(cost.amount))]
      : [point.year + '年目・累積損益', formatSignedYen(point.value)];
    if (point.year === 30 && point.costs.length) lines.push('30年目末の累積損益：' + formatSignedYen(point.value));
    markerTargets.push({ x: x(point.year), y: y(point.value), lines });
  }

  for (const scenario of availableScenarios) {
    const chartSeries = chartCashflowSeries(scenario);
    const intersections = zeroIntersections(chartSeries);
    const finalRecovery = paybackIntersection(chartSeries);
    if (!finalRecovery) continue;
    const selected = scenario.scenario === selectedScenario.scenario;
    const displayedIntersections = selected ? intersections : [finalRecovery];
    for (const intersection of displayedIntersections) {
      const isFinalRecovery = intersection.direction === "up"
        && Math.abs(intersection.year - finalRecovery.year) < 0.000001;
      const highlighted = selected && isFinalRecovery;
      markerTargets.push({ x: x(intersection.year), y: y(0), lines: [labels[scenario.scenario] + '・損益ゼロの交点（約' + Number(intersection.year.toFixed(1)) + '年）', '累積損益：0円'] });
      fragment.append(createSvgElement("circle", {
        cx: x(intersection.year),
        cy: y(0),
        r: highlighted ? 9 : isFinalRecovery ? 5 : 4,
        class: `cashflow-chart__payback cashflow-chart__payback--${scenario.scenario} ${highlighted ? "is-selected" : "is-secondary"}`
      }));
    }
  }

  for (const target of groupMarkerTargets(markerTargets)) {
    const marker = createSvgElement('g', { class: 'cashflow-marker-target', tabindex: 0, role: 'button', 'aria-label': target.lines.join('，'), 'aria-controls': 'cashflow-detail', 'aria-expanded': 'false' });
    for (const point of target.points) marker.append(createSvgElement('circle', { cx: point.x, cy: point.y, r: 12 }));
    const show = mode => showCashflowDetail(marker, target.lines, mode);
    marker.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') show('hover'); });
    marker.addEventListener('pointerleave', scheduleChartHoverClose);
    marker.addEventListener('focus', () => show('focus'));
    marker.addEventListener('click', () => show('fixed'));
    marker.addEventListener('keydown', event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); show('fixed'); } });
    fragment.append(marker);
  }
  elements.cashflowChart.replaceChildren(fragment);
  endpointLabel.setAttribute('x', compactChart ? x(30) : x(30) + 16);
  endpointLabel.setAttribute('y', compactChart ? chartLayout.labelTop : y(endpoint.value) + 5);
  if (compactChart) {
    endpointLabel.setAttribute('text-anchor', 'end');
    const availableWidth = chartLayout.labelMaxWidth;
    if (labelWidth > availableWidth) {
      endpointLabel.setAttribute('textLength', availableWidth);
      endpointLabel.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    }
  }
  const endpointCaption = createSvgElement('text', { x: endpointLabel.getAttribute('x'), y: Number(endpointLabel.getAttribute('y')) - 19, class: 'cashflow-endpoint-caption', 'text-anchor': compactChart ? 'end' : 'start' });
  endpointCaption.textContent = '30年間の収支';
  elements.cashflowChart.append(endpointCaption, endpointLabel);
  for (const legendItem of document.querySelectorAll("[data-legend-scenario]")) {
    legendItem.classList.toggle(
      "is-selected",
      legendItem.dataset.legendScenario === selectedScenario.scenario
    );
  }
  const paybackDescriptions = availableScenarios.map((scenario) => (
    `${labels[scenario.scenario]}は${scenario.payback_year === null ? "30年以内の回収なし" : `約${scenario.payback_year}年で回収`}`
  ));
  const batteryReplacementDescription = equipmentPackage === "solar_plus_standard_battery"
    ? "標準蓄電池は30年間交換せず使用する前提です．"
    : "";
  elements.cashflowDescription.textContent = `3シナリオの累積損益を表示しています．5年ごとの定期点検費と20年目のパワーコンディショナー交換費による減少も反映しています．${batteryReplacementDescription}${paybackDescriptions.join("，")}．選択中の${labels[selectedScenario.scenario]}は30年後${formatProfit(selectedScenario.profit_yen)}です．`;
}

function renderResult(result, options = {}) {
  latestResult = result;

  const selectedScenario = result.scenarios.find(
    (scenario) => scenario.scenario === selectedScenarioId
  ) ?? result.scenarios.find((scenario) => scenario.scenario === "standard");
  if (!selectedScenario) {
    throw new Error("選択したシナリオの計算結果がありません．");
  }

  selectedScenarioId = selectedScenario.scenario;
  document.querySelector('[data-chart-recovery]').textContent = '回収の目安：' + scenarioRecoveryPresentation(selectedScenario).replace(/年で回収$/, '年');
  const orientation = result.input.detail_conditions?.find(
    (item) => item.input_name === "roof_orientation"
  );
  if (orientation) {
    elements.roofOrientation.value = orientation.value;
  }
  selectDaytimeOccupancy(result.input.daytime_occupancy?.value);
  selectEquipmentPackage(result.input.equipment_package);
  if (result.input.equipment_package === frontendData.publicData.calculation.battery_capacity_input.applicable_equipment_package) {
    setBatteryCapacityValue(result.input.battery_capacity_kwh);
  }
  updateDetailConditionSummary(result);
  const profitConfirmed = Number.isFinite(selectedScenario.profit_yen);
  const subsidyReference = result.scenarios.find(item => item.scenario === 'standard');
  if (!subsidyReference) throw new Error('補助金の基準結果を確認できません．');
  const shortBreakdown = conclusionBreakdown(selectedScenario);
  elements.resultSubsidyNote.textContent = compactYen(shortBreakdown.subsidy);
  elements.resultSubsidyNote.classList.toggle("is-positive", shortBreakdown.subsidy > 0);
  document.querySelector('[data-conclusion-income]').textContent = compactYen(shortBreakdown.income);
  document.querySelector('[data-conclusion-cost]').textContent = compactYen(shortBreakdown.cost);
  const levelAmounts = subsidyLevelAmounts(subsidyReference.subsidy_breakdown);
  const levelList = document.querySelector('[data-subsidy-level-amounts]');
  levelList.replaceChildren();
  for (const row of levelAmounts) {
    const entry=document.createElement('div'); const term=document.createElement('dt'); const amount=document.createElement('dd');
    term.textContent=row.label; amount.textContent=row.statusText ?? (Number.isFinite(row.amount) ? formatYen(row.amount) : '未確定');
    entry.append(term,amount); levelList.append(entry);
  }
  document.querySelector("[data-subsidy-breakdown-button]").setAttribute("aria-label", "補助金の内訳");
  document.querySelector("[data-subsidy-breakdown-button]").textContent = "補助金の内訳";
  document.querySelector("[data-subsidy-reason-reference]").setAttribute("aria-label", "補助金の内訳");


  const totals = financialTotals(selectedScenario);
  renderCashflowAmount(document.querySelector('[data-income-total]'), totals.income, 'income');
  renderCashflowAmount(document.querySelector('[data-expense-total]'), totals.cost, 'cost');
  renderBreakdownAmount(elements.resultSolarCost, selectedScenario.solar_installation_cost_yen);
  renderCashflowAmount(elements.resultSelfConsumption, selectedScenario.total_electricity_savings_yen, "income");
  renderCashflowAmount(elements.resultSalesIncome, selectedScenario.total_sales_income_yen, "income");
  renderBreakdownAmount(elements.resultSubsidy, selectedScenario.subsidy_yen, "income");
  renderBreakdownAmount(elements.resultMaintenanceCost, selectedScenario.total_maintenance_cost_yen);
  renderBreakdownAmount(elements.resultPowerConditionerCost, selectedScenario.total_replacement_cost_yen);
  const batterySelected = result.input.equipment_package === "solar_plus_standard_battery";
  renderCashflowAmount(elements.resultProfit, selectedScenario.profit_yen);
  const routes = energyRoutes(result.energy);
  for (const [element,key] of [[elements.resultGeneration,'generation'],[elements.resultConsumption,'consumed'],[elements.resultDirectSelfConsumed,'direct'],[elements.resultBatteryDelivered,'delivered'],[elements.resultBatteryLoss,'loss'],[elements.resultPurchased,'purchased'],[elements.resultExported,'exported'],[document.querySelector('[data-energy-charge]'),'charge'],[document.querySelector('[data-energy-stored]'),'stored'],[document.querySelector('[data-energy-purchased-use]'),'purchased']]) {
    const value = routes[key];
    if (!Number.isFinite(value)) element.textContent = '未確定';
    else {
      const amount = Object.assign(document.createElement('span'), { className: 'energy-quantity', textContent: yenFormatter.format(Math.round(value)) });
      const unit = Object.assign(document.createElement('span'), { className: 'energy-unit', textContent: 'kWh／年' });
      element.replaceChildren(amount, document.createTextNode(' '), unit);
    }
  }
  elements.resultSelfConsumptionRate.textContent = formatEnergyRate(result.energy.self_consumption_rate);
  elements.resultSelfSufficiencyRate.textContent = formatEnergyRate(result.energy.self_sufficiency_rate);
  const energyPresentation = energyBreakdownPresentation(result.input.equipment_package);
  for (const row of document.querySelectorAll("[data-battery-only]")) row.hidden = !energyPresentation.battery;
  document.querySelector("[data-energy-equation]").textContent = energyPresentation.equation;
  document.querySelector("[data-energy-equation]").hidden = !energyPresentation.equation;
  document.querySelector(energyPresentation.battery ? "[data-battery-ratio-slot]" : "[data-solar-ratio-slot]").append(document.querySelector("[data-self-consumption-ratio]"));
  document.querySelector("[data-direct-energy-label]").textContent = energyPresentation.battery ? "家庭で直接使用" : "家庭で使用（自家消費）";
  document.querySelector("[data-sufficiency-definition]").textContent = energyPresentation.sufficiency;
  if (batterySelected) {
    renderBreakdownAmount(elements.resultBatteryCost, selectedScenario.battery_installation_cost_yen);
  } else {
    renderCashflowAmount(elements.resultBatteryCost, 0);
    elements.resultBatteryCost.textContent = "対象外";
  }
  elements.capacityOutput.textContent = formatCapacity(result.input.system_capacity_kw);
  elements.capacityStatus.textContent = "";
  updateEquipmentSummary();
  renderMunicipalSubsidy(result, subsidyReference);
  renderBatteryYearly(result);
  renderScenarios(result.scenarios, result.input);
  renderCashflow(result.scenarios, selectedScenario, result.input.equipment_package);
  collapseCalculator(result, options.keepEditor === true);
  updateMobileConditionsSummary(result);
  elements.result.hidden = false;
  document.querySelector("#diagnosis-empty").hidden = true;
  syncInitialPrefectureHint();
  document.body.classList.add("has-analysis-result");
  if (options.scroll !== false) {
    elements.result.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (options.focus !== false) {
    elements.resultTitle.focus({ preventScroll: true });
  }
  if (profitConfirmed) recordDiagnosisComplete();
}

async function initialize() {
  try {
    frontendData = await loadFrontendData();
    configureHousingInput(elements.housingAge, housingDisplayContract());
    populatePrefectures(frontendData.publicData.prefectures);
    populateRoofOrientations(frontendData.publicData.calculation.detail_inputs ?? []);
    populateDaytimeOccupancy(frontendData.publicData.calculation.daytime_occupancy);
    configureBatteryCapacityInput(frontendData.publicData.calculation.battery_capacity_input);
    elements.dataStatus.textContent = "";

    updateAvailability();
    const scenarioFromUrl = new URL(window.location.href).searchParams.get("scenario");
    if (["downside", "standard", "upside"].includes(scenarioFromUrl)) selectedScenarioId = scenarioFromUrl;
    document.querySelector("#scenario-select").value = selectedScenarioId;
    const initialInput = inputFromLocation();
    elements.monthlyElectricityBill.value = initialInput.monthlyElectricityBillYen ?? "";
    housingAgeSelection = initialInput.housingAge;
    elements.housingAge.value = housingInput(housingAgeSelection).value;
    batteryDegradationSelection = initialInput.batteryDegradationScenario;
    const defaultCapacity = frontendData.publicData.calculation.system_capacity_kw;
    initialInput.systemCapacityKw = normalizeCapacity(initialInput.systemCapacityKw, defaultCapacity);
    initialInput.daytimeOccupancy = normalizeDaytimeOccupancy(
      initialInput.daytimeOccupancy,
      frontendData.publicData.calculation.daytime_occupancy
    );
    initialInput.equipmentPackage = normalizeEquipmentPackage(
      initialInput.equipmentPackage,
      frontendData.publicData.calculation
    );
    if (initialInput.equipmentPackage === "solar_only") batteryDegradationSelection = null;
    if (initialInput.equipmentPackage === frontendData.publicData.calculation.battery_capacity_input.applicable_equipment_package) {
      setBatteryCapacityValue(
        initialInput.batteryCapacityKwh ?? frontendData.publicData.calculation.battery_capacity_input.default
      );
    }
    elements.capacitySlider.value = String(initialInput.systemCapacityKw);
    selectDaytimeOccupancy(initialInput.daytimeOccupancy);
    selectEquipmentPackage(initialInput.equipmentPackage);
    elements.capacityOutput.textContent = formatCapacity(initialInput.systemCapacityKw);
    updateEquipmentSummary();
    if (initialInput.detailConditions?.roof_orientation) {
      elements.roofOrientation.value = initialInput.detailConditions.roof_orientation;
    }
    updateCurrentHousingSummary();
    if (initialInput.prefectureCode) {
      elements.prefecture.value = initialInput.prefectureCode;
      updateMunicipalities(initialInput.municipalityCode);
      elements.monthlyElectricityBill.value = initialInput.monthlyElectricityBillYen ?? "";
      validateLocation(initialInput, frontendData.publicData);
      renderResult(calculateEstimate(initialInput, frontendData.publicData), { focus: false, scroll: false });
      openSubsidyHash();
    }
  } catch (error) {
    elements.formMessage.textContent = error instanceof Error ? error.message : "公開データを確認できませんでした．";
    recoverInvalidDegradationSelection();
    elements.result.hidden = true;
  } finally {
    syncInitialPrefectureHint();
    if (!latestResult && !elements.prefecture.value && !prefectureInteractionStarted) {
      playPrefectureIntro();
    }
  }
}

let prefectureInteractionStarted = false;
function playPrefectureIntro() {
  if (latestResult || elements.prefecture.value || elements.prefecture.classList.contains('prefecture-intro-pulse')) return;
  elements.prefecture.classList.add('prefecture-intro-pulse');
}
document.querySelector('.diagnosis-empty__replay').addEventListener('click', playPrefectureIntro);
function stopPrefectureIntro() {
  prefectureInteractionStarted = true;
  elements.prefecture.classList.remove('prefecture-intro-pulse');
}
function syncInitialPrefectureHint() {
  const initial = !latestResult && !elements.prefecture.value;
  elements.prefecture.classList.toggle('prefecture-intro', initial);
  document.querySelector('[data-diagnosis-start-hint]').hidden = !initial;
  if (!initial) stopPrefectureIntro();
}
for (const eventName of ['focus', 'pointerdown', 'keydown']) {
  elements.prefecture.addEventListener(eventName, stopPrefectureIntro);
}
elements.prefecture.addEventListener('animationend', stopPrefectureIntro);

let liveTimer;
let lastErrorControl;
function markPreviousResult() {
  if (!latestResult) return;
  const note = document.querySelector('[data-previous-result-note]');
  note.textContent = '変更前の結果（' + [...formatBasicConditions(latestResult), '新築・既存：' + housingLabel(latestResult.input.housing_age, housingDisplayContract()), ...latestResult.input.detail_conditions.map(item => item.label), '平日昼間の在宅状況：' + latestResult.input.daytime_occupancy.label, 'シナリオ：' + ({downside:'下振れ',standard:'標準',upside:'上振れ'}[selectedScenarioId])].join('／') + '）';
  note.hidden = false;
}
function clearLiveError() {
  elements.formMessage.textContent = '';
  equipmentMessage.textContent = '';
  document.querySelector('#electricity-bill-error').textContent = '';
  lastErrorControl?.removeAttribute('aria-invalid');
  lastErrorControl = null;
}
function applyLiveConditions() {
  clearTimeout(liveTimer);
  if (!frontendData || !CALCULATION_IMPLEMENTED) return false;
  if (!latestResult && !elements.prefecture.value) return false;
  clearLiveError();
  try {
    const input = readInput();
    const result = calculateEstimate(input, frontendData.publicData);
    selectedScenarioId = document.querySelector('#scenario-select').value;
    renderResult(result, { focus: false, scroll: false, resetDisclosures: false, keepEditor: true });
    writeInputToLocation(input);
    document.querySelector('[data-previous-result-note]').hidden = true;
    return true;
  } catch (error) {
    markPreviousResult();
    const message = error instanceof Error ? error.message : '再計算できませんでした．';
    const control = error.control ?? (!elements.prefecture.value ? elements.prefecture : null);
    if (control) { control.setAttribute('aria-invalid', 'true'); lastErrorControl = control; }
    if (control === elements.monthlyElectricityBill) document.querySelector('#electricity-bill-error').textContent = message;
    else if (!equipmentEditor.hidden && elements.calculatorExpanded.hidden) equipmentMessage.textContent = message;
    else elements.formMessage.textContent = message;
    return false;
  }
}
function scheduleLiveConditions(delay = 0) {
  if (!frontendData) return;
  clearTimeout(liveTimer);
  markPreviousResult();
  if (delay) liveTimer = setTimeout(applyLiveConditions, delay);
  else applyLiveConditions();
}
elements.form.addEventListener('submit', event => { event.preventDefault(); applyLiveConditions(); });
elements.changeConditionsButton.addEventListener('click', () => {
  if (elements.calculatorExpanded.hidden) expandCalculator();
  else if (!latestResult) return;
  else if (applyLiveConditions()) collapseCalculator(latestResult);
});
elements.prefecture.addEventListener('change', () => { stopPrefectureIntro(); syncInitialPrefectureHint(); updateMunicipalities(); scheduleLiveConditions(); });
elements.municipality.addEventListener('change', () => { elements.municipalityHelp.hidden = true; scheduleLiveConditions(); });
elements.monthlyElectricityBill.addEventListener('input', () => scheduleLiveConditions(350));
elements.monthlyElectricityBill.addEventListener('change', () => scheduleLiveConditions());
elements.monthlyElectricityBill.addEventListener('keydown', event => {
  if (event.key === 'Enter') { event.preventDefault(); applyLiveConditions(); }
});
elements.housingAge.addEventListener('change', () => { housingAgeSelection = elements.housingAge.value; scheduleLiveConditions(); });
elements.roofOrientation.addEventListener('change', () => scheduleLiveConditions());
elements.daytimeOccupancyOptions.addEventListener('change', () => scheduleLiveConditions());
elements.equipmentOptions.addEventListener('change', () => { selectEquipmentPackage(elements.equipmentOptions.value); scheduleLiveConditions(); });
elements.batteryDegradationSelect.addEventListener('change', () => { batteryDegradationSelection = elements.batteryDegradationSelect.value; scheduleLiveConditions(); });
for (const slider of [elements.capacitySlider, elements.batteryCapacitySlider]) {
  slider.addEventListener('input', () => {
    if (slider === elements.capacitySlider) elements.capacityOutput.textContent = formatCapacity(slider.value);
    else setBatteryCapacityValue(slider.value);
    scheduleLiveConditions(150);
  });
  slider.addEventListener('change', () => scheduleLiveConditions());
}
document.querySelector('#scenario-select').addEventListener('change', () => scheduleLiveConditions());

initialize();

// Reproject existing results when a chart becomes visible or its container changes width.
const chartWidths = new WeakMap();
const chartResizeObserver = new ResizeObserver((entries) => {
  for (const { target, contentRect } of entries) {
    const width = Math.round(contentRect.width);
    if (!latestResult || width <= 0 || chartWidths.get(target) === width) continue;
    chartWidths.set(target, width);
    if (target === elements.batteryCapacityChart) {
      renderBatteryYearly(latestResult);
    } else {
      const scenario = latestResult.scenarios.find((item) => item.scenario === selectedScenarioId);
      if (scenario) renderCashflow(latestResult.scenarios, scenario, latestResult.input.equipment_package);
    }
  }
});
chartResizeObserver.observe(elements.cashflowChart);
chartResizeObserver.observe(elements.batteryCapacityChart);

const subsidyDisclosure = document.querySelector('#subsidy-disclosure');
const subsidyInfoButton = document.querySelector('[data-subsidy-breakdown-button]');
const syncSubsidyExpanded = () => subsidyInfoButton.setAttribute('aria-expanded', String(subsidyDisclosure.open));
syncSubsidyExpanded();
subsidyDisclosure.addEventListener('toggle', syncSubsidyExpanded);
function openSubsidyTarget(target) {
  if (!target || !subsidyDisclosure.contains(target)) return;
  subsidyDisclosure.open = true;
  if (target.tagName === 'SUMMARY') target.parentElement.open = true;
  for (let parent = target.parentElement; parent && parent !== subsidyDisclosure; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
  syncSubsidyExpanded();
  target.focus({ preventScroll: true });
  target.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
function openSubsidyReason() { openSubsidyTarget(document.getElementById('subsidy-breakdown-item')); }
function openSubsidyHash() {
  if (elements.result.hidden) return;
  let id;
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
  openSubsidyTarget(document.getElementById(id));
}
subsidyInfoButton.addEventListener('click', openSubsidyReason);
document.querySelector('[data-subsidy-reason-reference]').addEventListener('click', event => { event.preventDefault(); openSubsidyReason(); });
window.addEventListener('hashchange', openSubsidyHash);

const detailConditions = document.querySelector('.advanced-panel--conditions');
detailConditions.addEventListener('change', updateCurrentHousingSummary);
const housingEditButton = document.querySelector('[data-edit-housing]');
const housingEditor = document.querySelector('#housing-conditions-editor');
function setConditionButton(button, name, editing) {
  button.textContent = editing ? '閉じる' : '変更';
  button.setAttribute('aria-expanded', String(editing));
  button.setAttribute('aria-label', name + 'を' + (editing ? '閉じる' : '変更'));
}
housingEditButton.addEventListener('click', () => {
  const editing = housingEditor.hidden;
  if (!editing && latestResult && !applyLiveConditions()) return;
  housingEditor.hidden = !editing;
  elements.detailConditionSummary.hidden = editing;
  setConditionButton(housingEditButton, '住宅・生活条件', editing);
});

setupMobileActions();
