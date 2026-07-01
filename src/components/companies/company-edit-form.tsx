"use client";

import { useActionState } from "react";
import { updateCompanyAction, type CompanyActionResult } from "@/server/actions/companies";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { COMPANY_TYPES, COMPANY_STATUSES } from "@/lib/constants/companies";
import { TRADE_DIRECTIONS } from "@/lib/constants/shared";
import type { Company } from "@/types/crm";

export function CompanyEditForm({ company }: { company: Company }) {
  const [result, action, isPending] = useActionState<CompanyActionResult | undefined, FormData>(
    updateCompanyAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="companyId" value={company.company_id} />

      <div className="space-y-1.5">
        <Label htmlFor="name">Company name</Label>
        <Input id="name" name="name" defaultValue={company.name} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="type">Type</Label>
        <select id="type" name="type" defaultValue={company.type} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          <option value="">Not specified</option>
          {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" defaultValue={company.status} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          {COMPANY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="trade_direction">Trade direction</Label>
        <select id="trade_direction" name="trade_direction" defaultValue={company.trade_direction} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
          <option value="">Not specified</option>
          {TRADE_DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="country">Country</Label>
        <Input id="country" name="country" defaultValue={company.country} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" defaultValue={company.city} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="industry">Industry</Label>
        <Input id="industry" name="industry" defaultValue={company.industry} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={company.email} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" defaultValue={company.phone} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" defaultValue={company.website} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <Input id="linkedin" name="linkedin" defaultValue={company.linkedin} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={company.notes} rows={3} />
      </div>

      {result && "error" in result && <p className="text-sm text-destructive">{result.error}</p>}
      {result && "ok" in result && <p className="text-sm text-emerald-700">Saved.</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
