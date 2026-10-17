import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { analyticsAllowed, cleanReferrer, createAnalytics } from "../../site/shared/analytics-core.js";
import { quoteMaterial } from '../../site/shared/quote-config.js';
import { analyticsConfig } from "../../site/shared/analytics-config.js";
import {renderConsultationProviders} from '../../site/map/consultation-view.js';
import {renderProviderComparison} from '../../site/map/provider-comparison-view.js';

const configured = { enabled: true, enhancedMeasurementDisabled: true, measurementId: "G-TEST123456" };
function fixture(href, config = configured, productionBuild = true, referrer = "https://haretoku.jp/guides/subsidies/?private=CANARY#CANARY") {
  const scripts = [], handlers = {}, windowHandlers = {};
  const window = { location: { href }, addEventListener(type,fn){windowHandlers[type]=fn;} };
  const document = {
    referrer,
    createElement(tag) { assert.equal(tag, "script"); return {}; },
    head: { append(script) { scripts.push(script); } },
    addEventListener(type, fn) { handlers[type] = fn; }
  };
  const analytics = createAnalytics({ config, productionBuild, window, document });
  return { analytics, window, scripts, handlers, windowHandlers, commands: () => (window.dataLayer ?? []).map(args => [...args]) };
}
const events = f => f.commands().filter(c => c[0] === "event");

test('MAPで実際に描画する3社の相談ボタンは全社計測し，広告指標も維持する',()=>{
  const f=fixture('https://haretoku.jp/?bill=CANARY#CANARY');
  const html=renderConsultationProviders({compact:true,preview:false});
  const anchors=[...html.matchAll(/<a\b[^>]*class="[^"]*consult-provider-action[^"]*"[^>]*>/g)].map(([tag])=>{
    const attr=name=>{const value=tag.match(new RegExp(`${name}="([^"]*)"`))?.[1]??null;return value===null?null:value.replaceAll('&amp;','&');};
    return {href:attr('href'),getAttribute:attr,hasAttribute:name=>attr(name)!==null};
  });
  assert.equal(anchors.length,3);
  for(const link of anchors)f.handlers.click({type:'click',button:0,target:{closest:()=>link}});
  const clicks=events(f).filter(e=>e[1]==='consultation_click');
  assert.deepEqual(clicks.map(e=>e[2].provider_id),['solar-partners','tainavi','griene']);
  assert(clicks.every(e=>e[2].consultation_placement==='map'));
  assert.deepEqual(events(f).filter(e=>e[1]==='quote_click').map(e=>e[2].quote_placement),['map_consultation']);
  assert(!JSON.stringify(f.commands()).includes('CANARY'));
  f.handlers.auxclick({type:'auxclick',button:1,target:{closest:()=>anchors[1]}});
  assert.equal(events(f).filter(e=>e[1]==='consultation_click').length,4);
});

test('相談先ID・配置・完全URLを照合し，任意値や取消し・右クリックを送らない',()=>{
  const f=fixture('https://haretoku.jp/');
  const link=(provider='tainavi',placement='map',href='https://www.tainavi.com/')=>({href,hasAttribute:()=>false,getAttribute:name=>({'data-consult-provider':provider,'data-consult-placement':placement}[name]??null)});
  for(const target of [link('CANARY'),link('tainavi','CANARY'),link('tainavi','map','https://www.tainavi.com/?CANARY')])f.handlers.click({button:0,target:{closest:()=>target}});
  f.handlers.click({button:0,defaultPrevented:true,target:{closest:()=>link()}});
  f.handlers.auxclick({type:'auxclick',button:2,target:{closest:()=>link()}});
  assert.deepEqual(events(f).map(e=>e[1]),['page_view']);
  assert(!JSON.stringify(f.commands()).includes('CANARY'));
});

