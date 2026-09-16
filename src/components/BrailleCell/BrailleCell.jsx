import './BrailleCell.css';

export default function BrailleCell({ dots=[], size='medium', interactive=false, showNumbers=false, showLabel='', onToggle }){
  const sizeClass = `braille-cell--${size}`;
  const dotSet = new Set(dots);
  const positions = [{ n:1 }, { n:4 }, { n:2 }, { n:5 }, { n:3 }, { n:6 }];

  return (
    <div className={`braille-cell ${sizeClass}`} role={interactive ? 'group' : undefined} aria-label={showLabel || `Ô Braille ${dots.join(',')}`}>
      <div className="braille-grid">
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
              onClick={()=> { if (interactive && onToggle) { onToggle(p.n); if (navigator.vibrate) try { navigator.vibrate(10); } catch {} } }}
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
