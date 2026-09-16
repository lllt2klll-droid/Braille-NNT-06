import { useState, useMemo } from 'react';
import { allEntries } from '../../data/vietnameseBraille.js';
import Modal from '../../components/Modal/Modal.jsx';
import BrailleCell from '../../components/BrailleCell/BrailleCell.jsx';
import BrailleCharacterCard from '../../components/BrailleCharacterCard/BrailleCharacterCard.jsx';
import { speak } from '../../utils/speak.js';
import { Link } from 'react-router-dom';
import './Alphabet.css';

const FILTERS = [
  { key:'all', label:'Tất cả' },
  { key:'letter', label:'Chữ cái' },
  { key:'vowel', label:'Nguyên âm' },
  { key:'tone', label:'Dấu thanh' },
  { key:'digit', label:'Số' },
  { key:'punctuation', label:'Dấu câu' },
  { key:'consonant', label:'Đặc biệt' },
];

export default function Alphabet(){
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(()=>{
    let list = allEntries;
    if(filter!=='all') list = list.filter(e=> e.type===filter || (filter==='letter' && e.type==='letter') );
    if(q){
      const qq = q.toLowerCase();
      list = list.filter(e=> e.character.toLowerCase().includes(qq) || e.braille.includes(q) || e.label.toLowerCase().includes(qq) || e.dots.join('-').includes(qq));
    }
    // dedup by character
    const seen = new Set();
    return list.filter(e=> { if(seen.has(e.character+e.braille)) return false; seen.add(e.character+e.braille); return true; });
  }, [filter, q]);

  return (
    <div className="page container">
      <h1 className="page-title">Bảng chữ cái</h1>
      <p className="page-subtitle">Nhấn vào ô để xem chấm, Braille và mô tả • Hỗ trợ tìm kiếm</p>

      <div className="alphabet-controls">
        <input className="input" placeholder="Tìm chữ, ký hiệu hoặc dấu… ví dụ: ơ, ⠪, chấm 1" value={q} onChange={e=> setQ(e.target.value)} aria-label="Tìm kiếm" style={{maxWidth:420}} />
        <div className="filter-row">
          {FILTERS.map(f=>(
            <button key={f.key} className={`btn btn-sm ${filter===f.key ? 'btn-soft':'btn-secondary'}`} onClick={()=> setFilter(f.key)}>{f.label}</button>
          ))}
        </div>
      </div>

      <div className="alphabet-grid" style={{marginTop:16}}>
        {filtered.map(e=>(
          <button key={e.character+e.braille+e.type} className="alphabet-card" onClick={()=> setSelected(e)} aria-label={`${e.label} ${e.braille} chấm ${e.dots.join('-')}`}>
            <div className="alpha-top">
              <span className={`alpha-type ${e.type}`}>{e.type==='letter'?'chữ': e.type==='vowel'?'nguyên âm': e.type==='tone'?'dấu': e.type==='digit'?'số': e.type}</span>
              {!e.verified ? <span className="alpha-unverified">UNVERIFIED</span> : <span style={{width:8}} />}
            </div>
            <div className="alpha-braille-box">
              <span className="alpha-braille">{e.braille}</span>
            </div>
            <div style={{display:'flex', justifyContent:'center', marginTop:8}}>
              <BrailleCell dots={e.dots} size="small" showNumbers={false} />
            </div>
            <div className="alpha-char">{e.character}</div>
            <div className="alpha-label">{e.label}</div>
            <div className="alpha-dots">{e.dots.length ? `Chấm ${e.dots.join(' · ')}` : '—'}</div>
          </button>
        ))}
      </div>
      {filtered.length===0 && <div className="empty-state"><div className="empty-icon">🔎</div>Không tìm thấy kết quả phù hợp</div>}

      <Modal open={!!selected} onClose={()=> setSelected(null)} title={selected?.label}>
        {selected && (
          <div style={{display:'flex', flexDirection:'column', gap:14, alignItems:'center'}}>
            <BrailleCharacterCard entry={selected} showTry={false} />
            <div style={{display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center'}}>
              <button className="btn btn-ghost btn-sm" onClick={()=> speak(selected.character)}>🔊 Nghe</button>
              <button className="btn btn-ghost btn-sm" onClick={()=> navigator.clipboard.writeText(selected.braille)}>Sao chép</button>
              <button className="btn btn-ghost btn-sm" onClick={()=> navigator.clipboard.writeText(selected.character)}>Sao chép chữ</button>
              <Link to="/practice" className="btn btn-primary btn-sm">Luyện chữ này</Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
