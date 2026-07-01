import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { CompanyCreateForm } from "@/components/companies/company-create-form";

export const metadata: Metadata = { title: "New Company — Valeris CRM" };

export default async function NewCompanyPage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/companies"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Companies
        </Link>
        <h1 className="font-heading text-2xl font-medium">New company</h1>
      </div>
      <CompanyCreateForm />
    </div>
  );
}
