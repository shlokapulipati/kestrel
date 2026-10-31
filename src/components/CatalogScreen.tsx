import { RotateCcw, Search, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  getCatalogInfo,
  getCategories,
  getTool,
  getTools,
  getVersionsFor,
} from "@/catalog/catalog"
import {
  findPlatformEntry,
  TEMP_TARGET,
  TEMP_TARGET_LABEL,
} from "@/catalog/platform"
import { ALL_CATEGORIES, countByCategory, filterTools } from "@/catalog/search"
import { DataStatusBanner } from "@/components/DataStatusBanner"
import { EmptyState } from "@/components/EmptyState"
import { ToolCard } from "@/components/ToolCard"
import { ToolDetails } from "@/components/ToolDetails"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function CatalogScreen() {
  const categories = getCategories()
  const allTools = getTools()
  const versionsAreSample = getCatalogInfo().versionsStatus === "sample"

  const [query, setQuery] = useState("")
  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORIES)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const lastOpenedRef = useRef<string | null>(null)

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
      if (isTyping || !searchRef.current) return
      event.preventDefault()
      searchRef.current.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // After closing the details view, put focus back on the card that was opened.
  useEffect(() => {
    if (selectedId !== null || lastOpenedRef.current === null) return
    document.getElementById(`tool-card-${lastOpenedRef.current}`)?.focus()
    lastOpenedRef.current = null
  }, [selectedId])

  const openTool = useCallback((toolId: string) => {
    lastOpenedRef.current = toolId
    setSelectedId(toolId)
  }, [])
  const closeTool = useCallback(() => setSelectedId(null), [])

  function resetFilters() {
    setQuery("")
    setCategoryId(ALL_CATEGORIES)
  }

  const categoryButtons = [
    { id: ALL_CATEGORIES, name: "All tools", count: allTools.length },
    ...categories.map((category) => ({
      id: category.id,
      name: category.name,
      count: counts[category.id] ?? 0,
    })),
  ]
  const activeCategoryName =
    categoryButtons.find((button) => button.id === categoryId)?.name ??
    "All tools"
  const trimmedQuery = query.trim()
  const filtersActive = query !== "" || categoryId !== ALL_CATEGORIES
  const selectedTool = selectedId === null ? undefined : getTool(selectedId)

  return (
    <div className="@container mx-auto flex max-w-6xl flex-col gap-4">
      <DataStatusBanner targetLabel={TEMP_TARGET_LABEL} />

      {selectedTool ? (
        <ToolDetails
          key={selectedTool.id}
          tool={selectedTool}
          platform={findPlatformEntry(selectedTool, TEMP_TARGET)}
          targetLabel={TEMP_TARGET_LABEL}
          versions={getVersionsFor(selectedTool.id)}
          versionsAreSample={versionsAreSample}
          onBack={closeTool}
        />
      ) : (
        <>
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
              className="h-10 pl-9 pr-9"
            />
            {query !== "" ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
                onClick={() => {
                  setQuery("")
                  searchRef.current?.focus()
                }}
              >
                <X />
              </Button>
            ) : null}
          </div>

          <nav aria-label="Categories">
            <ul className="flex gap-1.5 overflow-x-auto p-0.5 @3xl:flex-wrap @3xl:overflow-visible">
              {categoryButtons.map(({ id, name, count }) => {
                const isActive = id === categoryId
                return (
                  <li key={id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setCategoryId(id)}
                      aria-pressed={isActive}
                      className={cn(
                        "inline-flex items-center gap-2 whitespace-nowrap rounded-md border px-2.5 py-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "border-primary/60 bg-accent text-accent-foreground"
                          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {name}
                      <span className="font-mono text-xs opacity-80">{count}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex min-h-8 items-center justify-between gap-3">
            <h2 className="text-sm font-medium">
              {activeCategoryName}{" "}
              <span
                className="font-mono text-xs font-normal text-muted-foreground"
                aria-live="polite"
              >
                {visibleTools.length} of {allTools.length} tools
              </span>
            </h2>
            {filtersActive ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Reset search and category"
                onClick={resetFilters}
              >
                <RotateCcw />
                Reset
              </Button>
            ) : null}
          </div>

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
                    ? "Try a different name, or reset the filters."
                    : "The catalog is added to in phases. This category simply has no entries yet."
                }
              />
              {filtersActive ? (
                <div className="flex justify-center">
                  <Button type="button" variant="outline" onClick={resetFilters}>
                    Reset filters
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 @lg:grid-cols-2 @3xl:grid-cols-3">
              {visibleTools.map((tool) => (
                <li key={tool.id} className="min-w-0">
                  <ToolCard
                    tool={tool}
                    platform={findPlatformEntry(tool, TEMP_TARGET)}
                    targetLabel={TEMP_TARGET_LABEL}
                    state="not-checked"
                    versions={getVersionsFor(tool.id)}
                    versionsAreSample={versionsAreSample}
                    onOpen={openTool}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}