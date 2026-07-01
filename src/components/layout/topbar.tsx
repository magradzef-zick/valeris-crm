import { LogOut } from 'lucide-react';
import { signOut } from '@/server/actions/auth';
import type { CurrentUser } from '@/server/auth/guards';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/mobile-nav';

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function Topbar({ user }: { user: CurrentUser }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6">
      <MobileNav />
      <div className="ml-auto flex items-center gap-3">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {user.role}
        </Badge>
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