test('MAPと記事の比較表は広告2社と通常1社を記録し，SP広告の配置も区別する',()=>{
  for(const [path,placement] of [['/','map_comparison'],['/guides/quote-services/','article_comparison']]){
    const f=fixture('https://haretoku.jp'+path+'?bill=CANARY');
    const html=renderProviderComparison({placement});
    const anchors=[...html.matchAll(/<a\b[^>]*class="provider-brand"[^>]*>/g)].map(([tag])=>{
      const attr=name=>tag.match(new RegExp(`${name}="([^"]*)"`))?.[1]??null;
      return {href:attr('href'),getAttribute:attr,hasAttribute:name=>attr(name)!==null};
    });
    assert.equal(anchors.length,3);
    for(const link of anchors)f.handlers.click({type:'click',button:0,target:{closest:()=>link}});
    const clicks=events(f).filter(event=>event[1]==='consultation_click');
    assert.deepEqual(clicks.map(event=>event[2].provider_id),['solar-partners','tainavi','griene']);
    assert(clicks.every(event=>event[2].consultation_placement===placement));
    assert.deepEqual(events(f).filter(event=>event[1]==='quote_click').map(event=>event[2].quote_placement),[placement]);
    f.handlers.auxclick({type:'auxclick',button:1,target:{closest:()=>anchors[0]}});
    assert.equal(events(f).filter(event=>event[1]==='consultation_click').length,4);
    const payload=JSON.stringify(f.commands());
    assert(!payload.includes('CANARY'));assert(!payload.includes('www.solar-partners.jp'));assert(!payload.includes('www.tainavi.com'));assert(!payload.includes('griene.jp'));assert(!payload.includes('a8mat'));
    const wrongPage=fixture('https://haretoku.jp'+(path==='/'?'/guides/quote-services/':'/'));
    wrongPage.handlers.click({type:'click',button:0,target:{closest:()=>anchors[0]}});
    assert.equal(events(wrongPage).filter(event=>event[1]==='consultation_click').length,0);
  }
});

test('主要操作は許可した画面と固定値だけを送り，自動表示を操作として扱わない',()=>{
  const f=fixture('https://haretoku.jp/');
  for(const value of [0,1,2,3,4])assert.equal(f.analytics.journeyAction('map_step_click',value),true);
  for(const value of [-1,5,'1','CANARY',{chapter:1}])assert.equal(f.analytics.journeyAction('map_step_click',value),false);
  assert.equal(f.analytics.journeyAction('goal_consultation_click'),true);
  assert.equal(f.analytics.journeyAction('plan_change'),false);
  assert.equal(f.analytics.journeyAction('CANARY','CANARY'),false);
  const d=fixture('https://haretoku.jp/simulator/');
  assert.deepEqual(events(d).map(e=>e[1]),['page_view']);
  assert.equal(d.analytics.journeyAction('diagnosis_start'),true);
  assert.equal(d.analytics.journeyAction('diagnosis_start'),false);
  assert.equal(d.analytics.journeyAction('plan_change'),true);
  assert.equal(d.analytics.journeyAction('plan_change'),true);
  assert.equal(d.analytics.journeyAction('map_step_click',1),false);
  assert(events(d).every(e=>!Object.hasOwn(e[2],'equipment')));
  assert(!JSON.stringify(f.commands()).includes('CANARY'));
});

test('章読了は正しい章末の明示操作を文書内で一度記録し，途中ページは除く',()=>{
  for(const [path,chapter] of [['solar-costs',0],['../simulator',1],['disaster-preparedness',2],['installation-process',3],['choosing-installer',4]]){
    const href=path==='../simulator'?'https://haretoku.jp/simulator/':`https://haretoku.jp/guides/${path}/`;
    const f=fixture(href);
    assert.equal(f.analytics.journeyAction('chapter_complete',chapter+1),false);
    assert.equal(f.analytics.journeyAction('chapter_complete',chapter),true);
    assert.equal(f.analytics.journeyAction('chapter_complete',chapter),false);
    assert.equal(events(f).filter(e=>e[1]==='chapter_complete')[0][2].chapter_id,String(chapter));
  }
  const middle=fixture('https://haretoku.jp/guides/solar-benefits/');
  assert.equal(middle.analytics.journeyAction('chapter_complete',0),false);
  for(const [config,prod] of [[configured,false],[{...configured,enabled:false},true]]){
    const f=fixture('https://haretoku.jp/',config,prod);
    assert.equal(f.analytics.journeyAction('map_step_click',0),false);
    assert.equal(f.window.dataLayer,undefined);
  }
});

