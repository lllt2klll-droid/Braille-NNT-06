import './QuizCard.css';
export default function QuizCard({ question, options, onSelect, feedback }){
  return (
    <div className="card card-padded quiz-card">
      <div className="quiz-q">{question}</div>
      <div className="quiz-options">
        {options.map(opt=>(
          <button key={opt.value} className="btn btn-secondary quiz-opt" onClick={()=> onSelect(opt.value)}>{opt.label}</button>
        ))}
      </div>
      {feedback && <div className={`quiz-feedback ${feedback.ok ? 'ok':'bad'}`}>{feedback.ok ? '✓ Chính xác!' : `✕ Chưa đúng. Đáp án: ${feedback.answer}`}</div>}
    </div>
  );
}
