"use client";

import { useActionState } from "react";
import { createProjectAction, type ProjectActionResult } from "@/server/actions/projects";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PROJECT_STATUSES, PROJECT_PHASES, SERVICE_LINES } from "@/lib/constants/projects";
import { TRADE_DIRECTIONS } from "@/lib/constants/shared";
import type { CompanySummary, CrmUser } from "@/types/crm";

const SELECT_CLS = "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function ProjectCreateForm({
  companies,
  users,
  defaultLeadId,
  defaultCompanyId,
}: {
  companies: CompanySummary[];
  users: CrmUser[];
  defaultLeadId?: string;
  defaultCompanyId?: string;
}) {
  const [result, action, isPending] = useActionState<
    ProjectActionResult | undefined,
    FormData
  >(createProjectAction, undefined);

  return (
    <form action={action} className="space-y-4 max-w-xl">
      {defaultLeadId && <input type="hidden" name="lead_id" value={defaultLeadId} />}

      <div className="space-y-1.5">
        <Label htmlFor="name">Project name <span className="text-destructive">*</span></Label>
        <Input id="name" name="name" required placeholder="e.g. Supplier Verification — Q3 2026" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue="Active" className={SELECT_CLS}>
            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phase">Phase</Label>
          <select id="phase" name="phase" defaultValue="Discovery" className={SELECT_CLS}>
            {PROJECT_PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="priority">Priority</Label>
          <select id="priority" name="priority" defaultValue="Medium" className={SELECT_CLS}>
            {['High', 'Medium', 'Low'].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="service_line">Service line</Label>
          <select id="service_line" name="service_line" className={SELECT_CLS}>
            <option value="">Not specified</option>
            {SERVICE_LINES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="trade_direction">Trade direction</Label>
        <select id="trade_direction" name="trade_direction" className={SELECT_CLS}>
          <option value="">Not specified</option>
          {TRADE_DIRECTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="company_id">Company</Label>
        <select id="company_id" name="company_id" defaultValue={defaultCompanyId ?? ""} className={SELECT_CLS}>
          <option value="">Not linked</option>
          {companies.map((c) => <option key={c.company_id} value={c.company_id}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="owner_user_id">Owner</Label>
          <select id="owner_user_id" name="owner_user_id" className={SELECT_CLS}>
            <option value="">Not assigned</option>
            {users.map((u) => <option key={u.user_id} value={u.user_id}>{u.full_name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="operations_user_id">Operations</Label>
          <select id="operations_user_id" name="operations_user_id" className={SELECT_CLS}>
            <option value="">Not assigned</option>
            {users.filter((u) => u.role === 'Operations' || u.role === 'Owner' || u.role === 'Administrator').map((u) => (
              <option key={u.user_id} value={u.user_id}>{u.full_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start date</Label>
          <Input id="start_date" name="start_date" type="date" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="target_end_date">Target end date</Label>
          <Input id="target_end_date" name="target_end_date" type="date" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Project scope, objectives, notes…" rows={4} />
      </div>

      {result && 'error' in result && result.error && <p className="text-sm text-destructive">{result.error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create project"}
      </Button>
    </form>
  );
}
