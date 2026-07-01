"use client";

import { useActionState } from "react";
import { createContactAction } from "@/server/actions/companies";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CONTACT_STATUSES } from "@/lib/constants/companies";
import { LANGUAGES } from "@/lib/constants/shared";
import type { CompanySummary } from "@/types/crm";

export function ContactCreateForm({
  companies,
  defaultCompanyId,
}: {
  companies: CompanySummary[];
  defaultCompanyId?: string;
}) {
  const [result, action, isPending] = useActionState<{ error?: string } | undefined, FormData>(
    createContactAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4 max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First name <span className="text-destructive">*</span></Label>
          <Input id="first_name" name="first_name" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last name <span className="text-destructive">*</span></Label>
          <Input id="last_name" name="last_name" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company_id">Company</Label>
        <select id="company_id" name="company_id" defaultValue={defaultCompanyId ?? ""} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          <option value="">No company</option>
          {companies.map((c) => (
            <option key={c.company_id} value={c.company_id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Title / Role</Label>
        <Input id="title" name="title" placeholder="e.g. Purchasing Manager" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="language">Language</Label>
          <select id="language" name="language" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            <option value="">Not specified</option>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue="Active" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            {CONTACT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input id="linkedin" name="linkedin" placeholder="linkedin.com/in/…" />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_primary"
          name="is_primary"
          type="checkbox"
          value="true"
          className="h-4 w-4 rounded border-input accent-brand-green"
        />
        <Label htmlFor="is_primary" className="cursor-pointer">Primary contact for this company</Label>
      </div>

      {result?.error && <p className="text-sm text-destructive">{result.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create contact"}
      </Button>
    </form>
  );
}
