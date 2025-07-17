'use client';

import { useEffect, useState } from 'react';

export default function ThemeSettings() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.body.classList.add(`theme-${saved}`);
  }, []);

  const changeTheme = (newTheme) => {
    document.body.classList.replace(`theme-${theme}`, `theme-${newTheme}`);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--primary)' }}>Theme Settings</h2>
      <div style={{ marginTop: '1rem' }}>
        {['light', 'dark', 'modern', 'skywarm', 'cyberwave'].map((t) => (
          <button
            key={t}
            onClick={() => changeTheme(t)}
            style={{
              marginRight: '1rem',
              padding: '0.5rem 1rem',
              background: theme === t ? 'var(--primary)' : 'var(--primary-light)',
              color: theme === t ? '#fff' : 'var(--text)',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
