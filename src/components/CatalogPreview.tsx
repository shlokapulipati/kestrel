import {
  getCatalogInfo,
  getCategories,
  getToolsInCategory,
  getVersionsFor,
} from "@/catalog/catalog"

export function CatalogPreview() {
  const info = getCatalogInfo()
  const categories = getCategories()

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <p className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
        {info.toolsStatus === "sample"
          ? "Sample data, not refreshed from any official source."
          : "Reviewed catalog data."}{" "}
        Catalog dated {info.updatedAt}.{" "}
        {info.versionsRetrievedAt === null
          ? "Version lists have never been refreshed."
          : `Versions retrieved ${info.versionsRetrievedAt}.`}{" "}
        This is a temporary preview; the real catalog screen replaces it next.
      </p>

      {categories.map((category) => {
        const tools = getToolsInCategory(category.id)
        return (
          <section key={category.id} className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              {category.name}
            </h2>
            {tools.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tools yet.</p>
            ) : (
              tools.map((tool) => (
                <article
                  key={tool.id}
                  className="space-y-2 rounded-lg border border-border bg-card p-4"
                >
                  <h3 className="font-medium">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                  <p className="font-mono text-xs">
                    versions: {getVersionsFor(tool.id).join(", ") || "none listed"}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    on this computer: not checked
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {tool.platforms
                      .map(
                        (platform) =>
                          `${platform.distroFamily ?? platform.os}: ${platform.status}`,
                      )
                      .join(" · ")}
                  </p>
                </article>
              ))
            )}
          </section>
        )
      })}
    </div>
  )
}