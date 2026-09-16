import { Link } from 'react-router-dom';
import { storage } from '../../utils/storage.js';
import './Home.css';

export default function Home(){
  const history = storage.get('converterHistory', []);
  const progress = storage.get('learnProgress', {});
  const learned = Object.keys(progress).filter(k=> progress[k]).length;
  return (
    <div className="page container">
      <section className="hero">
        <div className="hero-illus" aria-hidden>
          <div className="illus-dots">
            <span className="idot active"></span><span className="idot"></span>
            <span className="idot active"></span><span className="idot active"></span>
            <span className="idot"></span><span className="idot"></span>
          </div>
          <span className="illus-braille">⠿</span>
        </div>
        <div className="hero-badge">✨ Chạy 100% trên trình duyệt • Không cần tài khoản</div>
        <h1 className="app-title hero-title">VietBraille<br/><span>Học chữ nổi – Kết nối bằng ngôn ngữ của đôi tay.</span></h1>
        <p className="hero-desc">Học, luyện tập và chuyển đổi chữ nổi tiếng Việt một cách trực quan, đơn giản và dễ tiếp cận.</p>
        <div className="hero-actions">
          <Link to="/learn" className="btn btn-primary btn-lg">Bắt đầu học</Link>
          <Link to="/converter" className="btn btn-secondary btn-lg">Chuyển đổi văn bản</Link>
        </div>
        <div className="hero-stats">
          <div><b>32</b> ký tự cơ bản</div><span>•</span><div><b>5</b> dấu thanh</div><span>•</span><div><b>6</b> chấm</div>
        </div>
      </section>

      <section className="shortcuts">
        <Link to="/keyboard" className="card card-hover shortcut-card"><div className="sc-icon">⠿</div><div><div className="sc-title">Bàn phím Braille</div><div className="small muted">Tập viết bằng 6 chấm</div></div></Link>
        <Link to="/converter" className="card card-hover shortcut-card"><div className="sc-icon">⇄</div><div><div className="sc-title">Chuyển đổi</div><div className="small muted">Tiếng Việt ↔ Braille</div></div></Link>
        <Link to="/alphabet" className="card card-hover shortcut-card"><div className="sc-icon">ABC</div><div><div className="sc-title">Bảng chữ cái</div><div className="small muted">Tra cứu ký hiệu</div></div></Link>
        <Link to="/practice" className="card card-hover shortcut-card"><div className="sc-icon">🎓</div><div><div className="sc-title">Học tập</div><div className="small muted">Học từng bước</div></div></Link>
      </section>

      {(history.length>0 || learned>0) && (
        <section className="grid-2" style={{marginTop:20}}>
          <div className="card card-padded">
            <div className="section-title" style={{fontSize:16}}>Tiến độ học</div>
            <div style={{height:8, background:'var(--color-border)', borderRadius:999, overflow:'hidden', margin:'8px 0'}}>
              <div style={{width:`${Math.round(learned/6*100)}%`, height:'100%', background:'var(--color-primary)', borderRadius:999}}></div>
            </div>
            <div className="small muted">{learned} / 6 bài học</div>
          </div>
          <div className="card card-padded">
            <div className="section-title" style={{fontSize:16}}>Gần đây</div>
            {history.length? history.slice(0,2).map((h,i)=><div key={i} className="small" style={{display:'flex', justifyContent:'space-between', gap:8, padding:'6px 0', borderBottom: i===0?'1px solid var(--color-border)':undefined}}><span style={{fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{h.vi.slice(0,24)}</span><span className="braille-text" style={{fontSize:16}}>{h.br.slice(0,8)}</span></div>) : <div className="small muted">Bạn chưa có hoạt động gần đây.</div>}
          </div>
        </section>
      )}

      <section className="card card-padded" style={{marginTop:20, display:'flex', gap:12, alignItems:'center'}}>
        <span style={{fontSize:20}}>♿</span>
        <div><div style={{fontWeight:700}}>Thiết kế hỗ trợ tiếp cận</div><div className="small muted">Bàn phím 44px, focus rõ, hỗ trợ screen reader và giảm chuyển động.</div></div>
        <Link to="/help" className="btn btn-soft btn-sm" style={{marginLeft:'auto'}}>Xem tùy chọn</Link>
      </section>

      <section className="info-grid grid-3" style={{marginTop:20}}>
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
