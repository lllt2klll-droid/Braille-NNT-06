import './BrailleCell.css';

export default function BrailleCell({ dots=[], size='medium', interactive=false, showNumbers=false, showLabel='', onToggle }){
  const sizeClass = `braille-cell--${size}`;
  const dotSet = new Set(dots);
  const positions = [
    { n:1, x:0, y:0 }, { n:4, x:1, y:0 },
    { n:2, x:0, y:1 }, { n:5, x:1, y:1 },
    { n:3, x:0, y:2 }, { n:6, x:1, y:2 },
  ];
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
              aria-label={`Chấm ${p.n}`}
              disabled={!interactive}
              onClick={()=> { if (onToggle) onToggle(p.n); }}
              onTouchStart={e=> { if(interactive){ e.preventDefault(); if (onToggle) onToggle(p.n); } }}
            >
              <span className="dot-inner" />
              {showNumbers && <span className="dot-number">{p.n}</span>}
            </button>
          );
        })}
      </div>
      {showLabel && <div className="braille-label">{showLabel}</div>}
    </div>
  );
}
