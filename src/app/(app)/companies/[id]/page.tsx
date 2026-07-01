import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Globe, Users, Calendar } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getCompany, getContacts } from "@/server/queries/companies";
import { getTimeline } from "@/server/queries/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CompanyStatusBadge } from "@/components/companies/company-status-badge";
import { CompanyEditForm } from "@/components/companies/company-edit-form";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { NoteForm } from "@/components/leads/note-form";
import { Timeline } from "@/components/leads/timeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Company ${id} — Valeris CRM` };
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

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser();

  const [{ company }, { contacts }, { items: timelineItems }] = await Promise.all([
    getCompany(session, id),
    getContacts(session, { companyId: id }),
    getTimeline(session, "Company", id),
  ]);

  if (!company) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/companies"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Companies
        </Link>
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl font-medium truncate">{company.name}</h1>
            {company.type && <p className="text-sm text-muted-foreground">{company.type}</p>}
          </div>
          <CompanyStatusBadge status={company.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Company details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Country" value={company.country} />
                <Field label="City" value={company.city} />
                <Field label="Industry" value={company.industry} />
                <Field label="Trade direction" value={company.trade_direction} />
                {company.email && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd className="mt-0.5">
                      <a href={`mailto:${company.email}`} className="inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline">
                        <Mail className="h-3.5 w-3.5" />{company.email}
                      </a>
                    </dd>
                  </div>
                )}
                {company.phone && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Phone</dt>
                    <dd className="mt-0.5">
                      <a href={`tel:${company.phone}`} className="inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline">
                        <Phone className="h-3.5 w-3.5" />{company.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {company.website && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Website</dt>
                    <dd className="mt-0.5">
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline">
                        <Globe className="h-3.5 w-3.5" />{company.website}
                      </a>
                    </dd>
                  </div>
                )}
                <Field label="LinkedIn" value={company.linkedin} />
              </dl>
              {company.notes && (
                <>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{company.notes}</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contacts section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Contacts
                </CardTitle>
                <Button asChild size="xs" variant="outline">
                  <Link href={`/contacts/new?companyId=${id}`}>Add contact</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No contacts yet.</p>
              ) : (
                <ContactsTable contacts={contacts} hideCompanyColumn />
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Activity timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <NoteForm entityType="Company" entityId={company.company_id} />
              {timelineItems.length > 0 && <Separator />}
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Edit details</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <CompanyEditForm company={company} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
