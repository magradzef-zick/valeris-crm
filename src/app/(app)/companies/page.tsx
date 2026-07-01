import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getCompanies } from "@/server/queries/companies";
import { CompaniesTable } from "@/components/companies/companies-table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Companies — Valeris CRM" };

export default async function CompaniesPage() {
  const session = await requireUser();
  const { companies, error } = await getCompanies(session);

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

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CompaniesTable companies={companies} />
    </div>
  );
}
