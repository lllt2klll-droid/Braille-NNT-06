import { Link } from 'react-router-dom';
import { storage } from '../../utils/storage.js';
import { lessons } from '../../data/lessons.js';
import Icon from '../../components/Icon/Icon.jsx';
import Expand from '../../components/Expand/Expand.jsx';
import './Home.css';

export default function Home(){
  const history = storage.get('converterHistory', []);
  const progress = storage.get('learnProgress', {});
  const completedIds = Object.keys(progress).filter(k=> progress[k]);
  const total = lessons.length;
  const done = completedIds.length;
  const pct = total ? Math.round(done/total*100) : 0;

  // determine current lesson: first not completed, or first
  let currentLesson = lessons.find(l=> !progress[l.id]) || lessons[0];
  const hasProgress = done > 0;

  const getStatus = (id)=>{
    if(progress[id]) return '✓ Đã hoàn thành';
    if(currentLesson.id===id) return '● Đang học';
    return '○ Chưa học';
  };

  return (
    <div className="page container">
      {/* HERO for new learner — spec §5 */}
      <section className="hero" aria-label="Giới thiệu VietBraille">
        <div className="hero-illus" aria-hidden>
          <div className="illus-dots">
            <span className="idot active"></span><span className="idot"></span>
            <span className="idot active"></span><span className="idot active"></span>
            <span className="idot"></span><span className="idot"></span>
          </div>
          <span className="illus-braille">⠿</span>
        </div>
        <div className="hero-badge">Chạy 100% trên trình duyệt • Không cần tài khoản</div>
        <h1 className="app-title hero-title">Học Braille tiếng Việt<br/>dễ dàng hơn</h1>
        <p className="hero-desc">Khám phá chữ nổi, luyện nhận diện và chuyển đổi văn bản tiếng Việt.</p>

        <div className="hero-actions">
          {hasProgress ? (
            <Link to="/learn" className="btn btn-primary btn-lg" aria-label="Tiếp tục bài đang học"><Icon name="play" size={16}/> ▶ Tiếp tục bài đang học</Link>
          ) : (
            <Link to="/learn" className="btn btn-primary btn-lg" aria-label="Bắt đầu học Braille"><Icon name="play" size={16}/> ▶ Bắt đầu học</Link>
          )}
          <Link to="/converter" className="btn btn-secondary btn-lg" aria-label="Chuyển đổi văn bản sang Braille"><Icon name="swap" size={16}/> 🔄 Chuyển đổi văn bản</Link>
        </div>

        {hasProgress && (
          <div style={{maxWidth:420, margin:'14px auto 0'}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:700}}>
              <span>Tiến trình học: {pct}%</span><span>{done}/{total} bài</span>
            </div>
            <div style={{height:10, background:'var(--color-border)', borderRadius:999, overflow:'hidden', marginTop:6}} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Tiến trình ${pct} phần trăm`}>
              <div style={{width:`${pct}%`, height:'100%', background:'var(--color-primary)', borderRadius:999, transition:'width 300ms ease'}}></div>
            </div>
          </div>
        )}

        <div className="hero-stats">
          <div><b>32</b> ký tự cơ bản</div><span>•</span><div><b>5</b> dấu thanh</div><span>•</span><div><b>6</b> chấm</div>
        </div>
      </section>

      {/* DASHBOARD — spec §6 */}
      <section aria-label="Bảng điều khiển học tập" style={{marginTop:20}}>
        <div className="grid-2">
          {/* Tiếp tục học */}
          <div className="card card-padded">
            <div className="section-title" style={{fontSize:16, display:'flex', alignItems:'center', gap:8}}><Icon name="learn" size={18}/> TIẾP TỤC HỌC</div>
            <div style={{marginTop:8}}>
              <div style={{fontWeight:800, fontSize:16}}>{currentLesson.title}</div>
              <div className="small muted">{currentLesson.description}</div>
              <div style={{height:8, background:'var(--color-border)', borderRadius:999, overflow:'hidden', margin:'10px 0'}}>
                <div style={{width:`${pct}%`, height:'100%', background:'var(--color-success)', borderRadius:999}}></div>
              </div>
              <Link to="/learn" className="btn btn-primary btn-sm" style={{marginTop:4}}>Tiếp tục</Link>
            </div>
          </div>

          {/* Lộ trình */}
          <div className="card card-padded">
            <div className="section-title" style={{fontSize:16}}>LỘ TRÌNH</div>
            <div style={{display:'flex', flexDirection:'column', gap:6}}>
              {lessons.slice(0,6).map(l=>(
                <div key={l.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 10px', borderRadius:10, background: currentLesson.id===l.id ? 'var(--color-primary-soft)' : 'transparent', border: currentLesson.id===l.id ? '1px solid rgba(91,103,241,0.15)' : '1px solid transparent'}}>
                  <span style={{fontWeight:600, fontSize:13}}>{l.shortTitle || l.title}</span>
                  <span className="small" style={{fontWeight:700, color: progress[l.id] ? 'var(--color-success)' : currentLesson.id===l.id ? 'var(--color-primary)' : 'var(--color-text-faint)'}}>{getStatus(l.id)}</span>
                </div>
              ))}
              <Link to="/learn" className="small" style={{textAlign:'center', marginTop:4, fontWeight:700}}>Xem tất cả {total} bài →</Link>
            </div>
          </div>
        </div>

        {/* Công cụ nhanh */}
        <div className="card card-padded" style={{marginTop:14}}>
          <div className="section-title" style={{fontSize:16}}>CÔNG CỤ NHANH</div>
          <div className="shortcuts" style={{marginTop:8}}>
            <Link to="/converter" className="card card-hover shortcut-card"><div className="sc-icon"><Icon name="swap" size={20}/></div><div><div className="sc-title">Chữ → Braille</div><div className="small muted">Chuyển văn bản</div></div></Link>
            <Link to="/converter" className="card card-hover shortcut-card"><div className="sc-icon">⠿</div><div><div className="sc-title">Braille → Chữ</div><div className="small muted">Giải mã</div></div></Link>
            <Link to="/alphabet" className="card card-hover shortcut-card"><div className="sc-icon"><Icon name="alphabet" size={20}/></div><div><div className="sc-title">Tra cứu</div><div className="small muted">Bảng chữ cái</div></div></Link>
            <Link to="/practice" className="card card-hover shortcut-card"><div className="sc-icon"><Icon name="learn" size={20}/></div><div><div className="sc-title">Luyện tập</div><div className="small muted">Quiz & gõ</div></div></Link>
          </div>
        </div>
      </section>

      {(history.length>0 || done>0) && (
        <section className="grid-2" style={{marginTop:14}}>
          <div className="card card-padded">
            <div className="section-title" style={{fontSize:16}}>Tiến độ học</div>
            <div style={{height:8, background:'var(--color-border)', borderRadius:999, overflow:'hidden', margin:'8px 0'}}>
              <div style={{width:`${pct}%`, height:'100%', background:'var(--color-primary)', borderRadius:999}}></div>
            </div>
            <div className="small muted">{done} / {total} bài học • {pct}%</div>
          </div>
          <div className="card card-padded">
            <div className="section-title" style={{fontSize:16}}>Gần đây</div>
            {history.length? history.slice(0,2).map((h,i)=><div key={i} className="small" style={{display:'flex', justifyContent:'space-between', gap:8, padding:'6px 0', borderBottom: i===0?'1px solid var(--color-border)':undefined}}><span style={{fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{h.vi.slice(0,24)}</span><span className="braille-text" style={{fontSize:16}}>{h.br.slice(0,8)}</span></div>) : <div className="small muted">Bạn chưa có hoạt động gần đây.</div>}
          </div>
        </section>
      )}

      <section className="card card-padded" style={{marginTop:14, display:'flex', gap:12, alignItems:'center'}}>
        <Icon name="learn" size={20} />
        <div><div style={{fontWeight:700}}>Thiết kế hỗ trợ tiếp cận</div><div className="small muted">Bàn phím 44px, focus rõ, hỗ trợ screen reader và giảm chuyển động.</div></div>
        <Link to="/help" className="btn btn-soft btn-sm" style={{marginLeft:'auto'}}><Icon name="help" size={14}/> Xem</Link>
      </section>

      <Expand title="Tìm hiểu nhanh" subtitle="Braille • Dấu thanh • Bàn phím 6 chấm" subtle defaultOpen={false}>
        <div className="info-grid grid-3">
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
            <p className="muted small" style={{marginBottom:0}}>Chạm 6 nút hoặc dùng phím <b>1 2 3 4 5 6</b> và <b>D S A J K L</b>. Nhấn Gửi để tạo ký tự.</p>
          </div>
        </div>
      </Expand>
    </div>
  );
}
