'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ForgotPasswordForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Reset your password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <p>
          Password resets are managed by your team administrator. Please contact them
          directly to have your password reset.
        </p>
        <Link href="/login" className="block text-primary underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </CardContent>
    </Card>
  );
}
