import type { LucideIcon } from "lucide-react"
type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  /** Optional small status line, shown in the mono font. */
  note?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  note,
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center">
      <Icon className="size-8 text-muted-foreground" aria-hidden />
      <h2 className="text-base font-medium">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      {note ? (
        <p className="font-mono text-xs text-muted-foreground">{note}</p>
      ) : null}
    </div>
  )
}