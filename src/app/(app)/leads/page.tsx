import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guards";
import { getLeads } from "@/server/queries/leads";
import { LeadsTable } from "@/components/leads/leads-table";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Leads — Valeris CRM" };

export default async function LeadsPage() {
  const session = await requireUser();
  const { leads, error } = await getLeads(session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Leads</h1>
        <p className="text-sm text-muted-foreground">
          All inbound enquiries from the website.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <LeadsTable leads={leads} />
    </div>
  );
}
