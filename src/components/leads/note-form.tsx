"use client";

import { useActionState, useRef, useEffect } from "react";
import { createNoteAction, type CreateNoteResult } from "@/server/actions/notes";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  entityType: string;
  entityId: string;
};

export function NoteForm({ entityType, entityId }: Props) {
  const [result, action, isPending] = useActionState<CreateNoteResult | undefined, FormData>(
    createNoteAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the textarea after a successful submission
  useEffect(() => {
    if (result && "ok" in result) {
      formRef.current?.reset();
    }
  }, [result]);

  return (
    <form ref={formRef} action={action} className="space-y-2">
      <input type="hidden" name="entityType" value={entityType} />
      <input type="hidden" name="entityId" value={entityId} />
      <Textarea
        name="content"
        placeholder="Add a note…"
        rows={3}
        required
        disabled={isPending}
      />
      {result && "error" in result && (
        <p className="text-xs text-destructive">{result.error}</p>
      )}
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Adding…" : "Add note"}
        </Button>
      </div>
    </form>
  );
}
