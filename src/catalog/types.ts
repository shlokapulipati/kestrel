// TypeScript shapes for catalog/tools.json and catalog/versions.sample.json.
// These mirror the JSON Schemas in catalog/*.schema.json. If one changes,
// change the other, then run `npm run catalog:check`.

export type OperatingSystem = "linux" | "windows" | "macos"

export type PlatformStatus = "supported" | "planned" | "untested" | "unsupported"

export type InstallMethodKind =
  | "system-package"
  | "version-manager"
  | "official-archive"

export type InstallMethod = {
  method: InstallMethodKind
  packageManager?: "dnf" | "apt" | "brew" | "winget"
  packageName?: string
  requiresElevation: boolean
}

export type PlatformEntry = {
  os: OperatingSystem
  distroFamily?: "fedora" | "debian" | "arch" | "suse"
  arch?: Array<"x86_64" | "aarch64">
  status: PlatformStatus
  note?: string
  installMethods: InstallMethod[]
}

export type ToolWarning = {
  level: "info" | "caution"
  text: string
}

export type DetectionSpec = {
  executables: string[]
  versionArgs: string[]
  versionPattern: string
}

export type Category = {
  id: string
  name: string
}

export type Tool = {
  id: string
  name: string
  category: string
  description: string
  homepage?: string
  notes?: string[]
  warnings?: ToolWarning[]
  detection: DetectionSpec
  platforms: PlatformEntry[]
}

export type ToolCatalog = {
  schemaVersion: 1
  dataStatus: "sample" | "reviewed"
  dataNote?: string
  updatedAt: string
  categories: Category[]
  tools: Tool[]
}

export type VersionsFile = {
  schemaVersion: 1
  dataStatus: "sample" | "refreshed"
  /** Date the versions were fetched, or null if they never were. */
  retrievedAt: string | null
  note?: string
  tools: Record<string, { versions: Array<{ version: string }> }>
}

export type CatalogInfo = {
  toolsStatus: ToolCatalog["dataStatus"]
  toolsNote?: string
  updatedAt: string
  versionsStatus: VersionsFile["dataStatus"]
  versionsRetrievedAt: string | null
}