const destinations=[
  ['guides','/guides/','詳しいガイド'],
  ['press','/press/','プレスリリース'],
  ['data','/data/','補助金を調べる'],
  ['method','/pages/calculation-method.html','計算方法・使用データ']
];

// 配信HTMLへ同期する正本．閲覧時にヘッダーを挿入しない．
export function renderSiteHeader(current='') {
  return `<header class="map-header">
    <div class="header-inner">
      <a class="brand" href="/" aria-label="はれトクのマップ"><span class="brand__hare">はれ</span><span class="brand__toku">トク<img class="brand__mark" src="/map/assets/sun-face.svg" alt=""></span></a>
      <nav aria-label="主要メニュー" class="header-nav">
        <a class="map-link" href="/"${current==='map'?' aria-current="page"':''}>マップ</a>
        <div class="menu-wrap">
          <button id="menu-button" type="button" aria-expanded="false" aria-controls="menu"><span class="menu-lines" aria-hidden="true"></span>メニュー</button>
          <div id="menu" class="menu-panel" hidden>
            <a href="/simulator/">わが家のプランを見直す</a>
            <button id="reset" type="button">進み具合をリセット</button>
            <div class="menu-references">
              ${destinations.map(([id,url,label])=>`<a href="${url}"${current===id?' aria-current="page"':''}>${label}</a>`).join('\n              ')}
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <dialog id="reset-dialog" class="site-reset-dialog" aria-labelledby="reset-title" aria-describedby="reset-description">
    <h2 id="reset-title">進み具合をリセットしますか？</h2>
    <p id="reset-description">進み具合・診断条件・選んだ設備を消して，最初の状態へ戻します．</p>
    <div class="reset-actions"><button id="cancel-reset" type="button" class="secondary" autofocus>キャンセル</button><button id="confirm-reset" type="button" class="primary">リセットする</button></div>
  </dialog>`;
}

export function headerSection(path) {
  if(path==='index.html')return 'map';
  if(path==='press/index.html'||path==='guides/electricity-support-end/index.html')return 'press';
  if(path.startsWith('guides/'))return 'guides';
  if(path.startsWith('data/'))return 'data';
  if(path==='pages/calculation-method.html')return 'method';
  return '';
}
