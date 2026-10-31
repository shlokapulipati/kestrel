import { LOGOS, type Logo } from "@/catalog/logos.generated"
import { cn } from "@/lib/utils"

type ToolLogoProps = {
  toolId: string
  name: string
  className?: string
}

export function ToolLogo({ toolId, name, className }: ToolLogoProps) {
  const logo = LOGOS[toolId] as Logo | undefined
  const frame = cn(
    "flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground",
    className,
  )

  // No logo available: a neutral letter tile, never a made-up logo.
  if (!logo) {
    return (
      <span
        aria-hidden
        className={cn(frame, "font-mono text-xs uppercase text-muted-foreground")}
      >
        {name.slice(0, 2)}
      </span>
    )
  }

  return (
    <span role="img" aria-label={`${logo.title} logo`} className={frame}>
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={logo.path} />
      </svg>
    </span>
  )
}