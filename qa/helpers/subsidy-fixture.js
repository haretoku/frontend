import { readFileSync } from 'node:fs';

export function loadPublicData() {
  return JSON.parse(readFileSync(new URL('../../data/input/public-data.json', import.meta.url), 'utf8'));
}
