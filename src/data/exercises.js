export const exerciseTypes = ['letterToBraille','brailleToLetter','typeBraille'];

export function generateDailyQuestions(allChars, count=5){
  const shuffled = [...allChars].sort(()=> Math.random()-0.5);
  return shuffled.slice(0,count).map(ch => ({
    type: Math.random()>0.5 ? 'letterToBraille':'brailleToLetter',
    prompt: ch.character || ch,
    answer: ch.braille || ch,
    dots: ch.dots || [],
  }));
}
