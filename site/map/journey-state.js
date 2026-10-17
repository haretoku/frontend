import {restoreConsultation} from './consultation-progress.js';

export function initialJourneyState(){
  return {step:0,pawn:'male',pawnChosen:true,input:null,goal:null,last:{},completed:[],consultation:{viewed:false,openedProviderIds:[]}};
}

export function restoreJourneyState(saved,pages,count){
  const value=saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};
  const hasSavedPawn=value.pawnChosen===true&&['male','female'].includes(value.pawn);
  const last=value.last&&typeof value.last==='object'&&!Array.isArray(value.last)?value.last:{};
  return restoreConsultation({
    ...initialJourneyState(),
    step:Number.isInteger(value.step)&&value.step>=0&&value.step<=count?Math.min(value.step,count-1):0,
    pawnChosen:true,pawn:hasSavedPawn?value.pawn:'male',
    last:Object.fromEntries(Object.entries(last).filter(([step,id])=>pages.some(page=>page.id===id&&String(page.step)===step))),
    completed:value.completed,consultation:value.consultation,
    // 診断データが取得できなくても，保存済みの入力・選択を消さない．
    input:value.input??null,goal:value.goal??null
  },count);
}

export function validJourneyInput(input,prefectures){
  return !!(input&&prefectures?.some(p=>p.code===input.prefectureCode)&&(input.monthlyElectricityBillYen===null||(Number.isInteger(input.monthlyElectricityBillYen)&&input.monthlyElectricityBillYen>=0&&input.monthlyElectricityBillYen<=1000000)));
}

export function normalizeJourneyDiagnosis(state,prefectures,equipmentIds){
  const normalized=input=>validJourneyInput(input,prefectures)?{prefectureCode:input.prefectureCode,monthlyElectricityBillYen:input.monthlyElectricityBillYen}:null;
  const input=normalized(state.input),goalInput=normalized(state.goal?.input);
  return {...state,input,goal:goalInput&&equipmentIds.includes(state.goal?.equipment)?{input:goalInput,equipment:state.goal.equipment,...(state.goal.automatic===true&&state.goal.equipment==='solar_only'?{automatic:true}:{})}:null};
}

// 初期プランだけを入力に追従させ，明示選択・旧保存のプランは保持する．
export function applyInitialSolarPlan(state,prefectures){
  if(!validJourneyInput(state.input,prefectures)||(state.goal&&state.goal.automatic!==true))return state;
  const input={prefectureCode:state.input.prefectureCode,monthlyElectricityBillYen:state.input.monthlyElectricityBillYen};
  if(state.goal?.automatic===true&&state.goal.equipment==='solar_only'&&JSON.stringify(state.goal.input)===JSON.stringify(input))return state;
  return {...state,goal:{input,equipment:'solar_only',automatic:true}};
}
