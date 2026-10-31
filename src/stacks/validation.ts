import type { Stack, StackDraft } from "./types"

export const NAME_MAX = 60
export const DESCRIPTION_MAX = 300

export type StackFormErrors = {
  name?: string
  description?: string
}

export type ValidationResult =
  | { ok: true; value: StackDraft }
  | { ok: false; errors: StackFormErrors }

// Control characters (other than ordinary line breaks in the description)
// have no place in a name or description.
function hasControlCharacters(text: string, allowLineBreaks: boolean): boolean {
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0
    const isControl = code < 32 || code === 127
    const isAllowed = allowLineBreaks && (code === 9 || code === 10 || code === 13)
    if (isControl && !isAllowed) return true
  }
  return false
}

export function validateStackDraft(
  draft: StackDraft,
  existing: Stack[],
  editingId: string | null,
): ValidationResult {
  const errors: StackFormErrors = {}
  const name = draft.name.trim()
  const description = draft.description.trim()

  if (name === "") {
    errors.name = "Give the stack a name."
  } else if (name.length > NAME_MAX) {
    errors.name = `Use at most ${NAME_MAX} characters.`
  } else if (hasControlCharacters(name, false)) {
    errors.name = "The name contains characters that can't be used."
  } else if (
    existing.some(
      (stack) =>
        stack.id !== editingId &&
        stack.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    errors.name = "Another stack already has this name."
  }

  if (description.length > DESCRIPTION_MAX) {
    errors.description = `Use at most ${DESCRIPTION_MAX} characters.`
  } else if (hasControlCharacters(description, true)) {
    errors.description = "The description contains characters that can't be used."
  }

  if (errors.name || errors.description) return { ok: false, errors }
  return {
  ok: true,
  value: {
    name,
    description,
    tools: draft.tools,
  },
}
}