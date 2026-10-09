import { FontPair } from '../types/resume';

const LOADED_FONTS = new Set<string>(['poppins-inter']);

export function loadFontPairOnDemand(fontPair: FontPair): void {
  if (LOADED_FONTS.has(fontPair)) return;

  let href = '';
  if (fontPair === 'playfair-sourcesans') {
    href =
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap&subset=latin';
  } else if (fontPair === 'merriweather-lato') {
    href =
      'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Lato:wght@400;700&display=swap&subset=latin';
  }

  if (href) {
    LOADED_FONTS.add(fontPair);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}
