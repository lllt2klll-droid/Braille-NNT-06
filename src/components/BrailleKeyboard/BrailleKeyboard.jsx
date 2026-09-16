import { useEffect, useState, useCallback } from 'react';
import BrailleCell from '../BrailleCell/BrailleCell.jsx';
import { dotsToBraille } from '../../utils/brailleParser.js';
import { getDotForKey } from '../../utils/keyboardMapper.js';
import { storage } from '../../utils/storage.js';
import './BrailleKeyboard.css';

export default function BrailleKeyboard({ onSend, onBrailleChange }){
  const [dots, setDots] = useState([]);
  const [history, setHistory] = useState(()=> storage.get('kb_history', []));
  const keyMap = storage.get('keyboardMapping', null) || undefined;

  const toggle = useCallback((n)=>{
    setDots(prev=> prev.includes(n) ? prev.filter(x=> x!==n) : [...prev, n].sort((a,b)=>a-b));
    if(navigator.vibrate) try{ navigator.vibrate(12);}catch{}
  }, []);

  const brailleChar = dots.length ? dotsToBraille(dots) : '⠀';

  useEffect(()=>{
    if (onBrailleChange) onBrailleChange(brailleChar, dots);
  }, [brailleChar, dots, onBrailleChange]);

  const handleSend = useCallback(()=>{
    if(dots.length===0) return;
    const ch = dotsToBraille(dots);
    const next = [...history, ch];
    setHistory(next);
    storage.set('kb_history', next);
    if (onSend) onSend(ch, dots);
    setDots([]);
    if(navigator.vibrate) try{ navigator.vibrate([20,30,20]);}catch{}
  }, [dots, history, onSend]);

  const handleClearDots = useCallback(()=> setDots([]), []);
  const handleBackspace = useCallback(()=>{
    if(dots.length>0) setDots([]);
    else if(history.length>0){
      const next = history.slice(0,-1);
      setHistory(next);
      storage.set('kb_history', next);
    }
  }, [dots, history]);
  const handleClearAll = useCallback(()=>{
    setHistory([]);
    storage.set('kb_history', []);
    setDots([]);
  }, []);

  // physical keyboard — đặt sau khi handlers đã định nghĩa
  useEffect(()=>{
    const down = new Set();
    const onKeyDown = (e)=>{
      if(e.repeat) return;
      if(e.target.tagName==='INPUT' || e.target.tagName==='TEXTAREA') return;
      const dot = getDotForKey(e.key, keyMap);
      if(dot){
        e.preventDefault();
        down.add(dot);
        setDots(prev=> prev.includes(dot) ? prev : [...prev, dot].sort((a,b)=>a-b));
      }
      if(e.key==='Enter'){
        e.preventDefault();
        handleSend();
      }
      if(e.key==='Backspace'){
        e.preventDefault();
        handleBackspace();
      }
      if(e.key==='Escape'){
        setDots([]);
      }
    };
    const onKeyUp = (e)=>{
      const dot = getDotForKey(e.key, keyMap);
      if(dot) down.delete(dot);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return ()=> { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, [keyMap, handleSend, handleBackspace]);

  return (
    <div className="bk-root">
      <div className="bk-card">
        <BrailleCell dots={dots} size="large" interactive showNumbers={storage.get('showDotNumbers', true)} onToggle={toggle} showLabel={`${brailleChar}  •  chấm ${dots.join('-') || 'trống'}`} />
        <div className="bk-preview braille-autofit">
          <div className="braille-text" aria-live="polite" style={{whiteSpace:'nowrap'}}>{history.join(' ') || '— chưa có ký tự —'}</div>
          <div className="small muted" style={{marginTop:4}}>{history.length} ký tự</div>
        </div>
        <div className="bk-actions">
          <button className="btn btn-secondary" onClick={handleClearDots} aria-label="Xóa chấm">Xóa</button>
          <button className="btn btn-secondary" onClick={handleBackspace} aria-label="Xóa ký tự cuối">⌫ Xóa ký tự</button>
          <button className="btn btn-primary btn-large" onClick={handleSend} aria-label="Gửi ký tự Braille" disabled={dots.length===0}>Gửi</button>
        </div>
        <div className="bk-actions" style={{justifyContent:'center'}}>
          <button className="btn btn-ghost btn-sm" onClick={handleClearAll}>Xóa tất cả</button>
          <button className="btn btn-ghost btn-sm" onClick={()=>{
            const txt = history.join('');
            if(txt) navigator.clipboard.writeText(txt);
          }}>Sao chép</button>
        </div>
      </div>
      <div className="card card-padded" style={{marginTop:4, width:'100%', maxWidth:520}}>
        <div className="small muted" style={{textAlign:'center'}}>
          Nhấn các chấm 1-6 • Phím vật lý: <b>D S A</b> (1 2 3) và <b>J K L</b> (4 5 6) • Enter = Gửi • Backspace = Xóa • Esc = Xóa chấm
        </div>
      </div>
    </div>
  );
}
