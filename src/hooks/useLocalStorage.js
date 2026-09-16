import { useState, useEffect } from 'react';
import { storage } from '../utils/storage.js';

export function useLocalStorage(key, defaultValue){
  const [value, setValue] = useState(()=> storage.get(key, defaultValue));
  useEffect(()=> { storage.set(key, value); }, [key, value]);
  return [value, setValue];
}
