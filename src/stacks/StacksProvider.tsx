import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Stack, StackDraft } from "./types"
import { validateStackDraft, type StackFormErrors } from "./validation"
export type SaveResult =
  | { ok: true; stack: Stack }
  | { ok: false; errors: StackFormErrors }
type StacksContextValue = {
  stacks: Stack[]
  createStack: (draft: StackDraft) => SaveResult
  updateStackDetails: (id: string, draft: StackDraft) => SaveResult
  deleteStack: (id: string) => void
}
const StacksContext = createContext<StacksContextValue | null>(null)

// In-memory only for now. Saving to disk arrives in Milestone 5.
export function StacksProvider({ children }: { children: ReactNode }) {
  const [stacks, setStacks] = useState<Stack[]>([])

  const createStack = useCallback(
    (draft: StackDraft): SaveResult => {
      const result = validateStackDraft(draft, stacks, null)
      if (!result.ok) return result

      const now = new Date().toISOString()
      const stack: Stack = {
        id: crypto.randomUUID(),
        name: result.value.name,
        description: result.value.description,
        tools: [],
        createdAt: now,
        updatedAt: now,
      }
      setStacks((current) => [...current, stack])
      return { ok: true, stack }
    },
    [stacks],
  )
  const updateStackDetails = useCallback(
    (id: string, draft: StackDraft): SaveResult => {
      const existing = stacks.find((stack) => stack.id === id)
      if (!existing) {
        return { ok: false, errors: { name: "This stack no longer exists." } }
      }
      const result = validateStackDraft(draft, stacks, id)
      if (!result.ok) return result

      const updated: Stack = {
        ...existing,
        name: result.value.name,
        description: result.value.description,
        updatedAt: new Date().toISOString(),
      }
      setStacks((current) =>
        current.map((stack) => (stack.id === id ? updated : stack)),
      )
      return { ok: true, stack: updated }
    },
    [stacks],
  )
  const deleteStack = useCallback((id: string) => {
    setStacks((current) => current.filter((stack) => stack.id !== id))
  }, [])

  const value = useMemo(
    () => ({ stacks, createStack, updateStackDetails, deleteStack }),
    [stacks, createStack, updateStackDetails, deleteStack],
  )

  return <StacksContext.Provider value={value}>{children}</StacksContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStacks(): StacksContextValue {
  const context = useContext(StacksContext)
  if (!context) {
    throw new Error("useStacks must be used inside <StacksProvider>")
  }
  return context
}