export const lessons = [
  {
    id: 'intro',
    title: 'Làm quen với 6 chấm',
    level: 'Beginner',
    description: 'Hiểu cách 6 chấm Braille được đánh số và cách tạo ký tự.',
    steps: [
      { type: 'info', title: '6 chấm Braille', content: 'Mỗi ô Braille gồm 6 chấm xếp 2 cột, đánh số 1-3 bên trái và 4-6 bên phải. Bật/tắt từng chấm tạo ra ký tự khác nhau.', demoDots: [] },
      { type: 'try', title: 'Thử bật chấm 1', prompt: 'Hãy bật chấm 1 để tạo chữ A (⠁)', expectedDots: [1], hint: 'Chấm 1 là trên cùng bên trái' },
      { type: 'try', title: 'Thử chữ B', prompt: 'Chữ B gồm chấm 1 và 2 (⠃)', expectedDots: [1,2], hint: 'Hai chấm trên bên trái' },
    ]
  },
  {
    id: 'level1',
    title: 'Nhóm a – j',
    level: 'Level 1',
    description: '10 chữ đầu tiên, nền tảng cho tất cả.',
    chars: ['a','b','c','d','e','f','g','h','i','j']
  },
  {
    id: 'level2',
    title: 'Nhóm k – t',
    level: 'Level 2',
    description: 'Mở rộng với chấm 3.',
    chars: ['k','l','m','n','o','p','q','r','s','t']
  },
  {
    id: 'level3',
    title: 'Nhóm u – z',
    level: 'Level 3',
    description: 'Nhóm cuối với chấm 6.',
    chars: ['u','v','x','y','z']
  },
  {
    id: 'level4',
    title: 'Chữ đặc biệt',
    level: 'Level 4',
    description: 'ă â ê ô ơ ư đ',
    chars: ['ă','â','ê','ô','ơ','ư','đ']
  },
  {
    id: 'level5',
    title: 'Dấu thanh',
    level: 'Level 5',
    description: 'Sắc huyền hỏi ngã nặng — dấu được đặt trước nguyên âm.',
    chars: ['sắc','huyền','hỏi','ngã','nặng']
  },
  {
    id: 'level6',
    title: 'Từ và câu',
    level: 'Level 6',
    description: 'Ghép chữ thành từ: ba, mẹ, xin chào, Việt Nam',
    words: ['ba','me','xin chào','Việt Nam','học sinh','màn hình']
  },
];
