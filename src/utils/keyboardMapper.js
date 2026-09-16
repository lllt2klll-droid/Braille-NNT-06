/**
 * keyboardMapper.js — ánh xạ phím vật lý -> chấm Braille
 * Mặc định hỗ trợ cả hai layout để thân thiện:
 *  d s a  <-> chấm 1 2 3  (tay trái)
 *  j k l  <-> chấm 4 5 6  (tay phải)
 * Ngoài ra hỗ trợ layout thay thế f d s j k l
 */

export const DEFAULT_KEY_MAP = {
  // Left hand
  'd': 1, 'D': 1,
  's': 2, 'S': 2,
  'a': 3, 'A': 3,
  // Right hand
  'j': 4, 'J': 4,
  'k': 5, 'K': 5,
  'l': 6, 'L': 6,
  // Alt layer (F D S J K L) cho người thuận kiểu khác
  'f': 1, 'F': 1,
};

export const ALT_KEY_MAP_2 = {
  'f': 1, 'd': 2, 's': 3,
  'j': 4, 'k': 5, 'l': 6,
  'F': 1, 'D': 2, 'S': 3,
  'J': 4, 'K': 5, 'L': 6,
};

export function getDotForKey(key, mapping = DEFAULT_KEY_MAP){
  return mapping[key] || null;
}

export function getKeysForDot(dot, mapping = DEFAULT_KEY_MAP){
  return Object.entries(mapping).filter(([,v])=> v===dot).map(([k])=> k);
}

export function isBrailleKey(key, mapping = DEFAULT_KEY_MAP){
  return key in mapping;
}
