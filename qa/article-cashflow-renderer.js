// 固定記事の図表再生成専用．旧診断の画面制御から，使用する描画関数だけを移管する．
// generate-economics-chart.mjs の制限したSVGコンテキストで実行する．
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
