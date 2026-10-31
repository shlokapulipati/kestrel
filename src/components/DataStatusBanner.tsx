import { getCatalogInfo } from "@/catalog/catalog"

export function DataStatusBanner({ targetLabel }: { targetLabel: string }) {
  const info = getCatalogInfo()
  return (
    <p className="rounded-md border border-border bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
      {info.toolsStatus === "sample"
        ? "Sample data, not refreshed from any official source."
        : "Reviewed catalog data."}{" "}
      Catalog dated {info.updatedAt}.{" "}
      {info.versionsRetrievedAt === null
        ? "Version lists have never been refreshed."
        : `Versions retrieved ${info.versionsRetrievedAt}.`}{" "}
      Compatibility is shown for {targetLabel}, which is assumed until machine
      detection exists (Milestone 6).
    </p>
  )
}