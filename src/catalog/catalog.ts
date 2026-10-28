// The only place the app reads catalog data. Everything else calls these
// functions, so the data source can change later without touching the UI.
import toolsFile from "../../catalog/tools.json"
import versionsFile from "../../catalog/versions.sample.json"

import type {
  CatalogInfo,
  Category,
  Tool,
  ToolCatalog,
  VersionsFile,
} from "./types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

// Light sanity checks only. Full validation is `npm run catalog:check`.
function parseCatalog(raw: unknown): ToolCatalog {
  if (
    !isRecord(raw) ||
    raw.schemaVersion !== 1 ||
    !Array.isArray(raw.categories) ||
    !Array.isArray(raw.tools)
  ) {
    throw new Error(
      "catalog/tools.json has an unexpected shape. Run `npm run catalog:check`.",
    )
  }
  return raw as unknown as ToolCatalog
}

function parseVersions(raw: unknown): VersionsFile {
  if (!isRecord(raw) || raw.schemaVersion !== 1 || !isRecord(raw.tools)) {
    throw new Error(
      "catalog/versions.sample.json has an unexpected shape. Run `npm run catalog:check`.",
    )
  }
  return raw as unknown as VersionsFile
}

const catalog = parseCatalog(toolsFile)
const versions = parseVersions(versionsFile)

export function getCatalogInfo(): CatalogInfo {
  return {
    toolsStatus: catalog.dataStatus,
    toolsNote: catalog.dataNote,
    updatedAt: catalog.updatedAt,
    versionsStatus: versions.dataStatus,
    versionsRetrievedAt: versions.retrievedAt,
  }
}

export function getCategories(): Category[] {
  return catalog.categories
}

export function getTools(): Tool[] {
  return catalog.tools
}

export function getToolsInCategory(categoryId: string): Tool[] {
  return catalog.tools.filter((tool) => tool.category === categoryId)
}

export function getTool(toolId: string): Tool | undefined {
  return catalog.tools.find((tool) => tool.id === toolId)
}

/** Version strings listed for a tool, or an empty list if none are known. */
export function getVersionsFor(toolId: string): string[] {
  const entry = versions.tools[toolId]
  return entry ? entry.versions.map((item) => item.version) : []
}