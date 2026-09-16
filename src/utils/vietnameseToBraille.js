/**
 * vietnameseToBraille.js
 * Chuyển tiếng Việt sang Braille (đi qua NFC normalize + tách dấu)
 */
import { normalizeVietnamese, getVietCharInfo } from './normalizeVietnamese.js';
import { charToBrailleMap, toneNameToBraille, digits, numbers } from '../data/vietnameseBraille.js';

// Map char lower -> braille char
const LETTER_MAP = new Map(charToBrailleMap); // a-z already
// Thêm các chữ đặc biệt đã có trong charToBrailleMap
// Tone mapping
const TONE_TO_BRAILLE = toneNameToBraille;
const NUMBER_SIGN = numbers[0].braille; // ⠼
const CAPITAL_SIGN = '⠠';

const digitSet = new Set(['0','1','2','3','4','5','6','7','8','9']);
const digitBrailleMap = new Map(digits.map(d=>[d.character, d.braille])); // nhưng dùng a-j fallback cũng ok

// Punctuation direct map
const PUNCT_MAP = new Map([
  ['.', '⠲'], [',','⠂'], [';','⠆'], [':','⠒'], ['?','⠦'], ['!','⠖'], ['-','⠤'],
  ['(','⠶'], [')','⠶'], ['"','⠦'], ["'",'⠄'], ['…','⠔⠔⠔'], ['/','⠌'],
]);

function mapBaseChar(ch){
  // ch có thể là chữ hoa/thường đã tách base
  const lower = ch.toLowerCase();
  if (LETTER_MAP.has(lower)) return LETTER_MAP.get(lower);
  // fallback
  if (PUNCT_MAP.has(ch)) return PUNCT_MAP.get(ch);
  return null;
}

/**
 * Parse một ký tự tiếng Việt thành tokens Braille
 * Ví dụ: 'à' -> tone huyền + 'a'
 *         'M' -> capital sign + 'm'
 */
function charToBrailleTokens(ch){
  if (ch === ' ') return [' '];
  if (ch === '\n') return ['\n'];
  if (digitSet.has(ch)) {
    // Mỗi chữ số: number sign + digit braille? Theo spec, có number sign khi bắt đầu dãy số.
    // Để đơn giản ổn định round-trip: luôn dùng digit mapping (a-j). Khi decode, nếu thấy ⠼ thì biết là số.
    // Ở đây ta sẽ để caller nhóm số; nhưng với single char, trả về digit braille + cần number sign ở encodeWord level.
    return [digitBrailleMap.get(ch) || ch];
  }
  if (PUNCT_MAP.has(ch)) return [PUNCT_MAP.get(ch)];

  const info = getVietCharInfo(ch);
  if (!info) {
    // ký tự không hỗ trợ -> giữ nguyên? trả về ký tự gốc để không mất dữ liệu
    return [ch];
  }
  const tokens=[];
  // Xử lý hoa — dùng info từ map, fallback so sánh lower
  const isUpper = ch !== ch.toLowerCase() && ch.toUpperCase()===ch;
  if (isUpper) tokens.push(CAPITAL_SIGN);
  // Dấu thanh tách riêng (nếu có)
  if (info.tone) {
    const toneBraille = TONE_TO_BRAILLE[info.tone];
    if (toneBraille) tokens.push(toneBraille);
  }
  // base
  const baseLower = info.base.toLowerCase();
  const baseBraille = LETTER_MAP.get(baseLower);
  if (baseBraille) tokens.push(baseBraille);
  else tokens.push(info.base);

  return tokens;
}

/**
 * Convert full Vietnamese text -> Braille string
 * Xử lý:
 *  - normalize NFC
 *  - nhóm số: chèn NUMBER_SIGN trước mỗi cụm số liên tiếp
 *  - tách dấu theo charToBrailleTokens
 */
export function vietnameseToBraille(text){
  if (!text) return '';
  const norm = normalizeVietnamese(String(text));
  let out = '';
  let inNumberSequence = false;

  for (let i=0; i<norm.length; i++){
    const ch = norm[i];
    if (digitSet.has(ch)){
      if (!inNumberSequence){
        out += NUMBER_SIGN;
        inNumberSequence = true;
      }
      out += digitBrailleMap.get(ch) || ch;
      continue;
    } else {
      inNumberSequence = false;
    }

    if (ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r'){
      out += ch;
      continue;
    }
    if (PUNCT_MAP.has(ch)){
      out += PUNCT_MAP.get(ch);
      continue;
    }
    const tokens = charToBrailleTokens(ch);
    out += tokens.join('');
  }
  return out;
}

// Helpers for engine API
export function getBrailleForCharacter(character){
  if (!character) return null;
  if (digitSet.has(character)) return digitBrailleMap.get(character) || null;
  if (PUNCT_MAP.has(character)) return PUNCT_MAP.get(character);
  const info = getVietCharInfo(character);
  if (!info) return null;
  // trả về Braille của base (không kèm tone/capital) — để tra cứu đơn ký tự
  return LETTER_MAP.get(info.base.toLowerCase()) || null;
}

export function getCharacterForBraille(braille){
  // reverse lookup cho letters
  for (const [k,v] of LETTER_MAP.entries()){
    if (v===braille) return k;
  }
  // digits
  for (const [k,v] of digitBrailleMap.entries()){
    if (v===braille) return k;
  }
  return null;
}
