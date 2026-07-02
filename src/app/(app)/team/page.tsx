import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { requireUser } from "@/server/auth/guards";
import { isOwnerOrAdmin } from "@/server/auth/permissions";
import { getUsers } from "@/server/queries/team";
import { QK } from "@/lib/crm-queries";
import { TeamClient } from "./team-client";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Team — Valeris CRM" };

export default async function TeamPage() {
  const session = await requireUser();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: QK.users,
    queryFn: async () => {
      const { users } = await getUsers(session);
      return { users };
    },
  });

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

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TeamClient currentRole={session.role} />
      </HydrationBoundary>
    </div>
  );
}
