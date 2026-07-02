'use client';

import { useTasks } from '@/lib/crm-queries';
import { TasksTable } from '@/components/tasks/tasks-table';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function TasksClient() {
  const { data, isError, error } = useTasks();
  return (
    <>
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}
      <TasksTable tasks={data?.tasks ?? []} />
    </>
  );
}
