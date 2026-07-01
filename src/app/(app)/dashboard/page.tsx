import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard — Valeris CRM" };

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = user.name.split(' ')[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Welcome, {firstName}</h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across Valeris.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dashboard is being built out</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Leads, pipeline value, and team activity will appear here as those
          modules ship.
        </CardContent>
      </Card>
    </div>
  );
}
