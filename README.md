# VietBraille — Học và chuyển đổi chữ nổi tiếng Việt

Công cụ web miễn phí, chạy 100% trên trình duyệt giúp chuyển tiếng Việt ↔ Braille, học bảng chữ cái, luyện tập và gõ bằng bàn phím 6 chấm.

Không backend, không database, không đăng nhập, không gửi dữ liệu lên server. Dữ liệu học & cài đặt lưu bằng `localStorage`.

## Features
- Chuyển đổi Tiếng Việt ↔ Braille (tách dấu thanh, giữ hoa/thường, số, dấu câu)
- Bàn phím 6 chấm (touch + phím vật lý D S A J K L, Enter/Gửi, Backspace)
- Bảng chữ cái, tìm kiếm, filter
- Học theo cấp độ (Beginner → Level 6), tiến độ local
- Luyện tập: Quiz + Luyện gõ Braille
- Responsive 320 → 1440px, Light/Dark/System, Accessibility (ARIA, keyboard, focus, 44px)
- PWA manifest, offline sau khi tải, GitHub Pages ready

## Tech Stack
- React 19 + Vite 8 + React Router (HashRouter cho GitHub Pages)
- HTML5 / CSS3 / ES Modules, không thêm lib nặng
- Font: Quicksand (Google Fonts)

## Installation
```bash
npm install
npm run dev    # http://localhost:5173
npm run build
npm run preview
```

## Deploy GitHub Pages
Đã có workflow `.github/workflows/deploy.yml`:
```
checkout → setup node → npm ci → npm run build → deploy pages
```
Cấu hình `vite.config.js` có `base: './'` để chạy ổn trên Pages (cả project site). Push lên nhánh `main` là tự deploy.
Nếu là user/org site: đổi `base` thành `'/'` nếu cần.

## Architecture
```
UI → Application State → Braille Engine → Vietnamese Braille Data → LocalStorage
```
Engine tách khỏi UI: `src/utils/vietnameseToBraille.js`, `brailleToVietnamese.js`, `normalizeVietnamese.js`, `brailleParser.js`, `keyboardMapper.js`

## Vietnamese Braille Mapping
File source of truth: `src/data/vietnameseBraille.js`

- Chữ cái a-z: theo Braille quốc tế (a=⠁ b=⠃ …)
- Đặc biệt: ă ⠷, â ⠡, ê ⠣, ô ⠹, ơ ⠪, ư ⠳, đ ⠫
- Dấu thanh: tách riêng, đặt TRƯỚC nguyên âm — sắc ⠄, huyền ⠂, hỏi ⠆, ngã ⠒, nặng ⠲ (UNVERIFIED — cần đối chiếu chuẩn in nổi VN)
- Hoa: ⠠, Số: ⠼ + a-j
- Dấu câu: . , ; : ? ! - ( ) " ' … /

Xem chi tiết và sửa mapping trực tiếp trong `vietnameseBraille.js` — không hard-code trong engine.

### Tone Marks
Mỗi dấu chiếm 1 cell Braille đặt trước vowel mang dấu. Ví dụ "á" = ⠄⠁.

### Number Rules
Cụm số liên tiếp được tiền tố ⠼. Khi decode, ⠼ → các ký tự a-j tiếp theo hiểu là số cho đến khoảng trắng.

### Data Validation
`src/utils/validateBrailleData.js` kiểm tra duplicate, invalid unicode, missing fields. Chạy trong Settings.

## Accessibility
- Semantic HTML, ARIA labels, keyboard navigation (Tab/Enter/Space/Arrow)
- Focus visible, high contrast dark mode, không chỉ dùng màu (có ✓/✕ kèm text)
- Touch targets ≥44px, hỗ trợ touch/pointer

## License
MIT
