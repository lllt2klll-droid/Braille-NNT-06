export function speak(text, lang='vi-VN'){
  if(!('speechSynthesis' in window)) return false;
  try{
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}
export function canSpeak(){
  return 'speechSynthesis' in window;
}
