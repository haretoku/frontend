// Truncate the decimal value represented by Number.toString(), including exponents.
// Do not multiply by 100: binary floating-point can move exact hundredths below a boundary.
export function preprocessCapacity(capacityKw, rule) {
  if (rule == null) return capacityKw;
  const precision = rule === "floor_0_01_kw" ? 2 : rule === "floor_0_1_kw" ? 1 : undefined;
  if (precision === undefined) throw new Error("未対応の補助金容量前処理です．");
  if (!Number.isFinite(capacityKw) || capacityKw <= 0) {
    throw new Error("容量前処理には正の有限な容量が必要です．");
  }
  const [coefficient, exponent = "0"] = String(capacityKw).toLowerCase().split("e");
  const [integer, fraction = ""] = coefficient.split(".");
  const digits = integer + fraction;
  const shift = Number(exponent) - fraction.length + precision;
  if (shift >= 0) return capacityKw;
  const retainedLength = digits.length + shift;
  if (retainedLength <= 0) return 0;
  return Number(`${digits.slice(0, retainedLength)}e-${precision}`);
}
