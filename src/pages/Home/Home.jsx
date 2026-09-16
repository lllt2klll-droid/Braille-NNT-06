import { Link } from 'react-router-dom';
import './Home.css';

export default function Home(){
  return (
    <div className="page container">
      <section className="hero">
        <div className="hero-badge">✨ Chạy 100% trên trình duyệt • Không cần tài khoản</div>
        <h1 className="hero-title">VietBraille<br/><span>Học và sử dụng chữ nổi tiếng Việt</span></h1>
        <p className="hero-desc">Khám phá chữ nổi Braille theo cách trực quan, đơn giản và dễ tiếp cận. Chuyển đổi, luyện gõ 6 chấm, học bảng chữ cái và luyện tập mỗi ngày.</p>
        <div className="hero-actions">
          <Link to="/converter" className="btn btn-primary btn-lg">🔄 Chuyển đổi</Link>
          <Link to="/learn" className="btn btn-secondary btn-lg">🎓 Học Braille</Link>
        </div>
        <div className="hero-stats">
          <div><b>32</b> ký tự cơ bản</div><span>•</span><div><b>5</b> dấu thanh</div><span>•</span><div><b>6</b> chấm</div>
        </div>
      </section>

      <section className="shortcuts">
        <Link to="/converter" className="card card-hover shortcut-card"><div className="sc-icon">🔄</div><div><div className="sc-title">Chuyển đổi</div><div className="small muted">Việt ↔ Braille tức thì</div></div></Link>
        <Link to="/keyboard" className="card card-hover shortcut-card"><div className="sc-icon">⠿</div><div><div className="sc-title">Bàn phím</div><div className="small muted">Gõ 6 chấm trực quan</div></div></Link>
        <Link to="/alphabet" className="card card-hover shortcut-card"><div className="sc-icon">🔤</div><div><div className="sc-title">Bảng chữ cái</div><div className="small muted">Tra cứu 60+ ký hiệu</div></div></Link>
        <Link to="/practice" className="card card-hover shortcut-card"><div className="sc-icon">✍️</div><div><div className="sc-title">Luyện tập</div><div className="small muted">Quiz & gõ Braille</div></div></Link>
      </section>

      <section className="info-grid grid-3" style={{marginTop:24}}>
        <div className="card card-padded">
          <h3 style={{marginTop:0}}>Braille là gì?</h3>
          <p className="muted small" style={{marginBottom:0}}>Hệ thống 6 chấm nổi giúp người khiếm thị đọc bằng tay. Mỗi ô 6 chấm tạo nên một ký tự — chữ, số hoặc dấu câu.</p>
        </div>
        <div className="card card-padded">
          <h3 style={{marginTop:0}}>Dấu thanh</h3>
          <p className="muted small" style={{marginBottom:0}}>Tiếng Việt đặt ký hiệu dấu trước nguyên âm: <code>⠄</code> sắc, <code>⠂</code> huyền... Không gộp chung vào chữ.</p>
        </div>
        <div className="card card-padded">
          <h3 style={{marginTop:0}}>Bàn phím 6 chấm</h3>
          <p className="muted small" style={{marginBottom:0}}>Chạm 6 nút hoặc dùng phím <b>D S A J K L</b>. Nhấn Gửi để tạo ký tự Braille.</p>
        </div>
      </section>
    </div>
  );
}
