import { createContext, useState, useContext } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false)
  const toggleTheme = () => setDark((prev) => !prev)

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <div className={`form-container ${dark ? 'dark' : 'light'}`}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