test('旧TOPの既知ハッシュは正規URLとして集計し，任意ハッシュは送らない',()=>{
  for(const [hash,path,chapter] of [['estimate','/simulator/',1],['try','/guides/solar-costs/',0]]){
    const f=fixture(`https://haretoku.jp/?secret=CANARY#${hash}`);
    assert.equal(events(f)[0][2].page_location,'https://haretoku.jp'+path);
    assert.equal(f.analytics.journeyAction('chapter_complete',chapter),true);
    if(hash==='estimate'){
      assert.equal(f.analytics.journeyAction('diagnosis_start'),true);
      assert.equal(f.analytics.journeyAction('plan_change'),true);
    }
    assert(!JSON.stringify(f.commands()).includes('CANARY'));
  }
  const f=fixture('https://haretoku.jp/');
  f.window.location.href='https://haretoku.jp/?secret=CANARY#estimate';
  f.windowHandlers.hashchange();
  assert.equal(f.analytics.journeyAction('diagnosis_start'),true);
  assert.deepEqual(events(f).filter(e=>e[1]==='page_view').map(e=>e[2].page_location),['https://haretoku.jp/','https://haretoku.jp/simulator/']);
  f.window.location.href='https://haretoku.jp/simulator/#CANARY';
  f.windowHandlers.hashchange();
  assert.equal(events(f).filter(e=>e[1]==='page_view').length,2);
  assert(!JSON.stringify(f.commands()).includes('CANARY'));
});

test('マップ診断の完了と記事からの移動は一度だけ記録し，入力やハッシュを送らない',()=>{
  const home=fixture('https://haretoku.jp/?prefecture=CANARY&monthlyElectricityBill=CANARY#estimate');
  assert.equal(home.analytics.diagnosisComplete(),true);
  assert.equal(home.analytics.diagnosisComplete(),false);
  assert.deepEqual(events(home).map(e=>e[1]),['page_view','diagnosis_complete']);
  assert(events(home).every(e=>e[2].page_location==='https://haretoku.jp/simulator/'));
  assert(!JSON.stringify(home.commands()).includes('CANARY'));
  const article=fixture('https://haretoku.jp/guides/subsidies/');
  const click=href=>article.handlers.click({button:0,target:{closest:()=>({href,hasAttribute:()=>false,getAttribute:()=>null})}});
  click('https://haretoku.jp/#map');
  assert.equal(events(article).length,2);
  click('https://haretoku.jp/?prefecture=CANARY#estimate');
  click('https://haretoku.jp/#estimate');
  assert.deepEqual(events(article).map(e=>e[1]),['page_view','article_view','article_diagnosis_click']);
  assert(!JSON.stringify(article.commands()).includes('CANARY'));
});

test('見積もりクリックは固定配置とページだけを送り，入力・任意リンクは送らない', () => {
  const url = quoteMaterial.url;
  for (const [path, placement] of [['/', 'fixed_bar'], ['/guides/subsidies/', 'article_body'], ['/simulator/', 'diagnosis_result']]) {
    const f = fixture('https://haretoku.jp' + path + '?private=CANARY');
    const click = (href, position, extra = {}) => f.handlers.click({ button: 0, target: { closest: () => ({ href, textContent: 'CANARY', hasAttribute: () => false, getAttribute: name => name === 'data-quote-placement' ? position : null }) }, ...extra });
    click(url, 'CANARY');
    click(url + '&private=CANARY', placement);
    click(url, placement, { defaultPrevented: true });
    click(url, placement, { button: 2 });
    assert.equal(events(f).filter(c => c[1] === 'quote_click').length, 0);
    click(url, placement);
    const recorded = events(f).filter(c => c[1] === 'quote_click');
    assert.equal(recorded.length, 1);
    assert.equal(recorded[0][2].quote_placement, placement);
    assert.deepEqual(Object.keys(recorded[0][2]).sort(), ['page_id', 'page_location', 'page_referrer', 'page_title', 'send_to', 'quote_placement'].sort());
    assert(!JSON.stringify(f.commands()).includes('CANARY'));
  }
});

test("未設定ID・無効設定・拡張計測未確認はGoogle読込・キュー・イベントを作らない", () => {
  for (const config of [ { ...configured, measurementId: "" }, { ...configured, measurementId: "G-INVALID?x=1" }, { ...configured, enabled: false }, { ...configured, enhancedMeasurementDisabled: false }]) {
    const f = fixture("https://haretoku.jp/simulator/?private=CANARY", config);
    assert.equal(f.analytics.active, false);
    assert.equal(f.analytics.diagnosisComplete(), false);
    assert.equal(f.window.dataLayer, undefined);
    assert.deepEqual(f.scripts, []);
    assert.deepEqual(f.handlers, {});
  }
});

