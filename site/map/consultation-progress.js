import {completedSteps} from './chapter-progress.js';

export const consultationProviderIds = ['solar-partners','tainavi','griene'];

export function consultationProgress(value) {
  const openedProviderIds=[...new Set((Array.isArray(value?.openedProviderIds)?value.openedProviderIds:[]).filter(id=>consultationProviderIds.includes(id)))];
  return {viewed:value?.viewed===true||openedProviderIds.length>0,openedProviderIds};
}

// 旧版の章読了は，外部の相談先を開いた証拠にはしない．
export function restoreConsultation(state,count) {
  const consultation=consultationProgress(state.consultation);
  const completed=completedSteps(state.completed,count).filter(step=>step!==5);
  return {...state,completed,consultation};
}

export function openConsultationProvider(state,id,count) {
  if(!consultationProviderIds.includes(id))return state;
  const current=consultationProgress(state.consultation);
  return restoreConsultation({...state,consultation:{viewed:true,openedProviderIds:[...current.openedProviderIds,id]}},count);
}
