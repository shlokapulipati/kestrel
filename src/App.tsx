import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"

function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <span className="font-mono text-sm tracking-tight">kestrel</span>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-2xl space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Design check</h1>
          <p className="text-muted-foreground">
            A temporary screen for checking the design tokens. The theme
            toggle works; the sample buttons below do nothing. Step 2c replaces
            this screen with the real app shell.
          </p>
        </div>

        <section className="space-y-3 rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Versions and paths use the mono font:
          </p>
          <p className="font-mono text-sm">node 22.23.1 · /usr/bin/node</p>
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App