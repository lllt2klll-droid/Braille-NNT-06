/**
 * brailleToVietnamese.js
 * Chuyển Braille -> tiếng Việt
 * Logic: Braille tokens -> letters, ghép tone + vowel
 */

// Inverse maps
const BRAILLE_TO_BASE = new Map([
  ['⠁','a'],['⠃','b'],['⠉','c'],['⠙','d'],['⠑','e'],['⠋','f'],['⠛','g'],['⠓','h'],
  ['⠊','i'],['⠚','j'],['⠅','k'],['⠇','l'],['⠍','m'],['⠝','n'],['⠕','o'],['⠏','p'],
  ['⠟','q'],['⠗','r'],['⠎','s'],['⠞','t'],['⠥','u'],['⠧','v'],['⠭','x'],['⠽','y'],['⠵','z'],
  ['⠷','ă'],['⠡','â'],['⠣','ê'],['⠹','ô'],['⠪','ơ'],['⠳','ư'],['⠫','đ'],
]);

const TONE_BRAILLE_TO_NAME = new Map([
  ['⠄','sắc'],['⠂','huyền'],['⠆','hỏi'],['⠒','ngã'],['⠲','nặng'], // lưu ý ⠲ cũng dùng cho '.' nên cần phân biệt context? Ưu tiên tone khi trước nguyên âm
]);

const BRAILLE_TO_PUNCT = new Map([
  ['⠲','.'],['⠂',','],['⠆',';'],['⠒',':'],['⠦','?'],['⠖','!'],['⠤','-'],['⠶','('],['⠌','/'],['⠄',"'"],
  // ⠔⠔⠔ -> … sẽ xử lý riêng
]);

const NUMBER_SIGN = '⠼';
const CAPITAL_SIGN = '⠠';

const DIGIT_BRAILLE_TO_DIGIT = new Map([
  ['⠁','1'],['⠃','2'],['⠉','3'],['⠙','4'],['⠑','5'],['⠋','6'],['⠛','7'],['⠓','8'],['⠊','9'],['⠚','0'],
]);

// Ghép base + tone -> ký tự có dấu
const COMPOSE_MAP = {
  'a': { 'sắc':'á','huyền':'à','hỏi':'ả','ngã':'ã','nặng':'ạ' },
  'ă': { 'sắc':'ắ','huyền':'ằ','hỏi':'ẳ','ngã':'ẵ','nặng':'ặ' },
  'â': { 'sắc':'ấ','huyền':'ầ','hỏi':'ẩ','ngã':'ẫ','nặng':'ậ' },
  'e': { 'sắc':'é','huyền':'è','hỏi':'ẻ','ngã':'ẽ','nặng':'ẹ' },
  'ê': { 'sắc':'ế','huyền':'ề','hỏi':'ể','ngã':'ễ','nặng':'ệ' },
  'i': { 'sắc':'í','huyền':'ì','hỏi':'ỉ','ngã':'ĩ','nặng':'ị' },
  'o': { 'sắc':'ó','huyền':'ò','hỏi':'ỏ','ngã':'õ','nặng':'ọ' },
  'ô': { 'sắc':'ố','huyền':'ồ','hỏi':'ổ','ngã':'ỗ','nặng':'ộ' },
  'ơ': { 'sắc':'ớ','huyền':'ờ','hỏi':'ở','ngã':'ỡ','nặng':'ợ' },
  'u': { 'sắc':'ú','huyền':'ù','hỏi':'ủ','ngã':'ũ','nặng':'ụ' },
  'ư': { 'sắc':'ứ','huyền':'ừ','hỏi':'ử','ngã':'ữ','nặng':'ự' },
  'y': { 'sắc':'ý','huyền':'ỳ','hỏi':'ỷ','ngã':'ỹ','nặng':'ỵ' },
};

function compose(base, tone){
  if(!tone) return base;
  const lower = base.toLowerCase();
  const entry = COMPOSE_MAP[lower];
  if(!entry) return base; // phụ âm không mang dấu -> bỏ tone? nhưng spec nói tone tách riêng trước nguyên âm, nên base là nguyên âm
  const composed = entry[tone];
  if(!composed) return base;
  // giữ hoa
  if(base !== lower) return composed.toUpperCase();
  return composed;
}

