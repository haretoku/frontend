import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { prepareSubsidyData } from '../../data/src/scheme-adapter.js';
import { receiveHareDisplayRecords } from '../../site/shared/hare-display-record.js';
import { receiveDiagnosticDisplayRecords } from '../../site/simulator/src/diagnostic-display-record.js';

const read = async name => JSON.parse(await readFile(new URL(`../../data/input/${name}.json`, import.meta.url)));
const [raw, metadata, hare, hareBinding, diagnostic, diagnosticBinding] = await Promise.all(
  ['public-data','metadata','hare-display-table','hare-display-binding','diagnostic-display-table','diagnostic-display-binding'].map(read));
const prepared = prepareSubsidyData(raw);

test('新受領版の両表示表は公開ペアと同じ入力・計算契約から受領できる', async () => {
  assert.equal(raw.data_version, metadata.data_version);
  assert.equal(raw.schema_version, metadata.schema_version);
  const hareRecords = receiveHareDisplayRecords(prepared, hare, hareBinding);
  const diagnosis = await receiveDiagnosticDisplayRecords(prepared, diagnostic, diagnosticBinding, hare);
  assert.equal(hareRecords.size, hare.records.length);
  assert.equal(diagnosis.size, diagnostic.records.length);
  assert.equal(diagnosis.size, 60);
  assert.equal(hareBinding.public_data_version, raw.data_version);
  assert.equal(diagnosticBinding.public_data_version, raw.data_version);
});

test('異なる表・binding・版を受領した場合は表示を継続しない', async () => {
  const invalid = structuredClone(diagnosticBinding);
  invalid.hare_payload_sha256 = '0'.repeat(64);
  await assert.rejects(receiveDiagnosticDisplayRecords(prepared, diagnostic, invalid, hare), /SHA/);
  assert.throws(() => receiveHareDisplayRecords(prepared, hare, {...hareBinding,public_data_version:'other'}), /データ版/);
});

test('受領は国県だけとし，市区町村の制度を除外する', () => {
  assert.equal(prepared.prefectures.length, 47);
  assert.equal(raw.service_scope.municipal_subsidies_included, false);
  assert(!raw.subsidy_schemes.some(p => p.government_level === 'municipality'));
  assert(!prepared.diagnostic_subsidy_programs.some(p => p.government_level === 'municipality'));
  assert(!('municipalities' in raw));
});
