export function completedSteps(value, count) {
  return [...new Set((Array.isArray(value)?value:[]).filter(step=>Number.isInteger(step)&&step>=0&&step<count))].sort((a,b)=>a-b);
}

export function chapterNavigation(pages, id) {
  const index=pages.findIndex(page=>page.id===id);
  if(index<0)throw new Error('ページが見つかりません．');
  const page=pages[index],next=pages[index+1];
  const last=!next||next.step!==page.step;
  return {href:last?'#map':`#${next.id}`,label:last?'わかった！ マップへ →':'わかった！ 次へ →',completedStep:last?page.step:null};
}

export function finishChapter(state, step, count) {
  if(!Number.isInteger(step)||step<0||step>=count)throw new Error('ステップが見つかりません．');
  const completed=completedSteps([...(state.completed??[]),step],count);
  const order=Array.from({length:count},(_,offset)=>(step+1+offset)%count);
  const next=order.find(candidate=>!completed.includes(candidate));
  return {...state,completed,step:next??step};
}
