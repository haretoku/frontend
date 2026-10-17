// 公開URLの正本．章番号や画面上の並び順をURLに含めない．
export const journeyRoutes=Object.freeze({
  map:'/',
  welcome:'/guides/welcome/',
  basics:'/guides/solar-benefits/',
  try:'/guides/solar-costs/',
  estimate:'/simulator/',
  electricity:'/guides/solar-living/',
  money:'/guides/home-battery/',
  roof:'/guides/equipment-maintenance/',
  backup:'/guides/power-outage/',
  disaster:'/guides/disaster-preparedness/',
  preparation:'/guides/consultation-preparation/',
  consultation:'/guides/home-survey/',
  installation:'/guides/installation-process/',
  companies:'/guides/solar-consultation/',
  'quote-sites':'/guides/quote-services/',
  compare:'/guides/choosing-installer/'
});

export function journeyPageId(url){
  const legacy=url.hash.slice(1);
  // 旧TOPのハッシュと試作URLを引き継ぐ．本文内の通常アンカーは扱わない．
  if((url.pathname==='/'||url.pathname==='/index.html'||url.pathname.startsWith('/prototypes/step-map/'))&&legacy){
    if(legacy==='quote')return 'map';
    if(Object.hasOwn(journeyRoutes,legacy))return legacy;
  }
  const rawPath=url.pathname.replace(/index\.html$/,'');
  const path=rawPath.endsWith('/')?rawPath:rawPath+'/';
  return Object.entries(journeyRoutes).find(([,route])=>route===path)?.[0]??null;
}

export function journeyHref(href){
  const match=String(href).match(/^(?:\/)?#([a-z-]+)$/);
  return match&&journeyRoutes[match[1]]?journeyRoutes[match[1]]:href;
}

export function journeyLinks(html){
  return html.replace(/href="((?:\/)?#[a-z-]+)"/g,(_,href)=>`href="${journeyHref(href)}"`);
}
