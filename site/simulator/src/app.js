import { CALCULATION_IMPLEMENTED, calculateEstimate } from "./calculator.js";
import { loadFrontendData } from "../../../data/src/data-loader.js";
import { decisionAmountParts } from "./result-presentation.js";

const elements = {
  form: document.querySelector("#estimate-form"),
  prefecture: document.querySelector("#prefecture"),
  municipalityField: document.querySelector("[data-municipality-field]"),
  municipality: document.querySelector("#municipality"),
  municipalityHelp: document.querySelector("#municipality-help"),
  monthlyElectricityBill: document.querySelector("#monthly-electricity-bill"),
  calculateButton: document.querySelector("#calculate-button"),
  calculateLabel: document.querySelector("[data-calculate-label]"),
  formMessage: document.querySelector("#form-message"),
  calculator: document.querySelector(".calculator"),
  calculatorExpanded: document.querySelector("[data-calculator-expanded]"),
  calculatorCollapsed: document.querySelector("[data-calculator-collapsed]"),
  conditionSummary: document.querySelector("[data-condition-summary]"),
  changeConditionsButton: document.querySelector("[data-change-conditions]"),
  cancelConditionsButton: document.querySelector("[data-cancel-conditions]"),
  roofOrientation: document.querySelector("#roof-orientation"),
  daytimeOccupancyOptions: document.querySelector("[data-daytime-occupancy-options]"),
  equipmentOptions: document.querySelector(".equipment-choice__options"),
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
  resultSummary: document.querySelector("[data-result-summary]"),
  resultEconomicBenefit: document.querySelector("[data-result-economic-benefit]"),
  resultPayback: document.querySelector("[data-result-payback]"),
  resultPeriod: document.querySelector("[data-result-period]"),
  resultGrossCost: document.querySelector("[data-result-gross-cost]"),
  resultSolarCost: document.querySelector("[data-result-solar-cost]"),
  resultInitialCost: document.querySelector("[data-result-initial-cost]"),
  resultSelfConsumption: document.querySelector("[data-result-self-consumption]"),
  resultSalesIncome: document.querySelector("[data-result-sales-income]"),
  resultSubsidy: document.querySelector("[data-result-subsidy]"),
  resultSubsidySource: document.querySelector("[data-result-subsidy-source]"),
  resultMaintenanceCost: document.querySelector("[data-result-maintenance-cost]"),
  resultPowerConditionerCost: document.querySelector("[data-result-power-conditioner-cost]"),
  resultLifecycleCost: document.querySelector("[data-result-lifecycle-cost]"),
  resultLifecycleStatus: document.querySelector("[data-result-lifecycle-status]"),
  resultProfit: document.querySelector("[data-result-profit]"),
  resultGeneration: document.querySelector("[data-result-generation]"),
  resultConsumption: document.querySelector("[data-result-consumption]"),
  resultSelfConsumptionRate: document.querySelector("[data-result-self-consumption-rate]"),
  resultSelfSufficiencyRate: document.querySelector("[data-result-self-sufficiency-rate]"),
  resultSelfConsumed: document.querySelector("[data-result-self-consumed]"),
  resultDirectSelfConsumed: document.querySelector("[data-result-direct-self-consumed]"),
  resultBatteryDelivered: document.querySelector("[data-result-battery-delivered]"),
  resultBatteryLoss: document.querySelector("[data-result-battery-loss]"),
  resultPurchased: document.querySelector("[data-result-purchased]"),
  resultExported: document.querySelector("[data-result-exported]"),
  scenarioList: document.querySelector("[data-scenario-list]"),
  municipalSubsidyTitle: document.querySelector("[data-municipal-subsidy-title]"),
  municipalSubsidySummary: document.querySelector("[data-municipal-subsidy-summary]"),
  municipalIncluded: document.querySelector("[data-municipal-included]"),
  municipalIncludedList: document.querySelector("[data-municipal-included-list]"),
  municipalScenarioUnreflected: document.querySelector("[data-municipal-scenario-unreflected]"),
  municipalScenarioUnreflectedList: document.querySelector("[data-municipal-scenario-unreflected-list]"),
  municipalCandidates: document.querySelector("[data-municipal-candidates]"),
  municipalCandidateList: document.querySelector("[data-municipal-candidate-list]"),
  municipalExcluded: document.querySelector("[data-municipal-excluded]"),
  municipalExcludedList: document.querySelector("[data-municipal-excluded-list]"),
  resultBatteryCost: document.querySelector("[data-result-battery-cost]"),
  batteryYearly: document.querySelector("[data-battery-yearly]"),
  batteryCapacityChart: document.querySelector("[data-battery-capacity-chart]"),
  batteryCapacityDescription: document.querySelector("[data-battery-capacity-description]"),
  batteryCapacityInitial: document.querySelector("[data-battery-capacity-initial]"),
  batteryCapacityYear1: document.querySelector("[data-battery-capacity-year1]"),
  batteryCapacityYear10: document.querySelector("[data-battery-capacity-year10]"),
  batteryCapacityYear20: document.querySelector("[data-battery-capacity-year20]"),
  lossGuidance: document.querySelector("[data-loss-guidance]"),
  capacitySlider: document.querySelector("#system-capacity"),
  capacityOutput: document.querySelector("[data-capacity-output]"),
  capacityGeneration: document.querySelector("[data-capacity-generation]"),
  capacityRevenue: document.querySelector("[data-capacity-revenue]"),
  capacityCost: document.querySelector("[data-capacity-cost]"),
  capacityStatus: document.querySelector("[data-capacity-status]"),
  cashflowChart: document.querySelector("[data-cashflow-chart]"),
  cashflowDescription: document.querySelector("[data-cashflow-description]"),
  cashflowEndpoint: document.querySelector("[data-cashflow-endpoint]"),
  cashflowScenario: document.querySelector("[data-cashflow-scenario]"),
  resultDisclosures: document.querySelectorAll("[data-result-disclosure]")
};

