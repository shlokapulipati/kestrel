import {
  Ban,
  CircleArrowDown,
  CircleCheck,
  CircleDashed,
  CircleX,
  LoaderCircle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type InstallState =
  | "not-checked"
  | "checking"
  | "compatible"
  | "ready"
  | "installing"
  | "verifying"
  | "completed"
  | "failed"
  | "cancelled"

type StateStyle = {
  label: string
  icon: LucideIcon
  className: string
  spin?: boolean
}
const STATE_STYLES: Record<InstallState, StateStyle> = {
  "not-checked": {
    label: "Not checked",
    icon: CircleDashed,
    className: "text-muted-foreground",
  },
  checking: {
    label: "Checking",
    icon: LoaderCircle,
    className: "text-muted-foreground",
    spin: true,
  },
  compatible: {
    label: "Already compatible",
    icon: CircleCheck,
    className: "text-foreground",
  },
  ready: {
    label: "Ready to install",
    icon: CircleArrowDown,
    className: "text-foreground",
  },
  installing: {
    label: "Installing",
    icon: LoaderCircle,
    className: "text-foreground",
    spin: true,
    },
  verifying: {
    label: "Verifying",
    icon: ShieldCheck,
    className: "text-foreground",
  },
  completed: {
    label: "Completed",
    icon: CircleCheck,
    className: "text-foreground",
  },
  failed: {
    label: "Failed",
    icon: CircleX,
    className: "text-destructive",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    className: "text-muted-foreground",
  },
}
export function InstallationStatus({ state }: { state: InstallState }) {
  const { label, icon: Icon, className, spin } = STATE_STYLES[state]
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", className)}>
      <Icon
        className={cn("size-3.5", spin && "motion-safe:animate-spin")}
        aria-hidden
      />
      {label}
    </span>
  )
}