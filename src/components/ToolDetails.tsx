import { ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import type { InstallMethod, PlatformEntry, Tool } from "@/catalog/types"
import { CompatibilityBadge } from "@/components/CompatibilityBadge"
import { InstallationStatus } from "@/components/InstallationStatus"
import { ToolLogo } from "@/components/ToolLogo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ToolDetailsProps = {
  tool: Tool
  platform?: PlatformEntry
  targetLabel: string
  versions: string[]
  versionsAreSample: boolean
  onBack: () => void
}

function describeMethod(method: InstallMethod): string {
  const parts: string[] = [method.method]
  if (method.packageManager) parts.push(method.packageManager)
  if (method.packageName) parts.push(method.packageName)
  parts.push(
    method.requiresElevation
      ? "needs administrator rights"
      : "no administrator rights",
  )
  return parts.join(" · ")
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2 border-t border-border pt-4">
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  )
}

export function ToolDetails({
  tool,
  platform,
  targetLabel,
  versions,
  versionsAreSample,
  onBack,
}: ToolDetailsProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Move keyboard focus to the new view when it opens.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  // Escape goes back to the catalog.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onBack()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onBack])

  const hasNotes = (tool.warnings?.length ?? 0) > 0 || (tool.notes?.length ?? 0) > 0

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <Button type="button" variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft />
        Back to catalog
      </Button>

      <header className="flex items-start gap-3">
        <ToolLogo toolId={tool.id} name={tool.name} className="size-11" />
        <div className="min-w-0 space-y-1">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-lg font-semibold tracking-tight outline-none"
          >
            {tool.name}
          </h2>
          <p className="font-mono text-xs text-muted-foreground">{tool.id}</p>
        </div>
      </header>

      <p className="text-sm text-muted-foreground">{tool.description}</p>

      {hasNotes ? (
        <Section title="Notes and warnings">
          <ul className="space-y-1.5 text-sm">
            {tool.warnings?.map((warning) => (
              <li key={warning.text}>
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  {warning.level === "caution" ? "Caution" : "Note"}
                </span>{" "}
                {warning.text}
              </li>
            ))}
            {tool.notes?.map((note) => (
              <li key={note} className="text-muted-foreground">
                {note}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="Version">
        {versions.length > 0 ? (
          <div role="group" aria-label="Version" className="flex flex-wrap gap-1.5">
            {versions.map((version) => {
              const isSelected = selectedVersion === version
              return (
                <button
                  key={version}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedVersion((current) =>
                      current === version ? null : version,
                    )
                  }
                  className={cn(
                    "rounded-md border px-2.5 py-1 font-mono text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "border-primary/60 bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {version}
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No versions listed.</p>
        )}
        <p className="text-xs text-muted-foreground">
          {versionsAreSample
            ? "Sample version list, not fetched from any official source. "
            : ""}
          {selectedVersion
            ? `Selected ${selectedVersion}. This choice is not saved anywhere yet.`
            : "Pick a version to preview it. Choices are not saved to a stack yet."}
        </p>
      </Section>

      <Section title="On this computer">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <InstallationStatus state="not-checked" />
          <span className="font-mono text-xs text-muted-foreground">
            detected version: not checked
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Machine detection is not implemented yet (Milestone 6).
        </p>
      </Section>

      <Section title={`Target platform (${targetLabel}, assumed)`}>
        <CompatibilityBadge targetLabel={targetLabel} platform={platform} />
        {platform?.note ? (
          <p className="text-sm text-muted-foreground">{platform.note}</p>
        ) : null}
        {platform && platform.installMethods.length > 0 ? (
          <ul className="space-y-1 font-mono text-xs text-muted-foreground">
            {platform.installMethods.map((method) => (
              <li key={describeMethod(method)}>{describeMethod(method)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No install method is defined for this platform yet.
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Install methods are catalog metadata only. None is implemented.
        </p>
      </Section>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button type="button" disabled aria-describedby="install-note">
          Install
        </Button>
        <p id="install-note" className="text-xs text-muted-foreground">
          Installation is not implemented yet (Milestone 8). Nothing on this
          screen changes your computer.
        </p>
      </div>
    </div>
  )
}