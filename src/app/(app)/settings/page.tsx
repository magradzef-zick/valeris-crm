import type { Metadata } from "next";
import { requireUser } from "@/server/auth/guards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LEAD_STATUSES } from "@/lib/constants/leads";
import { PROJECT_STATUSES, PROJECT_PHASES, SERVICE_LINES } from "@/lib/constants/projects";
import { TASK_STATUSES } from "@/lib/constants/tasks";
import { ROLES, SCHEMA_VERSION } from "@/lib/constants/shared";

export const metadata: Metadata = { title: "Settings — Valeris CRM" };

function ValueList({ values }: { values: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <span key={v} className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {v}
        </span>
      ))}
    </div>
  );
}

export default async function SettingsPage() {
  const session = await requireUser();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-2xl font-medium">Settings</h1>
        <p className="text-sm text-muted-foreground">
          System configuration and reference values.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Your account</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Name</dt>
              <dd className="text-sm mt-0.5">{session.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Email</dt>
              <dd className="text-sm mt-0.5">{session.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Role</dt>
              <dd className="text-sm mt-0.5">{session.role}</dd>
            </div>
          </dl>
          <Separator className="my-3" />
          <p className="text-xs text-muted-foreground">
            To change your password, use the <code className="text-xs bg-muted px-1 rounded">changePassword()</code> function in the Apps Script editor.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Reference values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium">Lead statuses</p>
            <ValueList values={LEAD_STATUSES} />
          </div>
          <Separator />
          <div className="space-y-1.5">
            <p className="text-xs font-medium">Project statuses</p>
            <ValueList values={PROJECT_STATUSES} />
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium">Project phases</p>
            <ValueList values={PROJECT_PHASES} />
          </div>
          <Separator />
          <div className="space-y-1.5">
            <p className="text-xs font-medium">Task statuses</p>
            <ValueList values={TASK_STATUSES} />
          </div>
          <Separator />
          <div className="space-y-1.5">
            <p className="text-xs font-medium">Service lines</p>
            <ValueList values={SERVICE_LINES} />
          </div>
          <Separator />
          <div className="space-y-1.5">
            <p className="text-xs font-medium">Roles</p>
            <ValueList values={ROLES} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">System</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex gap-4">
              <dt className="text-xs text-muted-foreground w-32 shrink-0">Backend</dt>
              <dd className="text-xs">Google Apps Script + Google Sheets</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-xs text-muted-foreground w-32 shrink-0">Schema version</dt>
              <dd className="text-xs">{SCHEMA_VERSION}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-xs text-muted-foreground w-32 shrink-0">Password reset</dt>
              <dd className="text-xs">Via <code className="bg-muted px-1 rounded">changePassword(userId, newPassword)</code> in the Apps Script editor</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-xs text-muted-foreground w-32 shrink-0">Soft deletes</dt>
              <dd className="text-xs">Leads, Companies, Contacts, Projects, Tasks — deleted_at set, row preserved</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
