import type { PlatformEntry, PlatformStatus } from "@/catalog/types"
import { cn } from "@/lib/utils"

const STATUS_LABELS: Record<PlatformStatus, string> = {
  supported: "Supported",
  planned: "Planned",
  untested: "Untested",
  unsupported: "Unsupported",
}

type CompatibilityBadgeProps = {
  targetLabel: string
  platform?: PlatformEntry
}

export function CompatibilityBadge({
  targetLabel,
  platform,
}: CompatibilityBadgeProps) {
  const label = platform ? STATUS_LABELS[platform.status] : "No entry"
  return (
    <span
      title={platform?.note ?? `${targetLabel}: ${label}`}
      className={cn(
        "inline-flex items-center rounded-md border border-border px-2 py-0.5 font-mono text-xs",
        platform?.status === "supported"
          ? "text-foreground"
          : "text-muted-foreground",
        platform?.status === "unsupported" && "text-destructive",
      )}
    >
      {targetLabel} · {label}
    </span>
  )
}