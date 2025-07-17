// components/ThemeProvider.jsx or .tsx
'use client';

import { useEffect, useState } from 'react';

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('modern');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'modern';
    setTheme(storedTheme);
    document.body.classList.add(`theme-${storedTheme}`);
  }, []);

  return children;
}
