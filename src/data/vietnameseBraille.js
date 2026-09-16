/**
 * vietnameseBraille.js — Source of Truth cho mapping tiếng Việt ↔ Braille
 * Quy ước: Mỗi entry: { character, braille, dots, type, label }
 * 
 * LƯU Ý QUAN TRỌNG (theo yêu cầu spec §102):
 * - Dấu thanh được tách riêng, không gộp vào nguyên âm (trừ ă â ê ô ơ ư đ là dạng chữ riêng)
 * - Một số ký tự Braille tiếng Việt chưa có chuẩn thống nhất tuyệt đối; các entry đánh dấu UNVERIFIED
 *   sẽ có verified: false để UI hiển thị cảnh báo và dễ cập nhật.
 * 
 * Nguồn tham khảo logic:
 * - Cơ sở: Braille 6 chấm U+2800, dots 1..6 -> giá trị 1,2,4,8,16,32
 * - Bảng chữ cái a-z theo chuẩn Braille quốc tế cho chữ thường (a=⠁ b=⠃ ...)
 * - Tiếng Việt mở rộng: ă â ê ô ơ ư đ + 5 dấu thanh + số + dấu câu
 *   Dấu thanh Braille được thiết kế tách rời để engine ghép:  tone + vowel
 */

export const BRAILLE_BASE = 0x2800;

// Helper tạo ký tự Braille từ dots
export function dotsToChar(dots) {
  let v = 0;
  const map = {1:1,2:2,3:4,4:8,5:16,6:32};
  for (const d of dots) v += map[d] || 0;
  return String.fromCodePoint(BRAILLE_BASE + v);
}

// Helper: char -> dots (reverse)
export function charToDots(ch) {
  const code = ch.codePointAt(0) - BRAILLE_BASE;
  const dots = [];
  if (code & 1) dots.push(1);
  if (code & 2) dots.push(2);
  if (code & 4) dots.push(3);
  if (code & 8) dots.push(4);
  if (code & 16) dots.push(5);
  if (code & 32) dots.push(6);
  return dots;
}

/**
 * Bảng chữ cái cơ bản (a-z, không có f j w z hiếm dùng nhưng vẫn đầy đủ)
 * Theo Braille tiếng Việt thường dùng bảng chữ cái Pháp/Anh mở rộng.
 */
export const letters = [
  { character: 'a', braille: '⠁', dots: [1], type: 'letter', label: 'Chữ a', verified: true },
  { character: 'b', braille: '⠃', dots: [1,2], type: 'letter', label: 'Chữ b', verified: true },
  { character: 'c', braille: '⠉', dots: [1,4], type: 'letter', label: 'Chữ c', verified: true },
  { character: 'd', braille: '⠙', dots: [1,4,5], type: 'letter', label: 'Chữ d', verified: true },
  { character: 'e', braille: '⠑', dots: [1,5], type: 'letter', label: 'Chữ e', verified: true },
  { character: 'f', braille: '⠋', dots: [1,2,4], type: 'letter', label: 'Chữ f', verified: true },
  { character: 'g', braille: '⠛', dots: [1,2,4,5], type: 'letter', label: 'Chữ g', verified: true },
  { character: 'h', braille: '⠓', dots: [1,2,5], type: 'letter', label: 'Chữ h', verified: true },
  { character: 'i', braille: '⠊', dots: [2,4], type: 'letter', label: 'Chữ i', verified: true },
  { character: 'j', braille: '⠚', dots: [2,4,5], type: 'letter', label: 'Chữ j', verified: true },
  { character: 'k', braille: '⠅', dots: [1,3], type: 'letter', label: 'Chữ k', verified: true },
  { character: 'l', braille: '⠇', dots: [1,2,3], type: 'letter', label: 'Chữ l', verified: true },
  { character: 'm', braille: '⠍', dots: [1,3,4], type: 'letter', label: 'Chữ m', verified: true },
  { character: 'n', braille: '⠝', dots: [1,3,4,5], type: 'letter', label: 'Chữ n', verified: true },
  { character: 'o', braille: '⠕', dots: [1,3,5], type: 'letter', label: 'Chữ o', verified: true },
  { character: 'p', braille: '⠏', dots: [1,2,3,4], type: 'letter', label: 'Chữ p', verified: true },
  { character: 'q', braille: '⠟', dots: [1,2,3,4,5], type: 'letter', label: 'Chữ q', verified: true },
  { character: 'r', braille: '⠗', dots: [1,2,3,5], type: 'letter', label: 'Chữ r', verified: true },
  { character: 's', braille: '⠎', dots: [2,3,4], type: 'letter', label: 'Chữ s', verified: true },
  { character: 't', braille: '⠞', dots: [2,3,4,5], type: 'letter', label: 'Chữ t', verified: true },
  { character: 'u', braille: '⠥', dots: [1,3,6], type: 'letter', label: 'Chữ u', verified: true },
  { character: 'v', braille: '⠧', dots: [1,2,3,6], type: 'letter', label: 'Chữ v', verified: true },
  { character: 'x', braille: '⠭', dots: [1,3,4,6], type: 'letter', label: 'Chữ x', verified: true },
  { character: 'y', braille: '⠽', dots: [1,3,4,5,6], type: 'letter', label: 'Chữ y', verified: true },
  { character: 'z', braille: '⠵', dots: [1,3,5,6], type: 'letter', label: 'Chữ z', verified: true },
];

