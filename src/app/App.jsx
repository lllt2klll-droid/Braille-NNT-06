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
  const close = (choice)=>{
    storage.set('onboardingCompleted', true);
    if(choice==='beginner') storage.set('userType','beginner');
    else if(choice==='known') storage.set('userType','known');
    setOpen(false);
    if(choice==='beginner'){
      // navigate to learn intro
      setTimeout(()=> { window.location.hash = '#/learn'; }, 100);
    }
  };
  if(!open) return null;
  return (
    <Modal open={true} onClose={()=> close('known')} title="Chào mừng đến với VietBraille 👋">
      <p style={{fontWeight:600, marginBottom:4}}>Bạn chưa từng học Braille?</p>
      <p className="small muted" style={{marginTop:0}}>Chọn lộ trình phù hợp — không cần tài khoản, học ngay trên trình duyệt.</p>
      <div style={{display:'grid', gap:10, marginTop:14}}>
        <button className="btn btn-primary btn-lg" onClick={()=> close('beginner')} autoFocus>▶ BẮT ĐẦU TỪ ĐẦU</button>
        <button className="btn btn-secondary" onClick={()=> close('known')}>Tôi đã biết Braille — đến bảng điều khiển</button>
      </div>
      <p className="small muted" style={{textAlign:'center', marginTop:10}}>Mỗi ô Braille có 6 chấm: 1-2-3 bên trái, 4-5-6 bên phải. Chữ A chỉ cần chấm 1 (⠁).</p>
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
