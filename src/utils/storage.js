const PREFIX = 'vietbraille:';

function safeJsonParse(v, fallback){
  try { return JSON.parse(v); } catch { return fallback; }
}

export const storage = {
  get(key, fallback=null){
    try{
      const v = localStorage.getItem(PREFIX+key);
      return v===null ? fallback : safeJsonParse(v, fallback);
    } catch { return fallback; }
  },
  set(key, value){
    try{ localStorage.setItem(PREFIX+key, JSON.stringify(value)); } catch {}
  },
  remove(key){
    try{ localStorage.removeItem(PREFIX+key); } catch {}
  },
  getRaw(key, fallback=null){
    try{
      const v = localStorage.getItem(PREFIX+key);
      return v===null ? fallback : v;
    } catch { return fallback; }
  },
  setRaw(key, value){
    try{ localStorage.setItem(PREFIX+key, String(value)); } catch {}
  }
};
