import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { quoteActionFor, quoteMaterial } from '../../site/shared/quote-config.js';

test('提供された自由テキスト素材は公開ビルド・localhostでも同じ導線になる', () => {
  for (const [development, hostname] of [[false, 'haretoku.jp'], [false, '127.0.0.1'], [true, 'localhost']]) {
    const action = quoteActionFor(development, hostname);
    assert.equal(action.disabled, false);
    assert.equal(action.label, '無料見積もり');
    assert.equal(action.url, 'https://px.a8.net/svt/ejp?a8mat=4BCKBS+DN6MUQ+3LME+66H9E');
    assert.equal('preview' in action, false);
  }
});

test('提供コードのリンクと計測画像を同じ素材で保持し，利用者条件を追加しない', () => {
  assert.equal(quoteMaterial.materialId, '038');
  assert.equal(quoteMaterial.materialVerified, true);
  assert.equal(quoteMaterial.impressionUrl, 'https://www11.a8.net/0.gif?a8mat=4BCKBS+DN6MUQ+3LME+66H9E');
  for (const source of [quoteMaterial.url, quoteMaterial.impressionUrl]) {
    const url = new URL(source);
    assert.deepEqual([...url.searchParams.keys()], ['a8mat']);
    assert.equal(url.search, '?a8mat=4BCKBS+DN6MUQ+3LME+66H9E');
  }
});

test('通常ページの共通固定バー入口は1個で，プレス記事には設置しない', async () => {
  const root = new URL('../../site/', import.meta.url);
  const paths = (await readdir(root, { recursive: true })).filter(path => path.endsWith('.html'));
  assert(paths.length >= 12);
  for (const path of paths) {
    const html = await readFile(new URL(path.replaceAll('\\', '/'), root), 'utf8');
    const releaseArticle = path.replaceAll('\\', '/') === 'guides/electricity-support-end/index.html';
    assert.equal((html.match(/src="\/shared\/quote-entry\.js"/g) || []).length, releaseArticle ? 0 : 1, path);
  }
  const bar = await readFile(new URL('../../site/shared/fixed-quote-bar.js', import.meta.url), 'utf8');
  assert(!bar.includes('bar.hidden'));
  assert(!bar.includes('readState'));
  assert(!bar.includes("addEventListener('scroll'"));
});