// Nguyên âm đặc biệt tiếng Việt
export const vowelsSpecial = [
  { character: 'ă', braille: '⠷', dots: [1,2,3,5,6], type: 'vowel', label: 'Chữ ă', verified: true },
  { character: 'â', braille: '⠡', dots: [1,6], type: 'vowel', label: 'Chữ â', verified: true },
  { character: 'ê', braille: '⠣', dots: [1,2,6], type: 'vowel', label: 'Chữ ê', verified: true },
  { character: 'ô', braille: '⠹', dots: [1,4,5,6], type: 'vowel', label: 'Chữ ô', verified: true },
  { character: 'ơ', braille: '⠪', dots: [2,4,6], type: 'vowel', label: 'Chữ ơ', verified: true },
  { character: 'ư', braille: '⠳', dots: [1,2,5,6], type: 'vowel', label: 'Chữ ư', verified: true },
  { character: 'đ', braille: '⠫', dots: [1,2,4,6], type: 'consonant', label: 'Chữ đ', verified: true },
];

// Dấu thanh — tách riêng (tone marks)
// Mỗi dấu chiếm 1 cell Braille đặt TRƯỚC nguyên âm mang dấu
// Mapping chọn các pattern ít va chạm với chữ cái; có thể điều chỉnh tập trung tại file này.
// Đánh dấu UNVERIFIED nếu cần rà soát chuẩn in nổi VN chính thức.
export const tones = [
  { character: 'sắc', braille: '⠄', dots: [3], type: 'tone', label: 'Dấu sắc', verified: false },
  { character: 'huyền', braille: '⠂', dots: [2], type: 'tone', label: 'Dấu huyền', verified: false },
  { character: 'hỏi', braille: '⠆', dots: [2,3], type: 'tone', label: 'Dấu hỏi', verified: false },
  { character: 'ngã', braille: '⠒', dots: [2,5], type: 'tone', label: 'Dấu ngã', verified: false },
  { character: 'nặng', braille: '⠲', dots: [2,5,6], type: 'tone', label: 'Dấu nặng', verified: false },
];

// Dấu viết hoa
export const capitals = [
  { character: 'CAPITAL', braille: '⠠', dots: [6], type: 'capital', label: 'Ký hiệu viết hoa', verified: true },
];

// Số — sử dụng number sign + chữ a-j cho 1-0
export const numbers = [
  { character: 'NUMBER_SIGN', braille: '⠼', dots: [3,4,5,6], type: 'number_sign', label: 'Ký hiệu số', verified: true },
];

