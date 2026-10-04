// src/components/layout/ThemeProvider.tsx
'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'campab-theme'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: false,
})

export const useTheme = () => useContext(ThemeContext)

function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'dark' || attr === 'light') return attr
  return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // On lit le thème déjà posé par le script inline dans <head>,
  // ce qui évite le flash et la désynchronisation.
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setThemeState(getInitialTheme())
    setMounted(true)

    // Écoute les changements de préférence système,
    // uniquement si l'utilisateur n'a pas choisi manuellement.
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY)) return
      const next: Theme = event.matches ? 'dark' : 'light'
      setThemeState(next)
      document.documentElement.setAttribute('data-theme', next)
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const applyTheme = useCallback((next: Theme, persist: boolean) => {
    setThemeState(next)
    document.documentElement.setAttribute('data-theme', next)
    if (persist) localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const setTheme = useCallback(
    (next: Theme) => applyTheme(next, true),
    [applyTheme],
  )

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    applyTheme(next, true)
  }, [theme, applyTheme])

  // Le contexte est TOUJOURS fourni, même avant hydratation.
  // Les composants enfants peuvent donc appeler useTheme() en toute sécurité.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  )
}