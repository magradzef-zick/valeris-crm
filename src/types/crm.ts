// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = 'Owner' | 'Administrator' | 'Sales' | 'Operations';

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
  expiresAt: string; // ISO 8601
};

// ─── API envelope ─────────────────────────────────────────────────────────────

export type ApiResponse<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

// ─── Entities ─────────────────────────────────────────────────────────────────

export type Lead = {
  lead_id: string;
  received: string;
  status: string;
  priority: string;
  owner: string;
  next_action: string;
  next_action_date: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  full_name: string;
  company_name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  language: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  referrer: string;
  page_url: string;
  device: string;
  user_agent: string;
  client_timestamp: string;
  notes: string;
  created_by: string;
  updated_by: string;
  deleted_at: string;
  trade_direction: string;
  company_id: string;
  contact_id: string;
  converted_to_project_id: string;
  converted_at: string;
  converted_by: string;
};

export type Company = {
  company_id: string;
  name: string;
  type: string;
  country: string;
  city: string;
  industry: string;
  trade_direction: string;
  website: string;
  linkedin: string;
  email: string;
  phone: string;
  status: string;
  owner_user_id: string;
  primary_contact_id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string;
  notes: string;
};

export type Contact = {
  contact_id: string;
  company_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  language: string;
  is_primary: boolean; // Sheets checkbox columns return native booleans, not strings
  status: string;
  owner_user_id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string;
};

export type Project = {
  project_id: string;
  lead_id: string;
  company_id: string;
  contact_id: string;
  name: string;
  service_line: string;
  trade_direction: string;
  status: string;
  phase: string;
  priority: string;
  owner_user_id: string;
  operations_user_id: string;
  start_date: string;
  target_end_date: string;
  actual_end_date: string;
  description: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string;
};

export type Task = {
  task_id: string;
  entity_type: string;
  entity_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string;
  due_date: string;
  completed_at: string;
  completed_by: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string;
};

export type Note = {
  note_id: string;
  entity_type: string;
  entity_id: string;
  content: string;
  author_user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type Activity = {
  activity_id: string;
  entity_type: string;
  entity_id: string;
  activity_type: string;
  summary: string;
  details: string;
  performed_by: string;
  performed_at: string;
  created_at: string;
};

export type TimelineItem =
  | (Note & { _kind: 'note' })
  | (Activity & { _kind: 'activity' });

// Lean summary types for list views — excludes heavy/unused fields to keep the
// Next.js SSR HTML payload small (data is embedded as inline JSON).

export type LeadSummary = Pick<Lead,
  | 'lead_id' | 'received' | 'status' | 'priority' | 'owner'
  | 'next_action' | 'next_action_date' | 'updated_at'
  | 'first_name' | 'last_name' | 'full_name' | 'company_name'
  | 'email' | 'phone' | 'interest' | 'language'
  | 'deleted_at' | 'trade_direction'
>;

export type CompanySummary = Pick<Company,
  | 'company_id' | 'name' | 'type' | 'country' | 'city' | 'industry'
  | 'trade_direction' | 'email' | 'phone' | 'status'
  | 'owner_user_id' | 'primary_contact_id' | 'deleted_at'
>;

export type ContactSummary = Pick<Contact,
  | 'contact_id' | 'company_id' | 'first_name' | 'last_name' | 'full_name'
  | 'title' | 'email' | 'phone' | 'language' | 'is_primary'
  | 'status' | 'owner_user_id' | 'deleted_at'
>;

export type CrmUser = {
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: string;
  last_login_at: string;
  created_at: string;
};

export type ProjectSummary = Pick<Project,
  | 'project_id' | 'name' | 'status' | 'phase' | 'priority'
  | 'service_line' | 'trade_direction'
  | 'company_id' | 'lead_id' | 'contact_id'
  | 'owner_user_id' | 'operations_user_id'
  | 'start_date' | 'target_end_date' | 'deleted_at'
>;

export type TaskSummary = Pick<Task,
  | 'task_id' | 'entity_type' | 'entity_id'
  | 'title' | 'status' | 'priority'
  | 'assigned_to' | 'due_date' | 'completed_at'
  | 'created_by' | 'created_at' | 'deleted_at'
>;

export type DashboardStats = {
  leads: {
    total: number;
    byStatus: Record<string, number>;
    newThisMonth: number;
    highPriority: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
  };
  tasks: {
    total: number;
    open: number;
    dueToday: number;
    overdue: number;
  };
};
