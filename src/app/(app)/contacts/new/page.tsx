import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getCompanies } from "@/server/queries/companies";
import { ContactCreateForm } from "@/components/contacts/contact-create-form";

export const metadata: Metadata = { title: "New Contact — Valeris CRM" };

export default async function NewContactPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const session = await requireUser();
  const { companyId } = await searchParams;
  const { companies } = await getCompanies(session);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/contacts"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Contacts
        </Link>
        <h1 className="font-heading text-2xl font-medium">New contact</h1>
      </div>
      <ContactCreateForm companies={companies} defaultCompanyId={companyId} />
    </div>
  );
}
