const destinations = {"initial-cost": "costs", "included-costs": "lifecycle-cost", "excluded-costs": "removal-cost", "inspection-caution": "inspection-conditions", "cost-lifecycle-caption": "maintenance-baseline", "summary": "decision-path", "learn-title": "costs"};
const anchor = location.hash.slice(1);
const destination = destinations[anchor] ?? "costs";
location.replace(new URL("../../pages/electricity-sales.html#" + destination, import.meta.url).href);
