import { useEffect, useState } from 'react';
import { storage } from '../utils/storage.js';

export function useTheme(){
  const [theme, setTheme] = useState(()=> storage.get('theme', 'system')); // light | dark | system

  useEffect(()=>{
    storage.set('theme', theme);
    const root = document.documentElement;
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effective = theme==='system' ? (sysDark ? 'dark':'light') : theme;
    root.setAttribute('data-theme', effective);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', effective==='dark' ? '#121E35' : '#2563EB');
  }, [theme]);

  useEffect(()=>{
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if(storage.get('theme','system')==='system'){
        document.documentElement.setAttribute('data-theme', mql.matches ? 'dark':'light');
      }
    };
    mql.addEventListener('change', handler);
    return ()=> mql.removeEventListener('change', handler);
  }, []);

  return [theme, setTheme];
}
