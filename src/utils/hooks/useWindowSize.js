"use client";

import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [isWide, setIsWide] = useState(false);
  
  useEffect(() => {
    // This code only runs client-side
    function checkSize() {
      setIsWide(window.innerWidth >= 768);
    }
    
    checkSize(); // Initial check
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);
  
  return isWide;
}