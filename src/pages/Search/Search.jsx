import { useState, useMemo } from 'react';
import { allEntries } from '../../data/vietnameseBraille.js';
import './Search.css';

export default function Search(){
  const [q, setQ] = useState('');
  const results = useMemo(()=>{
    if(!q) return [];
    const qq = q.toLowerCase().trim();
    return allEntries.filter(e=> e.character.toLowerCase().includes(qq) || e.braille.includes(q) || e.label.toLowerCase().includes(qq) || e.dots.join('-').includes(qq) || e.type.toLowerCase().includes(qq)).slice(0,20);
  }, [q]);

  return (
    <div className="page container">
      <h1 className="page-title">Tra cứu</h1>
      <input className="input" placeholder="Tìm chữ, ký hiệu hoặc dấu… ví dụ: ơ, ⠪, chấm 2-4-6, sắc" value={q} onChange={e=> setQ(e.target.value)} autoFocus aria-label="Tìm kiếm" />
      <div style={{marginTop:16, display:'flex', flexDirection:'column', gap:10}}>
        {q && results.length===0 && <div className="card card-padded empty-state">Không tìm thấy kết quả cho "{q}"</div>}
        {results.map(e=>(
          <div key={e.character+e.braille} className="card card-padded" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
            <div>
              <div style={{fontWeight:800}}>{e.character} <span className="muted">— {e.label}</span></div>
              <div className="small muted">Chấm: {e.dots.length? e.dots.join('-'):'—'} • {e.type}</div>
            </div>
            <div style={{fontSize:28}}>{e.braille}</div>
          </div>
        ))}
        {!q && <div className="card card-padded muted small" style={{textAlign:'center'}}>Nhập từ khóa để tra cứu. Thử: "sắc", "đ", "⠁", "1-3-5"</div>}
      </div>
    </div>
  );
}
