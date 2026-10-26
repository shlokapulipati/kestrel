import { Monitor, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme, type Theme } from "@/theme/ThemeProvider"

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light theme", icon: Sun },
  { value: "system", label: "Follow system theme", icon: Monitor },
  { value: "dark", label: "Dark theme", icon: Moon },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          size="icon"
          variant={theme === value ? "secondary" : "ghost"}
          aria-label={label}
          aria-pressed={theme === value}
          title={label}
          onClick={() => setTheme(value)}
        >
          <Icon />
        </Button>
      ))}
    </div>
  )
}