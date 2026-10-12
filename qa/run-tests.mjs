import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const dataTests = new Set([
  'listing-municipalities.test.js', 'catalog-amount.test.js',
  'catalog-connection.test.js', 'data-listing.test.js',
  'scheme-adapter.test.js', 'scheme-integration.test.js', 'data-loader.test.js',
]);
const scope = process.argv[2] ?? 'all';
if (!['all', 'public', 'data'].includes(scope)) throw new Error(`Unknown test scope: ${scope}`);
const root = fileURLToPath(new URL('../', import.meta.url));
const files = readdirSync(new URL('./tests/', import.meta.url))
  .filter(name => name.endsWith('.test.js'))
  .filter(name => scope === 'all' || dataTests.has(name) === (scope === 'data'))
  .sort().map(name => `qa/tests/${name}`);
if (!files.length) throw new Error('No tests selected');
console.log(`QA ${scope}: ${files.length} files`);
// 共有fixtureの多重読込みによるメモリ消費を抑え，ファイルを各1回だけ実行する．
const result = spawnSync(process.execPath, ['--test', '--test-concurrency=4', ...files], {
  cwd: root, stdio: 'inherit',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
