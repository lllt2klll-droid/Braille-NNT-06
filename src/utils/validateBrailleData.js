import { allEntries } from '../data/vietnameseBraille.js';

export function validateBrailleData(){
  const issues=[];
  const seenChar = new Map();
  const seenBraille = new Map();
  for(const e of allEntries){
    if(!e.character) issues.push(`Missing character: ${JSON.stringify(e)}`);
    if(!e.braille) issues.push(`Missing braille: ${e.character}`);
    if(!e.type) issues.push(`Missing type: ${e.character}`);
    if(!e.label) issues.push(`Missing label: ${e.character}`);
    if(e.dots && !Array.isArray(e.dots)) issues.push(`Invalid dots: ${e.character}`);
    if(seenChar.has(e.character) && e.type!=='digit' && e.type!=='punctuation') issues.push(`Duplicate character ${e.character}`);
    else seenChar.set(e.character, true);
    // braille duplicates allowed for punctuation but warn
    if(seenBraille.has(e.braille) && !['punctuation','digit'].includes(e.type)) issues.push(`Duplicate braille ${e.braille} for ${e.character}`);
    else seenBraille.set(e.braille, e.character);
    if(e.braille && [...e.braille].some(ch=>{
      const cp=ch.codePointAt(0); return cp<0x2800 || cp>0x28FF;
    }) && e.braille.length===1) issues.push(`Invalid braille unicode ${e.character} -> ${e.braille}`);
  }
  return { valid: issues.length===0, issues };
}
