import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Calendar, Building2 } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getContact, getCompanies } from "@/server/queries/companies";
import { getTimeline } from "@/server/queries/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContactEditForm } from "@/components/contacts/contact-edit-form";
import { NoteForm } from "@/components/leads/note-form";
import { Timeline } from "@/components/leads/timeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Contact ${id} — Valeris CRM` };
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser();

  const [{ contact }, { companies }, { items: timelineItems }] = await Promise.all([
    getContact(session, id),
    getCompanies(session),
    getTimeline(session, "Contact", id),
  ]);

  if (!contact) notFound();

  const linkedCompany = contact.company_id
    ? companies.find((c) => c.company_id === contact.company_id)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/contacts"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Contacts
        </Link>
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl font-medium">
              {contact.full_name || `${contact.first_name} ${contact.last_name}`.trim()}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              {contact.title && <span className="text-sm text-muted-foreground">{contact.title}</span>}
              {linkedCompany && (
                <>
                  {contact.title && <span className="text-muted-foreground">·</span>}
                  <Link
                    href={`/companies/${linkedCompany.company_id}`}
                    className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    {linkedCompany.name}
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${contact.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>
              {contact.status}
            </span>
            {contact.is_primary && (
              <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-800">
                Primary
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Contact information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {contact.email && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd className="mt-0.5">
                      <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline">
                        <Mail className="h-3.5 w-3.5" />{contact.email}
                      </a>
                    </dd>
                  </div>
                )}
                {contact.phone && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Phone</dt>
                    <dd className="mt-0.5">
                      <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline">
                        <Phone className="h-3.5 w-3.5" />{contact.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {contact.language && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Language</dt>
                    <dd className="text-sm mt-0.5">{contact.language}</dd>
                  </div>
                )}
                {contact.linkedin && (
                  <div>
                    <dt className="text-xs text-muted-foreground">LinkedIn</dt>
                    <dd className="mt-0.5">
                      <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-green hover:underline">{contact.linkedin}</a>
                    </dd>
                  </div>
                )}
              </dl>
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
              <NoteForm entityType="Contact" entityId={contact.contact_id} />
              {timelineItems.length > 0 && <Separator />}
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Edit contact</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <ContactEditForm contact={contact} companies={companies} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
