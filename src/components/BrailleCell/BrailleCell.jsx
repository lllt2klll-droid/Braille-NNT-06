import './BrailleCell.css';

export default function BrailleCell({ dots=[], size='medium', interactive=false, showNumbers=false, showLabel='', onToggle }){
  const sizeClass = `braille-cell--${size}`;
  const dotSet = new Set(dots);
  const positions = [
    { n:1 }, { n:4 },
    { n:2 }, { n:5 },
    { n:3 }, { n:6 },
  ];
  // tránh double toggle giữa pointer và click tổng hợp
  const lastPointerRef = { current: 0 };
  const handlePointerDown = (e, n) => {
    if (!interactive) return;
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
    lastPointerRef.current = Date.now();
    if (onToggle) onToggle(n);
    if (navigator.vibrate) try { navigator.vibrate(10); } catch {}
  };
  const handleClick = (e, n) => {
    if (!interactive) return;
    // nếu vừa xử lý pointer (mobile) thì bỏ qua click tổng hợp
    if (Date.now() - lastPointerRef.current < 500) {
      e.preventDefault();
      return;
    }
    if (onToggle) onToggle(n);
  };

  return (
    <div className={`braille-cell ${sizeClass}`} role={interactive ? 'group' : undefined} aria-label={showLabel || `Ô Braille ${dots.join(',')}`}>
      <div className="braille-grid" onContextMenu={e=> e.preventDefault()}>
        {positions.map(p=> {
          const active = dotSet.has(p.n);
          return (
            <button
              key={p.n}
              type="button"
              className={`braille-dot ${active ? 'active':''}`}
              aria-pressed={active}
              aria-label={`Chấm ${p.n}${active ? ' đang bật' : ''}`}
              disabled={!interactive}
              onPointerDown={e=> handlePointerDown(e, p.n)}
              onClick={e=> handleClick(e, p.n)}
              onKeyDown={e=> {
                if (!interactive) return;
                if (e.key==='Enter' || e.key===' ') { e.preventDefault(); if (onToggle) onToggle(p.n); }
              }}
            >
              <span className="dot-inner" aria-hidden />
              {showNumbers && <span className="dot-number" aria-hidden>{p.n}</span>}
            </button>
          );
        })}
      </div>
      {showLabel && <div className="braille-label" aria-live="polite">{showLabel}</div>}
    </div>
  );
}
