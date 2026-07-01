import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Globe, MessageSquare, Calendar } from "lucide-react";
import { requireUser } from "@/server/auth/guards";
import { getLead, getTimeline } from "@/server/queries/leads";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { LeadPriorityBadge } from "@/components/leads/lead-priority-badge";
import { LeadEditForm } from "@/components/leads/lead-edit-form";
import { Timeline } from "@/components/leads/timeline";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Lead ${id} — Valeris CRM` };
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

function formatDate(value: string | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireUser();

  const [{ lead }, { items: timelineItems }] = await Promise.all([
    getLead(session, id),
    getTimeline(session, "Lead", id),
  ]);

  if (!lead) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/leads"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Leads
        </Link>
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-2xl font-medium truncate">
              {lead.full_name || `${lead.first_name} ${lead.last_name}`.trim() || "Unnamed Lead"}
            </h1>
            {lead.company_name && (
              <p className="text-sm text-muted-foreground">{lead.company_name}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <LeadStatusBadge status={lead.status} />
            <LeadPriorityBadge priority={lead.priority} />
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Received {formatDate(lead.received)}
          {lead.received && lead.updated_at && lead.received !== lead.updated_at
            ? ` · Updated ${formatDate(lead.updated_at)}`
            : null}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: contact + source info */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Contact information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="First name" value={lead.first_name} />
                <Field label="Last name" value={lead.last_name} />
                {lead.email && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Email</dt>
                    <dd className="mt-0.5">
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {lead.email}
                      </a>
                    </dd>
                  </div>
                )}
                {lead.phone && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Phone</dt>
                    <dd className="mt-0.5">
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {lead.phone}
                      </a>
                    </dd>
                  </div>
                )}
                <Field label="Language" value={lead.language} />
                <Field label="Interest" value={lead.interest} />
                <Field label="Trade direction" value={lead.trade_direction} />
              </dl>
            </CardContent>
          </Card>

          {lead.message && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{lead.message}</p>
              </CardContent>
            </Card>
          )}

          {(lead.utm_source || lead.referrer || lead.page_url) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="UTM source" value={lead.utm_source} />
                  <Field label="UTM medium" value={lead.utm_medium} />
                  <Field label="UTM campaign" value={lead.utm_campaign} />
                  <Field label="Referrer" value={lead.referrer} />
                  <Field label="Page" value={lead.page_url} />
                  <Field label="Device" value={lead.device} />
                  <Field label="Language" value={lead.language} />
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Activity timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Timeline items={timelineItems} />
            </CardContent>
          </Card>
        </div>

        {/* Right column: editable CRM fields */}
        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">CRM fields</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <LeadEditForm lead={lead} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
