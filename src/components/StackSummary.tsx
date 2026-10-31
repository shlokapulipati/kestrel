import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Stack } from "@/stacks/types"

type StackSummaryProps = {
  stack: Stack
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function StackSummary({ stack, onEdit, onDelete }: StackSummaryProps) {
  const toolCount = stack.tools.length
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1">
        <h3 className="truncate font-medium">{stack.name}</h3>
        {stack.description !== "" ? (
          <p className="line-clamp-2 whitespace-pre-line text-sm text-muted-foreground">
            {stack.description}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">No description</p>
        )}
        <p className="font-mono text-xs text-muted-foreground">
          {toolCount} {toolCount === 1 ? "tool" : "tools"} · updated{" "}
          {new Date(stack.updatedAt).toLocaleString()}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(stack.id)}
          aria-label={`Edit details of ${stack.name}`}
        >
          <Pencil />
          Edit details
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(stack.id)}
          aria-label={`Delete ${stack.name}`}
        >
          <Trash2 />
          Delete
        </Button>
      </div>
    </div>
  )
}