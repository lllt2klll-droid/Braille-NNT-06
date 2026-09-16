import { useState, useMemo } from 'react';
import { allEntries } from '../../data/vietnameseBraille.js';
import BrailleCell from '../../components/BrailleCell/BrailleCell.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import { speak } from '../../utils/speak.js';
import './Search.css';

export default function Search(){
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);
  const results = useMemo(()=>{
    if(!q) return [];
    const qq = q.toLowerCase().trim();
    return allEntries.filter(e=> e.character.toLowerCase().includes(qq) || e.braille.includes(q) || e.label.toLowerCase().includes(qq) || e.dots.join('-').includes(qq) || e.type.toLowerCase().includes(qq)).slice(0,20);
  }, [q]);

  return (
    <div className="page container">
      <h1 className="page-title">Tra cứu</h1>
      <p className="page-subtitle">Tìm ký tự theo chữ, Braille, số chấm hoặc loại — bấm vào để xem chi tiết, nghe và sao chép.</p>
      <label className="input-label" htmlFor="search-input">Nhập ký tự — ví dụ: ê, ⠪, sắc</label>
      <input id="search-input" className="input" placeholder="Nhập ký tự… ví dụ: ê" value={q} onChange={e=> setQ(e.target.value)} autoFocus aria-label="Tìm kiếm ký tự Braille" />
      <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:10}}>
        {q && results.length===0 && <div className="card card-padded empty-state">Không tìm thấy kết quả cho "{q}"</div>}
        {results.map(e=>(
          <button key={e.character+e.braille} className="card card-padded" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, textAlign:'left', cursor:'pointer', width:'100%'}} onClick={()=> setSelected(e)} aria-label={`${e.label} ${e.braille}`}>
            <div style={{display:'flex', gap:12, alignItems:'center'}}>
              <BrailleCell dots={e.dots} size="small" />
              <div>
                <div style={{fontWeight:800}}>{e.character} <span className="muted">— {e.label}</span></div>
                <div className="small muted">Chấm: {e.dots.length? e.dots.join(' · '):'—'} • {e.type}</div>
              </div>
            </div>
            <div style={{fontSize:28, fontFamily:'var(--font-braille)'}}>{e.braille}</div>
          </button>
        ))}
        {!q && <div className="card card-padded muted small" style={{textAlign:'center'}}>Nhập từ khóa để tra cứu. Thử: "sắc", "đ", "⠁", "1-3-5" — hoặc vào <b>Bảng chữ cái</b> để duyệt đầy đủ.</div>}
      </div>
      <Modal open={!!selected} onClose={()=> setSelected(null)} title={selected?.label}>
        {selected && (
          <div style={{textAlign:'center', display:'flex', flexDirection:'column', gap:12, alignItems:'center'}}>
            <div style={{fontSize:48, fontFamily:'var(--font-braille)'}}>{selected.braille}</div>
            <BrailleCell dots={selected.dots} size="large" showDotNumbers />
            <div style={{fontSize:20, fontWeight:800}}>{selected.character}</div>
            <div className="small muted">Chấm: {selected.dots.join(' · ') || '—'} • {selected.type}</div>
            <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
              <button className="btn btn-ghost btn-sm" onClick={()=> speak(selected.character)}>🔊 Nghe</button>
              <button className="btn btn-secondary btn-sm" onClick={()=> navigator.clipboard.writeText(selected.braille)}>Sao chép Braille</button>
              <button className="btn btn-ghost btn-sm" onClick={()=> navigator.clipboard.writeText(selected.character)}>Sao chép chữ</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
