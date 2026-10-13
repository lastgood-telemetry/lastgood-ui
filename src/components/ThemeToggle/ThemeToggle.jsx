import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const KEY = 'lg-theme'

export const readTheme = () => {
  try {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch (e) { /* storage blocked */ }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'
  const toggle = () => {
    try { window.localStorage.setItem(KEY, next) } catch (e) { /* storage blocked */ }
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`p-1.5 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded cursor-pointer transition-colors ${className}`}
    >
      {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  )
}

export default ThemeToggle
