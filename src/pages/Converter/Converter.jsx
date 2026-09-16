import { useState, useEffect, useMemo } from 'react';
import { vietnameseToBraille } from '../../utils/vietnameseToBraille.js';
import { brailleToVietnamese } from '../../utils/brailleToVietnamese.js';
import { storage } from '../../utils/storage.js';
import Icon from '../../components/Icon/Icon.jsx';
import Expand from '../../components/Expand/Expand.jsx';
import './Converter.css';

export default function Converter(){
  const [mode, setMode] = useState(()=> storage.get('converterMode','vi2br')); // vi2br | br2vi
  const [input, setInput] = useState(()=> storage.get('converterInput','Xin chào Việt Nam'));
  const [toast, setToast] = useState('');

  useEffect(()=> storage.set('converterMode', mode), [mode]);
  useEffect(()=> storage.set('converterInput', input), [input]);

  // history
  const [history, setHistory] = useState(()=> storage.get('converterHistory', []));
  const pushHistory = (vi, br)=>{
    const entry = { vi, br, at: Date.now() };
    setHistory(prev=>{
      const next = [entry, ...prev].slice(0,10);
      storage.set('converterHistory', next);
      return next;
    });
  };

  const output = useMemo(()=>{
    if(!input) return '';
    try{
      if(mode==='vi2br') return vietnameseToBraille(input);
      return brailleToVietnamese(input);
    } catch{ return 'Lỗi chuyển đổi'; }
  }, [input, mode]);

  const stats = useMemo(()=>{
    return { inLen: input.length, outLen: output.length };
  }, [input, output]);

  const copy = async (text)=>{
    try{ await navigator.clipboard.writeText(text); setToast('Đã sao chép!'); setTimeout(()=> setToast(''), 1500);}catch{}
  };
  const clear = ()=>{
    if(input.length>30){
      if(!confirm('Bạn có chắc muốn xóa nội dung?')) return;
    }
    setInput('');
  };
  const swap = ()=>{
    setMode(m=> m==='vi2br' ? 'br2vi':'vi2br');
    setInput(output);
  };

  return (
    <div className="page container">
      <h1 className="page-title">Chuyển đổi</h1>
      <p className="page-subtitle">Tiếng Việt ↔ Braille • Theo chuẩn tách dấu • Cập nhật tức thì</p>

      <div className="converter-toolbar">
        <div className="mode-switch" role="tablist" aria-label="Chiều chuyển đổi">
          <button role="tab" aria-selected={mode==='vi2br'} className={`seg ${mode==='vi2br'?'active':''}`} onClick={()=> setMode('vi2br')}>Tiếng Việt → Braille</button>
          <button role="tab" aria-selected={mode==='br2vi'} className={`seg ${mode==='br2vi'?'active':''}`} onClick={()=> setMode('br2vi')}>Braille → Tiếng Việt</button>
        </div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <button className="btn btn-secondary btn-sm" onClick={swap}><Icon name="swap" size={14}/> Đổi chiều</button>
          <button className="btn btn-ghost btn-sm" onClick={clear}><Icon name="trash" size={14}/> Xóa</button>
        </div>
      </div>

      <div className="conv-frame" style={{marginTop:16}}>
        <div style={{fontWeight:700, marginBottom:12}}>Chuyển đổi chữ nổi</div>
        <div className="converter-grid">
          <div className="card card-padded conv-card" style={{borderRadius:18}}>
            <label className="input-label" htmlFor="conv-input">{mode==='vi2br' ? 'Văn bản tiếng Việt' : 'Chữ nổi Braille'}</label>
            <textarea id="conv-input" className="textarea conv-textarea" placeholder={mode==='vi2br' ? 'Nhập nội dung cần chuyển đổi...' : 'Nhập Braille, ví dụ: ⠭⠔⠝ ⠡⠷⠕...'} value={input} onChange={e=> setInput(e.target.value)} aria-label="Ô nhập" />
            <div className="conv-meta">
              <span className="small muted">Đã nhập: {stats.inLen} ký tự</span>
              <button className="btn btn-ghost btn-sm" onClick={()=> copy(input)}><Icon name="copy" size={14}/> Sao chép</button>
            </div>
          </div>

          <div className="swap-center">
            <button className="btn btn-secondary swap-btn" aria-label="Đổi chiều" onClick={swap}><Icon name="swap" size={16}/></button>
            <button className="btn btn-ghost btn-sm" style={{marginTop:8}} onClick={swap}><Icon name="swap" size={14}/> Đổi chiều</button>
          </div>

          <div className="card card-padded conv-card" style={{borderRadius:18}}>
            <label className="input-label">{mode==='vi2br' ? 'Chữ nổi Braille' : 'Tiếng Việt'}</label>
            <div className={`conv-output braille-autofit ${mode==='vi2br' ? '':''}`} aria-live="polite" style={{fontSize: mode==='vi2br' ? undefined : '16px', fontWeight: mode==='vi2br'?500:600}}>
              {output ? (mode==='vi2br' ? <>{[...output].map((ch,i)=> ch===' ' ? <span key={i} className="braille-space" /> : ch==='\n' ? <span key={i} style={{width:'100%'}} /> : <span key={i} className="braille-char-frame">{ch}</span>)}</> : output) : <span className="muted">Chưa có nội dung — Nhập văn bản để bắt đầu chuyển đổi sang chữ nổi.</span>}
            </div>
            <div className="conv-meta">
              <span className="small muted">Đã chuyển: {stats.outLen} ký tự</span>
              <div style={{display:'flex', gap:8}}>
                <button className="btn btn-primary btn-sm" onClick={()=> { copy(output); if(input) pushHistory(mode==='vi2br'? input: output, mode==='vi2br'? output: input); }}><Icon name="copy" size={14}/> Sao chép</button>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:'flex', gap:8, marginTop:12, justifyContent:'center', flexWrap:'wrap'}}>
          <button className="btn btn-ghost btn-sm" onClick={clear}><Icon name="trash" size={14}/> Xóa</button>
          <button className="btn btn-secondary btn-sm" onClick={()=> copy(output)}><Icon name="copy" size={14}/> Sao chép kết quả</button>
        </div>
      </div>

      {history.length>0 && (
        <div style={{marginTop:16}}>
          <Expand title="Lịch sử" subtitle="10 gần nhất — bấm để mở" defaultOpen={false}>
            <div style={{display:'flex', justifyContent:'flex-end', marginBottom:8}}>
              <button className="btn btn-ghost btn-sm" onClick={()=> { setHistory([]); storage.set('converterHistory', []); }}><Icon name="trash" size={14}/> Xóa lịch sử</button>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              {history.map((h,i)=>(
                <div key={i} className="history-item">
                  <div className="small" style={{fontWeight:700}}>{h.vi.slice(0,80)}</div>
                  <div className="braille-text" style={{fontSize:16}}>{h.br.slice(0,80)}</div>
                </div>
              ))}
            </div>
          </Expand>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
