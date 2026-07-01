import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { isOwnerOrAdmin } from "@/server/auth/permissions";
import { getUsers } from "@/server/queries/team";
import { TeamTable } from "@/components/team/team-table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Team — Valeris CRM" };

export default async function TeamPage() {
  const session = await requireUser();
  const { users, error } = await getUsers(session);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium">Team</h1>
          <p className="text-sm text-muted-foreground">Valeris CRM users and their roles.</p>
        </div>
        {isOwnerOrAdmin(session.role) && (
          <Button asChild size="sm">
            <Link href="/team/new">
              <Plus className="h-3.5 w-3.5" />
              Add member
            </Link>
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <TeamTable users={users} currentRole={session.role} />
    </div>
  );
}
