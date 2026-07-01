"use client";

import { useActionState } from "react";
import { createCompanyAction } from "@/server/actions/companies";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { COMPANY_TYPES, COMPANY_STATUSES } from "@/lib/constants/companies";
import { TRADE_DIRECTIONS } from "@/lib/constants/shared";

export function CompanyCreateForm() {
  const [result, action, isPending] = useActionState<{ error?: string } | undefined, FormData>(
    createCompanyAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4 max-w-xl">
      <div className="space-y-1.5">
        <Label htmlFor="name">Company name <span className="text-destructive">*</span></Label>
        <Input id="name" name="name" required placeholder="e.g. Kowalski Exports Sp. z o.o." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <select id="type" name="type" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            <option value="">Not specified</option>
            {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue="Active" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            {COMPANY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" placeholder="e.g. Poland" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" placeholder="e.g. Warsaw" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" name="industry" placeholder="e.g. Pharmaceuticals" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="trade_direction">Trade direction</Label>
          <select id="trade_direction" name="trade_direction" className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
            <option value="">Not specified</option>
            {TRADE_DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="contact@company.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+48 …" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input id="website" name="website" placeholder="https://…" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" name="linkedin" placeholder="linkedin.com/company/…" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" placeholder="Internal notes…" rows={3} />
      </div>

      {result?.error && <p className="text-sm text-destructive">{result.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create company"}
      </Button>
    </form>
  );
}
