import {calculateEstimate} from '../simulator/src/calculator.js';

// ユーザー採用の試算仮定．実測故障率・平均修理額ではない．
// PCS交換は既存費用．蓄電池側は保証料を参考にした予備費で，保証購入・本体交換ではない．
export const repairReserveYen = 20000;
export const batteryRepairReserveYenPerEvent = 25000;
export const batteryRepairReserveYears = Object.freeze([5, 10, 15, 20, 25, 30]);
// 住宅の火災保険へ設備分を上乗せする，ユーザー採用の年間費用仮定．
export const annualInsuranceYen = Object.freeze({solar_only:3000, solar_plus_standard_battery:6000});

export function calculateJourneyEstimate(input, publicData) {
  const reserveId = 'journey-additional-repair-reserve';
  const batteryReserveId = 'journey-battery-repair-reserve';
  const insuranceId = 'journey-equipment-insurance';
  const evaluationYears = publicData.calculation.evaluation_period_years;
  if (evaluationYears !== 30) throw new Error('修理予備費は30年間の試算仮定です．');
  const equipment = input.equipmentPackage ?? publicData.calculation.default_equipment_package;
  const diagnosisData = {
    ...publicData,
    calculation: {
      ...publicData.calculation,
      lifecycle_cost_events: [
        ...(publicData.calculation.lifecycle_cost_events ?? []).filter(event => ![reserveId, batteryReserveId, insuranceId].includes(event.id)),
        {id:reserveId, cost_type:'maintenance', cost_yen:repairReserveYen, event_years:[evaluationYears]},
        {id:insuranceId, cost_type:'maintenance', cost_yen:annualInsuranceYen[equipment],
          event_years:Array.from({length:evaluationYears},(_,index)=>index+1)},
        ...(equipment === 'solar_plus_standard_battery' ? [{
          id:batteryReserveId, cost_type:'maintenance', cost_yen:batteryRepairReserveYenPerEvent,
          event_years:[...batteryRepairReserveYears]
        }] : [])
      ]
    }
  };
  return calculateEstimate(input, diagnosisData);
}
