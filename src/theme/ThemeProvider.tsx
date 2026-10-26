
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export type Theme = "light" | "dark" | "system"

const STORAGE_KEY = "kestrel-theme"
const DEFAULT_THEME: Theme = "dark"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY)

    if (value === "light" || value === "dark" || value === "system") {
      return value
    }
  } catch {
    // Storage can be unavailable.
  }

  return DEFAULT_THEME
}

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches

  const isDark =
    theme === "dark" || (theme === "system" && prefersDark)

  document.documentElement.classList.toggle("dark", isDark)
  document.documentElement.style.colorScheme = isDark ? "dark" : "light"
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode
}) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    applyTheme(theme)

    if (theme !== "system") return

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyTheme("system")

    media.addEventListener("change", onChange)

    return () => media.removeEventListener("change", onChange)
  }, [theme])

  function setTheme(next: Theme) {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Saving the preference is optional.
    }

    setThemeState(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>")
  }

  return context
}
