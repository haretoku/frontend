// Static imports let Vite resolve the same assets in development and the Pages bundle．
export const assets=Object.freeze({
 // SVG <use> cannot load symbol fragments from data URLs．Keep this sprite as a file．
 titleArt:new URL('./assets/title-art.svg?no-inline',import.meta.url).href,
 'professor-chibi':new URL('./assets/professor-chibi.png',import.meta.url).href,
 navigator:new URL('./assets/navigator.png',import.meta.url).href,
 'pawn-male':new URL('./assets/pawn-male.png',import.meta.url).href,
 'pawn-female':new URL('./assets/pawn-female.png',import.meta.url).href,
 rooftops:new URL('./assets/harena-rooftops.png',import.meta.url).href
});