test("localhost・dev・preview・www・非HTTPS・偽装host・404では計測しない", () => {
  for (const url of ["http://localhost:5173/", "http://127.0.0.1:4173/", "https://haretoku.github.io/", "https://www.haretoku.jp/", "http://haretoku.jp/", "https://haretoku.jp.evil.example/", "https://haretoku.jp:444/", "https://haretoku.jp/__local/review/", "https://haretoku.jp/404.html", "https://haretoku.jp/pages/costs-maintenance.html"]) {
    const f = fixture(url, analyticsConfig);
    assert.equal(f.analytics.active, false, url);
    assert.equal(f.window.dataLayer, undefined);
    assert.deepEqual(f.handlers, {});
    assert.deepEqual(f.scripts, []);
  }
  assert.equal(analyticsAllowed(analyticsConfig, "https://haretoku.jp/", false), false);
  assert.equal(analyticsAllowed(analyticsConfig, "https://haretoku.jp/", true), true);
  assert.equal(analyticsAllowed(configured, "https://haretoku.jp/", undefined), false);
});

test("URL・referrerのクエリー/ハッシュと任意title/utmをコマンドに含めない", () => {
  const f = fixture("https://haretoku.jp/simulator/?prefecture=CANARY&monthlyElectricityBill=CANARY&utm_source=CANARY#CANARY");
  f.analytics.diagnosisComplete();
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-TEST123456");
  assert.equal(f.scripts[0].referrerPolicy, "no-referrer");
  assert(!JSON.stringify(f.commands()).includes("CANARY"));
  for (const command of events(f)) {
    assert.equal(command[2].page_location, "https://haretoku.jp/simulator/");
    assert.equal(command[2].page_referrer, "https://haretoku.jp/guides/subsidies/");
    assert.deepEqual(Object.keys(command[2]).sort(), ["page_id", "page_location", "page_referrer", "page_title", "send_to"].sort());
  }
  assert.equal(cleanReferrer("https://search.example/CANARY?q=CANARY#CANARY"), "https://search.example");
  assert.equal(cleanReferrer("javascript:CANARY"), "");
  assert.equal(cleanReferrer("invalid"), "");
});

