import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const topSource = await readFile(new URL("../../site/simulator/src/top.js", import.meta.url), "utf8");
const housingSource = await readFile(new URL("../../site/simulator/src/housing-input.js", import.meta.url), "utf8");
const locationSource = await readFile(new URL("../../site/simulator/src/location-input.js", import.meta.url), "utf8");
const publicData = {
  data_version: "test",
  prefectures: [{ code: "14", name: "神奈川県" }, { code: "08", name: "茨城県" }, { code: "01", name: "北海道" }],
  municipalities: [
    { prefecture_code: "14", municipality_code: "14130", municipality_name: "川崎市" },
    { prefecture_code: "08", municipality_code: "08230", municipality_name: "かすみがうら市" }
  ]
};

function element() {
  return {
    value: "", hidden: false, disabled: false, textContent: "", children: [], listeners: {}, validity: { valid: true },
    get options() { return this.children; },
    focus() { this.focused = true; },
    scrollIntoView() { this.scrolled = true; },
    append(...items) { this.children.push(...items); },
    replaceChildren(...items) { this.children = items; this.value = ""; },
    addEventListener(type, callback) { this.listeners[type] = callback; },
    reportValidity() { return true; }
  };
}

async function initialize(loadFrontendData) {
  const selectors = ["main","#estimate-form", "#prefecture", "[data-municipality-field]", "#municipality", "#municipality-help", "#monthly-electricity-bill", "#calculate-button", "#form-message"];
  const nodes = Object.fromEntries(selectors.map((selector) => [selector, element()]));
  const navigations = [];
  const context = {
    QUOTE_ACTION: {disabled:true}, mountFixedQuoteBar: () => {}, URL, CALCULATION_IMPLEMENTED: true, loadFrontendData,
    document: {
      querySelector(selector) { assert.ok(nodes[selector], `Unexpected element: ${selector}`); return nodes[selector]; },
      createDocumentFragment: element, createElement: element
    },
    window: { location: { href: "http://127.0.0.1:5173/", assign(url) { navigations.push(url); } } }
  };
  await runInNewContext(`(async () => {${housingSource.replace(/^export /gm, "")}
${locationSource.replace(/^export /gm, "")}\n${topSource.replace(/^import .*;$/gm, "")}\n})()`, context);
  return { nodes, navigations, context };
}

test("トップの取得失敗はフォームで診断不能を説明し，後続更新でも上書きしない", async () => {
  const { nodes } = await initialize(async () => { throw new Error("network failure"); });
  assert.equal(nodes["#calculate-button"].disabled, true);
  assert.equal(nodes["#form-message"].hidden, false);
  assert.match(nodes["#form-message"].textContent, /使用データを読み込めないため.*診断できません.*再読み込み/);
});

test("トップは県のみ・県と市の診断と県変更時の市クリアを維持する", async () => {
 const {nodes,navigations}=await initialize(async()=>({publicData}));const prefecture=nodes['#prefecture'],municipality=nodes['#municipality'];const submit=()=>nodes['#estimate-form'].listeners.submit({preventDefault(){}});
 assert.equal(municipality.disabled,true);assert.equal(nodes['#municipality-help'].hidden,true);submit();assert.equal(navigations.length,0);
 prefecture.value='14';prefecture.listeners.change();submit();assert.equal(navigations.length,1);assert.equal(navigations[0].searchParams.has('municipality_code'),false);
 municipality.value='14130';prefecture.value='08';prefecture.listeners.change();assert.equal(municipality.value,'');
 municipality.value='14130';submit();assert.equal(navigations.length,1);assert.match(nodes['#form-message'].textContent,/組合せが無効/);
 municipality.value='08230';nodes['#monthly-electricity-bill'].value='0';submit();assert.equal(navigations.length,2);assert.equal(navigations[1].searchParams.get('municipality_code'),'08230');assert.equal(navigations[1].searchParams.get('monthlyElectricityBill'),'0');
 prefecture.value='01';prefecture.listeners.change();assert.equal(municipality.disabled,true);assert.match(nodes['#municipality-help'].textContent,/都道府県だけで診断できます/);assert.equal(nodes['#municipality-help'].hidden,false);assert.equal(nodes['#calculate-button'].disabled,false);submit();assert.equal(navigations.length,3);assert.equal(navigations[2].searchParams.has('municipality_code'),false);
});

test("共有地域入力は診断側の県未選択時の非表示と選択済み復元を維持する", async () => {
  const { context } = await initialize(async () => ({ publicData }));
  const elements = { prefecture: element(), municipality: element(), municipalityField: element(), municipalityHelp: element() };
  context.elements = elements;
  context.publicData = publicData;
  runInNewContext(`${locationSource.replace(/^export /gm, "")}\npopulateMunicipalitySelect(elements, publicData);`, context);
  assert.equal(elements.municipalityField.hidden, true);
  elements.prefecture.value = "14";
  runInNewContext('populateMunicipalitySelect(elements, publicData, "14130");', context);
  assert.equal(elements.municipality.value, "14130");
  assert.equal(elements.municipalityField.hidden, false);
});

test('トップは住宅区分を明示入力として送信しない', async () => {
 const {nodes,navigations}=await initialize(async()=>({publicData}));
 nodes['#prefecture'].value='14'; nodes['#prefecture'].listeners.change(); nodes['#municipality'].value='14130';
 nodes['#estimate-form'].listeners.submit({preventDefault(){}});
 assert.equal(navigations[0].searchParams.has('housingAge'),false);
 const result=runInNewContext(housingSource.replace(/^export /gm,'')+'; housingInput(undefined)');
 assert.equal(result.value,'existing'); assert.equal(result.source,'default');
});

test('住宅区分の表示変更は値と明示入力の由来を維持する', async()=>{
 const app=await readFile(new URL('../../site/simulator/src/app.js',import.meta.url),'utf8');
 const html=await readFile(new URL('../../site/index.html',import.meta.url),'utf8');
 assert.doesNotMatch(html,/id="housing-age"/);
 assert.match(app,/すでに建っている家に設置/); assert.match(app,/新築する家に設置/);
 const result=runInNewContext(housingSource.replace(/^export /gm,'')+"; housingInput('new')");
 assert.equal(result.value,'new'); assert.equal(result.source,'user_input');
});
