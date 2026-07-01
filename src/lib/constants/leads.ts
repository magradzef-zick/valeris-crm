export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Won',
  'Lost',
  'Spam',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const PRIORITIES = ['High', 'Medium', 'Low'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const TRADE_DIRECTIONS = ['India → Poland', 'Poland → India'] as const;
export type TradeDirection = (typeof TRADE_DIRECTIONS)[number];

// Mirrors SERVICES array in Code.gs
export const SERVICE_LINES = [
  'Supplier Verification',
  'India Market Entry Consulting',
  'Representation in India',
  'Operational Support',
  'Poland Market Entry (Indian company)',
  'Pharma — Europe Market Entry',
  'Other / Not sure yet',
] as const;

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string }> = {
  New:        { bg: 'bg-sky-100',    text: 'text-sky-800' },
  Contacted:  { bg: 'bg-violet-100', text: 'text-violet-800' },
  Qualified:  { bg: 'bg-emerald-100',text: 'text-emerald-800' },
  Proposal:   { bg: 'bg-amber-100',  text: 'text-amber-800' },
  Won:        { bg: 'bg-green-200',  text: 'text-green-900' },
  Lost:       { bg: 'bg-red-100',    text: 'text-red-800' },
  Spam:       { bg: 'bg-gray-100',   text: 'text-gray-500' },
};

export const PRIORITY_COLORS: Record<Priority, { bg: string; text: string }> = {
  High:   { bg: 'bg-red-100',    text: 'text-red-800' },
  Medium: { bg: 'bg-amber-100',  text: 'text-amber-700' },
  Low:    { bg: 'bg-slate-100',  text: 'text-slate-600' },
};
