import { useState, useEffect, useMemo } from 'react';
import { lessons } from '../../data/lessons.js';
import { allEntries, dotsToChar } from '../../data/vietnameseBraille.js';
import BrailleCell from '../../components/BrailleCell/BrailleCell.jsx';
import BrailleCharacterCard from '../../components/BrailleCharacterCard/BrailleCharacterCard.jsx';
import ProgressBar from '../../components/ProgressBar/ProgressBar.jsx';
import { storage } from '../../utils/storage.js';
import { speak } from '../../utils/speak.js';
import { dotsToBraille } from '../../utils/brailleParser.js';
import './Learn.css';

// Helper: get entry by char
function getEntry(ch){
  return allEntries.find(e=> e.character===ch) || allEntries.find(e=> e.character.toLowerCase()===ch.toLowerCase()) || null;
}

const MODES = [
  { key:'view', label:'Xem' },
  { key:'char2braille', label:'Chữ → Braille' },
  { key:'braille2char', label:'Braille → chữ' },
  { key:'dots2char', label:'Chấm → chữ' },
  { key:'create', label:'Tự tạo' },
  { key:'listen', label:'Nghe → chọn' },
];

export default function Learn(){
  const [activeId, setActiveId] = useState(()=> storage.get('currentLesson', lessons[0].id));
  const active = lessons.find(l=> l.id===activeId) || lessons[0];
  const [tryDots, setTryDots] = useState([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [feedback, setFeedback] = useState(null); // {ok, msg, expected, got}
  const [charIndex, setCharIndex] = useState(0);
  const [mode, setMode] = useState('view');
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [learnModeDots, setLearnModeDots] = useState([]);

  const progress = storage.get('learnProgress', {});
  const learnedCount = Object.keys(progress).filter(k=> progress[k]).length;
  const pct = Math.round(learnedCount / lessons.length * 100);

  useEffect(()=> storage.set('currentLesson', activeId), [activeId]);
  useEffect(()=> { setTryDots([]); setHintLevel(0); setFeedback(null); setCharIndex(0); setMode('view'); setQuizFeedback(null); setLearnModeDots([]); }, [activeId]);

  const markDone = (id)=>{
    const cur = storage.get('learnProgress', {});
    const next = { ...cur, [id]: true };
    storage.set('learnProgress', next);
    // track learnedCharacters
    if(active.chars){
      const lc = new Set(storage.get('learnedCharacters', []));
      active.chars.forEach(c=> lc.add(c));
      storage.set('learnedCharacters', [...lc]);
    }
    setTryDots([...tryDots]); // rerender
    setFeedback({ ok:true, msg:'Đã đánh dấu hoàn thành! 🎉' });
  };

  const isIntro = active.id==='intro';
  const charsForLesson = useMemo(()=>{
    if(!active.chars) return [];
    return active.chars.map(c=> getEntry(c) || { character:c, braille: dotsToChar([]), dots:[], label:c, type:'unknown', verified:false });
  }, [active]);

  const currentChar = charsForLesson[charIndex] || null;

  const handleCheckIntro = (expectedDots)=>{
    if(JSON.stringify(tryDots)===JSON.stringify(expectedDots)){
      setFeedback({ ok:true, msg:'🎉 Chính xác! Bạn đã tạo đúng ký tự.', got: tryDots, expected: expectedDots });
    } else {
      // show wrong feedback with expected vs got
      const gotChar = tryDots.length ? dotsToBraille(tryDots) : '—';
      const expChar = dotsToBraille(expectedDots);
      setFeedback({ ok:false, msg:`Chưa chính xác`, got: gotChar, expected: expChar, expectedDots, gotDots: tryDots, explain: `Đáp án cần chấm ${expectedDots.join(' · ')}` });
    }
  };

  const handleHint = (expectedDots)=>{
    const nextLevel = (hintLevel % 3) + 1;
    setHintLevel(nextLevel);
    let msg='';
    if(nextLevel===1) msg = `Gợi ý 1: Ký tự này sử dụng ${expectedDots.length} chấm.`;
    else if(nextLevel===2){
      // approximate position
      const pos = expectedDots.includes(1) ? 'trên cùng bên trái' : expectedDots.includes(2) ? 'giữa bên trái' : 'dưới bên trái';
      msg = `Gợi ý 2: Chấm nằm ở vị trí ${pos}.`;
    } else msg = `Gợi ý 3: Đó là chấm số ${expectedDots.join(', ')}.`;
    setFeedback({ ok:null, msg, hint:true });
  };

  // Multi-mode quiz logic for character lessons
  const handleModeAnswer = (selectedValue)=>{
    if(!currentChar) return;
    let correct=false;
    let correctVal='';
    if(mode==='char2braille'){ correctVal=currentChar.braille; correct = selectedValue===correctVal; }
    else if(mode==='braille2char' || mode==='dots2char' || mode==='listen'){ correctVal=currentChar.character; correct = selectedValue.toLowerCase()===correctVal.toLowerCase(); }
    setQuizFeedback({ ok: correct, correct: correctVal, selected: selectedValue });
    if(correct){
      setTimeout(()=> { const nextIdx = (charIndex+1) % charsForLesson.length; setCharIndex(nextIdx); setQuizFeedback(null); setLearnModeDots([]); }, 1300);
    }
  };

  const handleCreateCheck = ()=>{
    if(!currentChar) return;
    const ok = JSON.stringify(learnModeDots.slice().sort((a,b)=>a-b))===JSON.stringify([...currentChar.dots].sort((a,b)=>a-b));
    if(ok){
      setQuizFeedback({ ok:true, correct: currentChar.character });
      speak(`Chính xác, chữ ${currentChar.character}`);
      setTimeout(()=> { setCharIndex((charIndex+1)%charsForLesson.length); setQuizFeedback(null); setLearnModeDots([]); }, 1300);
    } else {
      const got = learnModeDots.length ? dotsToBraille(learnModeDots) : '—';
      setQuizFeedback({ ok:false, correct: currentChar.braille, got, explain:`Chữ ${currentChar.character} cần chấm ${currentChar.dots.join(' · ')}` });
    }
  };

  // Listen mode speak
  const handleListen = ()=>{
    if(currentChar) speak(currentChar.character);
  };

  return (
    <div className="page container">
      <nav aria-label="Breadcrumb" className="small" style={{marginBottom:8}}>
        <a href="#/" style={{color:'var(--color-primary)', fontWeight:700}}>Học Braille</a>
        <span aria-hidden> / </span>
        <span className="muted">{active.title}</span>
      </nav>

      <h1 className="page-title">Học Braille</h1>
      <p className="page-subtitle">Đi từng bước — từ 6 chấm đến từ và câu. Bạn đang ở đâu? Đang học gì? Tiếp theo là gì?</p>

      <ProgressBar value={learnedCount} max={lessons.length} label={`Tiến độ ${learnedCount}/${lessons.length}`} />
      <div className="small muted" style={{marginTop:4}}>{pct}% hoàn thành • Dùng phím Tab, 1-6 để tương tác</div>

      <div className="learn-layout">
        <aside className="learn-sidebar card" aria-label="Lộ trình học">
          {lessons.map(l=>{
            const status = progress[l.id] ? '✓' : activeId===l.id ? '●' : '○';
            return (
              <button key={l.id} className={`learn-item ${activeId===l.id?'active':''}`} onClick={()=> setActiveId(l.id)} aria-current={activeId===l.id ? 'step' : undefined} aria-label={`${l.title} ${status}`}>
                <div className="learn-item-title">{status} {l.shortTitle || l.title}</div>
                <div className="small muted">{l.level}</div>
                {progress[l.id] && <span className="badge badge-success" style={{marginTop:4}}>✓ Hoàn thành</span>}
                {activeId===l.id && !progress[l.id] && <span className="badge badge-primary" style={{marginTop:4}}>Đang học</span>}
              </button>
            );
          })}
        </aside>

        <div className="learn-main">
          <div className="card card-padded">
            <div className="badge badge-primary">{active.level}</div>
            <h2 style={{margin:'8px 0 6px'}}>{active.title}</h2>
            <p className="muted">{active.description}</p>
            {active.longDesc && <p className="small muted">{active.longDesc}</p>}
            {active.details && <p className="small" style={{background:'var(--color-primary-soft)', padding:'10px 12px', borderRadius:12}}>{active.details}</p>}

            {/* INTRO LESSON — highly visual */}
            {isIntro && active.steps && active.steps.map((s, idx)=>(
              <div key={idx} className="learn-step">
                <h3>{s.title}</h3>
                <p className="muted">{s.content || s.prompt}</p>
                {s.type==='try' ? (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:12}}>
                    {/* Visual 6-dot mapping */}
                    <div className="small muted" style={{textAlign:'center'}}>Ô Braille lớn — chấm được đánh số như sau:<br/>
                      <code style={{fontWeight:800}}>1&nbsp;&nbsp;&nbsp;4<br/>2&nbsp;&nbsp;&nbsp;5<br/>3&nbsp;&nbsp;&nbsp;6</code>
                    </div>
                    <BrailleCell dots={tryDots} interactive showDotNumbers onToggle={n=> { setTryDots(prev=> prev.includes(n)? prev.filter(x=>x!==n): [...prev,n].sort((a,b)=>a-b)); setFeedback(null); }} showLabel={tryDots.length ? `Bạn đang chọn chấm ${tryDots.join(' · ')} • ${dotsToBraille(tryDots)}` : 'Chưa chọn chấm nào — hãy thử bật chấm'} size="large" />
                    <div style={{display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center'}}>
                      <button className="btn btn-secondary btn-sm" onClick={()=> { setTryDots([]); setFeedback(null); }}>Xóa</button>
                      <button className="btn btn-primary btn-sm" onClick={()=> handleCheckIntro(s.expectedDots)}>Kiểm tra — Enter</button>
                      <button className="btn btn-ghost btn-sm" onClick={()=> handleHint(s.expectedDots)}>Xem gợi ý</button>
                    </div>
                    {feedback && (
                      <div className={`quiz-feedback ${feedback.ok ? 'ok' : feedback.ok===null ? '' : 'bad'}`} style={{width:'100%', textAlign:'center', background: feedback.ok ? 'var(--color-success-bg)' : feedback.ok===null ? 'var(--color-warning-bg)' : 'var(--color-error-bg)', border:'1px solid var(--color-border)', color: feedback.ok ? 'var(--color-success)' : feedback.ok===null ? '#8A6A00' : 'var(--color-error)'}}>
                        {feedback.ok ? (
                          <><div>🎉 Chính xác! Bạn đã tạo: {dotsToBraille(s.expectedDots)} — Chấm {s.expectedDots.join(' · ')}</div><div className="small" style={{marginTop:4}}>{s.explain}</div></>
                        ) : feedback.hint ? feedback.msg : (
                          <><div>Chưa chính xác</div>
                          <div className="small" style={{display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginTop:6}}>
                            <span>Bạn chọn: <b>{feedback.got}</b> ({feedback.gotDots?.join('·')||'trống'})</span>
                            <span>Đáp án: <b>{feedback.expected}</b> ({feedback.expectedDots?.join('·')})</span>
                          </div>
                          <div className="small" style={{marginTop:6}}>{s.explain}</div>
                          <div style={{display:'flex', gap:8, justifyContent:'center', marginTop:8}}>
                            <button className="btn btn-secondary btn-sm" onClick={()=> { setTryDots([]); setFeedback(null); }}>Thử lại</button>
                            <button className="btn btn-ghost btn-sm" onClick={()=> handleHint(s.expectedDots)}>Xem gợi ý</button>
                          </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // info step visual
                  <div style={{display:'flex', justifyContent:'center', marginTop:8}}>
                    <BrailleCell dots={s.demoDots||[]} size="medium" showDotNumbers ariaLabel="Minh họa ô Braille" />
                  </div>
                )}
              </div>
            ))}

            {/* CHARACTER LESSONS with multi-mode */}
            {active.chars && !isIntro && (
              <>
                {currentChar && (
                  <div style={{marginTop:12}}>
                    <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:10, justifyContent:'center'}} role="tablist" aria-label="Chế độ học">
                      {MODES.map(m=>(
                        <button key={m.key} role="tab" aria-selected={mode===m.key} className={`btn btn-sm ${mode===m.key ? 'btn-primary' : 'btn-secondary'}`} onClick={()=> { setMode(m.key); setQuizFeedback(null); setLearnModeDots([]); }}>{m.label}</button>
                      ))}
                    </div>

                    {mode==='view' && (
                      <BrailleCharacterCard entry={currentChar} onTry={()=> setMode('create')} onNext={()=> setCharIndex((charIndex+1)%charsForLesson.length)} />
                    )}

                    {mode==='char2braille' && (
                      <div className="card card-padded" style={{textAlign:'center'}}>
                        <h3>Chữ “{currentChar.character}” trong Braille là gì?</h3>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginTop:12}}>
                          {(()=>{
                            const opts = [currentChar, ...charsForLesson.filter(c=> c.character!==currentChar.character).sort(()=>Math.random()-0.5).slice(0,3)].sort(()=>Math.random()-0.5);
                            return opts.map(o=> (
                              <button key={o.character+o.braille} className="btn btn-secondary" style={{minHeight:56, fontFamily:'var(--font-braille)', fontSize:22}} onClick={()=> handleModeAnswer(o.braille)}>{o.braille}</button>
                            ));
                          })()}
                        </div>
                        {quizFeedback && <div className={`quiz-feedback ${quizFeedback.ok ? 'ok':'bad'}`} style={{marginTop:12}}>{quizFeedback.ok ? '🎉 Chính xác!' : `Chưa chính xác. Đáp án: ${quizFeedback.correct}`} <div className="small muted">Chữ {currentChar.character} = {currentChar.braille} (chấm {currentChar.dots.join('·')})</div></div>}
                      </div>
                    )}

                    {mode==='braille2char' && (
                      <div className="card card-padded" style={{textAlign:'center'}}>
                        <h3>Ký hiệu “{currentChar.braille}” là chữ gì?</h3>
                        <div style={{fontFamily:'var(--font-braille)', fontSize:36, color:'var(--color-primary)'}}>{currentChar.braille}</div>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginTop:12}}>
                          {(()=>{
                            const opts = [currentChar, ...charsForLesson.filter(c=> c.character!==currentChar.character).sort(()=>Math.random()-0.5).slice(0,3)].sort(()=>Math.random()-0.5);
                            return opts.map(o=> (
                              <button key={o.character} className="btn btn-secondary" onClick={()=> handleModeAnswer(o.character)}>{o.character}</button>
                            ));
                          })()}
                        </div>
                        {quizFeedback && <div className={`quiz-feedback ${quizFeedback.ok ? 'ok':'bad'}`} style={{marginTop:12}}>{quizFeedback.ok ? '🎉 Chính xác!' : `Chưa chính xác. Đáp án: ${quizFeedback.correct}`} </div>}
                      </div>
                    )}

                    {mode==='dots2char' && (
                      <div className="card card-padded" style={{textAlign:'center'}}>
                        <h3>Nhìn chấm → chọn chữ</h3>
                        <div style={{display:'flex', justifyContent:'center', margin:'10px 0'}}>
                          <BrailleCell dots={currentChar.dots} size="medium" showDotNumbers />
                        </div>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10}}>
                          {(()=>{
                            const opts = [currentChar, ...charsForLesson.filter(c=> c.character!==currentChar.character).sort(()=>Math.random()-0.5).slice(0,3)].sort(()=>Math.random()-0.5);
                            return opts.map(o=> (
                              <button key={o.character} className="btn btn-secondary" onClick={()=> handleModeAnswer(o.character)}>{o.character} — {o.braille}</button>
                            ));
                          })()}
                        </div>
                        {quizFeedback && <div className={`quiz-feedback ${quizFeedback.ok ? 'ok':'bad'}`} style={{marginTop:12}}>{quizFeedback.ok ? '🎉 Chính xác!' : `Chưa chính xác. Đáp án: ${quizFeedback.correct}`}</div>}
                      </div>
                    )}

                    {mode==='create' && (
                      <div className="card card-padded" style={{textAlign:'center'}}>
                        <h3>Tự tạo Braille cho chữ “{currentChar.character}”</h3>
                        <p className="small muted">Dùng chuột/chạm hoặc phím 1-6, Enter để kiểm tra, Backspace để xóa.</p>
                        <div style={{display:'flex', justifyContent:'center', margin:'12px 0'}}>
                          <BrailleCell dots={learnModeDots} interactive showDotNumbers onToggle={n=> setLearnModeDots(prev=> prev.includes(n)? prev.filter(x=>x!==n): [...prev,n].sort((a,b)=>a-b))} showLabel={learnModeDots.length ? `Bạn đang chọn chấm ${learnModeDots.join(' · ')} — ${dotsToBraille(learnModeDots)}` : 'Chưa chọn chấm nào'} size="large" />
                        </div>
                        <div style={{display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap'}}>
                          <button className="btn btn-secondary btn-sm" onClick={()=> setLearnModeDots([])}>Xóa (Backspace)</button>
                          <button className="btn btn-primary btn-sm" onClick={handleCreateCheck}>Kiểm tra (Enter)</button>
                          <button className="btn btn-ghost btn-sm" onClick={()=> setHintLevel(h=> (h%3)+1)}>Gợi ý</button>
                        </div>
                        {hintLevel>0 && <div className="small muted" style={{marginTop:8, padding:'8px 10px', background:'var(--color-warning-bg)', borderRadius:10}}>
                          {hintLevel===1 && `Gợi ý 1: Chữ này sử dụng ${currentChar.dots.length} chấm.`}
                          {hintLevel===2 && `Gợi ý 2: Chấm nằm ở vị trí ${currentChar.dots.includes(1) ? 'trên cùng' : ''} ${currentChar.dots.includes(4) ? 'bên phải' : 'bên trái'}.`}
                          {hintLevel===3 && `Gợi ý 3: Đó là chấm số ${currentChar.dots.join(', ')}.`}
                        </div>}
                        {quizFeedback && (
                          <div className={`quiz-feedback ${quizFeedback.ok?'ok':'bad'}`} style={{marginTop:12}}>
                            {quizFeedback.ok ? (
                              <>🎉 Chính xác! Bạn đã tạo: {currentChar.character} — {currentChar.braille} — chấm {currentChar.dots.join('·')}<div style={{marginTop:6}}><BrailleCell dots={currentChar.dots} size="small" /></div></>
                            ) : (
                              <><div>Chưa chính xác</div><div className="small">Bạn chọn: {quizFeedback.got} • Đáp án: {quizFeedback.correct}</div><div className="small">{quizFeedback.explain}</div><div style={{display:'flex', gap:8, justifyContent:'center', marginTop:8}}><button className="btn btn-secondary btn-sm" onClick={()=> setLearnModeDots([])}>Thử lại</button><button className="btn btn-ghost btn-sm" onClick={()=> setHintLevel(3)}>Xem gợi ý</button></div></>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {mode==='listen' && (
                      <div className="card card-padded" style={{textAlign:'center'}}>
                        <h3>Nghe → chọn ký tự</h3>
                        <button className="btn btn-primary btn-lg" onClick={handleListen} aria-label="Nghe ký tự">🔊 Nghe</button>
                        <p className="small muted" style={{marginTop:8}}>Bấm nghe, sau đó chọn đáp án đúng.</p>
                        <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginTop:12}}>
                          {(()=>{
                            const opts = [currentChar, ...charsForLesson.filter(c=> c.character!==currentChar.character).sort(()=>Math.random()-0.5).slice(0,3)].sort(()=>Math.random()-0.5);
                            return opts.map(o=> (
                              <button key={o.character} className="btn btn-secondary" onClick={()=> handleModeAnswer(o.character)}>{o.character} — {o.braille}</button>
                            ));
                          })()}
                        </div>
                        {quizFeedback && <div className={`quiz-feedback ${quizFeedback.ok?'ok':'bad'}`} style={{marginTop:12}}>{quizFeedback.ok ? '🎉 Chính xác!' : `Chưa chính xác. Đáp án: ${quizFeedback.correct}`}</div>}
                      </div>
                    )}

                    <div style={{display:'flex', gap:8, justifyContent:'center', marginTop:12}}>
                      <button className="btn btn-ghost btn-sm" onClick={()=> setCharIndex(i=> (i-1+charsForLesson.length)%charsForLesson.length)}>← Trước</button>
                      <span className="small muted" style={{alignSelf:'center'}}>{charIndex+1} / {charsForLesson.length}</span>
                      <button className="btn btn-ghost btn-sm" onClick={()=> setCharIndex(i=> (i+1)%charsForLesson.length)}>Tiếp →</button>
                    </div>
                  </div>
                )}
                {/* Also show grid overview */}
                <details style={{marginTop:16}}>
                  <summary className="small" style={{cursor:'pointer', fontWeight:700}}>Xem tất cả {charsForLesson.length} ký tự</summary>
                  <div className="alphabet-grid" style={{marginTop:12}}>
                    {charsForLesson.map(e=>(
                      <button key={e.character+e.braille} className={`card card-padded ${currentChar?.character===e.character ? 'card-highlight':''}`} style={{textAlign:'center', cursor:'pointer'}} onClick={()=> { const idx = charsForLesson.findIndex(c=> c.character===e.character); setCharIndex(idx); setMode('view'); }}>
                        <div style={{fontSize:22, fontFamily:'var(--font-braille)'}}>{e.braille}</div>
                        <div style={{fontWeight:800}}>{e.character}</div>
                        <div className="small muted">Chấm {e.dots.join('·')||'—'}</div>
                      </button>
                    ))}
                  </div>
                </details>
              </>
            )}

            {active.words && (
              <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:12}}>
                <h3 style={{margin:'8px 0 0'}}>Từ và câu</h3>
                {active.words.map(w=>(
                  <div key={w} className="card card-padded" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap'}}>
                    <span style={{fontWeight:700}}>{w}</span>
                    <span className="braille-text" style={{fontSize:18}}>{w.split('').map((ch,i)=> {
                      const e = getEntry(ch.toLowerCase());
                      return <span key={i}>{e ? e.braille : ch}</span>;
                    })}</span>
                    <button className="btn btn-ghost btn-sm" onClick={()=> speak(w)}>🔊</button>
                  </div>
                ))}
                {active.sentences && active.sentences.map(s=>(
                  <div key={s} className="card card-padded" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontWeight:600}}>{s}</span>
                    <button className="btn btn-ghost btn-sm" onClick={()=> speak(s)}>🔊</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{display:'flex', gap:10, marginTop:16, flexWrap:'wrap'}}>
              <button className="btn btn-primary" onClick={()=> markDone(active.id)}>Đánh dấu hoàn thành</button>
              <button className="btn btn-secondary" onClick={()=> { setTryDots([]); setFeedback(null); setLearnModeDots([]); setQuizFeedback(null); }}>Làm lại</button>
              {lessons.findIndex(l=> l.id===activeId) < lessons.length-1 && (
                <button className="btn btn-ghost" onClick={()=> setActiveId(lessons[lessons.findIndex(l=> l.id===activeId)+1].id)}>Bài tiếp theo →</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