export const digits = [
  { character: '1', braille: '⠁', dots: [1], type: 'digit', label: 'Số 1', verified: true },
  { character: '2', braille: '⠃', dots: [1,2], type: 'digit', label: 'Số 2', verified: true },
  { character: '3', braille: '⠉', dots: [1,4], type: 'digit', label: 'Số 3', verified: true },
  { character: '4', braille: '⠙', dots: [1,4,5], type: 'digit', label: 'Số 4', verified: true },
  { character: '5', braille: '⠑', dots: [1,5], type: 'digit', label: 'Số 5', verified: true },
  { character: '6', braille: '⠋', dots: [1,2,4], type: 'digit', label: 'Số 6', verified: true },
  { character: '7', braille: '⠛', dots: [1,2,4,5], type: 'digit', label: 'Số 7', verified: true },
  { character: '8', braille: '⠓', dots: [1,2,5], type: 'digit', label: 'Số 8', verified: true },
  { character: '9', braille: '⠊', dots: [2,4], type: 'digit', label: 'Số 9', verified: true },
  { character: '0', braille: '⠚', dots: [2,4,5], type: 'digit', label: 'Số 0', verified: true },
];

// Dấu câu
export const punctuation = [
  { character: '.', braille: '⠲', dots: [2,5,6], type: 'punctuation', label: 'Dấu chấm', verified: false },
  { character: ',', braille: '⠂', dots: [2], type: 'punctuation', label: 'Dấu phẩy', verified: false },
  { character: ';', braille: '⠆', dots: [2,3], type: 'punctuation', label: 'Dấu chấm phẩy', verified: false },
  { character: ':', braille: '⠒', dots: [2,5], type: 'punctuation', label: 'Dấu hai chấm', verified: false },
  { character: '?', braille: '⠦', dots: [2,3,6], type: 'punctuation', label: 'Dấu hỏi', verified: false },
  { character: '!', braille: '⠖', dots: [2,3,5], type: 'punctuation', label: 'Dấu chấm than', verified: false },
  { character: '-', braille: '⠤', dots: [3,6], type: 'punctuation', label: 'Dấu gạch ngang', verified: true },
  { character: '(', braille: '⠶', dots: [2,3,5,6], type: 'punctuation', label: 'Mở ngoặc', verified: false },
  { character: ')', braille: '⠶', dots: [2,3,5,6], type: 'punctuation', label: 'Đóng ngoặc', verified: false },
  { character: '"', braille: '⠦', dots: [2,3,6], type: 'punctuation', label: 'Dấu nháy kép', verified: false },
  { character: "'", braille: '⠄', dots: [3], type: 'punctuation', label: 'Dấu nháy đơn', verified: false },
  { character: '…', braille: '⠔⠔⠔', dots: [], type: 'punctuation', label: 'Dấu ba chấm', verified: false },
  { character: '/', braille: '⠌', dots: [3,4], type: 'punctuation', label: 'Dấu gạch chéo', verified: false },
];

// Tổng hợp
export const allEntries = [
  ...letters,
  ...vowelsSpecial,
  ...tones,
  ...capitals,
  ...numbers,
  ...digits,
  ...punctuation,
];

// Map nhanh
export const charToBrailleMap = new Map();
export const brailleToCharMap = new Map();
for (const e of letters) charToBrailleMap.set(e.character, e.braille);
for (const e of vowelsSpecial) charToBrailleMap.set(e.character, e.braille);
charToBrailleMap.set('đ', '⠫');

export const toneNameToBraille = Object.fromEntries(tones.map(t => [t.character, t.braille]));
export const brailleToToneName = Object.fromEntries(tones.map(t => [t.braille, t.character]));

// Braille language object extensible
export const vietnameseBraille = {
  name: 'Vietnamese',
  letters, vowelsSpecial, tones, capitals, numbers, digits, punctuation, allEntries,
};
