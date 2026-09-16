export const lessons = [
  {
    id: 'intro',
    title: 'Bài 1 – Làm quen với 6 chấm',
    shortTitle: '6 chấm',
    level: 'Beginner',
    description: 'Hiểu cách 6 chấm Braille được đánh số và cách tạo ký tự đầu tiên.',
    longDesc: 'Mỗi ô Braille gồm 6 chấm xếp 2 cột 3 hàng: 1-2-3 bên trái, 4-5-6 bên phải. Bật/tắt từng chấm tạo ra ký tự khác nhau.',
    steps: [
      { type: 'info', title: '6 chấm Braille là gì?', content: 'Một ô Braille có 6 chấm xếp thành 2 cột 3 hàng. Mỗi chấm có thể nổi lên hoặc không. Tổ hợp chấm khác nhau tạo thành ký tự khác nhau.', demoDots: [] },
      { type: 'try', title: 'Thử bật chấm 1', prompt: 'Hãy bật chấm 1 (trên cùng bên trái) để tạo chữ A (⠁)', expectedDots: [1], hint: 'Chấm 1 là trên cùng bên trái', explain: 'Chữ A sử dụng chấm số 1.' },
      { type: 'try', title: 'Thử chữ B', prompt: 'Chữ B gồm chấm 1 và 2 (⠃) – hai chấm trên bên trái', expectedDots: [1,2], hint: 'Hai chấm trên bên trái', explain: 'Chữ B sử dụng chấm 1 và 2.' },
      { type: 'try', title: 'Thử chữ C', prompt: 'Chữ C gồm chấm 1 và 4 (⠉) – trên cùng hai bên', expectedDots: [1,4], hint: 'Trên cùng bên trái và trên cùng bên phải', explain: 'Chữ C sử dụng chấm 1 và 4.' },
    ]
  },
  {
    id: 'level1',
    title: 'Bài 2 – Chữ A–J',
    shortTitle: 'A–J',
    level: 'Level 1',
    description: '10 chữ đầu tiên, nền tảng cho tất cả.',
    chars: ['a','b','c','d','e','f','g','h','i','j'],
    learnChars: true,
    hint: 'Nhóm A–J chỉ dùng chấm 1,2,4,5 (nửa trên của ô).'
  },
  {
    id: 'level2',
    title: 'Bài 3 – Chữ K–T',
    shortTitle: 'K–T',
    level: 'Level 2',
    description: 'Mở rộng với chấm 3 — thêm chấm dưới trái.',
    chars: ['k','l','m','n','o','p','q','r','s','t'],
    learnChars: true,
    hint: 'Nhóm K–T giống A–J nhưng thêm chấm 3.'
  },
  {
    id: 'level3',
    title: 'Bài 4 – Chữ U–Z',
    shortTitle: 'U–Z',
    level: 'Level 3',
    description: 'Nhóm cuối với chấm 6 — hoàn thiện bảng chữ cái.',
    chars: ['u','v','x','y','z'],
    learnChars: true,
    hint: 'Nhóm U–Z thêm chấm 3 và 6.'
  },
  {
    id: 'uppercase',
    title: 'Bài 5 – Chữ hoa',
    shortTitle: 'Chữ hoa',
    level: 'Level 4',
    description: 'Ký hiệu viết hoa ⠠ đặt trước chữ cái.',
    chars: ['A','B','C','D','E'],
    details: 'Viết hoa trong Braille dùng ký hiệu chấm 6 (⠠) đặt trước chữ thường. Ví dụ: ⠠⠁ = A, ⠠⠃ = B.',
    learnChars: true,
    specialType: 'capital'
  },
  {
    id: 'level4',
    title: 'Bài 6 – Nguyên âm và chữ đặc biệt',
    shortTitle: 'ă â ê ô ơ ư đ',
    level: 'Level 5',
    description: 'Các nguyên âm đặc biệt tiếng Việt và chữ đ.',
    chars: ['ă','â','ê','ô','ơ','ư','đ'],
    learnChars: true,
    hint: 'Đây là chữ riêng, không phải dấu thanh tách rời.'
  },
  {
    id: 'tones',
    title: 'Bài 6b – Dấu thanh',
    shortTitle: 'Dấu thanh',
    level: 'Level 5',
    description: 'Sắc huyền hỏi ngã nặng — dấu được đặt trước nguyên âm.',
    chars: ['sắc','huyền','hỏi','ngã','nặng'],
    details: 'Tiếng Việt đặt ký hiệu dấu trước nguyên âm: ⠄ sắc, ⠂ huyền, ⠆ hỏi, ⠒ ngã, ⠲ nặng.',
    specialType: 'tone'
  },
  {
    id: 'numbers',
    title: 'Bài 7 – Số',
    shortTitle: 'Số',
    level: 'Level 6',
    description: 'Ký hiệu số ⠼ và các chữ số 0-9.',
    chars: ['1','2','3','4','5','6','7','8','9','0'],
    details: 'Số trong Braille dùng ký hiệu số ⠼ (3-4-5-6) đặt trước dãy. Sau đó a–j trở thành 1–0.',
    specialType: 'number'
  },
  {
    id: 'punct',
    title: 'Bài 8 – Dấu câu',
    shortTitle: 'Dấu câu',
    level: 'Level 6',
    description: 'Chấm, phẩy, hỏi, chấm than, gạch ngang…',
    chars: ['.',',','?','!','-',':',';'],
    specialType: 'punctuation'
  },
  {
    id: 'level6',
    title: 'Bài 9 – Từ',
    shortTitle: 'Từ',
    level: 'Level 7',
    description: 'Ghép chữ thành từ thông dụng.',
    words: ['ba','me','xin chào','Việt Nam','học sinh','màn hình','bàn phím','chữ nổi'],
    learnChars: false
  },
  {
    id: 'sentences',
    title: 'Bài 10 – Câu',
    shortTitle: 'Câu',
    level: 'Level 8',
    description: 'Luyện đọc và gõ câu hoàn chỉnh.',
    sentences: ['Xin chào Việt Nam.', 'Tôi học chữ nổi.', 'Braille giúp kết nối.', 'Học sinh đang học bài.'],
    words: ['Xin chào Việt Nam','Tôi học chữ nổi','Braille giúp kết nối'],
    learnChars: false
  },
];

// Map for dashboard continue logic – keep compatibility with old learnProgress keys
export const lessonIndexMap = Object.fromEntries(lessons.map((l,i)=> [l.id,i]));
export function getLessonProgressPercent(completedIds){
  const total = lessons.length;
  const done = lessons.filter(l=> completedIds.includes(l.id)).length;
  return Math.round(done/total*100);
}
