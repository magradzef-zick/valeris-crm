import type { UserRole } from '@/types/crm';

export type { UserRole };

export function isOwnerOrAdmin(role: UserRole): boolean {
  return role === 'Owner' || role === 'Administrator';
}

export function canEditRecord(
  role: UserRole,
  recordOwnerUserId: string,
  currentUserId: string,
): boolean {
  return isOwnerOrAdmin(role) || recordOwnerUserId === currentUserId;
}
