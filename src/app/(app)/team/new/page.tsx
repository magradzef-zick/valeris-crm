import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { requireUser } from "@/server/auth/guards";
import { isOwnerOrAdmin } from "@/server/auth/permissions";
import { UserCreateForm } from "@/components/team/user-create-form";

export const metadata: Metadata = { title: "Add Team Member — Valeris CRM" };

export default async function NewTeamMemberPage() {
  const session = await requireUser();
  if (!isOwnerOrAdmin(session.role)) redirect("/team");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/team"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Team
        </Link>
        <h1 className="font-heading text-2xl font-medium">Add team member</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a CRM login for a new team member. The password can be changed later via the Apps Script editor.
        </p>
      </div>
      <UserCreateForm currentRole={session.role} />
    </div>
  );
}
