import { NAV_ITEMS, type ViewId } from "@/app/navigation"
import { EmptyState } from "@/components/EmptyState"
import { NavigationSidebar } from "@/components/NavigationSidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
type AppShellProps={
    active:ViewId
    onSelect:(id:ViewId)=>void
}
export function AppShell ({active,onSelect}:AppShellProps){
    const item = NAV_ITEMS.find((entry) => entry.id === active) ?? NAV_ITEMS[0]

  return (
    <div className="flex h-svh bg-background text-foreground">
      <NavigationSidebar active={active} onSelect={onSelect} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <h1 className="truncate text-sm font-medium tracking-tight">
            {item.label}
          </h1>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-auto p-6">
          <EmptyState
            icon={item.icon}
            title={item.label}
            description={item.description}
            note={item.status}
          />
        </main>
      </div>
    </div>
  )
}