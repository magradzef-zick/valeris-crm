// Must stay in sync with COMPANY_TYPES in Code.gs
export const COMPANY_TYPES = [
  'Importer',
  'Exporter',
  'Manufacturer',
  'Distributor',
  'Agent / Broker',
  'Retailer',
  'Service Provider',
  'Other',
] as const;
export type CompanyType = (typeof COMPANY_TYPES)[number];

// Must stay in sync with COMPANY_STATUSES in Code.gs
export const COMPANY_STATUSES = ['Active', 'Inactive', 'Prospect', 'Partner'] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export const CONTACT_STATUSES = ['Active', 'Inactive'] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const STATUS_COLORS: Record<CompanyStatus, { bg: string; text: string }> = {
  Active:   { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  Inactive: { bg: 'bg-gray-100',    text: 'text-gray-500' },
  Prospect: { bg: 'bg-sky-100',     text: 'text-sky-800' },
  Partner:  { bg: 'bg-violet-100',  text: 'text-violet-800' },
};
