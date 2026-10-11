import { useState } from 'react'

function loadTheme() {
  try {
    return localStorage.getItem('grc-theme') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(loadTheme)

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    try {
      localStorage.setItem('grc-theme', nextTheme)
    } catch {
      // The theme still applies for this session if browser storage is unavailable.
    }
  }

  return { theme, toggleTheme }
}
