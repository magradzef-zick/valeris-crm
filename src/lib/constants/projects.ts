export const PROJECT_STATUSES = ['Active', 'On Hold', 'Completed', 'Cancelled'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_PHASES = ['Discovery', 'Proposal', 'Execution', 'Delivery', 'Closed'] as const;
export type ProjectPhase = (typeof PROJECT_PHASES)[number];

export const SERVICE_LINES = [
  'Supplier Verification',
  'India Market Entry Consulting',
  'Representation in India',
  'Operational Support',
  'Poland Market Entry (Indian company)',
  'Pharma — Europe Market Entry',
  'Other / Not sure yet',
] as const;
export type ServiceLine = (typeof SERVICE_LINES)[number];

export const PROJECT_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Active:    { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  'On Hold': { bg: 'bg-amber-100',   text: 'text-amber-800'   },
  Completed: { bg: 'bg-sky-100',     text: 'text-sky-800'     },
  Cancelled: { bg: 'bg-red-100',     text: 'text-red-700'     },
};

export const PROJECT_PHASE_COLORS: Record<string, { bg: string; text: string }> = {
  Discovery: { bg: 'bg-violet-100', text: 'text-violet-800' },
  Proposal:  { bg: 'bg-amber-100',  text: 'text-amber-800'  },
  Execution: { bg: 'bg-blue-100',   text: 'text-blue-800'   },
  Delivery:  { bg: 'bg-teal-100',   text: 'text-teal-800'   },
  Closed:    { bg: 'bg-gray-100',   text: 'text-gray-600'   },
};
