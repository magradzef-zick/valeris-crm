import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getProjects } from "@/server/queries/projects";
import { ProjectsTable } from "@/components/projects/projects-table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Projects — Valeris CRM" };

export default async function ProjectsPage() {
  const session = await requireUser();
  const { projects, error } = await getProjects(session);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium">Projects</h1>
          <p className="text-sm text-muted-foreground">Active engagements and deliveries.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/projects/new">
            <Plus className="h-3.5 w-3.5" />
            New project
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ProjectsTable projects={projects} />
    </div>
  );
}
