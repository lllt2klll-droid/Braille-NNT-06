/**
 * normalizeVietnamese.js
 * Chuẩn hóa Unicode tiếng Việt về NFC trước khi xử lý Braille.
 * Không làm mất dấu thanh, đ, ă â ê ô ơ ư.
 */

/**
 * Normalize text to NFC form.
 * Ví dụ: 'a' + combining acute -> 'á' (single codepoint)
 * @param {string} text
 * @returns {string}
 */
export function normalizeVietnamese(text) {
  if (typeof text !== 'string') return '';
  // NFC chuẩn hóa tổ hợp
  return text.normalize('NFC');
}

/**
 * Kiểm tra có phải khoảng trắng / xuống dòng không
 */
export function isWhitespace(ch) {
  return /\s/.test(ch);
}

// Bảng tham chiếu tách dấu (giữ để tài liệu, không dùng runtime)
const _TONE_MARKS = {
  'sắc': ['á','ắ','ấ','é','ế','í','ó','ố','ớ','ú','ứ','ý'],
  'huyền': ['à','ằ','ầ','è','ề','ì','ò','ồ','ờ','ù','ừ','ỳ'],
  'hỏi': ['ả','ẳ','ẩ','ẻ','ể','ỉ','ỏ','ổ','ở','ủ','ử','ỷ'],
  'ngã': ['ã','ẵ','ẫ','ẽ','ễ','ĩ','õ','ỗ','ỡ','ũ','ữ','ỹ'],
  'nặng': ['ạ','ặ','ậ','ẹ','ệ','ị','ọ','ộ','ợ','ụ','ự','ỵ'],
};

// Map ký tự có dấu -> { base, tone }
const VIET_CHAR_MAP = new Map();

// Build map
(function buildVietMap(){
  // plain vowels
  const plain = ['a','ă','â','e','ê','i','o','ô','ơ','u','ư','y'];
  // không dấu giữ nguyên
  for (const c of [...plain, 'b','c','d','đ','g','h','k','l','m','n','p','q','r','s','t','v','x']) {
    VIET_CHAR_MAP.set(c, { base: c, tone: null });
    VIET_CHAR_MAP.set(c.toUpperCase(), { base: c.toUpperCase(), tone: null, isUpper: true });
  }
  // tone variants (tài liệu)
  const _toneMap = {
    'sắc': { suffix: 'sắc' }, 'huyền': { suffix: 'huyền' }, 'hỏi': { suffix: 'hỏi' }, 'ngã': { suffix: 'ngã' }, 'nặng': { suffix: 'nặng' }
  };
  void _toneMap; void _TONE_MARKS;
  // Manual accurate mapping base + tone
  const detailed = [
    // a
    ['á','a','sắc'],['à','a','huyền'],['ả','a','hỏi'],['ã','a','ngã'],['ạ','a','nặng'],
    // ă
    ['ắ','ă','sắc'],['ằ','ă','huyền'],['ẳ','ă','hỏi'],['ẵ','ă','ngã'],['ặ','ă','nặng'],
    // â
    ['ấ','â','sắc'],['ầ','â','huyền'],['ẩ','â','hỏi'],['ẫ','â','ngã'],['ậ','â','nặng'],
    // e
    ['é','e','sắc'],['è','e','huyền'],['ẻ','e','hỏi'],['ẽ','e','ngã'],['ẹ','e','nặng'],
    // ê
    ['ế','ê','sắc'],['ề','ê','huyền'],['ể','ê','hỏi'],['ễ','ê','ngã'],['ệ','ê','nặng'],
    // i
    ['í','i','sắc'],['ì','i','huyền'],['ỉ','i','hỏi'],['ĩ','i','ngã'],['ị','i','nặng'],
    // o
    ['ó','o','sắc'],['ò','o','huyền'],['ỏ','o','hỏi'],['õ','o','ngã'],['ọ','o','nặng'],
    // ô
    ['ố','ô','sắc'],['ồ','ô','huyền'],['ổ','ô','hỏi'],['ỗ','ô','ngã'],['ộ','ô','nặng'],
    // ơ
    ['ớ','ơ','sắc'],['ờ','ơ','huyền'],['ở','ơ','hỏi'],['ỡ','ơ','ngã'],['ợ','ơ','nặng'],
    // u
    ['ú','u','sắc'],['ù','u','huyền'],['ủ','u','hỏi'],['ũ','u','ngã'],['ụ','u','nặng'],
    // ư
    ['ứ','ư','sắc'],['ừ','ư','huyền'],['ử','ư','hỏi'],['ữ','ư','ngã'],['ự','ư','nặng'],
    // y
    ['ý','y','sắc'],['ỳ','y','huyền'],['ỷ','y','hỏi'],['ỹ','y','ngã'],['ỵ','y','nặng'],
  ];
  for (const [ch, base, tone] of detailed) {
    VIET_CHAR_MAP.set(ch, { base, tone });
    VIET_CHAR_MAP.set(ch.toUpperCase(), { base: base.toUpperCase(), tone, isUpper: ch.toUpperCase() !== ch });
  }
})();

export function getVietCharInfo(ch) {
  return VIET_CHAR_MAP.get(ch) || null;
}

export function getToneOf(ch) {
  const info = VIET_CHAR_MAP.get(ch);
  return info ? info.tone : null;
}

export function getBaseOf(ch) {
  const info = VIET_CHAR_MAP.get(ch);
  return info ? info.base : ch;
}

export function isVietnameseLetter(ch) {
  return VIET_CHAR_MAP.has(ch);
}
