import { HashRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import Header from '../components/Header/Header.jsx';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation.jsx';
import Home from '../pages/Home/Home.jsx';
import Converter from '../pages/Converter/Converter.jsx';
import Keyboard from '../pages/Keyboard/Keyboard.jsx';
import Alphabet from '../pages/Alphabet/Alphabet.jsx';
import Learn from '../pages/Learn/Learn.jsx';
import Practice from '../pages/Practice/Practice.jsx';
import Search from '../pages/Search/Search.jsx';
import Settings from '../pages/Settings/Settings.jsx';
import Help from '../pages/Help/Help.jsx';
import { useState } from 'react';
import { storage } from '../utils/storage.js';
import Modal from '../components/Modal/Modal.jsx';

function Onboarding(){
  const [open, setOpen] = useState(()=> !storage.get('onboardingCompleted', false));
  const [step, setStep] = useState(0);
  const steps = [
    { title:'Chào mừng đến VietBraille', desc:'Công cụ học và chuyển đổi chữ nổi tiếng Việt — miễn phí, offline, không cần tài khoản.' },
    { title:'Braille sử dụng 6 chấm', desc:'Mỗi ô gồm 2 cột 3 hàng, đánh số 1-2-3 bên trái và 4-5-6 bên phải. Bật tắt chấm tạo ký tự.' },
    { title:'Hãy thử tạo chữ A', desc:'Chữ A chỉ cần bật chấm 1 (⠁). Vào mục Học tập để thử ngay!' },
  ];
  const close = ()=>{
    storage.set('onboardingCompleted', true);
    setOpen(false);
  };
  if(!open) return null;
  return (
    <Modal open={true} onClose={close} title={steps[step].title}>
      <p className="muted">{steps[step].desc}</p>
      <div style={{display:'flex', gap:8, justifyContent:'space-between', marginTop:12}}>
        <button className="btn btn-ghost" onClick={close}>Bỏ qua</button>
        <div style={{display:'flex', gap:8}}>
          {step>0 && <button className="btn btn-secondary" onClick={()=> setStep(s=> s-1)}>Quay lại</button>}
          {step<steps.length-1 ? <button className="btn btn-primary" onClick={()=> setStep(s=> s+1)}>Tiếp tục</button> : <button className="btn btn-primary" onClick={close}>Bắt đầu</button>}
        </div>
      </div>
      <div className="small muted" style={{textAlign:'center', marginTop:10}}>{step+1} / {steps.length}</div>
    </Modal>
  );
}

function Footer(){
  return (
    <footer style={{padding:'20px 0 72px', borderTop:'1px solid var(--color-border)', marginTop:20, textAlign:'center'}}>
      <div className="container">
        <div style={{fontWeight:800, fontSize:15}}>VietBraille</div>
        <div className="small muted" style={{fontSize:12}}>Công cụ học và chuyển đổi chữ nổi tiếng Việt.</div>
        <div style={{marginTop:8, display:'inline-flex', alignItems:'center', gap:6, padding:'5px 10px', background:'var(--color-primary-soft)', border:'1px solid rgba(91,103,241,0.12)', borderRadius:999, fontSize:12, fontWeight:700, color:'var(--color-primary)'}}>
          <span aria-hidden>👤</span> Người thực hiện: Nguyễn Tuấn
        </div>
      </div>
    </footer>
  );
}

export default function App(){
  const [theme, setTheme] = useTheme();
  return (
    <HashRouter>
      <Header theme={theme} setTheme={setTheme} />
      <main id="main" style={{minHeight:'60vh'}}>
        <Onboarding />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/converter" element={<Converter />} />
          <Route path="/keyboard" element={<Keyboard />} />
          <Route path="/alphabet" element={<Alphabet />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>
      <Footer />
      <BottomNavigation />
    </HashRouter>
  );
}
