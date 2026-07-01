"use client";

import { useActionState } from "react";
import { createUserAction, type TeamActionResult } from "@/server/actions/team";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SELECT_CLS = "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function UserCreateForm({ currentRole }: { currentRole: string }) {
  const [result, action, isPending] = useActionState<
    TeamActionResult | undefined,
    FormData
  >(createUserAction, undefined);

  return (
    <form action={action} className="space-y-4 max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Full name <span className="text-destructive">*</span></Label>
        <Input id="full_name" name="full_name" required placeholder="e.g. Jan Kowalski" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
        <Input id="email" name="email" type="email" required placeholder="jan@valeris.com.in" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="role">Role</Label>
        <select id="role" name="role" defaultValue="Sales" className={SELECT_CLS}>
          {currentRole === 'Owner'
            ? ['Owner', 'Administrator', 'Sales', 'Operations'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))
            : ['Sales', 'Operations'].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))
          }
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Temporary password <span className="text-destructive">*</span></Label>
        <Input id="password" name="password" type="password" required
          placeholder="Must be changed on first login" />
        <p className="text-xs text-muted-foreground">
          Share this password securely with the team member. They should change it via the Apps Script editor on first use.
        </p>
      </div>

      {result && 'error' in result && result.error && <p className="text-sm text-destructive">{result.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding member…" : "Add team member"}
      </Button>
    </form>
  );
}
