import {journeyRoutes,journeyPageId} from './routes.js';
// 旧URLからは，新しい診断でも入力できる地域・電気代だけを引き継ぐ．
export function readDiagnosisQuery(url,prefectureCodes) {
  const prefectureCode=url.searchParams.get('prefecture');
  if(!prefectureCodes.includes(prefectureCode))return null;
  const raw=url.searchParams.get('monthlyElectricityBill');
  const bill=raw===null||raw===''?null:Number(raw);
  if(bill!==null&&(!/^\d+$/.test(raw)||!Number.isSafeInteger(bill)||bill<0||bill>1000000))return null;
  return {prefectureCode,monthlyElectricityBillYen:bill};
}

export function mapRedirectTarget(url) {
  const params=new URLSearchParams();
  for(const key of ['prefecture','monthlyElectricityBill']) {
    if(url.searchParams.has(key))params.set(key,url.searchParams.get(key));
  }
  const id=journeyPageId(url)??'map';
  return journeyRoutes[id]+(params.size?'?'+params:'');
}
