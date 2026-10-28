import type { Category, Tool } from "./types"

export const ALL_CATEGORIES="all"
export function filterTools(
  tools: Tool[],
  query: string,
  categoryId: string,
): Tool[] {
  const needle = query.trim().toLowerCase()
  return tools.filter((tool) => {
    if (categoryId !== ALL_CATEGORIES && tool.category !== categoryId) {
      return false
    }
    if (needle === "") return true
    return (
      tool.name.toLowerCase().includes(needle) || tool.id.includes(needle)
    )
  })
}
export function countByCategory(
  tools: Tool[],
  categories: Category[],
): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const category of categories) counts[category.id] = 0
  for (const tool of tools) {
    counts[tool.category] = (counts[tool.category] ?? 0) + 1
  }
  return counts
}