export type StackTool = {
  toolId: string
  /** A version string from the catalog, or null if none is chosen yet. */
  version: string | null
}
export type Stack={
    id:string
    name:string
    description:string
    tools:StackTool[]
    createdAt:string
    updatedAt:string
}
export type StackDraft = {
  name: string
  description: string
  tools: StackTool[]
}