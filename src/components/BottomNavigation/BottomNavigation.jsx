import { Link, useLocation } from 'react-router-dom';
import Icon from '../Icon/Icon.jsx';
import './BottomNavigation.css';

const items = [
  { path:'/', label:'Trang chủ', icon:'home' },
  { path:'/converter', label:'Chuyển đổi', icon:'swap' },
  { path:'/keyboard', label:'Bàn phím', icon:'keyboard' },
  { path:'/learn', label:'Học', icon:'learn' },
  { path:'/alphabet', label:'Thêm', icon:'more' },
];

export default function BottomNavigation(){
  const loc = useLocation();
  return (
    <nav className="bottom-nav" aria-label="Điều hướng di động">
      {items.map(it=>(
        <Link key={it.path} to={it.path} className={`bn-item ${loc.pathname===it.path ? 'active':''}`} aria-current={loc.pathname===it.path ? 'page':undefined}>
          <span className="bn-icon" aria-hidden><Icon name={it.icon} size={18} /></span>
          <span className="bn-label">{it.label}</span>
        </Link>
      ))}
    </nav>
  );
}
