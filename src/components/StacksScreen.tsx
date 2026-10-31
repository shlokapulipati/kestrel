import { Layers, Plus } from "lucide-react"
import { useState } from "react"

import { ConfirmationDialog } from "@/components/ConfirmationDialog"
import { EmptyState } from "@/components/EmptyState"
import { StackDetailsForm } from "@/components/StackDetailsForm"
import { StackSummary } from "@/components/StackSummary"
import { Button } from "@/components/ui/button"
import { useStacks } from "@/stacks/StacksProvider"

type View =
  | { mode: "list" }
  | { mode: "create" }
  | { mode: "edit"; id: string }

export function StacksScreen() {
  const { stacks, createStack, updateStackDetails, deleteStack } = useStacks()
  const [view, setView] = useState<View>({ mode: "list" })
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [notice, setNotice] = useState("")

  const editingStack =
    view.mode === "edit"
      ? stacks.find((stack) => stack.id === view.id)
      : undefined
  const pendingDelete =
    pendingDeleteId === null
      ? undefined
      : stacks.find((stack) => stack.id === pendingDeleteId)
  const sorted = [...stacks].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  )

  function backToList(message: string) {
    setNotice(message)
    setView({ mode: "list" })
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <p className="rounded-md border border-border bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
        Stacks are kept in memory for now and are lost when the app closes.
        Saving them to disk arrives in Milestone 5. Adding tools to a stack
        arrives in the next step.
      </p>

      <p className="sr-only" role="status" aria-live="polite">
        {notice}
      </p>

      {view.mode === "create" ? (
        <StackDetailsForm
          heading="New stack"
          submitLabel="Create stack"
          initial={{ name: "", description: "" , tools: [],}}
          onSubmit={createStack}
          onSaved={(name) => backToList(`Created stack "${name}".`)}
          onCancel={() => setView({ mode: "list" })}
        />
      ) : view.mode === "edit" && editingStack ? (
        <StackDetailsForm
          key={editingStack.id}
          heading="Edit stack details"
          submitLabel="Save changes"
          initial={{
            name: editingStack.name,
            description: editingStack.description,
            tools: editingStack.tools,
          }}
          onSubmit={(draft) => updateStackDetails(editingStack.id, draft)}
          onSaved={(name) => backToList(`Saved changes to "${name}".`)}
          onCancel={() => setView({ mode: "list" })}
        />
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium">
              Your stacks{" "}
              <span className="font-mono text-xs font-normal text-muted-foreground">
                {stacks.length}
              </span>
            </h2>
            <Button type="button" size="sm" onClick={() => setView({ mode: "create" })}>
              <Plus />
              New stack
            </Button>
          </div>

          {notice !== "" ? (
            <p className="text-xs text-muted-foreground">{notice}</p>
          ) : null}

          {sorted.length === 0 ? (
            <div className="space-y-3">
              <EmptyState
                icon={Layers}
                title="No stacks yet"
                description="A stack is a named set of tools and versions for one kind of project. Create one to get started."
              />
              <div className="flex justify-center">
                <Button type="button" onClick={() => setView({ mode: "create" })}>
                  <Plus />
                  Create your first stack
                </Button>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {sorted.map((stack) => (
                <li key={stack.id}>
                  <StackSummary
                    stack={stack}
                    onEdit={(id) => {
                      setNotice("")
                      setView({ mode: "edit", id })
                    }}
                    onDelete={setPendingDeleteId}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ConfirmationDialog
        open={pendingDelete !== undefined}
        title={`Delete "${pendingDelete?.name ?? ""}"?`}
        description="This removes the stack from Kestrel. It cannot be undone. It does not uninstall anything from your computer."
        confirmLabel="Delete stack"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteStack(pendingDelete.id)
            setNotice(`Deleted stack "${pendingDelete.name}".`)
          }
          setPendingDeleteId(null)
        }}
      />
    </div>
  )
}