const icons={
  clock:'<circle cx="24" cy="24" r="17"/><path d="M24 13v12l8 5"/>',
  question:'<path d="M15 17a9 9 0 0 1 18 0c0 7-9 6-9 13"/><circle cx="24" cy="37" r="1"/>',
  panel:'<path d="m8 17-4 19h29l-4-19ZM17 17l-1 19m7-19 1 19M6 26h25M18.5 36v7m-6 0h12"/><path d="m39 4-8 11h6l-3 10L45 10h-7Z" opacity=".5"/>',
  coin:'<circle cx="24" cy="24" r="19"/><path d="m16 13 8 11 8-11m-8 11v13m-8-12h16m-16 6h16"/>',
  outage:'<path d="M16 33v-3c0-5-6-7-6-15a14 14 0 0 1 28 0c0 8-6 10-6 15v3Zm0 5h16m-13 5h10"/><path d="M5 43 43 5"/>',
  inspect:'<circle cx="20" cy="20" r="14"/><path d="m30 30 13 13"/>',
  roof:'<path d="m3 17 13-12 13 12M8 13v18h13" opacity=".65"/><g transform="translate(12 12) scale(.75)" stroke-width="3"><path d="M29 7a13 13 0 0 0-14 17L4 35a6 6 0 0 0 9 9l12-12A13 13 0 0 0 42 17L31 28l-9-9Z" fill="#fffefa"/><circle cx="10" cy="38" r="1"/></g>',
  renew:'<path d="M6 17A18 18 0 0 1 39 11l3 5m0-10v10H32M42 31A18 18 0 0 1 9 37l-3-5m0 10V32h10"/><path d="m17 17-3 14h20l-3-14ZM23 17l-1 14m5-14 1 14M16 24h16M24 31v6m-5 0h10"/>',
  document:'<path d="M11 3h19l9 9v33H11ZM29 3v11h10M18 21h14m-14 7h9m-9 7h14"/>',
  talk:'<path d="M41 21a17 17 0 0 1-24 16L6 42l3-11A17 17 0 1 1 41 21Z"/><path d="M16 21h1m7 0h1m7 0h1"/>',
  book:'<path d="M24 11C18 6 9 6 4 8v31c7-2 14-2 20 3 6-5 13-5 20-3V8c-5-2-14-2-20 3Zm0 0v31M11 16h6m-6 7h6m14-7h6m-6 7h6"/>'
};
export function renderManualIcon(name){
  const path=icons[name];
  return path?'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>':'';
}