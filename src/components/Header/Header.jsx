import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../app/routes.js';
import './Header.css';

export default function Header({ theme, setTheme }){
  const loc = useLocation();

  return (
    <>
      <a href="#main" className="skip-link">Bỏ qua đến nội dung chính</a>
      {/* Desktop header */}
      <header className="desktop-header header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="VietBraille Trang chủ">
            <span className="brand-mark" aria-hidden>⠧⠃</span>
            <span className="brand-text">VietBraille</span>
            <span className="badge" style={{marginLeft:8}}>VN</span>
          </Link>
          <nav className="header-nav" aria-label="Điều hướng chính">
            {routes.filter(r=> !['/search','/settings','/help'].includes(r.path)).map(r=>(
              <Link key={r.path} to={r.path} className={`nav-link ${loc.pathname===r.path ? 'active':''}`}>{r.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link to="/search" className="btn btn-ghost btn-sm" aria-label="Tra cứu">🔎</Link>
            <button className="btn btn-ghost btn-sm" aria-label="Đổi giao diện" onClick={()=>{
              const next = theme==='light' ? 'dark' : theme==='dark' ? 'system' : 'light';
              setTheme(next);
            }} title={`Giao diện: ${theme}`}>
              {theme==='dark' ? '🌙' : theme==='light' ? '☀️' : '◐'}
            </button>
            <Link to="/settings" className="btn btn-secondary btn-sm">Cài đặt</Link>
          </div>
        </div>
      </header>

      {/* Mobile header */}
      <header className="mobile-header header">
        <div className="container header-inner">
          <Link to="/" className="brand"><span className="brand-mark">⠧⠃</span> VietBraille</Link>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <button className="btn btn-ghost btn-sm" aria-label="Đổi giao diện" onClick={()=>{
              const next = theme==='light' ? 'dark' : theme==='dark' ? 'system' : 'light';
              setTheme(next);
            }}>{theme==='dark' ? '🌙':'☀️'}</button>
            <button className="btn btn-secondary btn-sm" aria-label="Mở menu" onClick={()=>{
              document.getElementById('mobile-drawer')?.classList.toggle('open');
            }}>☰</button>
          </div>
        </div>
        <div id="mobile-drawer" className="mobile-drawer">
          {routes.map(r=>(
            <Link key={r.path} to={r.path} className={`drawer-link ${loc.pathname===r.path ? 'active':''}`} onClick={()=> document.getElementById('mobile-drawer')?.classList.remove('open')}>{r.icon} {r.label}</Link>
          ))}
        </div>
      </header>
    </>
  );
}
