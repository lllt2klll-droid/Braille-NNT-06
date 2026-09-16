import { useState } from 'react';
import { lessons } from '../../data/lessons.js';
import { allEntries } from '../../data/vietnameseBraille.js';
import BrailleCell from '../../components/BrailleCell/BrailleCell.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import { storage } from '../../utils/storage.js';
import './Learn.css';

export default function Learn(){
  const [activeId, setActiveId] = useState(lessons[0].id);
  const active = lessons.find(l=> l.id===activeId);
  const [tryDots, setTryDots] = useState([]);
  const progress = storage.get('learnProgress', {}); // {lessonId: done}

  const markDone = (id)=> {
    const next = { ...progress, [id]: true };
    storage.set('learnProgress', next);
    // force rerender via state hack
    setTryDots([...tryDots]);
  };

  const learnedCount = Object.keys(progress).filter(k=> progress[k]).length;

  return (
    <div className="page container">
      <h1 className="page-title">Học Braille</h1>
      <p className="page-subtitle">Đi từng bước — từ 6 chấm đến từ và câu</p>

      <ProgressBar value={learnedCount} max={lessons.length} label={`Tiến độ ${learnedCount}/${lessons.length}`} />

      <div className="learn-layout">
        <aside className="learn-sidebar card">
          {lessons.map(l=>(
            <button key={l.id} className={`learn-item ${activeId===l.id?'active':''}`} onClick={()=> setActiveId(l.id)}>
              <div className="learn-item-title">{l.title}</div>
              <div className="small muted">{l.level}</div>
              {progress[l.id] && <span className="badge badge-success" style={{marginTop:4}}>✓ Hoàn thành</span>}
            </button>
          ))}
        </aside>
        <div className="learn-main">
          <div className="card card-padded">
            <div className="badge badge-primary">{active.level}</div>
            <h2 style={{margin:'8px 0 6px'}}>{active.title}</h2>
            <p className="muted">{active.description}</p>

            {active.steps && active.steps.map((s, idx)=>(
              <div key={idx} className="learn-step">
                <h3>{s.title}</h3>
                <p className="muted">{s.content || s.prompt}</p>
                {s.type==='try' && (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:10}}>
                    <BrailleCell dots={tryDots} interactive showNumbers onToggle={n=> setTryDots(prev=> prev.includes(n)? prev.filter(x=>x!==n): [...prev,n].sort((a,b)=>a-b))} />
                    <div className="small muted">Mong đợi: chấm {s.expectedDots.join('-')}</div>
                    {JSON.stringify(tryDots)===JSON.stringify(s.expectedDots) ? <div className="badge badge-success">✓ Chính xác!</div> : <div className="small muted">Hãy thử lại nhé!</div>}
                  </div>
                )}
              </div>
            ))}

            {active.chars && (
              <div className="alphabet-grid" style={{marginTop:12}}>
                {active.chars.map(ch=>{
                  const e = allEntries.find(x=> x.character===ch) || { character: ch, braille:'?', dots:[], label: ch };
                  return (
                    <div key={ch} className="card card-padded" style={{textAlign:'center'}}>
                      <div style={{fontSize:26}}>{e.braille}</div>
                      <div style={{fontWeight:800}}>{e.character}</div>
                      <div className="small muted">Chấm {e.dots?.join('-') || '-'}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {active.words && (
              <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:12}}>
                {active.words.map(w=>(
                  <div key={w} className="card card-padded" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontWeight:700}}>{w}</span>
                    <span className="small muted">Thử gõ bằng bàn phím 6 chấm</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{display:'flex', gap:10, marginTop:16}}>
              <button className="btn btn-primary" onClick={()=> markDone(active.id)}>Đánh dấu hoàn thành</button>
              <button className="btn btn-secondary" onClick={()=> setTryDots([])}>Làm lại</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
