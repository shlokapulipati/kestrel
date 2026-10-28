import type { PlatformEntry, Tool } from "@/catalog/types"
import { CompatibilityBadge } from "@/components/CompatibilityBadge"
import {
  InstallationStatus,
  type InstallState,
} from "@/components/InstallationStatus"

type ToolRowProps = {
  tool: Tool
  platform?: PlatformEntry
  targetLabel: string
  state: InstallState
  versions: string[]
}

export function ToolRow({
  tool,
  platform,
  targetLabel,
  state,
  versions,
}: ToolRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex items-baseline gap-2">
          <h3 className="font-medium">{tool.name}</h3>
          <span className="font-mono text-xs text-muted-foreground">
            {tool.id}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {tool.description}
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {versions.length > 0
            ? `versions: ${versions.join(" · ")}`
            : "no versions listed"}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
        <CompatibilityBadge targetLabel={targetLabel} platform={platform} />
        <InstallationStatus state={state} />
      </div>
    </div>
  )
}