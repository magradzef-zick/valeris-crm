import type { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { requireUser } from "@/server/auth/guards";
import { getLeads } from "@/server/queries/leads";
import { QK } from "@/lib/crm-queries";
import { LeadsClient } from "./leads-client";

export const metadata: Metadata = { title: "Leads — Valeris CRM" };

export default async function LeadsPage() {
  const session = await requireUser();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: QK.leads,
    queryFn: async () => {
      const { leads } = await getLeads(session);
      return { leads };
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Leads</h1>
        <p className="text-sm text-muted-foreground">
          All inbound enquiries from the website.
        </p>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <LeadsClient />
      </HydrationBoundary>
    </div>
  );
}
