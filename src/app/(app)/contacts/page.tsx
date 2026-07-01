import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getContacts } from "@/server/queries/companies";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Contacts — Valeris CRM" };

export default async function ContactsPage() {
  const session = await requireUser();
  const { contacts, error } = await getContacts(session);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium">Contacts</h1>
          <p className="text-sm text-muted-foreground">Individuals at your partner companies.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/contacts/new">
            <Plus className="h-3.5 w-3.5" />
            New contact
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ContactsTable contacts={contacts} />
    </div>
  );
}
