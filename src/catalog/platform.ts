import type { OperatingSystem, PlatformEntry, Tool } from "./types"
export type Target={
    os:OperatingSystem
    distroFamily?: PlatformEntry["distroFamily"]
}
export const TEMP_TARGET:Target = { os: "linux", distroFamily: "fedora" }
export const TEMP_TARGET_LABEL = "Fedora"
export function findPlatformEntry(
  tool: Tool,
  target: Target,
): PlatformEntry | undefined {
  return tool.platforms.find(
    (platform) =>
      platform.os === target.os &&
      (platform.distroFamily === undefined ||
        platform.distroFamily === target.distroFamily),
  )
}