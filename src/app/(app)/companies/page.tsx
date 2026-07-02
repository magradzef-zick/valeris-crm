import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { requireUser } from "@/server/auth/guards";
import { getCompanies } from "@/server/queries/companies";
import { QK } from "@/lib/crm-queries";
import { CompaniesClient } from "./companies-client";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Companies — Valeris CRM" };

export default async function CompaniesPage() {
  const session = await requireUser();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: QK.companies,
    queryFn: async () => {
      const { companies } = await getCompanies(session);
      return { companies };
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium">Companies</h1>
          <p className="text-sm text-muted-foreground">B2B organisations in your network.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/companies/new">
            <Plus className="h-3.5 w-3.5" />
            New company
          </Link>
        </Button>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <CompaniesClient />
      </HydrationBoundary>
    </div>
  );
}