test("広告関連の同意を拒否し，自動page_viewとsignalsを無効化する", () => {
  const f = fixture("https://haretoku.jp/");
  const consent = f.commands()[0];
  assert.deepEqual(consent, ["consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }]);
  const config = f.commands().find(c => c[0] === "config")[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.campaign_source, "");
  assert.deepEqual(events(f).map(c => c[1]), ["page_view"]);
});

test("記事閲覧・診断リンクだけを計測し無効な見積もりや外部リンクを計測しない", () => {
  const f = fixture("https://haretoku.jp/guides/subsidies/");
  function click(href, extra = {}) {
    f.handlers.click({ button: 0, target: { closest: () => ({ href, hasAttribute: () => false, getAttribute: () => null }) }, ...extra });
  }
  assert.deepEqual(events(f).map(c => c[1]), ["page_view", "article_view"]);
  click("https://outside.example/simulator/");
  click("https://haretoku.jp/guides/quotes-contractors/");
  click("https://haretoku.jp/simulator/", { defaultPrevented: true });
  assert.equal(events(f).length, 2);
  click("https://haretoku.jp/simulator/?private=CANARY#CANARY");
  click("https://haretoku.jp/simulator/");
  assert.deepEqual(events(f).map(c => c[1]), ["page_view", "article_view", "article_diagnosis_click"]);
  assert(!JSON.stringify(f.commands()).includes("CANARY"));
  assert.equal(f.analytics.diagnosisComplete(), false);
});

test("最初の有効結果だけを記録し再計算・履歴変更で完了を増やさない", () => {
  const f = fixture("https://haretoku.jp/simulator/?private=CANARY");
  assert.deepEqual(events(f).map(c => c[1]), ["page_view"]);
  assert.equal(f.analytics.diagnosisComplete(), true);
  f.window.location.href = "https://haretoku.jp/simulator/?private=CHANGED#CHANGED";
  assert.equal(f.analytics.diagnosisComplete(), false);
  assert.equal(f.analytics.diagnosisComplete(), false);
  assert.deepEqual(events(f).map(c => c[1]), ["page_view", "diagnosis_complete"]);
  assert(!JSON.stringify(f.commands()).includes("CHANGED"));
});

test("基礎・詳細・時事・データページに入口があり結果描画成功後にだけ完了を通知する", async () => {
  const pages = ["index.html", "guides/index.html", "press/index.html", "data/index.html", "data/subsidies/index.html", ...["solar-economics", "subsidies", "disaster", "quotes-contractors", "solar-electricity-savings", "solar-fit", "solar-installation-cost", "solar-maintenance-cost", "subsidy-amount", "electricity-support-end"].map(n => `guides/${n}/index.html`), ...["policy", "calculation-method"].map(n => `pages/${n}.html`)];
  for (const page of pages) {
    const html = await readFile(new URL(`../../site/${page}`, import.meta.url), "utf8");
    assert.equal((html.match(/src="(?:\.\.\/|\/)?shared\/analytics\.js"/g) ?? []).length, 1, page);
  }
  const app = await readFile(new URL("../../site/map/journey.js", import.meta.url), "utf8");
  assert.equal((app.match(/recordDiagnosisComplete\(\);/g) ?? []).length, 1);
  assert(app.indexOf("if(!ready)return;") < app.indexOf("recordDiagnosisComplete();"));
  const policy = await readFile(new URL("../../site/pages/policy.html", import.meta.url), "utf8");
  assert(policy.includes(`data-analytics-policy="${analyticsConfig.enabled ? "enabled" : "disabled"}"`));
});


test("旧ガイドURLでは計測せず，新URLのindex別名を正規化する", () => {
  for (const path of ["/solar/", "/solar/index.html", ...["electricity-sales", "subsidies", "disaster", "quotes-contractors"].map(id => `/pages/${id}.html`)]) {
    assert.equal(analyticsAllowed(configured, `https://haretoku.jp${path}`, true), false);
  }
  assert.equal(analyticsAllowed(configured, "https://haretoku.jp/guides/solar-economics/index.html", true), true);
});

test('データページは地域・受付・金額を送らず，診断遷移を一度だけ記録する',()=>{
 for(const path of ['/data/','/data/subsidies/','/data/subsidies/index.html']){
  const f=fixture('https://haretoku.jp'+path+'?prefecture=CANARY&municipality_code=CANARY&reception=CANARY#CANARY',configured,true,'https://haretoku.jp/data/subsidies/?secret=CANARY');
  assert.equal(f.analytics.active,true);
  assert.deepEqual(events(f).map(c=>c[1]),['page_view']);
  const click=href=>f.handlers.click({button:0,target:{closest:()=>({href,hasAttribute:()=>false,getAttribute:()=>null})}});
  click('https://outside.example/simulator/');
  click('https://haretoku.jp/data/subsidies/');
  assert.equal(events(f).length,1);
  click('https://haretoku.jp/simulator/?prefecture=CANARY&from=data');
  click('https://haretoku.jp/simulator/');
  assert.deepEqual(events(f).map(c=>c[1]),['page_view','data_diagnosis_click']);
  assert.equal(f.analytics.diagnosisComplete(),false);
  assert.equal(events(f)[0][2].page_referrer,'https://haretoku.jp/data/subsidies/');
  assert(!JSON.stringify(f.commands()).includes('CANARY'));
  assert.equal(fixture('http://localhost:5173'+path).analytics.active,false);
  assert.equal(fixture('https://haretoku.jp'+path,configured,false).analytics.active,false);
 }
});


test('詳細5記事と時事記事は閲覧と見積もりを計測し，入力URLを送らない', () => {
  for (const slug of ['solar-electricity-savings', 'solar-fit', 'solar-installation-cost', 'solar-maintenance-cost', 'subsidy-amount', 'electricity-support-end']) {
    const path='/guides/'+slug+'/';
    const f=fixture('https://haretoku.jp'+path+'?private=CANARY#CANARY');
    assert.equal(f.analytics.active,true,slug);
    assert.equal(analyticsAllowed(configured,'https://haretoku.jp'+path+'index.html',true),true);
    assert.deepEqual(events(f).map(c=>c[1]),['page_view','article_view']);
    for(const placement of ['fixed_bar','article_body']) {
      f.handlers.click({button:0,target:{closest:()=>({href:quoteMaterial.url,hasAttribute:()=>false,getAttribute:name=>name==='data-quote-placement'?placement:null})}});
    }
    const quotes=events(f).filter(c=>c[1]==='quote_click');
    assert.deepEqual(quotes.map(c=>c[2].quote_placement),['fixed_bar','article_body']);
    assert(quotes.every(c=>c[2].page_location==='https://haretoku.jp'+path));
    assert(!JSON.stringify(f.commands()).includes('CANARY'));
  }
});
