"use client";

import { useActionState } from "react";
import { updateUserAction } from "@/server/actions/team";
import { Button } from "@/components/ui/button";
import type { CrmUser, UserRole } from "@/types/crm";
import { isOwnerOrAdmin } from "@/server/auth/permissions";

const ROLE_COLORS: Record<string, string> = {
  Owner:         "bg-violet-100 text-violet-800",
  Administrator: "bg-blue-100 text-blue-800",
  Sales:         "bg-emerald-100 text-emerald-800",
  Operations:    "bg-amber-100 text-amber-800",
};

function UserRow({ user, currentRole }: { user: CrmUser; currentRole: UserRole }) {
  const [result, action, isPending] = useActionState<
    { error?: string } | { ok: true } | undefined,
    FormData
  >(updateUserAction, undefined);

  const canEdit = isOwnerOrAdmin(currentRole);

  return (
    <tr className="border-t border-border">
      <td className="px-3 py-2.5">
        <div className="font-medium text-sm">{user.full_name}</div>
        <div className="text-xs text-muted-foreground">{user.email}</div>
      </td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-600"}`}>
          {user.role}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${user.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-500"}`}>
          {user.status}
        </span>
      </td>
      <td className="px-3 py-2.5 text-xs text-muted-foreground">
        {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : "Never"}
      </td>
      <td className="px-3 py-2.5">
        {canEdit && (
          <form action={action} className="flex items-center gap-2">
            <input type="hidden" name="userId" value={user.user_id} />
            <input type="hidden" name="role"   value={user.role} />
            <select
              name="status"
              defaultValue={user.status}
              className="h-7 rounded border border-input bg-transparent px-2 text-xs outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Button type="submit" size="xs" variant="outline" disabled={isPending}>
              {isPending ? "…" : "Save"}
            </Button>
          </form>
        )}
        {result && 'error' in result && (
          <p className="text-xs text-destructive mt-1">{result.error}</p>
        )}
      </td>
    </tr>
  );
}

export function TeamTable({ users, currentRole }: { users: CrmUser[]; currentRole: UserRole }) {
  return (
    <div className="rounded-lg border border-border overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            {["Name / Email", "Role", "Status", "Last login", ""].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-8 text-center text-sm text-muted-foreground">
                No team members found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <UserRow key={u.user_id} user={u} currentRole={currentRole} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