/**
 * Chuyển chuỗi Braille -> tiếng Việt
 * Xử lý: capital sign, number sign, tone prefix
 */
export function brailleToVietnamese(braille){
  if(!braille) return '';
  let out = '';
  let pendingTone = null;
  let pendingCapital = false;
  let inNumber = false;
  let numberBufferActive = false; // sau ⠼ thì các ký tự a-j được hiểu là số cho đến khi gặp khoảng trắng hoặc không phải braille số

  for(let i=0; i<braille.length; i++){
    const ch = braille[i];

    // whitespace giữ nguyên
    if(ch===' ' || ch==='\n' || ch==='\t' || ch==='\r'){
      out += ch;
      pendingTone = null;
      pendingCapital = false;
      inNumber = false;
      numberBufferActive = false;
      continue;
    }

    // ... check for ellipsis ⠔⠔⠔ (3 chars)
    if(ch==='⠔' && braille[i+1]==='⠔' && braille[i+2]==='⠔'){
      out += '…';
      i+=2;
      pendingTone=null; pendingCapital=false; inNumber=false;
      continue;
    }

    if(ch===CAPITAL_SIGN){
      pendingCapital = true;
      continue;
    }
    if(ch===NUMBER_SIGN){
      inNumber = true;
      numberBufferActive = true;
      continue;
    }

    // Trong mode số: a-j -> digits
    if(inNumber && numberBufferActive){
      const digit = DIGIT_BRAILLE_TO_DIGIT.get(ch);
      if(digit){
        out += digit;
        continue;
      } else {
        // kết thúc dãy số
        inNumber = false;
        numberBufferActive = false;
        // fallback tiếp tục xử lý ký tự hiện tại như chữ thường
      }
    }

    // Tone?
    if(TONE_BRAILLE_TO_NAME.has(ch)){
      // Heuristic: nếu ch là ⠲ hoặc ⠂ ... có thể là dấu câu.
      // Ưu tiên: nếu ký tự tiếp theo là nguyên âm Braille, thì hiểu là tone.
      const next = braille[i+1];
      const nextIsVowel = next && BRAILLE_TO_BASE.has(next) && /[aăâeêioôơuưy]/i.test(BRAILLE_TO_BASE.get(next) || '');
      const nextIsLetter = next && BRAILLE_TO_BASE.has(next);
      // Nếu next là chữ thì khả năng là tone; nếu không, có thể là dấu câu
      // Để ổn định round-trip: khi encode, tone luôn đặt trước vowel; nên khi decode, chỉ áp tone khi next là base vowel.
      if(nextIsVowel){
        pendingTone = TONE_BRAILLE_TO_NAME.get(ch);
        continue;
      }
      // Nếu không phải vowel nhưng vẫn là tone braille, có thể là tone cho phụ âm? bỏ qua, coi là tone chung
      // For safety, if nextIsLetter false, treat as punctuation later
      if(!nextIsLetter){
        // treat as punctuation if possible
        const p = BRAILLE_TO_PUNCT.get(ch);
        if(p){
          out += p;
          pendingTone=null; pendingCapital=false;
          continue;
        }
      } else {
        // next is consonant: tone shouldn't apply — nhưng spec vẫn tách tone trước vowel, nên bỏ pending?
        // giữ pendingTone cho tới khi gặp vowel
        pendingTone = TONE_BRAILLE_TO_NAME.get(ch);
        continue;
      }
    }

    // Punctuation?
    if(BRAILLE_TO_PUNCT.has(ch) && !BRAILLE_TO_BASE.has(ch)){
      out += BRAILLE_TO_PUNCT.get(ch);
      pendingTone=null; pendingCapital=false;
      continue;
    }
    // Nếu vừa là letter vừa là punct trùng (⠲,⠂...), ưu tiên letter khi có pendingTone logic đã xử lý
    // Còn lại, nếu là braille letter:
    const base = BRAILLE_TO_BASE.get(ch);
    if(base){
      let charOut = base;
      if(pendingTone){
        charOut = compose(base, pendingTone);
        pendingTone = null;
      }
      if(pendingCapital){
        charOut = charOut.toUpperCase();
        pendingCapital = false;
      }
      out += charOut;
      continue;
    }

    // Braille không hỗ trợ
    out += ch; // giữ nguyên để báo "ký hiệu chưa hỗ trợ" ở UI có thể detect
  }

  return out;
}
