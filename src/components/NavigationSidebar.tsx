import { NAV_ITEMS, type ViewId } from "@/app/navigation"
import { cn } from "@/lib/utils"
type NavigationSidebarProps = {
  active: ViewId
  onSelect: (id: ViewId) => void
}
export function NavigationSidebar({ active, onSelect }: NavigationSidebarProps){
    return (
    <nav
      aria-label="Main"
      className="flex w-14 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:w-56"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-primary" />
        <span className="hidden font-mono text-sm tracking-tight md:inline">
          kestrel
        </span>
      </div>

      <ul className="flex flex-col gap-1 p-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                title={label}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="hidden truncate md:inline">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
