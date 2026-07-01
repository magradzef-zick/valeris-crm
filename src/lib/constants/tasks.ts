export const TASK_STATUSES = ['Open', 'In Progress', 'Done', 'Cancelled'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['High', 'Medium', 'Low'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_ENTITY_TYPES = ['Lead', 'Company', 'Contact', 'Project'] as const;
export type TaskEntityType = (typeof TASK_ENTITY_TYPES)[number];

export const TASK_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Open:         { bg: 'bg-blue-100',  text: 'text-blue-800'  },
  'In Progress': { bg: 'bg-amber-100', text: 'text-amber-800' },
  Done:         { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  Cancelled:    { bg: 'bg-gray-100',  text: 'text-gray-500'  },
};
