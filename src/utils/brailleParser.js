/**
 * brailleParser.js
 * Các hàm dots <-> braille + parser từ
 */
import { BRAILLE_BASE } from '../data/vietnameseBraille.js';

const DOT_VALUES = {1:1,2:2,3:4,4:8,5:16,6:32};

export function dotsToBraille(dots){
  let value = 0;
  for(const d of dots) value += DOT_VALUES[d] || 0;
  return String.fromCodePoint(BRAILLE_BASE + value);
}

export function brailleToDots(ch){
  if(!ch) return [];
  const cp = ch.codePointAt(0);
  if(cp < 0x2800 || cp > 0x28FF) return [];
  const v = cp - BRAILLE_BASE;
  const dots=[];
  if(v & 1) dots.push(1);
  if(v & 2) dots.push(2);
  if(v & 4) dots.push(3);
  if(v & 8) dots.push(4);
  if(v & 16) dots.push(5);
  if(v & 32) dots.push(6);
  return dots;
}

export function isBrailleChar(ch){
  if(!ch) return false;
  const cp = ch.codePointAt(0);
  return cp >= 0x2800 && cp <= 0x28FF;
}

export function getBrailleDotsLabel(dots){
  if(!dots || dots.length===0) return 'trống';
  return dots.join('-');
}

export function validateDots(dots){
  if(!Array.isArray(dots)) return false;
  return dots.every(d=> d>=1 && d<=6);
}
