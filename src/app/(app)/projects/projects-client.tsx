'use client';

import { useProjects } from '@/lib/crm-queries';
import { ProjectsTable } from '@/components/projects/projects-table';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ProjectsClient() {
  const { data, isError, error } = useProjects();
  return (
    <>
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}
      <ProjectsTable projects={data?.projects ?? []} />
    </>
  );
}
