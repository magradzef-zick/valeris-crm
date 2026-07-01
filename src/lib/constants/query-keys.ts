/**
 * TanStack Query cache keys. Always use these constants — never inline strings.
 * Invalidation relies on referential equality of the first element (the entity name).
 *
 * Pattern: QUERY_KEYS.leads.all() invalidates every leads query.
 *          QUERY_KEYS.leads.detail(id) invalidates one lead.
 */
export const QUERY_KEYS = {
  leads: {
    all:    ()         => ['leads'] as const,
    list:   (filters?: Record<string, unknown>) => ['leads', 'list', filters] as const,
    detail: (id: string) => ['leads', 'detail', id] as const,
  },
  companies: {
    all:    ()         => ['companies'] as const,
    list:   (filters?: Record<string, unknown>) => ['companies', 'list', filters] as const,
    detail: (id: string) => ['companies', 'detail', id] as const,
  },
  contacts: {
    all:    ()         => ['contacts'] as const,
    list:   (filters?: Record<string, unknown>) => ['contacts', 'list', filters] as const,
    detail: (id: string) => ['contacts', 'detail', id] as const,
  },
  projects: {
    all:    ()         => ['projects'] as const,
    list:   (filters?: Record<string, unknown>) => ['projects', 'list', filters] as const,
    detail: (id: string) => ['projects', 'detail', id] as const,
  },
  tasks: {
    all:    ()         => ['tasks'] as const,
    list:   (filters?: Record<string, unknown>) => ['tasks', 'list', filters] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
  },
  notes: {
    all:    ()         => ['notes'] as const,
    entity: (entityType: string, entityId: string) => ['notes', entityType, entityId] as const,
  },
  timeline: {
    entity: (entityType: string, entityId: string) => ['timeline', entityType, entityId] as const,
  },
  users: {
    all:  () => ['users'] as const,
    me:   () => ['users', 'me'] as const,
  },
} as const;
