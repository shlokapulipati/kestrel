import { useRef, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { SaveResult } from "@/stacks/StacksProvider"
import type { StackDraft } from "@/stacks/types"
import {
  DESCRIPTION_MAX,
  NAME_MAX,
  type StackFormErrors,
} from "@/stacks/validation"

type StackDetailsFormProps = {
  heading: string
  submitLabel: string
  initial: StackDraft
  onSubmit: (draft: StackDraft) => SaveResult
  onSaved: (name: string) => void
  onCancel: () => void
}

export function StackDetailsForm({
  heading,
  submitLabel,
  initial,
  onSubmit,
  onSaved,
  onCancel,
}: StackDetailsFormProps) {
  const [name, setName] = useState(initial.name)
  const [description, setDescription] = useState(initial.description)
  const [errors, setErrors] = useState<StackFormErrors>({})
  const nameRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const result = onSubmit({ name, description ,tools: initial.tools})
    if (result.ok) {
      onSaved(result.stack.name)
      return
    }
    setErrors(result.errors)
    // Move focus to the first field that needs attention.
    if (result.errors.name) nameRef.current?.focus()
    else descriptionRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-xl space-y-4"
    >
      <h2 className="text-lg font-semibold tracking-tight">{heading}</h2>

      <div className="space-y-1.5">
        <label htmlFor="stack-name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="stack-name"
          ref={nameRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "stack-name-error" : undefined}
          autoComplete="off"
          autoFocus
        />
        <div className="flex justify-between gap-3 text-xs">
          <p id="stack-name-error" role="alert" className="text-destructive">
            {errors.name ?? ""}
          </p>
          <p className="font-mono text-muted-foreground">
            {name.length}/{NAME_MAX}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="stack-description" className="text-sm font-medium">
          Description <span className="text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="stack-description"
          ref={descriptionRef}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={
            errors.description ? "stack-description-error" : undefined
          }
        />
        <div className="flex justify-between gap-3 text-xs">
          <p
            id="stack-description-error"
            role="alert"
            className="text-destructive"
          >
            {errors.description ?? ""}
          </p>
          <p className="font-mono text-muted-foreground">
            {description.length}/{DESCRIPTION_MAX}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">{submitLabel}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}