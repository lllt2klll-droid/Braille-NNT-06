import { useState } from 'react';
import BrailleKeyboard from '../../components/BrailleKeyboard/BrailleKeyboard.jsx';
import { brailleToVietnamese } from '../../utils/brailleToVietnamese.js';
import './Keyboard.css';

export default function Keyboard(){
  const [last, setLast] = useState('');
  const [translated, setTranslated] = useState('');

  const handleSend = (ch)=>{
    const next = last + ch;
    setLast(next);
    setTranslated(brailleToVietnamese(next));
  };

  return (
    <div className="page container">
      <h1 className="page-title">Bàn phím Braille 6 chấm</h1>
      <p className="page-subtitle">Chạm các chấm hoặc dùng bàn phím vật lý D S A J K L • Mỗi lần nhấn Gửi là một ô Braille</p>

      <div className="card card-padded" style={{display:'flex', justifyContent:'center'}}>
        <BrailleKeyboard onSend={handleSend} />
      </div>

      <div className="grid-2" style={{marginTop:16}}>
        <div className="card card-padded">
          <div className="section-title">Chuỗi Braille</div>
          <div className="braille-text" style={{minHeight:56}}>{last || <span className="muted">Chưa có</span>}</div>
          <div style={{display:'flex', gap:8, marginTop:10}}>
            <button className="btn btn-secondary btn-sm" onClick={()=> navigator.clipboard.writeText(last)}>Sao chép Braille</button>
            <button className="btn btn-ghost btn-sm" onClick={()=> { setLast(''); setTranslated(''); }}>Xóa</button>
          </div>
        </div>
        <div className="card card-padded">
          <div className="section-title">Dịch sang tiếng Việt</div>
          <div style={{fontSize:18, fontWeight:700, minHeight:56}}>{translated || <span className="muted">—</span>}</div>
          <button className="btn btn-primary btn-sm" style={{marginTop:10}} onClick={()=> navigator.clipboard.writeText(translated)}>Sao chép tiếng Việt</button>
        </div>
      </div>
    </div>
  );
}
