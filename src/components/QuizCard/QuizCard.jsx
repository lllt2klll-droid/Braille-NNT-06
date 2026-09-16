import './QuizCard.css';
import BrailleCell from '../BrailleCell/BrailleCell.jsx';
import { brailleToDots } from '../../utils/brailleParser.js';
export default function QuizCard({ question, options, onSelect, feedback }){
  return (
    <div className="card card-padded quiz-card">
      <div className="quiz-q" role="heading" aria-level={3}>{question}</div>
      <div className="quiz-options" role="group" aria-label="Lựa chọn đáp án">
        {options.map(opt=>(
          <button key={opt.value} className="btn btn-secondary quiz-opt" onClick={()=> onSelect(opt.value)} aria-label={`Chọn ${opt.label}`}>{opt.label}</button>
        ))}
      </div>
      {feedback && (
        <div className={`quiz-feedback ${feedback.ok ? 'ok':'bad'}`} role="status" aria-live="polite">
          {feedback.ok ? (
            <>
              <div style={{fontSize:16}}>🎉 Chính xác!</div>
              {feedback.msg && <div className="small" style={{marginTop:6}}>{feedback.msg}</div>}
              {feedback.explain && <div className="small muted" style={{marginTop:4}}>{feedback.explain}</div>}
              {feedback.answer && (()=>{ const dots = brailleToDots(feedback.answer); return dots.length ? <div style={{display:'flex', justifyContent:'center', marginTop:8}}><BrailleCell dots={dots} size="small" /></div> : null; })()}
            </>
          ) : feedback.hint ? (
            feedback.msg
          ) : (
            <>
              <div>Chưa chính xác</div>
              {feedback.got && <div className="small" style={{marginTop:4}}>Bạn chọn: <b>{feedback.got}</b></div>}
              <div className="small" style={{marginTop:2}}>Đáp án: <b>{feedback.answer}</b></div>
              {feedback.explain && <div className="small" style={{marginTop:4}}>{feedback.explain}</div>}
              {feedback.answer && (()=>{ const dots = brailleToDots(feedback.answer); return dots.length ? <div style={{display:'flex', justifyContent:'center', marginTop:8}}><BrailleCell dots={dots} size="small" showDotNumbers={false} /></div> : null; })()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
