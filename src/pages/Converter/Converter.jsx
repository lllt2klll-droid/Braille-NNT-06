import { useState, useEffect, useMemo } from 'react';
import { vietnameseToBraille } from '../../utils/vietnameseToBraille.js';
import { brailleToVietnamese } from '../../utils/brailleToVietnamese.js';
import { storage } from '../../utils/storage.js';
import { allEntries } from '../../data/vietnameseBraille.js';
import { brailleToDots } from '../../utils/brailleParser.js';
import BrailleKeyboard from '../../components/BrailleKeyboard/BrailleKeyboard.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import BrailleCharacterCard from '../../components/BrailleCharacterCard/BrailleCharacterCard.jsx';
import Icon from '../../components/Icon/Icon.jsx';
import Expand from '../../components/Expand/Expand.jsx';
import { Link } from 'react-router-dom';
import './Converter.css';

export default function Converter(){
  const [mode, setMode] = useState(()=> storage.get('converterMode','vi2br'));
  const [input, setInput] = useState(()=> storage.get('converterInput','Xin chào Việt Nam'));
  const [toast, setToast] = useState('');
  const [showExplain, setShowExplain] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [practiceWord, setPracticeWord] = useState('');

  useEffect(()=> storage.set('converterMode', mode), [mode]);
  useEffect(()=> storage.set('converterInput', input), [input]);

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

  const hasUnsupported = useMemo(()=>{
    if(mode!=='br2vi') return false;
    // detect braille chars not in mapping (remain as original)
    for(const ch of input){
      if(ch.trim()==='') continue;
      if(ch>='\u2800' && ch<='\u28FF'){
        const supported = allEntries.some(e=> e.braille===ch) || ['⠠','⠼'].includes(ch);
        if(!supported) return true;
      }
    }
    return false;
  }, [input, mode]);

  const explainRows = useMemo(()=>{
    if(!input || !output) return [];
    if(mode==='vi2br'){
      // Map each input char to braille tokens
      const rows=[];
      // Need to handle that vietnameseToBraille may expand char to multiple braille cells (tone+base, capital+base)
      // For explain we do char by char tokens using vietnameseToBraille per char
      for(let i=0;i<input.length;i++){
        const ch = input[i];
        if(ch===' '){ rows.push({ text:' ', braille:' ', dots:[], label:'Khoảng trắng'}); continue; }
        if(ch==='\n'){ rows.push({ text:'↵', braille:'↵', dots:[], label:'Xuống dòng'}); continue; }
        const br = vietnameseToBraille(ch);
        // For braille tokens, pick dots of first braille char if exists
        const firstBrChar = [...br][0] || '?';
        const dots = brailleToDots(firstBrChar);
        const entry = allEntries.find(e=> e.character.toLowerCase()===ch.toLowerCase() || e.braille===br) || null;
        rows.push({ text: ch, braille: br || '?', dots, entry, label: entry?.label || ch });
      }
      return rows;
    } else {
      // br2vi explain: each braille char -> text
      const rows=[];
      for(let i=0;i<input.length;i++){
        const ch = input[i];
        if(ch===' '){ rows.push({ text:' ', braille:' ', dots:[], label:'Khoảng trắng'}); continue; }
        const txt = brailleToVietnamese(ch);
        const dots = brailleToDots(ch);
        const entry = allEntries.find(e=> e.braille===ch) || null;
        rows.push({ text: txt, braille: ch, dots, entry, label: entry?.label || txt });
      }
      return rows;
    }
  }, [input, output, mode]);

  const stats = useMemo(()=> ({ inLen: input.length, outLen: output.length }), [input, output]);

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

  const handleExplainClick = (row)=>{
    // open card for that char
    let entry = row.entry;
    if(!entry && row.text && row.text!==' '){
      entry = allEntries.find(e=> e.character.toLowerCase()===row.text.toLowerCase()) || null;
      if(!entry && row.braille) entry = allEntries.find(e=> e.braille===row.braille) || null;
    }
    if(entry) setSelectedEntry(entry);
    else if(row.text) {
      // fallback: show generic
      setSelectedEntry({ character: row.text, braille: row.braille, dots: row.dots, label: row.label, type:'unknown', verified:false });
    }
  };

  return (
    <div className="page container">
      <h1 className="page-title">Chuyển đổi</h1>
      <p className="page-subtitle">Tiếng Việt ↔ Braille • Theo chuẩn tách dấu • Cập nhật tức thì • Không gửi dữ liệu ra ngoài</p>

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

      {mode==='br2vi' && (
        <div className="card card-padded" style={{marginTop:16}}>
          <div style={{fontWeight:700, marginBottom:8}}>Bàn phím 6 chấm — chạm để nhập Braille</div>
          <BrailleKeyboard onSend={ch=> setInput(prev=> prev + ch)} hideHistory={false} />
          <div className="small muted" style={{textAlign:'center', marginTop:8}}>Mỗi lần bấm <b>Gửi</b> sẽ thêm một ô Braille vào ô nhập phía trên • Phím 1-6 hoặc D S A J K L • Enter=Gửi</div>
        </div>
      )}
      <div className="conv-frame" style={{marginTop:16}}>
        <div style={{fontWeight:700, marginBottom:12}}>Chuyển đổi chữ nổi</div>
        <div className="converter-grid">
          <div className="card card-padded conv-card" style={{borderRadius:18}}>
            <label className="input-label" htmlFor="conv-input">{mode==='vi2br' ? 'Văn bản đầu vào' : 'Chữ nổi Braille'}</label>
            <textarea id="conv-input" className="textarea conv-textarea" placeholder={mode==='vi2br' ? 'Nhập nội dung cần chuyển đổi...' : 'Nhập Braille, ví dụ: ⠭⠔⠝ ⠡⠷⠕...'} value={input} onChange={e=> setInput(e.target.value)} aria-label={mode==='vi2br' ? 'Văn bản tiếng Việt' : 'Chữ nổi Braille'} />
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
            <label className="input-label">{mode==='vi2br' ? 'Kết quả' : 'Tiếng Việt'}</label>
            <div className={`conv-output braille-autofit`} aria-live="polite" style={{fontSize: mode==='vi2br' ? undefined : '16px', fontWeight: mode==='vi2br'?500:600}}>
              {output ? (mode==='vi2br' ? <>{[...output].map((ch,i)=> ch===' ' ? <span key={i} className="braille-space" /> : ch==='\n' ? <span key={i} style={{width:'100%'}} /> : <span key={i} className="braille-char-frame">{ch}</span>)}</> : output) : <span className="muted">Chưa có nội dung — Nhập văn bản để bắt đầu chuyển đổi sang chữ nổi.</span>}
            </div>
            {hasUnsupported && <div className="small" style={{color:'var(--color-warning)', fontWeight:700, marginTop:6}}>⚠ Ký tự Braille này chưa được hỗ trợ.</div>}
            <div className="conv-meta">
              <span className="small muted">Đã chuyển: {stats.outLen} ký tự</span>
              <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                <button className="btn btn-primary btn-sm" onClick={()=> { copy(output); if(input) pushHistory(mode==='vi2br'? input: output, mode==='vi2br'? output: input); }}><Icon name="copy" size={14}/> Sao chép</button>
                <button className="btn btn-secondary btn-sm" onClick={()=> setShowExplain(v=> !v)}>{showExplain ? 'Ẩn giải thích' : 'Giải thích'}</button>
                <button className="btn btn-secondary btn-sm" onClick={()=> { setShowExplain(true); setPracticeWord(input.slice(0,30)); }}>{showExplain ? 'Luyện' : 'Luyện từ kết quả'}</button>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:'flex', gap:8, marginTop:12, justifyContent:'center', flexWrap:'wrap'}}>
          <button className="btn btn-ghost btn-sm" onClick={clear}><Icon name="trash" size={14}/> Xóa</button>
          <button className="btn btn-secondary btn-sm" onClick={()=> copy(output)}><Icon name="copy" size={14}/> Sao chép kết quả</button>
          <button className="btn btn-soft btn-sm" onClick={()=> setShowExplain(v=> !v)}>{showExplain ? 'Ẩn giải thích' : 'Giải thích chi tiết'}</button>
        </div>

        {showExplain && (
          <div style={{marginTop:16}}>
            <h3 style={{margin:'0 0 8px'}}>Giải thích từng ký tự</h3>
            <p className="small muted" style={{marginTop:0}}>Bấm vào một ô để xem thẻ ký tự chi tiết.</p>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', minWidth:480}}>
                <thead>
                  <tr style={{textAlign:'left', borderBottom:'2px solid var(--color-border)', fontSize:13, color:'var(--color-text-secondary)'}}>
                    <th style={{padding:'8px'}}>Văn bản</th>
                    <th style={{padding:'8px'}}>Braille</th>
                    <th style={{padding:'8px'}}>Chấm</th>
                    <th style={{padding:'8px'}}>Nhấn để xem</th>
                  </tr>
                </thead>
                <tbody>
                  {explainRows.map((r,i)=>(
                    <tr key={i} style={{borderBottom:'1px solid var(--color-border)', cursor: r.text.trim() ? 'pointer':'default'}} onClick={()=> r.text.trim() && handleExplainClick(r)} onKeyDown={e=> { if((e.key==='Enter'||e.key===' ') && r.text.trim()){ e.preventDefault(); handleExplainClick(r); } }} tabIndex={r.text.trim() ? 0 : -1} role={r.text.trim() ? 'button' : undefined} aria-label={r.text.trim() ? `Xem chi tiết ${r.text} ${r.braille}` : undefined}>
                      <td style={{padding:'8px', fontWeight:700}}>{r.text}</td>
                      <td style={{padding:'8px', fontFamily:'var(--font-braille)', color:'var(--color-primary)'}}>{r.braille}</td>
                      <td style={{padding:'8px', fontSize:12}}>{r.dots.length ? r.dots.join(' · ') : '—'}</td>
                      <td style={{padding:'8px'}}>{r.text.trim() ? <span className="badge" style={{fontSize:11}}>Xem</span> : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
              <Link to="/practice" className="btn btn-primary btn-sm" onClick={()=> {
                if(mode==='vi2br'){
                  const words = input.split(/\s+/).filter(Boolean).slice(0,5);
                  storage.set('practiceFromConverter', words);
                }
              }}>Luyện nhận diện</Link>
              <Link to="/practice" className="btn btn-secondary btn-sm" onClick={()=> {
                const words = input.split(/\s+/).filter(Boolean).slice(0,5);
                storage.set('practiceFromConverter', words);
              }}>Tạo bài tập từ đoạn này</Link>
            </div>
            {practiceWord && (
              <div className="card card-padded" style={{marginTop:12, background:'var(--color-surface-2)'}}>
                <div className="small" style={{fontWeight:700}}>Luyện từ đoạn văn này: “{practiceWord}”</div>
                <div className="small muted">Đã lưu vào Luyện tập — vào mục Luyện tập để bắt đầu.</div>
              </div>
            )}
          </div>
        )}
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

      <Modal open={!!selectedEntry} onClose={()=> setSelectedEntry(null)} title={selectedEntry?.label || 'Chi tiết ký tự'}>
        {selectedEntry && (
          <div style={{display:'flex', justifyContent:'center'}}>
            <BrailleCharacterCard entry={selectedEntry} showTry={false} />
          </div>
        )}
      </Modal>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
