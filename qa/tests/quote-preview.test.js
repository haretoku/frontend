import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { quoteActionFor, quotePreviewEnabled, quoteMaterial } from '../../site/shared/quote-config.js';

test('ASP仮表示は開発実行かつloopbackだけで有効になる', () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    assert.equal(quotePreviewEnabled(true, host), true);
    assert.equal(quotePreviewEnabled(false, host), false);
  }
  for (const host of ['haretoku.jp', 'localhost.example.com', '127.0.0.1.example.com', '192.168.1.1', '']) {
    assert.equal(quotePreviewEnabled(true, host), false);
  }
});

test('本番やプレビューのビルドではASP接続を有効化しない', () => {
  const action = quoteActionFor(false, '127.0.0.1');
  assert.equal(action.disabled, true);
  assert.equal('url' in action, false);
  assert.equal('preview' in action, false);
});

test('ローカル接続には保存広告URLを使い，利用者条件を追加しない', () => {
  const action = quoteActionFor(true, '127.0.0.1');
  assert.equal(action.url, quoteMaterial.url);
  const url = new URL(action.url);
  assert.equal(url.hostname, 'px.a8.net');
  assert.deepEqual([...url.searchParams.keys()], ['a8mat']);
  assert.equal(quoteMaterial.materialVerified, false);
});

test('全HTMLの共通固定バー入口は1個だけで，表示条件をページ別に持たない', async () => {
  const root = new URL('../../site/', import.meta.url);
  const paths = (await readdir(root, { recursive: true })).filter(path => path.endsWith('.html'));
  assert(paths.length >= 12);
  for (const path of paths) {
    const html = await readFile(new URL(path.replaceAll('\\', '/'), root), 'utf8');
    assert.equal((html.match(/src="\/shared\/quote-entry\.js"/g) || []).length, 1, path);
  }
  const bar = await readFile(new URL('../../site/shared/fixed-quote-bar.js', import.meta.url), 'utf8');
  assert(!bar.includes('bar.hidden'));
  assert(!bar.includes('readState'));
  assert(!bar.includes("addEventListener('scroll'"));
});
