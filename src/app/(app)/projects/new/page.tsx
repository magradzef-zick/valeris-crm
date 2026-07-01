import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getCompanies } from "@/server/queries/companies";
import { getUsers } from "@/server/queries/team";
import { ProjectCreateForm } from "@/components/projects/project-create-form";

export const metadata: Metadata = { title: "New Project — Valeris CRM" };

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string; companyId?: string }>;
}) {
  const session = await requireUser();
  const { leadId, companyId } = await searchParams;

  const [{ companies }, { users }] = await Promise.all([
    getCompanies(session),
    getUsers(session),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Projects
        </Link>
        <h1 className="font-heading text-2xl font-medium">New project</h1>
      </div>
      <ProjectCreateForm
        companies={companies}
        users={users}
        defaultLeadId={leadId}
        defaultCompanyId={companyId}
      />
    </div>
  );
}