let frontendData = null;
let latestResult = null;
let selectedScenarioId = "standard";

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

function setMunicipalityPlaceholder(text) {
  const option = document.createElement("option");
  option.value = "";
  option.textContent = text;
  elements.municipality.replaceChildren(option);
}

function updateMunicipalities(preferredCode = null) {
  setMunicipalityPlaceholder("都道府県を選択してください");
  elements.municipality.disabled = true;
  elements.municipalityField.hidden = !elements.prefecture.value;
  if (!elements.prefecture.value || !frontendData) {
    elements.municipalityHelp.textContent = "都道府県を選ぶと，対応する市区町村を確認できます．";
    return null;
  }

  const municipalities = (frontendData.publicData.municipalities ?? []).filter(
    (item) => item.prefecture_code === elements.prefecture.value
  );
  elements.municipalityField.hidden = false;
  if (!municipalities.length) {
    setMunicipalityPlaceholder("市区町村データは未収集です");
    elements.municipalityHelp.textContent = "市区町村の補助金が0円という意味ではありません．市区町村を選択せず診断できます．";
    return null;
  }

  setMunicipalityPlaceholder("選択しない");
  const fragment = document.createDocumentFragment();
  for (const municipality of municipalities) {
    const option = document.createElement("option");
    option.value = municipality.municipality_code;
    option.textContent = municipality.municipality_name;
    fragment.append(option);
  }
  elements.municipality.append(fragment);
  elements.municipality.disabled = false;
  elements.municipalityHelp.textContent = "選ぶと市区町村の補助金情報を確認できます．選択しなくても診断できます．";
  if (municipalities.some((item) => item.municipality_code === preferredCode)) {
    elements.municipality.value = preferredCode;
    return preferredCode;
  }
  return null;
}

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
  return elements.equipmentOptions.querySelector('input[name="equipment_package"]:checked')?.value ?? null;
}

function selectEquipmentPackage(value) {
  const option = elements.equipmentOptions.querySelector(`input[value="${value}"]`);
  if (option) option.checked = true;
  for (const label of elements.equipmentOptions.querySelectorAll(".equipment-choice__option")) {
    label.classList.toggle("is-selected", label.querySelector("input")?.checked === true);
  }
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
    prefectureCode: elements.prefecture.value,
    municipalityCode: elements.municipality.disabled || !elements.municipality.value
      ? null
      : elements.municipality.value,
    monthlyElectricityBillYen: monthlyElectricityBill === "" ? null : Number(monthlyElectricityBill),
    systemCapacityKw: Number(elements.capacitySlider.value),
    equipmentPackage: selectedEquipmentPackage(),
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
    prefectureCode,
    municipalityCode,
    monthlyElectricityBillYen: monthlyBill === null || monthlyBill === "" ? null : Number(monthlyBill),
    systemCapacityKw: capacity === null || capacity === "" ? null : Number(capacity),
    equipmentPackage,
    batteryCapacityKwh: batteryCapacity === null || batteryCapacity === "" ? null : Number(batteryCapacity),
    daytimeOccupancy,
    detailConditions: roofOrientation ? { roof_orientation: roofOrientation } : undefined
  };
}

function writeInputToLocation(input) {
  const target = new URL(window.location.href);
  target.search = "";
  target.searchParams.set("prefecture", input.prefectureCode);
  if (input.municipalityCode) {
    target.searchParams.set("municipality_code", input.municipalityCode);
  }
  if (input.monthlyElectricityBillYen !== null) {
    target.searchParams.set("monthlyElectricityBill", String(input.monthlyElectricityBillYen));
  }
  target.searchParams.set("systemCapacityKw", String(input.systemCapacityKw));
  target.searchParams.set("equipment_package", input.equipmentPackage);
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
  target.searchParams.set("from", "analysis");
  window.history.replaceState(null, "", target);
}

const yenFormatter = new Intl.NumberFormat("ja-JP");

