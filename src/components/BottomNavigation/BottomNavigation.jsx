import { Link, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

const items = [
  { path:'/', label:'Trang chủ', icon:'⌂' },
  { path:'/converter', label:'Chuyển đổi', icon:'🔄' },
  { path:'/keyboard', label:'Bàn phím', icon:'⠿' },
  { path:'/learn', label:'Học', icon:'🎓' },
  { path:'/alphabet', label:'Thêm', icon:'⋯' },
];

export default function BottomNavigation(){
  const loc = useLocation();
  return (
    <nav className="bottom-nav" aria-label="Điều hướng di động">
      {items.map(it=>(
        <Link key={it.path} to={it.path} className={`bn-item ${loc.pathname===it.path ? 'active':''}`} aria-current={loc.pathname===it.path ? 'page':undefined}>
          <span className="bn-icon" aria-hidden>{it.icon}</span>
          <span className="bn-label">{it.label}</span>
        </Link>
      ))}
    </nav>
  );
}
