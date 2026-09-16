import { useState, useEffect } from 'react';
import Icon from '../Icon/Icon.jsx';
import './Expand.css';

export default function Expand({ title, subtitle, defaultOpen=false, children, subtle=false }) {
  const [open, setOpen] = useState(defaultOpen);

  // trên điện thoại tự thu gọn để bớt lướt
  useEffect(()=>{
    if (window.innerWidth < 768 && !defaultOpen) setOpen(false);
  }, []);

  return (
    <div className={`expand ${subtle ? 'expand-subtle' : ''} ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="expand-head"
        aria-expanded={open}
        onClick={()=> setOpen(o=> !o)}
      >
        <div className="expand-titles">
          <span className="expand-title">{title}</span>
          {subtitle && <span className="expand-sub">{subtitle}</span>}
        </div>
        <span className={`expand-chevron ${open ? 'rotated' : ''}`} aria-hidden>
          <Icon name="chevron" size={16} />
        </span>
      </button>
      <div className={`expand-body ${open ? 'expanded' : 'collapsed'}`} aria-hidden={!open}>
        <div className="expand-inner">{children}</div>
      </div>
    </div>
  );
}
