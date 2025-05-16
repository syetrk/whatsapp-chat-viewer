'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Komponent mount olduktan sonra göster (SSR ile uyumluluk için)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 p-2 rounded-full bg-white/10"></div>;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center transform hover:scale-110"
      aria-label={resolvedTheme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      {resolvedTheme === 'dark' ? (
        <svg 
          className="w-5 h-5 text-yellow-100" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg 
          className="w-5 h-5 text-indigo-900" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
} 