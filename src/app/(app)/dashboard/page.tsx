import type { Metadata } from "next";
import Link from "next/link";
import { Users, FolderKanban, CheckSquare, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getDashboardStats } from "@/server/queries/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard — Valeris CRM" };

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  href?: string;
  accent?: "red" | "amber" | "green";
}) {
  const accentCls =
    accent === "red"   ? "text-red-600"   :
    accent === "amber" ? "text-amber-600" :
    accent === "green" ? "text-emerald-600" : "text-foreground";

  const card = (
    <Card className={href ? "hover:bg-muted/30 transition-colors" : ""}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${accentCls}`}>{value}</div>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{card}</Link> : card;
}

export default async function DashboardPage() {
  const session = await requireUser();
  const firstName = session.name.split(" ")[0];
  const { stats } = await getDashboardStats(session);

  const openLeads =
    (stats?.leads.byStatus["New"] ?? 0) +
    (stats?.leads.byStatus["Contacted"] ?? 0) +
    (stats?.leads.byStatus["Qualified"] ?? 0) +
    (stats?.leads.byStatus["Proposal"] ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium">Welcome, {firstName}</h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across Valeris today.
        </p>
      </div>

      {!stats ? (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Dashboard data unavailable — check that Apps Script is deployed and APPS_SCRIPT_URL is set.
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Leads</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total leads"   value={stats.leads.total}         icon={Users}        href="/leads" />
              <StatCard label="Open"          value={openLeads}                 icon={TrendingUp}   href="/leads" accent={openLeads > 10 ? "amber" : undefined} />
              <StatCard label="High priority" value={stats.leads.highPriority}  icon={AlertTriangle} href="/leads" accent={stats.leads.highPriority > 0 ? "red" : undefined} />
              <StatCard label="New this month" value={stats.leads.newThisMonth} icon={Clock}        sub={`${stats.leads.byStatus["Won"] ?? 0} won`} />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Projects</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard label="Total"     value={stats.projects.total}     icon={FolderKanban} href="/projects" />
              <StatCard label="Active"    value={stats.projects.active}    icon={FolderKanban} href="/projects" accent="green" />
              <StatCard label="Completed" value={stats.projects.completed} icon={FolderKanban} href="/projects" />
            </div>
          </div>

          <div>
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Tasks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total"     value={stats.tasks.total}    icon={CheckSquare} href="/tasks" />
              <StatCard label="Open"      value={stats.tasks.open}     icon={CheckSquare} href="/tasks" />
              <StatCard label="Due today" value={stats.tasks.dueToday} icon={Clock}       href="/tasks" accent={stats.tasks.dueToday > 0 ? "amber" : undefined} />
              <StatCard label="Overdue"   value={stats.tasks.overdue}  icon={AlertTriangle} href="/tasks" accent={stats.tasks.overdue > 0 ? "red" : undefined} />
            </div>
          </div>

          {/* Lead status breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Lead pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["New", "Contacted", "Qualified", "Proposal", "Won", "Lost", "Spam"].map((s) => (
                  <div key={s} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s}</span>
                    <span className="text-sm font-medium">{stats.leads.byStatus[s] ?? 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
