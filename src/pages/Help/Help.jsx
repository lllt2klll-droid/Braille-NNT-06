export default function Help(){
  return (
    <div className="page container">
      <h1 className="page-title">Trợ giúp</h1>
      <div className="grid-2">
        <div className="card card-padded">
          <h3>Braille là gì?</h3>
          <p className="muted small">Braille là hệ thống chữ nổi gồm 6 chấm. Mỗi ô 6 chấm có thể tạo 64 ký tự khác nhau. Người đọc dùng tay để cảm nhận.</p>
          <h3 style={{marginTop:16}}>6 chấm hoạt động thế nào?</h3>
          <p className="muted small">Đánh số: 1-2-3 bên trái, 4-5-6 bên phải. Bật chấm 1 = ⠁ (a). Bật 1+2 = ⠃ (b).</p>
          <h3>Dấu thanh</h3>
          <p className="muted small">Dấu được đặt trước nguyên âm: ví dụ "á" = dấu sắc + a. Không gộp chung.</p>
        </div>
        <div className="card card-padded">
          <h3>Bàn phím</h3>
          <p className="muted small">Chạm 6 nút trên màn hình hoặc dùng phím vật lý: <b>D S A</b> cho 1 2 3 và <b>J K L</b> cho 4 5 6. Enter = Gửi, Backspace = Xóa, Esc = Xóa chấm.</p>
          <h3 style={{marginTop:16}}>Sao không có đăng nhập?</h3>
          <p className="muted small">VietBraille chạy 100% trên trình duyệt, không gửi dữ liệu lên server. Tiến độ lưu ở localStorage.</p>
          <h3 style={{marginTop:16}}>Báo lỗi & đóng góp</h3>
          <p className="muted small">Nếu mapping chưa chính xác, vui lòng chỉnh tại <code>src/data/vietnameseBraille.js</code> và gửi PR.</p>
        </div>
      </div>
      <div className="card card-padded" style={{marginTop:16}}>
        <h3 style={{marginTop:0}}>Quyền riêng tư</h3>
        <p className="small muted" style={{marginBottom:0}}>VietBraille xử lý nội dung trực tiếp trên thiết bị. Ứng dụng không cần tài khoản và không gửi nội dung người dùng lên máy chủ. Không có tracking, không quảng cáo.</p>
      </div>
    </div>
  );
}
