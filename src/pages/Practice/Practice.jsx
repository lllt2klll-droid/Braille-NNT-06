import { useState } from 'react';
import { allEntries } from '../../data/vietnameseBraille.js';
import BrailleKeyboard from '../../components/BrailleKeyboard/BrailleKeyboard.jsx';
import QuizCard from '../../components/QuizCard/QuizCard.jsx';
import { vietnameseToBraille } from '../../utils/vietnameseToBraille.js';
import { storage } from '../../utils/storage.js';
import './Practice.css';

function pickRandom(arr, n, exclude){
  const pool = arr.filter(x=> x.character!==exclude);
  const sh = [...pool].sort(()=> Math.random()-0.5);
  return sh.slice(0,n);
}

export default function Practice(){
  const letters = allEntries.filter(e=> ['letter','vowel','consonant'].includes(e.type));
  const [mode, setMode] = useState('quiz'); // quiz | typing
  const [quiz, setQuiz] = useState(()=> generateQ());
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(()=> storage.get('quizScore', { correct:0, total:0, streak:0 }));
  const [typingTarget, setTypingTarget] = useState('ba');
  const [typingInput, setTypingInput] = useState('');
  const [typingFeedback, setTypingFeedback] = useState(null);

  function generateQ(){
    const entry = letters[Math.floor(Math.random()*letters.length)];
    const isLetterToBraille = Math.random()>0.5;
    const options = [entry, ...pickRandom(letters,3, entry.character)].sort(()=> Math.random()-0.5);
    return { entry, isLetterToBraille, options };
  }

  const handleQuiz = (val)=>{
    // For letter->braille, val is braille; for braille->letter, val is character
    const correct = quiz.isLetterToBraille ? quiz.entry.braille : quiz.entry.character;
    const isOk = val===correct;
    setFeedback({ ok: isOk, answer: correct });
    const next = { correct: score.correct + (isOk?1:0), total: score.total+1, streak: isOk ? score.streak+1 : 0 };
    setScore(next);
    storage.set('quizScore', next);
    setTimeout(()=> { setQuiz(generateQ()); setFeedback(null); }, 1200);
  };

  const handleTypingSend = (ch)=>{
    const next = typingInput + ch;
    setTypingInput(next);
  };
  const checkTyping = ()=>{
    const expectedBraille = vietnameseToBraille(typingTarget);
    const got = typingInput;
    const ok = got===expectedBraille;
    setTypingFeedback({ ok, expected: expectedBraille, got });
    if(ok){
      const nextTargets = ['me','an','hoàng','xin chào','Việt Nam','học'];
      setTimeout(()=>{
        setTypingTarget(nextTargets[Math.floor(Math.random()*nextTargets.length)]);
        setTypingInput('');
        setTypingFeedback(null);
      }, 1200);
    }
  };

  const accuracy = score.total ? Math.round(score.correct/score.total*100) : 0;

  return (
    <div className="page container">
      <h1 className="page-title">Luyện tập</h1>
      <p className="page-subtitle">Quiz nhanh và luyện gõ Braille</p>

      <div className="mode-switch" style={{marginBottom:16}}>
        <button className={`seg ${mode==='quiz'?'active':''}`} onClick={()=> setMode('quiz')}>Quiz</button>
        <button className={`seg ${mode==='typing'?'active':''}`} onClick={()=> setMode('typing')}>Luyện gõ</button>
      </div>

      {mode==='quiz' ? (
        <>
          <div className="card card-padded" style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:12}}>
            <div><b>{score.correct}/{score.total}</b> đúng • <b>{accuracy}%</b> chính xác • 🔥 {score.streak} streak</div>
            <button className="btn btn-ghost btn-sm" onClick={()=> { setScore({correct:0,total:0,streak:0}); storage.set('quizScore',{correct:0,total:0,streak:0}); }}>Đặt lại</button>
          </div>
          <QuizCard
            question={quiz.isLetterToBraille ? `Chữ "${quiz.entry.character}" trong Braille là gì?` : `Ký hiệu "${quiz.entry.braille}" là chữ gì?`}
            options={quiz.options.map(o=> ({ value: quiz.isLetterToBraille ? o.braille : o.character, label: quiz.isLetterToBraille ? o.braille : o.character }))}
            onSelect={handleQuiz}
            feedback={feedback}
          />
          <div style={{textAlign:'center', marginTop:12}}>
            <button className="btn btn-secondary" onClick={()=> { setQuiz(generateQ()); setFeedback(null); }}>Câu tiếp theo →</button>
          </div>
        </>
      ) : (
        <div className="typing-layout">
          <div className="card card-padded">
            <div className="section-title">Hãy nhập: "{typingTarget}"</div>
            <div className="small muted">Braille mong đợi: <span className="braille-text">{vietnameseToBraille(typingTarget)}</span></div>
            <div className="braille-text" style={{minHeight:48, marginTop:12, padding:12, background:'var(--color-surface-2)', borderRadius:12, border:'1px solid var(--color-border)'}}>{typingInput || <span className="muted">—</span>}</div>
            {typingFeedback && <div className={`quiz-feedback ${typingFeedback.ok?'ok':'bad'}`} style={{marginTop:10}}>{typingFeedback.ok ? '✓ Chính xác!' : `✕ Chưa đúng. Đáp án: ${typingFeedback.expected}`}</div>}
            <div style={{display:'flex', gap:8, marginTop:12, justifyContent:'center'}}>
              <button className="btn btn-secondary" onClick={()=> { setTypingInput(''); setTypingFeedback(null); }}>Xóa</button>
              <button className="btn btn-primary" onClick={checkTyping}>Kiểm tra</button>
            </div>
          </div>
          <div className="card card-padded">
            <BrailleKeyboard onSend={handleTypingSend} />
          </div>
        </div>
      )}
    </div>
  );
}
