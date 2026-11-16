'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bell, AlertTriangle, Info } from 'lucide-react';

export default function NotificationsPage() {
  const { session, client } = useAuth();
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    c.getNotificationStatus()
      .then((r) => setStatus(r))
      .catch((err: any) => {
        if (isAuthError(err)) return;
        setError(userFriendlyMessage(err));
      });
  }, [client, session?.accessToken]);

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-veyra-navy mb-2">Notifications</h1>
        <p className="text-muted-foreground">
          In-app notification centre. Notification preferences are managed through the Platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification provider</CardTitle>
          <CardDescription>Email delivery status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Provider</span>
                <span className="text-sm font-medium">{status.provider}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Live emails</span>
                <Badge variant={status.liveEmailsEnabled ? 'success' : 'secondary'}>
                  {status.liveEmailsEnabled ? 'Enabled' : 'Disabled (mock)'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm text-muted-foreground">{status.message}</span>
              </div>
            </div>
          ) : (
            <div className="h-24 bg-secondary/50 rounded animate-pulse" />
          )}
        </CardContent>
      </Card>

      {!status?.liveEmailsEnabled && (
        <div className="mt-6 rounded-xl border border-dashed border-border bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-semibold text-veyra-navy mb-1">Mock email provider active</h3>
              <p className="text-sm text-muted-foreground">
                No real emails are sent. A live email provider must be configured on the Platform before
                notification emails are delivered.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 mt-6 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-8">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <h3 className="font-semibold text-veyra-navy mb-1">Notification centre</h3>
            <p className="text-sm text-muted-foreground">
              A per-user in-app notification list (read/unread, pagination) requires Platform notification
              endpoints that are not yet implemented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



