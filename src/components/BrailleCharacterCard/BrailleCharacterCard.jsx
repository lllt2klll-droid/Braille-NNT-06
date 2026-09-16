import BrailleCell from '../BrailleCell/BrailleCell.jsx';
import './BrailleCharacterCard.css';

function speak(text){
  if(!('speechSynthesis' in window)) return;
  try{
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN';
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}

export default function BrailleCharacterCard({ entry, onTry, onNext, showTry = true }){
  if(!entry) return null;
  const dotsLabel = entry.dots?.length ? entry.dots.join(' · ') : '—';
  const explain = entry.type==='letter' || entry.type==='vowel' || entry.type==='consonant'
    ? `Chữ ${entry.character.toUpperCase()} sử dụng chấm số ${dotsLabel}.`
    : entry.type==='tone' ? `${entry.label} được đặt trước nguyên âm. Chấm: ${dotsLabel}.`
    : entry.type==='digit' ? `Số ${entry.character} — ký hiệu ${entry.braille}, chấm ${dotsLabel}.`
    : `${entry.label} — chấm ${dotsLabel}.`;

  const ariaLabel = `${entry.label}, ${entry.braille}, chấm ${dotsLabel}`;

  return (
    <div className="bcc card card-padded" role="article" aria-label={ariaLabel}>
      <div className="bcc-top">
        <span className="badge badge-primary">{entry.type==='letter'?'chữ cái': entry.type==='vowel'?'nguyên âm': entry.type==='tone'?'dấu thanh': entry.type==='digit'?'số': entry.type}</span>
        {!entry.verified && <span className="badge" style={{background:'#FFF7DD', color:'#9A6A00', borderColor:'rgba(240,174,69,0.3)'}}>Chưa xác minh</span>}
      </div>

      <div className="bcc-char" aria-hidden>{entry.character}</div>
      <div className="bcc-braille" aria-label={`Ký hiệu Braille ${entry.braille}`}>{entry.braille}</div>

      <div style={{display:'flex', justifyContent:'center', margin:'12px 0'}}>
        <BrailleCell dots={entry.dots} size="medium" showDotNumbers ariaLabel={`${entry.label} chấm ${dotsLabel}`} />
      </div>

      <div className="bcc-dots-label">Chấm: {dotsLabel}</div>
      <p className="small muted" style={{textAlign:'center', margin:'6px 0 10px'}}>{explain}</p>

      <div className="bcc-actions">
        <button className="btn btn-ghost btn-sm" onClick={()=> speak(entry.character)} aria-label={`Nghe chữ ${entry.character}`}>🔊 Nghe</button>
        <button className="btn btn-ghost btn-sm" onClick={()=> { try{ navigator.clipboard.writeText(entry.braille); } catch{} }} aria-label="Sao chép Braille">Sao chép</button>
        {showTry && onTry && <button className="btn btn-primary btn-sm" onClick={onTry}>Thử tạo ký tự</button>}
        {onNext && <button className="btn btn-secondary btn-sm" onClick={onNext}>Tiếp tục</button>}
      </div>
    </div>
  );
}
