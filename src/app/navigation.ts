import {
  Activity,
  ArrowLeftRight,
  LayoutDashboard,
  Layers,
  Package,
  Settings,
  type LucideIcon,
} from "lucide-react"
export type ViewId=
  | "overview"
  | "stacks"
  | "catalog"
  | "activity"
  | "transfer"
  | "settings"
export type NavItem={
  id: ViewId
  label: string
  icon: LucideIcon
  /** What this screen will do once it is built. */
  description: string
  /** Honest status shown on the placeholder. */
  status: string
}
export const NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    description:
      "A summary of this machine and your stacks: what is installed, what is missing, and what needs attention.",
    status: "Not implemented yet. Needs machine detection (Milestone 6).",
  },
  {
    id: "stacks",
    label: "My Stacks",
    icon: Layers,
    description:
      "Create, edit and review the sets of tools and versions your projects need.",
    status: "Not implemented yet. Planned for Milestone 4.",
  },
  {
    id: "catalog",
    label: "Tool Catalog",
    icon: Package,
    description:
      "Browse and search the tools Kestrel knows about, with versions and platform support.",
    status: "Not implemented yet. Planned for Milestone 3.",
  },
  {
    id: "activity",
    label: "Installation Activity",
    icon: Activity,
    description:
      "Live output and history for every installation run, with verification results.",
    status: "Not implemented yet. Arrives with real installations (Milestones 8 and 9).",
  },
  {
    id: "transfer",
    label: "Exports and Imports",
    icon: ArrowLeftRight,
    description:
      "Share a stack as a JSON manifest, or import one from a teammate and preview it before anything changes.",
    status: "Not implemented yet. Planned for Milestone 10.",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Preferences for how Kestrel looks and behaves.",
    status:
      "Not implemented yet. Theme switching already works from the top bar.",
  },
]