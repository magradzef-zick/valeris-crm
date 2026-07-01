"use client";

import { useActionState } from "react";
import { updateLeadAction, type UpdateLeadResult } from "@/server/actions/leads";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LEAD_STATUSES, PRIORITIES, TRADE_DIRECTIONS } from "@/lib/constants/leads";
import type { Lead } from "@/types/crm";

export function LeadEditForm({ lead }: { lead: Lead }) {
  const [result, action, isPending] = useActionState<UpdateLeadResult | undefined, FormData>(
    updateLeadAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="leadId" value={lead.lead_id} />

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={lead.status}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="priority">Priority</Label>
        <select
          id="priority"
          name="priority"
          defaultValue={lead.priority}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="owner">Owner</Label>
        <Input id="owner" name="owner" defaultValue={lead.owner} placeholder="Name or email" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="trade_direction">Trade direction</Label>
        <select
          id="trade_direction"
          name="trade_direction"
          defaultValue={lead.trade_direction}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Not specified</option>
          {TRADE_DIRECTIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="next_action">Next action</Label>
        <Input
          id="next_action"
          name="next_action"
          defaultValue={lead.next_action}
          placeholder="e.g. Follow up call"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="next_action_date">Next action date</Label>
        <Input
          id="next_action_date"
          name="next_action_date"
          type="date"
          defaultValue={lead.next_action_date ? lead.next_action_date.slice(0, 10) : ""}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Internal notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={lead.notes}
          placeholder="Private notes for the team…"
          rows={4}
        />
      </div>

      {result && "error" in result && (
        <p className="text-sm text-destructive">{result.error}</p>
      )}
      {result && "ok" in result && (
        <p className="text-sm text-emerald-700">Saved.</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