function formatYen(value) {
  return `${yenFormatter.format(value)}円`;
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
  return `${sign}${yenFormatter.format(Math.abs(value))}円`;
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

function renderBreakdownAmount(element, value) {
  element.textContent = Number.isFinite(value) ? formatYen(value) : "未確認";
  for (const name of ["positive", "negative", "neutral"]) {
    element.classList.remove(`cashflow-amount--${name}`);
  }
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
  return `${value < 0 ? "−" : ""}${yenFormatter.format(Math.round(absolute))}円`;
}

function formatBasicConditions(result) {
  const bill = result.input.used_default_monthly_electricity_bill
    ? `戸建て・4人以上世帯の地域平均（令和5年度） 月額${formatYen(result.input.monthly_electricity_bill_yen)}`
    : `月額${formatYen(result.input.monthly_electricity_bill_yen)}`;
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
  return `${location}・${bill}・${equipment}・太陽光 ${solarCapacity}${batteryCapacity}`;
}

function updateDetailConditionSummary(result) {
  const orientation = result.input.detail_conditions?.find(
    (item) => item.input_name === "roof_orientation"
  );
  const summary = [
    orientation ? `方角：${orientation.label}` : null,
    result.input.daytime_occupancy ? `日中在宅：${result.input.daytime_occupancy.label}` : null
  ].filter(Boolean);
  elements.detailConditionSummary.textContent = summary.join("・");
}

function collapseCalculator(result) {
  elements.conditionSummary.textContent = formatBasicConditions(result);
  elements.calculatorExpanded.hidden = true;
  elements.calculatorCollapsed.hidden = false;
  elements.calculator.classList.add("calculator--collapsed");
}

function expandCalculator() {
  elements.calculatorCollapsed.hidden = true;
  elements.calculatorExpanded.hidden = false;
  elements.calculator.classList.remove("calculator--collapsed");
  elements.cancelConditionsButton.hidden = latestResult === null;
  elements.calculateLabel.textContent = latestResult === null
    ? "分析結果を表示する"
    : "この条件で再計算する";
  elements.calculator.scrollIntoView({ behavior: "smooth", block: "start" });
  elements.prefecture.focus({ preventScroll: true });
}

function cancelConditionChanges() {
  if (!latestResult) {
    return;
  }
  elements.prefecture.value = latestResult.input.prefecture_code;
  updateMunicipalities(latestResult.input.municipality_code);
  elements.monthlyElectricityBill.value = latestResult.input.used_default_monthly_electricity_bill
    ? ""
    : String(latestResult.input.monthly_electricity_bill_yen);
  selectEquipmentPackage(latestResult.input.equipment_package);
  collapseCalculator(latestResult);
  elements.changeConditionsButton.focus({ preventScroll: true });
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

const SUBSIDY_SOURCE_FALLBACK_ID = "env-housing-decarbonization-navi-2026";
const OFFICIAL_SOURCE_CLASSES = new Set(["primary", "official_index"]);

function officialSubsidySource(result, scenario) {
  const prefecture = frontendData.publicData.prefectures.find(
    (item) => item.code === result.input.prefecture_code
  );
  const candidateIds = [
    ...(scenario.subsidy_source_ids ?? []),
    ...(prefecture?.subsidy_programs ?? []).map((program) => program.source_id),
    ...(prefecture?.subsidy_review_source_ids ?? []),
    SUBSIDY_SOURCE_FALLBACK_ID
  ];
  const sources = new Map(
    frontendData.metadata.sources.map((source) => [source.source_id, source])
  );
  return [...new Set(candidateIds)]
    .map((sourceId) => sources.get(sourceId))
    .find((source) => source?.source_url && OFFICIAL_SOURCE_CLASSES.has(source.source_class));
}

function bindSubsidySourceLink(element, source) {
  if (!source) {
    element.hidden = true;
    element.removeAttribute("href");
    return;
  }
  element.href = source.source_url;
  element.title = source.source_title;
  element.textContent = source.source_class === "official_index"
    ? "環境省の補助金検索で確認 ↗"
    : "補助金制度の公式情報を確認 ↗";
  element.hidden = false;
}

function renderScenarios(scenarios, input) {
  const labels = { downside: "下振れ", standard: "標準", upside: "上振れ" };
  const scenarioAssumptions = new Map(
    frontendData.publicData.scenarios.map((scenario) => [scenario.scenario, scenario])
  );
  elements.scenarioList.replaceChildren();
  for (const scenario of scenarios) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `scenario-card scenario-card--${scenario.scenario}`;
    item.dataset.scenario = scenario.scenario;
    item.setAttribute("aria-pressed", String(scenario.scenario === selectedScenarioId));
    const label = document.createElement("span");
    label.className = "scenario-card__label";
    label.textContent = labels[scenario.scenario];
    const amount = document.createElement("strong");
    amount.className = "scenario-card__amount";
    renderCashflowAmount(amount, scenario.profit_yen);
    const premise = document.createElement("small");
    premise.className = "scenario-card__premise";
    const growthRate = scenarioAssumptions.get(scenario.scenario)?.electricity_price_growth_rate ?? 0;
    const growthPercent = Number((growthRate * 100).toFixed(3));
    premise.textContent = `電気料金上昇 年${growthPercent}％`;
    item.append(label, amount, premise);
    elements.scenarioList.append(item);
  }
}

function appendProgramList(list, programs, statusText) {
  const fragment = document.createDocumentFragment();
  for (const program of programs) {
    const item = document.createElement("li");
    const heading = document.createElement("strong");
    if (program.official_url) {
      const link = document.createElement("a");
      link.href = program.official_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${program.program_name} ↗`;
      heading.append(link);
    } else {
      heading.textContent = program.program_name;
    }
    const note = document.createElement("p");
    note.textContent = typeof statusText === "function" ? statusText(program) : statusText;
    item.append(heading, note);
    const userConfirmations = (program.required_confirmations ?? []).filter(
      (confirmation) => !confirmation.includes("金額算定ルールを一意に確定できない")
        && !confirmation.includes("入力と対象設備が一致しない")
        && !confirmation.includes("現在の受付状態では算入しない")
    );
    if (userConfirmations.length) {
      const confirmations = document.createElement("ul");
      for (const confirmation of userConfirmations) {
        const confirmationItem = document.createElement("li");
        confirmationItem.textContent = confirmation;
        confirmations.append(confirmationItem);
      }
      item.append(confirmations);
    }
    fragment.append(item);
  }
  list.replaceChildren(fragment);
}

function renderMunicipalSubsidy(result, scenario) {
  const breakdown = scenario.subsidy_breakdown;
  const municipalIncluded = (breakdown?.included_programs ?? []).filter(
    (program) => program.government_level === "municipality"
  );
  const rawMunicipalCandidates = (breakdown?.candidate_programs ?? []).filter(
    (program) => program.government_level === "municipality"
  );
  const equipmentMismatch = (program) => (program.required_confirmations ?? []).some(
    (confirmation) => confirmation.includes("入力と対象設備が一致しない")
  );
  const municipalCandidates = rawMunicipalCandidates.filter((program) => !equipmentMismatch(program));
  const rawMunicipalExcluded = (breakdown?.excluded_programs ?? []).filter(
    (program) => program.government_level === "municipality"
  );
  const municipalExcluded = [
    ...rawMunicipalExcluded,
    ...rawMunicipalCandidates.filter(equipmentMismatch)
  ];
  const municipalScenarioUnreflected = scenario.scenario === "downside"
    ? [...new Map(
      result.scenarios
        .filter((item) => item.scenario !== "downside")
        .flatMap((item) => item.subsidy_breakdown?.included_programs ?? [])
        .filter((program) => program.government_level === "municipality")
        .map((program) => [program.id, program])
    ).values()]
    : [];
  const status = result.input.municipality_program_status ?? "not_requested";
  elements.municipalSubsidyTitle.textContent = result.input.municipality_name
    ? `${result.input.municipality_name}の制度確認`
    : "市区町村を選ぶと確認できます";
  const summaries = {
    not_requested: "市区町村を選択していないため，市区町村制度は判定していません．未選択は補助金0円を意味しません．",
    no_program: "収集済みの公式情報では，現在利用できる市区町村の補助金を確認できませんでした．",
    unconfirmed: "補助金額は未確認のため，今回は含めていません．市区町村・制度の公式情報で確認できます．",
    candidate: `補助金額は未確認のため，今回は含めていません．詳細は${result.input.municipality_name ?? "市区町村"}・該当制度で確認できます．`,
    included: "受付中，対象設備一致，金額算定可能の3条件を満たす制度を計算に反映しています．個別適格性は公式情報で確認してください．"
  };
  const scenarioAssumption = frontendData.publicData.scenarios.find(
    (item) => item.scenario === scenario.scenario
  );
  if (status === "included" && scenarioAssumption?.subsidy_included === false) {
    elements.municipalSubsidySummary.textContent = "利用できる制度がある場合でも，この下振れシナリオは「補助金を利用できない場合」として0円で計算しています．";
  } else if (municipalIncluded.length > 0) {
    elements.municipalSubsidySummary.textContent = summaries.included;
  } else if (municipalCandidates.length > 0) {
    elements.municipalSubsidySummary.textContent = summaries.candidate;
  } else if (rawMunicipalExcluded.some((program) => program.calculation_status === "excluded_closed")) {
    elements.municipalSubsidySummary.textContent = "確認した制度は受付終了または予算終了のため，今回は含めていません．";
  } else if (municipalExcluded.some(equipmentMismatch)) {
    elements.municipalSubsidySummary.textContent = "選択した設備構成と対象設備が一致しないため，今回は含めていません．";
  } else if (municipalExcluded.length > 0) {
    elements.municipalSubsidySummary.textContent = "確認した制度は適用条件と一致しないため，今回は含めていません．";
  } else {
    elements.municipalSubsidySummary.textContent = summaries[status] ?? summaries.unconfirmed;
  }

  elements.municipalIncluded.hidden = municipalIncluded.length === 0;
  appendProgramList(
    elements.municipalIncludedList,
    municipalIncluded,
    (program) => `${formatYen(program.amount_yen)}を計算に反映しています．契約前に個別適格性と最新の受付状況を確認してください．`
  );
  elements.municipalScenarioUnreflected.hidden = municipalScenarioUnreflected.length === 0;
  appendProgramList(
    elements.municipalScenarioUnreflectedList,
    municipalScenarioUnreflected,
    (program) => `${formatYen(program.amount_yen)}を算定できます．下振れシナリオでは，補助金を利用できない場合として計算へ反映していません．`
  );
  elements.municipalCandidates.hidden = municipalCandidates.length === 0;
  appendProgramList(
    elements.municipalCandidateList,
    municipalCandidates,
    "公式情報で利用条件を確認してください．"
  );
  elements.municipalExcluded.hidden = municipalExcluded.length === 0;
  const excludedLabels = {
    excluded_closed: "受付終了または予算終了のため，計算に反映していません．",
    excluded_incompatible: "現在のFIT売電を前提とする計算と両立しないため，計算に反映していません．",
    excluded_duplicate: "同じ給付目的の重複を避けるため，計算に反映していません．",
    candidate_missing_conditions: "選択した設備構成と対象設備が一致しないため，今回は含めていません．"
  };
  appendProgramList(
    elements.municipalExcludedList,
    municipalExcluded,
    (program) => excludedLabels[program.calculation_status] ?? "計算に反映していません．"
  );

  bindSubsidySourceLink(elements.resultSubsidySource, officialSubsidySource(result, scenario));
}

function renderBatteryYearly(result) {
  const batterySelected = result.input.equipment_package === "solar_plus_standard_battery";
  elements.batteryYearly.hidden = !batterySelected;
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
  const width = 720;
  const height = 260;
  const margin = { top: 20, right: 26, bottom: 44, left: 58 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (year) => margin.left + (year / 20) * plotWidth;
  const y = (capacity) => margin.top + (1 - capacity / nominalCapacity) * plotHeight;
  const chart = elements.batteryCapacityChart;
  chart.replaceChildren();
  chart.append(
    createSvgElement("line", { x1: margin.left, y1: margin.top, x2: margin.left, y2: height - margin.bottom, class: "battery-capacity-chart__axis" }),
    createSvgElement("line", { x1: margin.left, y1: height - margin.bottom, x2: width - margin.right, y2: height - margin.bottom, class: "battery-capacity-chart__axis" })
  );
  for (const year of [0, 10, 20]) {
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
  const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"}${x(point.year)} ${y(point.capacity)}`).join(" ");
  chart.append(createSvgElement("path", { d: pathData, class: "battery-capacity-chart__line" }));
  for (const point of points.filter(({ year }) => [0, 1, 10, 20].includes(year))) {
    chart.append(createSvgElement("circle", { cx: x(point.year), cy: y(point.capacity), r: 5, class: "battery-capacity-chart__point" }));
  }
  const capacities = new Map(points.map((point) => [point.year, point.capacity]));
  elements.batteryCapacityInitial.textContent = `${nominalCapacity.toFixed(2)} kWh`;
  elements.batteryCapacityYear1.textContent = `${capacities.get(1).toFixed(2)} kWh`;
  elements.batteryCapacityYear10.textContent = `${capacities.get(10).toFixed(2)} kWh`;
  elements.batteryCapacityYear20.textContent = `${capacities.get(20).toFixed(2)} kWh`;
  elements.batteryCapacityDescription.textContent = `導入時${nominalCapacity.toFixed(2)} kWh，初年度${capacities.get(1).toFixed(2)} kWh，10年後${capacities.get(10).toFixed(2)} kWh，20年後${capacities.get(20).toFixed(2)} kWhです．15年目末60％は保証下限に整合する保守的感度パスで，各年は年末容量をその年の計算に用います．16～20年は年率係数を継続した数学的外挿であり，一次資料の実測値・保証値ではありません．`;
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

function renderCashflow(scenarios, selectedScenario, equipmentPackage) {
  const availableScenarios = scenarios.filter((scenario) => annualCashflowSeries(scenario).length);
  if (!availableScenarios.length) {
    elements.cashflowChart.replaceChildren();
    elements.cashflowEndpoint.textContent = "20年後 補助金確認後に確定";
    elements.cashflowDescription.textContent = "補助金額が未確認のため，累積損益と回収時点は確定できません．";
    return;
  }

  const selectedSeries = annualCashflowSeries(selectedScenario);
  if (!selectedSeries.length) {
    elements.cashflowChart.replaceChildren();
    elements.cashflowScenario.textContent = "選択中のシナリオは補助金確認待ち";
    elements.cashflowEndpoint.textContent = "20年後 補助金確認後に確定";
    elements.cashflowDescription.textContent = "補助金額が未確認のため，選択中シナリオの累積損益と回収時点は確定できません．下振れシナリオでは補助金0円の結果を確認できます．";
    return;
  }

  const labels = { downside: "下振れ", standard: "標準", upside: "上振れ" };
  const width = 720;
  const height = 280;
  const padding = { top: 20, right: 24, bottom: 42, left: 76 };
  const values = availableScenarios.flatMap((scenario) => (
    chartCashflowSeries(scenario).map((point) => point.cumulative_profit_yen)
  ));
  const minimum = Math.min(0, ...values);
  const maximum = Math.max(0, ...values);
  const range = Math.max(maximum - minimum, 1);
  const x = (year) => padding.left + (year / 20) * (width - padding.left - padding.right);
  const y = (value) => padding.top + ((maximum - value) / range) * (height - padding.top - padding.bottom);
  const fragment = document.createDocumentFragment();

  for (const value of [...new Set([minimum, 0, maximum])]) {
    const line = createSvgElement("line", {
      x1: padding.left,
      x2: width - padding.right,
      y1: y(value),
      y2: y(value),
      class: value === 0 ? "cashflow-chart__zero" : "cashflow-chart__grid"
    });
    const label = createSvgElement("text", {
      x: padding.left - 12,
      y: y(value) + 6,
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
    points: `${x(0)},${y(0)} ${selectedLinePoints} ${x(20)},${y(0)}`,
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

  for (const year of [0, 5, 10, 15, 20]) {
    const point = selectedSeries.find((item) => item.year === year);
    fragment.append(createSvgElement("circle", {
      cx: x(year),
      cy: y(point.cumulative_profit_yen),
      r: 5,
      class: "cashflow-chart__dot"
    }));
    const yearLabel = createSvgElement("text", {
      x: x(year),
      y: height - 12,
      "text-anchor": "middle",
      class: "cashflow-chart__label"
    });
    yearLabel.textContent = `${year}年`;
    fragment.append(yearLabel);
  }

  for (const point of selectedSeries.filter((item) => item.maintenance_and_replacement_cost_yen > 0)) {
    fragment.append(createSvgElement("circle", {
      cx: x(point.year),
      cy: y(point.cumulative_profit_yen),
      r: 4,
      class: "cashflow-chart__lifecycle-cost"
    }));
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
      fragment.append(createSvgElement("circle", {
        cx: x(intersection.year),
        cy: y(0),
        r: highlighted ? 9 : isFinalRecovery ? 5 : 4,
        class: `cashflow-chart__payback cashflow-chart__payback--${scenario.scenario} ${highlighted ? "is-selected" : "is-secondary"}`
      }));
    }
  }

  elements.cashflowChart.replaceChildren(fragment);
  for (const legendItem of document.querySelectorAll("[data-legend-scenario]")) {
    legendItem.classList.toggle(
      "is-selected",
      legendItem.dataset.legendScenario === selectedScenario.scenario
    );
  }
  elements.cashflowScenario.textContent = `${labels[selectedScenario.scenario]}シナリオを選択中`;
  renderInlineCashflowAmount(elements.cashflowEndpoint, "20年後 ", selectedScenario.profit_yen);
  const paybackDescriptions = availableScenarios.map((scenario) => (
    `${labels[scenario.scenario]}は${scenario.payback_year === null ? "20年以内の回収なし" : `約${scenario.payback_year}年で回収`}`
  ));
  const batteryReplacementDescription = equipmentPackage === "solar_plus_standard_battery"
    ? "標準蓄電池は20年間交換せず使用する前提です．"
    : "";
  elements.cashflowDescription.textContent = `3シナリオの累積損益を表示しています．4年ごとの定期点検費と15年目のパワーコンディショナー交換費による減少も反映しています．${batteryReplacementDescription}${paybackDescriptions.join("，")}．選択中の${labels[selectedScenario.scenario]}は20年後${formatProfit(selectedScenario.profit_yen)}です．`;
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
  const profitable = profitConfirmed && selectedScenario.profit_yen > 0;
  const breakEven = profitConfirmed && selectedScenario.profit_yen === 0;
  if (!profitConfirmed) {
    elements.resultSummary.textContent = `${result.input.prefecture_name}では，補助金確認後に収支が確定します`;
  } else if (profitable) {
    renderBrandOutcome(elements.resultSummary, `${result.input.prefecture_name}では，`, "トク", "になる見込みです", false);
  } else if (breakEven) {
    elements.resultSummary.textContent = `${result.input.prefecture_name}では，収支が同額になる見込みです`;
  } else {
    elements.resultSummary.textContent = `${result.input.prefecture_name}では，損になる見込みです`;
  }
  const decisionAmount = decisionAmountParts(selectedScenario.profit_yen);
  renderBrandOutcome(elements.resultEconomicBenefit, decisionAmount.amount, decisionAmount.outcome);
  elements.resultEconomicBenefit.classList.toggle("result-amount--negative", profitConfirmed && !profitable);
  elements.lossGuidance.hidden = !profitConfirmed || profitable || breakEven;
  elements.resultPayback.textContent = !profitConfirmed
    ? "補助金額が未確認のため，回収年数は確定できません．"
    : selectedScenario.payback_year === null
    ? "現在の計算前提では，20年以内の回収は見込めません．"
    : selectedScenario.payback_year === 0
      ? "初期費用は補助金の範囲内です．"
      : `現在の計算前提では，約${selectedScenario.payback_year}年で回収する見込みです．`;
  const scenarioLabels = { downside: "下振れ", standard: "標準", upside: "上振れ" };
  renderInlineCashflowAmount(
    elements.resultPeriod,
    `${scenarioLabels[selectedScenario.scenario]}シナリオの20年間概算：`,
    selectedScenario.profit_yen
  );
  const netInitialOutlay = selectedScenario.net_initial_outlay_yen
    ?? selectedScenario.initial_cost_yen;
  const grossInstallationCost = selectedScenario.gross_installation_cost_yen
    ?? netInitialOutlay + selectedScenario.subsidy_yen;
  renderBreakdownAmount(elements.resultGrossCost, grossInstallationCost);
  renderBreakdownAmount(elements.resultSolarCost, selectedScenario.solar_installation_cost_yen);
  renderBreakdownAmount(elements.resultInitialCost, netInitialOutlay);
  renderCashflowAmount(elements.resultSelfConsumption, selectedScenario.total_electricity_savings_yen, "income");
  renderCashflowAmount(elements.resultSalesIncome, selectedScenario.total_sales_income_yen, "income");
  const selectedSubsidyStatus = subsidyStatusFor(selectedScenario, result.input);
  if (selectedSubsidyStatus === "unverified") {
    elements.resultSubsidy.textContent = "未確認";
  } else {
    renderBreakdownAmount(elements.resultSubsidy, selectedScenario.subsidy_yen);
  }
  const lifecycleCost = selectedScenario.total_maintenance_and_replacement_cost_yen;
  if (Number.isFinite(lifecycleCost)) {
    renderBreakdownAmount(elements.resultLifecycleCost, lifecycleCost);
  } else {
    elements.resultLifecycleCost.textContent = "未確認";
  }
  renderBreakdownAmount(elements.resultMaintenanceCost, selectedScenario.total_maintenance_cost_yen);
  renderBreakdownAmount(elements.resultPowerConditionerCost, selectedScenario.total_replacement_cost_yen);
  const batterySelected = result.input.equipment_package === "solar_plus_standard_battery";
  elements.resultLifecycleStatus.textContent = selectedScenario.lifecycle_cost_status === "applied"
    ? "点検・機器交換費を含みます．"
    : "点検・機器交換費は未確認です．";
  renderCashflowAmount(elements.resultProfit, selectedScenario.profit_yen);
  elements.resultGeneration.textContent = `${yenFormatter.format(result.energy.annual_generation_kwh)} kWh／年`;
  elements.resultConsumption.textContent = `${yenFormatter.format(result.energy.annual_consumption_kwh)} kWh／年`;
  elements.resultSelfConsumptionRate.textContent = `${(result.energy.self_consumption_rate * 100).toFixed(1)}％`;
  elements.resultSelfSufficiencyRate.textContent = `${(result.energy.self_sufficiency_rate * 100).toFixed(1)}％`;
  elements.resultSelfConsumed.textContent = `${yenFormatter.format(result.energy.annual_self_consumed_kwh)} kWh／年`;
  elements.resultDirectSelfConsumed.textContent = `${yenFormatter.format(result.energy.annual_direct_self_consumed_kwh)} kWh／年`;
  elements.resultBatteryDelivered.textContent = `${yenFormatter.format(result.energy.annual_battery_delivered_kwh)} kWh／年`;
  elements.resultBatteryLoss.textContent = `${yenFormatter.format(result.energy.annual_battery_conversion_loss_kwh)} kWh／年`;
  const purchasedEnergy = result.energy.annual_purchased_kwh
    ?? Math.max(result.energy.annual_consumption_kwh - result.energy.annual_self_consumed_kwh, 0);
  elements.resultPurchased.textContent = `${yenFormatter.format(purchasedEnergy)} kWh／年`;
  elements.resultExported.textContent = `${yenFormatter.format(result.energy.annual_exported_kwh)} kWh／年`;
  if (batterySelected) {
    renderBreakdownAmount(elements.resultBatteryCost, selectedScenario.battery_installation_cost_yen);
  } else {
    elements.resultBatteryCost.textContent = "対象外";
  }
  elements.capacityOutput.textContent = formatCapacity(result.input.system_capacity_kw);
  elements.capacityGeneration.textContent = `${yenFormatter.format(result.energy.annual_generation_kwh)} kWh`;
  renderCashflowAmount(elements.capacityRevenue, selectedScenario.total_revenue_yen, "income");
  const totalTwentyYearCost = Number.isFinite(netInitialOutlay) && Number.isFinite(lifecycleCost)
    ? netInitialOutlay + lifecycleCost
    : null;
  renderCashflowAmount(elements.capacityCost, totalTwentyYearCost, "cost");
  elements.capacityStatus.textContent = selectedScenario.lifecycle_cost_status === "applied"
    ? "点検・機器交換費を含みます．"
    : "点検・機器交換費は未確認です．";
  renderMunicipalSubsidy(result, selectedScenario);
  renderBatteryYearly(result);
  renderScenarios(result.scenarios, result.input);
  renderCashflow(result.scenarios, selectedScenario, result.input.equipment_package);
  collapseCalculator(result);
  if (options.resetDisclosures !== false) {
    for (const disclosure of elements.resultDisclosures) {
      disclosure.removeAttribute("open");
    }
  }
  elements.result.hidden = false;
  document.body.classList.add("has-analysis-result");
  if (options.scroll !== false) {
    elements.result.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (options.focus !== false) {
    elements.resultTitle.focus({ preventScroll: true });
  }
}

async function initialize() {
  try {
    frontendData = await loadFrontendData();
    populatePrefectures(frontendData.publicData.prefectures);
    populateRoofOrientations(frontendData.publicData.calculation.detail_inputs ?? []);
    populateDaytimeOccupancy(frontendData.publicData.calculation.daytime_occupancy);
    configureBatteryCapacityInput(frontendData.publicData.calculation.battery_capacity_input);
    elements.dataStatus.textContent = `公開データ版：${frontendData.metadata.data_version}`;

    const initialInput = inputFromLocation();
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
    if (initialInput.equipmentPackage === frontendData.publicData.calculation.battery_capacity_input.applicable_equipment_package) {
      setBatteryCapacityValue(
        initialInput.batteryCapacityKwh ?? frontendData.publicData.calculation.battery_capacity_input.default
      );
    }
    elements.capacitySlider.value = String(initialInput.systemCapacityKw);
    selectDaytimeOccupancy(initialInput.daytimeOccupancy);
    selectEquipmentPackage(initialInput.equipmentPackage);
    if (initialInput.detailConditions?.roof_orientation) {
      elements.roofOrientation.value = initialInput.detailConditions.roof_orientation;
    }
    if (initialInput.prefectureCode) {
      elements.prefecture.value = initialInput.prefectureCode;
      initialInput.municipalityCode = updateMunicipalities(initialInput.municipalityCode);
      elements.monthlyElectricityBill.value = initialInput.monthlyElectricityBillYen ?? "";
      renderResult(calculateEstimate(initialInput, frontendData.publicData));
    }
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

  try {
    const input = readInput();
    renderResult(calculateEstimate(input, frontendData.publicData));
    writeInputToLocation(input);
    elements.formMessage.textContent = "条件を変更して再計算できます．";
  } catch (error) {
    elements.formMessage.textContent = error instanceof Error ? error.message : "計算できませんでした．";
  }
});

elements.changeConditionsButton.addEventListener("click", expandCalculator);
elements.cancelConditionsButton.addEventListener("click", cancelConditionChanges);
elements.prefecture.addEventListener("change", () => updateMunicipalities());

elements.equipmentOptions.addEventListener("change", (event) => {
  if (!event.target.matches('input[name="equipment_package"]')) return;
  selectEquipmentPackage(event.target.value);
  if (!frontendData || elements.result.hidden) return;
  try {
    const input = readInput();
    renderResult(calculateEstimate(input, frontendData.publicData), {
      focus: false,
      resetDisclosures: false,
      scroll: false
    });
    writeInputToLocation(input);
  } catch (error) {
    elements.formMessage.textContent = error instanceof Error ? error.message : "再計算できませんでした．";
  }
});

elements.batteryCapacitySlider.addEventListener("input", () => {
  setBatteryCapacityValue(elements.batteryCapacitySlider.value);
  if (!frontendData || elements.result.hidden || elements.batteryCapacitySlider.disabled) return;
  try {
    const input = readInput();
    renderResult(calculateEstimate(input, frontendData.publicData), {
      focus: false,
      resetDisclosures: false,
      scroll: false
    });
    writeInputToLocation(input);
    elements.batteryCapacityStatus.textContent = "選択した容量で結果を更新しました．";
  } catch (error) {
    elements.batteryCapacityStatus.textContent = error instanceof Error ? error.message : "再計算できませんでした．";
  }
});

elements.scenarioList.addEventListener("click", (event) => {
  const scenarioButton = event.target.closest("[data-scenario]");
  if (!scenarioButton || !latestResult) {
    return;
  }
  selectedScenarioId = scenarioButton.dataset.scenario;
  renderResult(latestResult, {
    focus: false,
    resetDisclosures: false,
    scroll: false
  });
});

elements.capacitySlider.addEventListener("input", () => {
  elements.capacityOutput.textContent = formatCapacity(elements.capacitySlider.value);
  if (!frontendData || elements.result.hidden) {
    return;
  }

  try {
    const input = readInput();
    renderResult(calculateEstimate(input, frontendData.publicData), {
      focus: false,
      resetDisclosures: false,
      scroll: false
    });
    writeInputToLocation(input);
  } catch (error) {
    elements.capacityStatus.textContent = error instanceof Error ? error.message : "再計算できませんでした．";
  }
});

elements.roofOrientation.addEventListener("change", () => {
  if (!frontendData || elements.result.hidden) return;
  try {
    const input = readInput();
    renderResult(calculateEstimate(input, frontendData.publicData), {
      focus: false,
      resetDisclosures: false,
      scroll: false
    });
    writeInputToLocation(input);
  } catch (error) {
    elements.formMessage.textContent = error instanceof Error ? error.message : "再計算できませんでした．";
  }
});

elements.daytimeOccupancyOptions.addEventListener("change", (event) => {
  if (!event.target.matches('input[name="daytimeOccupancy"]') || !frontendData || elements.result.hidden) {
    return;
  }
  try {
    const input = readInput();
    renderResult(calculateEstimate(input, frontendData.publicData), {
      focus: false,
      resetDisclosures: false,
      scroll: false
    });
    writeInputToLocation(input);
  } catch (error) {
    elements.formMessage.textContent = error instanceof Error ? error.message : "再計算できませんでした．";
  }
});

initialize();
