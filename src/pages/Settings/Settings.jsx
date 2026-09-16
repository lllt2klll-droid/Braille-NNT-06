import { useState } from 'react';
import { storage } from '../../utils/storage.js';
import { validateBrailleData } from '../../utils/validateBrailleData.js';
import './Settings.css';

export default function Settings(){
  const [theme, setThemeState] = useState(()=> storage.get('theme','system'));
  const [showDots, setShowDots] = useState(()=> storage.get('showDotNumbers', true));
  const [brailleSize, setBrailleSize] = useState(()=> storage.get('brailleSize','medium'));
  const [sound, setSound] = useState(()=> storage.get('soundEnabled', false));
  const [vibrate, setVibrate] = useState(()=> storage.get('vibrateEnabled', true));
  const [toast, setToast] = useState('');

  const setTheme = (v)=>{
    setThemeState(v);
    storage.set('theme', v);
    const root = document.documentElement;
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const eff = v==='system' ? (sysDark ? 'dark':'light') : v;
    root.setAttribute('data-theme', eff);
  };

  const exportData = ()=>{
    const data = {
      theme, showDotNumbers: showDots, brailleSize, soundEnabled: sound, vibrateEnabled: vibrate,
      converterHistory: storage.get('converterHistory', []),
      quizScore: storage.get('quizScore', {}),
      learnProgress: storage.get('learnProgress', {}),
      kb_history: storage.get('kb_history', []),
    };
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='vietbraille-export.json'; a.click();
    URL.revokeObjectURL(url);
    setToast('Đã xuất dữ liệu'); setTimeout(()=> setToast(''),1500);
  };
  const importData = (e)=>{
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const data = JSON.parse(reader.result);
        Object.entries(data).forEach(([k,v])=> storage.set(k,v));
        setToast('Đã nhập dữ liệu — tải lại trang'); setTimeout(()=> location.reload(), 800);
      } catch{ setToast('File không hợp lệ'); setTimeout(()=> setToast(''),1500);}
    };
    reader.readAsText(file);
  };

  const validation = validateBrailleData();

  return (
    <div className="page container">
      <h1 className="page-title">Cài đặt</h1>
      <p className="page-subtitle">Điều chỉnh hiển thị, Braille và dữ liệu — khung app giữ nguyên, chỉ thay đổi kích thước và độ tương phản.</p>
      <div className="card card-padded" style={{marginBottom:16, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
        <span className="small" style={{fontWeight:700}}>Cài đặt hiển thị</span>
        <span className="small muted">Tự động vừa khung khi Braille dài • Cỡ chữ lớn qua Settings hệ thống • Giảm chuyển động theo prefers-reduced-motion</span>
      </div>
      <div className="grid-2">
        <div className="card card-padded">
          <h3>Giao diện</h3>
          <div className="setting-row">
            <label><input type="radio" name="theme" checked={theme==='light'} onChange={()=> setTheme('light')} /> Sáng</label>
            <label><input type="radio" name="theme" checked={theme==='dark'} onChange={()=> setTheme('dark')} /> Tối</label>
            <label><input type="radio" name="theme" checked={theme==='system'} onChange={()=> setTheme('system')} /> Theo hệ thống</label>
          </div>
          <div className="divider" />
          <h3>Kích thước Braille</h3>
          <div className="setting-row">
            {['small','medium','large'].map(s=>(
              <label key={s}><input type="radio" name="size" checked={brailleSize===s} onChange={()=> { setBrailleSize(s); storage.set('brailleSize', s); }} /> {s==='small'?'Nhỏ': s==='medium'?'Vừa':'Lớn'}</label>
            ))}
          </div>
          <label style={{display:'flex', gap:8, alignItems:'center', marginTop:12}}><input type="checkbox" checked={showDots} onChange={e=> { setShowDots(e.target.checked); storage.set('showDotNumbers', e.target.checked); }} /> Hiện số chấm</label>
          <label style={{display:'flex', gap:8, alignItems:'center', marginTop:8}}><input type="checkbox" checked={sound} onChange={e=> { setSound(e.target.checked); storage.set('soundEnabled', e.target.checked); }} /> Âm thanh phản hồi</label>
          <label style={{display:'flex', gap:8, alignItems:'center', marginTop:8}}><input type="checkbox" checked={vibrate} onChange={e=> { setVibrate(e.target.checked); storage.set('vibrateEnabled', e.target.checked); }} /> Rung trên mobile</label>
        </div>

        <div className="card card-padded">
          <h3>Cấu hình phím</h3>
          <p className="small muted">Mặc định: D S A = 1 2 3, J K L = 4 5 6. Có thể chỉnh ở đây (JSON).</p>
          <div className="card" style={{padding:12, background:'var(--color-surface-2)'}}>
            <code className="small">{JSON.stringify(storage.get('keyboardMapping', {d:1,s:2,a:3,j:4,k:5,l:6}), null, 2)}</code>
          </div>
          <div style={{display:'flex', gap:8, marginTop:12, flexWrap:'wrap'}}>
            <button className="btn btn-secondary btn-sm" onClick={()=> { storage.remove('keyboardMapping'); setToast('Đã đặt lại phím'); setTimeout(()=> setToast(''),1500); }}>Đặt lại mặc định</button>
          </div>
          <div className="divider" />
          <h3>Dữ liệu</h3>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <button className="btn btn-secondary btn-sm" onClick={exportData}>Xuất dữ liệu</button>
            <label className="btn btn-secondary btn-sm" style={{cursor:'pointer'}}>Nhập dữ liệu<input type="file" accept=".json" hidden onChange={importData} /></label>
            <button className="btn btn-ghost btn-sm" onClick={()=> { if(confirm('Xóa tất cả dữ liệu local?')) { localStorage.clear(); location.reload(); }}}>Xóa tất cả</button>
          </div>
        </div>
      </div>

      <div className="card card-padded" style={{marginTop:16}}>
        <h3>Kiểm tra dữ liệu Braille</h3>
        {validation.valid ? <div className="badge badge-success">✓ Dữ liệu hợp lệ</div> : <div className="badge" style={{background:'#FEF2F2', color:'#DC2626'}}>Có {validation.issues.length} vấn đề</div>}
        {!validation.valid && <ul className="small" style={{marginTop:8}}>{validation.issues.map((iss,i)=> <li key={i}>{iss}</li>)}</ul>}
        <p className="small muted" style={{marginTop:8}}>Các mục UNVERIFIED (dấu thanh, một số dấu câu) cần đối chiếu chuẩn in nổi Việt Nam chính thức — có thể cập nhật tại <code>src/data/vietnameseBraille.js</code>.</p>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
