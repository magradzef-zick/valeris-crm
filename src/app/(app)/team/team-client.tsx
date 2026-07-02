'use client';

import { useUsers } from '@/lib/crm-queries';
import { TeamTable } from '@/components/team/team-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UserRole } from '@/types/crm';

export function TeamClient({ currentRole }: { currentRole: UserRole }) {
  const { data, isError, error } = useUsers();
  return (
    <>
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}
      <TeamTable users={data?.users ?? []} currentRole={currentRole} />
    </>
  );
}
