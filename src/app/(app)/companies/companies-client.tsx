'use client';

import { useCompanies } from '@/lib/crm-queries';
import { CompaniesTable } from '@/components/companies/companies-table';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CompaniesClient() {
  const { data, isError, error } = useCompanies();
  return (
    <>
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}
      <CompaniesTable companies={data?.companies ?? []} />
    </>
  );
}
