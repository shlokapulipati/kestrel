import { ChevronRight } from "lucide-react"

import type { PlatformEntry, Tool } from "@/catalog/types"
import { CompatibilityBadge } from "@/components/CompatibilityBadge"
import {
  InstallationStatus,
  type InstallState,
} from "@/components/InstallationStatus"
import { ToolLogo } from "@/components/ToolLogo"
type ToolCardProps = {
  tool: Tool
  platform?: PlatformEntry
  targetLabel: string
  state: InstallState
  versions: string[]
  versionsAreSample: boolean
  onOpen: (toolId: string) => void
}
export function ToolCard({
  tool,
  platform,
  targetLabel,
  state,
  versions,
  versionsAreSample,
  onOpen,
}: ToolCardProps) {
  const versionText =
    versions.length > 0
      ? `${versions.join(" · ")}${versionsAreSample ? " (sample)" : ""}`
      : "no versions listed"
      return (
    <article className="group relative flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-foreground/25 hover:bg-muted/40 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring">
      <div className="flex items-center gap-3">
        <ToolLogo toolId={tool.id} name={tool.name} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium">
            {/* The button stretches over the whole card, so the card is one click target. */}
            <button
              id={`tool-card-${tool.id}`}
              type="button"
              onClick={() => onOpen(tool.id)}
              title={`Open details for ${tool.name}`}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {tool.name}
            </button>
          </h3>
          <p className="truncate font-mono text-xs text-muted-foreground">
            {versionText}
          </p>
        </div>
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
       <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
        {tool.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-border pt-3">
        <CompatibilityBadge targetLabel={targetLabel} platform={platform} />
        <InstallationStatus state={state} />
      </div>
    </article>
  )
}