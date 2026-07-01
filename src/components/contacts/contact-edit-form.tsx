"use client";

import { useActionState } from "react";
import { updateContactAction, type ContactActionResult } from "@/server/actions/companies";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CONTACT_STATUSES } from "@/lib/constants/companies";
import { LANGUAGES } from "@/lib/constants/shared";
import type { Contact, CompanySummary } from "@/types/crm";

export function ContactEditForm({
  contact,
  companies,
}: {
  contact: Contact;
  companies: CompanySummary[];
}) {
  const [result, action, isPending] = useActionState<ContactActionResult | undefined, FormData>(
    updateContactAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="contactId" value={contact.contact_id} />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First name</Label>
          <Input id="first_name" name="first_name" defaultValue={contact.first_name} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last name</Label>
          <Input id="last_name" name="last_name" defaultValue={contact.last_name} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company_id">Company</Label>
        <select id="company_id" name="company_id" defaultValue={contact.company_id} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          <option value="">No company</option>
          {companies.map((c) => (
            <option key={c.company_id} value={c.company_id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="title">Title / Role</Label>
        <Input id="title" name="title" defaultValue={contact.title} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={contact.email} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={contact.phone} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="language">Language</Label>
        <select id="language" name="language" defaultValue={contact.language} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          <option value="">Not specified</option>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" defaultValue={contact.status} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          {CONTACT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input id="linkedin" name="linkedin" defaultValue={contact.linkedin} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_primary"
          name="is_primary"
          type="checkbox"
          defaultChecked={contact.is_primary}
          className="h-4 w-4 rounded border-input accent-brand-green"
        />
        <Label htmlFor="is_primary" className="cursor-pointer">Primary contact</Label>
      </div>

      {result && "error" in result && <p className="text-sm text-destructive">{result.error}</p>}
      {result && "ok" in result && <p className="text-sm text-emerald-700">Saved.</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
