'use client';

import { useLeads } from '@/lib/crm-queries';
import { LeadsTable } from '@/components/leads/leads-table';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LeadsClient() {
  const { data, isError, error } = useLeads();
  return (
    <>
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}
      <LeadsTable leads={data?.leads ?? []} />
    </>
  );
}
