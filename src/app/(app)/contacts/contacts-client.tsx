'use client';

import { useContacts } from '@/lib/crm-queries';
import { ContactsTable } from '@/components/contacts/contacts-table';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ContactsClient() {
  const { data, isError, error } = useContacts();
  return (
    <>
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}
      <ContactsTable contacts={data?.contacts ?? []} />
    </>
  );
}
