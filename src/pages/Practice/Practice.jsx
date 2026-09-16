import { useState, useEffect } from 'react';
import { allEntries } from '../../data/vietnameseBraille.js';
import BrailleKeyboard from '../../components/BrailleKeyboard/BrailleKeyboard.jsx';
import QuizCard from '../../components/QuizCard/QuizCard.jsx';
import { vietnameseToBraille } from '../../utils/vietnameseToBraille.js';
import { storage } from '../../utils/storage.js';
import { speak } from '../../utils/speak.js';
import './Practice.css';

function pickRandom(arr, n, exclude){
  const pool = arr.filter(x=> x.character!==exclude);
  const sh = [...pool].sort(()=> Math.random()-0.5);
  return sh.slice(0,n);
}

const PRACTICE_MODES = [
  { key:'quiz', label:'Quiz' },
  { key:'typing', label:'Luyện gõ' },
  { key:'char2braille', label:'Chữ → Braille' },
  { key:'braille2char', label:'Braille → chữ' },
  { key:'listen', label:'Nghe → chọn' },
];

export default function Practice(){
  const fromConverter = storage.get('practiceFromConverter', null);
  const letters = allEntries.filter(e=> ['letter','vowel','consonant','digit'].includes(e.type));
  const [mode, setMode] = useState('quiz');
  const [quiz, setQuiz] = useState(()=> generateQ());
  const [feedback, setFeedback] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [score, setScore] = useState(()=> storage.get('quizScore', { correct:0, total:0, streak:0, practiced:0 }));
  const [typingTarget, setTypingTarget] = useState(()=> fromConverter ? fromConverter[0] : 'ba');
  const [typingInput, setTypingInput] = useState('');
  const [typingFeedback, setTypingFeedback] = useState(null);
  const [quizQueue, setQuizQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  function generateQ(){
    const entry = letters[Math.floor(Math.random()*letters.length)];
    const isLetterToBraille = Math.random()>0.5;
    const options = [entry, ...pickRandom(letters,3, entry.character)].sort(()=> Math.random()-0.5);
    return { entry, isLetterToBraille, options };
  }

  function startShortQuiz(){
    const shuffled = [...letters].sort(()=> Math.random()-0.5).slice(0,5);
    const queue = shuffled.map(e=> ({
      entry: e,
      isLetterToBraille: Math.random()>0.5,
      options: [e, ...pickRandom(letters,3,e.character)].sort(()=>Math.random()-0.5)
    }));
    setQuizQueue(queue);
    setQueueIndex(0);
    setQuiz(queue[0]);
    setFeedback(null);
    setHintLevel(0);
  }

  useEffect(()=> { if(quizQueue.length===0) startShortQuiz(); }, []);

  const handleQuiz = (val)=>{
    const correct = quiz.isLetterToBraille ? quiz.entry.braille : quiz.entry.character;
    const isOk = val===correct;
    const correctDots = quiz.entry.dots.join(' · ');
    if(isOk){
      setFeedback({ ok:true, answer: correct, msg:`🎉 Chính xác! Bạn đã tạo: ${quiz.entry.character} — ${quiz.entry.braille} — chấm ${correctDots}`, explain: `Chữ ${quiz.entry.character} sử dụng chấm ${correctDots}.` });
    } else {
      setFeedback({ ok:false, answer: correct, got: val, msg:'Chưa chính xác', explain:`Chữ ${quiz.entry.character} cần chấm ${correctDots}.`, dotsGot: val });
    }
    const nextScore = { correct: score.correct + (isOk?1:0), total: score.total+1, streak: isOk ? score.streak+1 : 0, practiced: (score.practiced||0)+1 };
    setScore(nextScore);
    storage.set('quizScore', nextScore);
    storage.set('practiceStats', nextScore);
    if(isOk){
      setTimeout(()=> {
        if(quizQueue.length>0 && queueIndex < quizQueue.length-1){
          const nextIdx = queueIndex+1;
          setQueueIndex(nextIdx);
          setQuiz(quizQueue[nextIdx]);
        } else {
          setQuiz(generateQ());
        }
        setFeedback(null); setHintLevel(0);
      }, 1400);
    }
  };

  const handleModeAnswer = (selected)=>{
    handleQuiz(selected);
  };

  const getHint = ()=>{
    const next = (hintLevel %3)+1;
    setHintLevel(next);
    let hint='';
    if(next===1) hint = `Gợi ý 1: Chữ này chỉ sử dụng ${quiz.entry.dots.length} chấm.`;
    else if(next===2) hint = `Gợi ý 2: Chấm nằm ở vị trí ${quiz.entry.dots.includes(1) ? 'trên cùng bên trái' : 'bên trái'}.`;
    else hint = `Gợi ý 3: Đó là chấm số ${quiz.entry.dots.join(', ')}.`;
    setFeedback({ ok:null, msg:hint, hint:true });
  };

  const handleTypingSend = (ch)=>{
    const next = typingInput + ch;
    setTypingInput(next);
  };
  const checkTyping = ()=>{
    const expectedBraille = vietnameseToBraille(typingTarget);
    const got = typingInput;
    const ok = got===expectedBraille;
    if(ok){
      setTypingFeedback({ ok:true, expected: expectedBraille, got, msg:`🎉 Chính xác! Bạn đã tạo: ${typingTarget} — ${expectedBraille}` });
    } else {
      setTypingFeedback({ ok:false, expected: expectedBraille, got, msg:'Chưa chính xác', explain:`“${typingTarget}” cần ${expectedBraille}` });
    }
    if(ok){
      const nextTargets = fromConverter && fromConverter.length ? fromConverter : ['me','an','hoàng','xin chào','Việt Nam','học'];
      setTimeout(()=>{
        const next = nextTargets[Math.floor(Math.random()*nextTargets.length)];
        setTypingTarget(next);
        setTypingInput('');
        setTypingFeedback(null);
      }, 1400);
    }
  };

  const accuracy = score.total ? Math.round(score.correct/score.total*100) : 0;

  return (
    <div className="page container">
      <h1 className="page-title">Luyện tập</h1>
      <p className="page-subtitle">Quiz ngắn 5–10 câu, mỗi câu một kỹ năng • Không áp lực điểm số — ưu tiên tiến bộ</p>

      <div className="mode-switch" style={{marginBottom:16, flexWrap:'wrap'}}>
        {PRACTICE_MODES.map(m=>(
          <button key={m.key} className={`seg ${mode===m.key?'active':''}`} onClick={()=> { setMode(m.key); setFeedback(null); setHintLevel(0); }}>{m.label}</button>
        ))}
      </div>

      {mode==='quiz' && (
        <>
          <div className="card card-padded" style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:12}}>
            <div style={{fontSize:14}}><b>{score.correct}/{score.total}</b> đúng • <b>{accuracy}%</b> chính xác • 🔥 {score.streak} streak • <span className="muted">Đã luyện {score.practiced||0} lần</span></div>
            <button className="btn btn-ghost btn-sm" onClick={()=> { const s={correct:0,total:0,streak:0,practiced:0}; setScore(s); storage.set('quizScore',s); }}>Đặt lại</button>
          </div>
          {quizQueue.length>0 && <div className="small muted" style={{marginBottom:8}}>Quiz ngắn: câu {queueIndex+1}/{quizQueue.length || 5} — mỗi câu tập trung một kỹ năng</div>}
          <QuizCard
            question={quiz.isLetterToBraille ? `Chữ "${quiz.entry.character}" trong Braille là gì?` : `Ký hiệu "${quiz.entry.braille}" là chữ gì?`}
            options={quiz.options.map(o=> ({ value: quiz.isLetterToBraille ? o.braille : o.character, label: quiz.isLetterToBraille ? o.braille : o.character }))}
            onSelect={handleModeAnswer}
            feedback={feedback}
          />
          {feedback && !feedback.ok && !feedback.hint && (
            <div style={{display:'flex', gap:8, justifyContent:'center', marginTop:10, flexWrap:'wrap'}}>
              <button className="btn btn-secondary btn-sm" onClick={()=> { setFeedback(null); setHintLevel(0); }}>Thử lại</button>
              <button className="btn btn-ghost btn-sm" onClick={getHint}>Xem gợi ý</button>
              <button className="btn btn-ghost btn-sm" onClick={()=> { setQuiz(generateQ()); setFeedback(null); setHintLevel(0); }}>Bỏ qua</button>
            </div>
          )}
          {feedback && feedback.hint && (
            <div className="quiz-feedback" style={{marginTop:10, background:'var(--color-warning-bg)', color:'#8A6A00', border:'1px solid rgba(240,174,69,0.22)'}}>{feedback.msg}</div>
          )}
          <div style={{textAlign:'center', marginTop:12, display:'flex', gap:8, justifyContent:'center'}}>
            <button className="btn btn-secondary" onClick={()=> { setQuiz(generateQ()); setFeedback(null); setHintLevel(0); }}>Câu tiếp theo →</button>
            <button className="btn btn-ghost btn-sm" onClick={getHint}>Gợi ý</button>
          </div>
          <div className="small muted" style={{textAlign:'center', marginTop:8}}>💡 Gợi ý 3 mức: số chấm → vị trí → số chấm cụ thể. Không đưa đáp án ngay.</div>
        </>
      )}

      {mode==='char2braille' && (
        <div style={{maxWidth:560, marginInline:'auto'}}>
          <QuizCard question={`Chữ "${quiz.entry.character}" trong Braille là gì?`} options={quiz.options.map(o=> ({ value:o.braille, label:o.braille }))} onSelect={handleModeAnswer} feedback={feedback} />
          <div style={{display:'flex', gap:8, justifyContent:'center', marginTop:10}}><button className="btn btn-ghost btn-sm" onClick={getHint}>Gợi ý</button><button className="btn btn-ghost btn-sm" onClick={()=> { setQuiz(generateQ()); setFeedback(null); }}>Tiếp</button></div>
        </div>
      )}
      {mode==='braille2char' && (
        <div style={{maxWidth:560, marginInline:'auto'}}>
          <QuizCard question={`Ký hiệu "${quiz.entry.braille}" là chữ gì?`} options={quiz.options.map(o=> ({ value:o.character, label:o.character }))} onSelect={handleModeAnswer} feedback={feedback} />
        </div>
      )}
      {mode==='listen' && (
        <div style={{maxWidth:560, marginInline:'auto', textAlign:'center'}}>
          <div className="card card-padded">
            <h3>Nghe → chọn ký tự</h3>
            <button className="btn btn-primary btn-lg" onClick={()=> speak(quiz.entry.character)}>🔊 Nghe</button>
            <p className="small muted">Bấm nghe, sau đó chọn đáp án.</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginTop:12}}>
              {quiz.options.map(o=> <button key={o.character} className="btn btn-secondary" onClick={()=> handleModeAnswer(quiz.isLetterToBraille ? o.braille : o.character)}>{o.character} — {o.braille}</button>)}
            </div>
            {feedback && <div className={`quiz-feedback ${feedback.ok?'ok':'bad'}`} style={{marginTop:12}}>{feedback.ok ? feedback.msg : `${feedback.msg}. Đáp án: ${feedback.answer}`}<div className="small">{feedback.explain}</div></div>}
          </div>
        </div>
      )}

      {(mode==='typing') && (
        <div className="typing-layout">
          <div className="card card-padded typing-prompt-card">
            <div className="section-title" style={{marginBottom:4}}>Hãy nhập: “{typingTarget}”</div>
            <div className="typing-label">Braille mong đợi</div>
            <div className="typing-expected-box">
              <span className="typing-expected-braille">
                {[...vietnameseToBraille(typingTarget)].map((ch,i)=> ch===' ' ? <span key={i} style={{width:10}} /> : <span key={i} className="braille-char-frame">{ch}</span>)}
              </span>
              <span className="small muted" style={{fontWeight:700, whiteSpace:'nowrap'}}>{typingTarget}</span>
            </div>

            <div className="typing-label" style={{marginTop:14}}>Kết quả của bạn <span className="muted" style={{textTransform:'none', letterSpacing:0}}>{typingInput.length}/{vietnameseToBraille(typingTarget).length} ô</span></div>
            <div className={`typing-input-box ${typingInput ? 'has-content' : ''}`}>
              {typingInput
                ? <span className="typing-input-braille">{[...typingInput].map((ch,i)=> ch===' ' ? <span key={i} style={{width:10}} /> : <span key={i} className="braille-char-frame filled">{ch}</span>)}</span>
                : <span className="typing-empty">— chưa nhập —</span>}
            </div>

            {typingFeedback && <div className={`quiz-feedback ${typingFeedback.ok?'ok':'bad'}`} style={{marginTop:12}}>{typingFeedback.ok ? `🎉 ${typingFeedback.msg}` : <><span>Chưa chính xác</span><div className="small">Bạn chọn: {typingFeedback.got} • Đáp án: {typingFeedback.expected}</div><div className="small">{typingFeedback.explain}</div><div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:6}}><button className="btn btn-secondary btn-sm" onClick={()=> { setTypingInput(''); setTypingFeedback(null); }}>Thử lại</button><button className="btn btn-ghost btn-sm" onClick={()=> speak(typingTarget)}>🔊 Nghe gợi ý</button></div></>}</div>}

            <div style={{display:'flex', gap:8, marginTop:14, justifyContent:'center'}}>
              <button className="btn btn-secondary" onClick={()=> { setTypingInput(''); setTypingFeedback(null); }}>Xóa</button>
              <button className="btn btn-primary" onClick={checkTyping}>Kiểm tra</button>
            </div>
            <div className="small muted" style={{textAlign:'center', marginTop:8}}>Gõ bằng bàn phím 6 chấm bên phải, bấm <b>Gửi</b> sau mỗi ô • Enter = Kiểm tra • Backspace = Xóa</div>
          </div>
          <div className="card card-padded">
            <BrailleKeyboard onSend={handleTypingSend} hideHistory />
          </div>
        </div>
      )}

      {mode!=='quiz' && mode!=='typing' && (
        <div style={{textAlign:'center', marginTop:10}}>
          <button className="btn btn-secondary btn-sm" onClick={()=> { setQuiz(generateQ()); setFeedback(null); setHintLevel(0); }}>Đổi câu hỏi</button>
        </div>
      )}

      {(score.practiced||0)===0 && (
        <div className="empty-state" style={{marginTop:12}}>
          <div className="empty-icon">✍️</div>
          <div>Bạn chưa luyện tập.</div>
          <div className="small muted">Hoàn thành bài đầu tiên để xem tiến trình.</div>
          <a href="#/learn" className="btn btn-primary btn-sm" style={{marginTop:10}}>Bắt đầu học</a>
        </div>
      )}
    </div>
  );
}
