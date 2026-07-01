import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Calendar, CheckSquare } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getProject } from "@/server/queries/projects";
import { getCompanies } from "@/server/queries/companies";
import { getUsers } from "@/server/queries/team";
import { getTasks } from "@/server/queries/tasks";
import { getTimeline } from "@/server/queries/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ProjectStatusBadge, ProjectPhaseBadge } from "@/components/projects/project-status-badge";
import { ProjectEditForm } from "@/components/projects/project-edit-form";
import { TasksTable } from "@/components/tasks/tasks-table";
import { NoteForm } from "@/components/leads/note-form";
import { Timeline } from "@/components/leads/timeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Project ${id} — Valeris CRM` };
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm mt-0.5">{value}</dd>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser();

  const [{ project }, { companies }, { users }, { tasks }, { items: timelineItems }] =
    await Promise.all([
      getProject(session, id),
      getCompanies(session),
      getUsers(session),
      getTasks(session, { entityType: "Project", entityId: id }),
      getTimeline(session, "Project", id),
    ]);

  if (!project) notFound();

  const linkedCompany = project.company_id
    ? companies.find((c) => c.company_id === project.company_id)
    : null;

  const ownerUser   = users.find((u) => u.user_id === project.owner_user_id);
  const opsUser     = users.find((u) => u.user_id === project.operations_user_id);

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
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl font-medium">{project.name}</h1>
            {linkedCompany && (
              <Link
                href={`/companies/${linkedCompany.company_id}`}
                className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline mt-0.5"
              >
                <Building2 className="h-3.5 w-3.5" />
                {linkedCompany.name}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ProjectStatusBadge status={project.status} />
            <ProjectPhaseBadge phase={project.phase} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Project details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Service line"    value={project.service_line} />
                <Field label="Trade direction" value={project.trade_direction} />
                <Field label="Priority"        value={project.priority} />
                <Field label="Owner"           value={ownerUser?.full_name} />
                <Field label="Operations"      value={opsUser?.full_name} />
                <Field label="Start date"      value={project.start_date ? String(project.start_date).slice(0, 10) : null} />
                <Field label="Target end"      value={project.target_end_date ? String(project.target_end_date).slice(0, 10) : null} />
                <Field label="Actual end"      value={project.actual_end_date ? String(project.actual_end_date).slice(0, 10) : null} />
              </dl>
              {project.description && (
                <>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.description}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  Tasks
                </CardTitle>
                <Button asChild size="xs" variant="outline">
                  <Link href={`/tasks/new?entityType=Project&entityId=${id}`}>Add task</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks yet.</p>
              ) : (
                <TasksTable tasks={tasks} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Activity timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <NoteForm entityType="Project" entityId={project.project_id} />
              {timelineItems.length > 0 && <Separator />}
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Edit project</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <ProjectEditForm project={project} companies={companies} users={users} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
