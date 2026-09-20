export function cashflowMarkers(scenario) {
  return (scenario.annual_cash_flows ?? []).flatMap(row => {
    const costs = [
      ['定期点検費', row.maintenance_cost_yen],
      ['パワコン交換費', row.replacement_cost_yen],
      ['蓄電池交換費', row.battery_replacement_cost_yen],
    ].filter(([, amount]) => Number.isFinite(amount) && amount > 0)
      .map(([label, amount]) => ({ label, amount }));
    if (!costs.length && ![5, 10, 15, 20, 25, 30].includes(row.year)) return [];
    return [{ year: row.year, value: row.cumulative_cash_flow_yen, costs }];
  });
}

export function groupMarkerTargets(markers, distance = 24) {
  const groups = [];
  for (const marker of markers) {
    const group = groups.find(item => Math.hypot(item.x - marker.x, item.y - marker.y) < distance);
    if (group) { group.lines.push(...marker.lines); group.points.push({ x: marker.x, y: marker.y }); }
    else groups.push({ ...marker, lines: [...marker.lines], points: [{ x: marker.x, y: marker.y }] });
  }
  return groups;
}
