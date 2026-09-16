import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../app/routes.js';
import Icon from '../Icon/Icon.jsx';
import './Header.css';

const routeIcon = { '/':'home','/converter':'swap','/keyboard':'keyboard','/alphabet':'alphabet','/learn':'learn','/practice':'practice','/search':'search','/settings':'settings','/help':'help' };

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
              <Link key={r.path} to={r.path} className={`nav-link ${loc.pathname===r.path ? 'active':''}`}><span style={{display:'inline-flex', verticalAlign:'middle', marginRight:6}}><Icon name={routeIcon[r.path]} size={14} /></span>{r.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link to="/search" className="btn btn-ghost btn-sm" aria-label="Tra cứu"><Icon name="search" size={16} /></Link>
            <button className="btn btn-ghost btn-sm" aria-label="Đổi giao diện" onClick={()=>{
              const next = theme==='light' ? 'dark' : theme==='dark' ? 'system' : 'light';
              setTheme(next);
            }} title={`Giao diện: ${theme}`}>
              {theme==='dark' ? <Icon name="moon" size={16}/> : theme==='light' ? <Icon name="sun" size={16}/> : <Icon name="settings" size={16}/>}
            </button>
            <Link to="/settings" className="btn btn-secondary btn-sm"><Icon name="settings" size={14}/> Cài đặt</Link>
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
            }}>{theme==='dark' ? <Icon name="moon" size={16}/> : <Icon name="sun" size={16}/>}</button>
            <button className="btn btn-secondary btn-sm" aria-label="Mở menu" onClick={()=>{
              document.getElementById('mobile-drawer')?.classList.toggle('open');
            }}><Icon name="menu" size={16}/></button>
          </div>
        </div>
        <div id="mobile-drawer" className="mobile-drawer">
          {routes.map(r=>(
            <Link key={r.path} to={r.path} className={`drawer-link ${loc.pathname===r.path ? 'active':''}`} onClick={()=> document.getElementById('mobile-drawer')?.classList.remove('open')}><Icon name={routeIcon[r.path]} size={16}/> {r.label}</Link>
          ))}
        </div>
      </header>
    </>
  );
}
