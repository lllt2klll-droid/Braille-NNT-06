import './BrailleCell.css';
import { dotsToBraille } from '../../utils/brailleParser.js';

export default function BrailleCell({
  dots = [],
  activeDots,
  interactive = false,
  readonly = false,
  size = 'medium',
  label,
  showLabel,
  showDotNumbers,
  showNumbers,
  showCharacter = false,
  character,
  onToggle,
  onDotsChange,
  ariaLabel,
  id
}){
  // Support both dots and activeDots, showNumbers and showDotNumbers (compat)
  const effectiveDots = activeDots !== undefined ? activeDots : dots;
  const effectiveShowNumbers = showDotNumbers !== undefined ? showDotNumbers : (showNumbers !== undefined ? !!showNumbers : false);
  const effectiveLabel = label ?? showLabel ?? '';
  const isInteractive = interactive && !readonly;
  const sizeClass = `braille-cell--${size}`;
  const dotSet = new Set(effectiveDots);
  const positions = [{ n:1 }, { n:4 }, { n:2 }, { n:5 }, { n:3 }, { n:6 }];
  const brailleChar = effectiveDots.length ? dotsToBraille(effectiveDots) : '⠀';

  const handleToggle = (n) => {
    if(!isInteractive) return;
    if(onToggle) onToggle(n);
    if(onDotsChange){
      const next = dotSet.has(n) ? effectiveDots.filter(x=> x!==n) : [...effectiveDots, n].sort((a,b)=>a-b);
      onDotsChange(next);
    }
    if(navigator.vibrate) try { navigator.vibrate(10); } catch {}
  };

  const handleKeyDown = (e) => {
    if(!isInteractive) return;
    const k = e.key;
    if(k >= '1' && k <= '6'){
      e.preventDefault();
      handleToggle(Number(k));
    }
  };

  const cellAriaLabel = ariaLabel || effectiveLabel || (effectiveDots.length ? `Ô Braille ${brailleChar}, chấm ${effectiveDots.join(', ')}` : 'Ô Braille trống');

  return (
    <div
      className={`braille-cell ${sizeClass}`}
      role={isInteractive ? 'group' : undefined}
      aria-label={cellAriaLabel}
      id={id}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      data-interactive={isInteractive ? 'true' : 'false'}
    >
      <div className="braille-grid" role={isInteractive ? 'group' : undefined} aria-label={isInteractive ? 'Bàn phím 6 chấm — nhấn 1-6 để bật tắt' : undefined}>
        {positions.map(p=> {
          const active = dotSet.has(p.n);
          return (
            <button
              key={p.n}
              type="button"
              className={`braille-dot ${active ? 'active':''}`}
              aria-pressed={active}
              aria-label={`Chấm Braille số ${p.n}, ${active ? 'đã chọn' : 'chưa chọn'}`}
              disabled={!isInteractive}
              onClick={()=> handleToggle(p.n)}
              tabIndex={isInteractive ? 0 : -1}
            >
              <span className="dot-inner" aria-hidden />
              {effectiveShowNumbers && <span className="dot-number" aria-hidden>{p.n}</span>}
            </button>
          );
        })}
      </div>
      {effectiveLabel && <div className="braille-label" aria-live="polite">{effectiveLabel}</div>}
      {showCharacter && (
        <div className="braille-char-display" aria-hidden>
          <span className="braille-glyph">{character ?? brailleChar}</span>
          {character && <span className="small muted">{brailleChar}</span>}
        </div>
      )}
    </div>
  );
}
