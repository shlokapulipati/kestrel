import { Search, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { getCategories, getTools, getVersionsFor } from "@/catalog/catalog"
import {
  findPlatformEntry,
  TEMP_TARGET,
  TEMP_TARGET_LABEL,
} from "@/catalog/platform"
import { ALL_CATEGORIES, countByCategory, filterTools } from "@/catalog/search"
import { DataStatusBanner } from "@/components/DataStatusBanner"
import { EmptyState } from "@/components/EmptyState"
import { ToolRow } from "@/components/ToolRow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function CatalogScreen() {
  const categories = getCategories()
  const allTools = getTools()

  const [query, setQuery] = useState("")
  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORIES)
  const searchRef = useRef<HTMLInputElement>(null)

  const counts = useMemo(
    () => countByCategory(allTools, categories),
    [allTools, categories],
  )
  const visibleTools = useMemo(
    () => filterTools(allTools, query, categoryId),
    [allTools, query, categoryId],
  )

  // Press "/" anywhere (outside a text field) to jump to the search box.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) {
        return
      }
      const target = event.target as HTMLElement | null
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      if (isTyping) return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const categoryButtons = [
    { id: ALL_CATEGORIES, name: "All tools", count: allTools.length },
    ...categories.map((category) => ({
      id: category.id,
      name: category.name,
      count: counts[category.id] ?? 0,
    })),
  ]

  const trimmedQuery = query.trim()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <DataStatusBanner targetLabel={TEMP_TARGET_LABEL} />

      <div className="flex flex-col gap-4 md:flex-row">
        <nav
          aria-label="Categories"
          className="flex gap-1 overflow-x-auto md:w-56 md:shrink-0 md:flex-col md:overflow-visible"
        >
          {categoryButtons.map(({ id, name, count }) => {
            const isActive = id === categoryId
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategoryId(id)}
                aria-pressed={isActive}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <span className="whitespace-nowrap md:whitespace-normal">
                  {name}
                </span>
                <span className="font-mono text-xs">{count}</span>
              </button>
            )
          })}
        </nav>

        <section aria-label="Tools" className="min-w-0 flex-1 space-y-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("")
              }}
              placeholder="Search tools by name   ( / )"
              aria-label="Search tools by name"
              className="pl-9 pr-9"
            />
            {query !== "" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
                onClick={() => {
                  setQuery("")
                  searchRef.current?.focus()
                }}
              >
                <X />
              </Button>
            ) : null}
          </div>

          <p className="text-xs text-muted-foreground" aria-live="polite">
            {visibleTools.length} of {allTools.length} tools
          </p>

          {visibleTools.length === 0 ? (
            <div className="space-y-3">
              <EmptyState
                icon={Search}
                title={
                  trimmedQuery !== ""
                    ? `No tools match "${trimmedQuery}"`
                    : "No tools in this category yet"
                }
                description={
                  trimmedQuery !== ""
                    ? "Try a different name, or clear the search."
                    : "The catalog is added to in phases. This category simply has no entries yet."
                }
              />
              {trimmedQuery !== "" ? (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setQuery("")}
                  >
                    Clear search
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <ul className="space-y-2">
              {visibleTools.map((tool) => (
                <li key={tool.id}>
                  <ToolRow
                    tool={tool}
                    platform={findPlatformEntry(tool, TEMP_TARGET)}
                    targetLabel={TEMP_TARGET_LABEL}
                    state="not-checked"
                    versions={getVersionsFor(tool.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}