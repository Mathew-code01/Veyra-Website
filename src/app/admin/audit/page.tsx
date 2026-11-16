'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Info, List } from 'lucide-react';

export default function AdminAudit() {
  const { session, client } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    c.adminListAuditEvents()
      .then((r) => setEvents(r.auditEvents))
      .catch((err: any) => {
        if (isPermissionError(err)) setPermissionError('Auditor role required for audit logs.');
        else if (!isAuthError(err)) setError(userFriendlyMessage(err));
      })
      .finally(() => setLoading(false));
  }, [client, session?.accessToken]);

  if (!session) return null;

  if (permissionError) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 lg:px-8 lg:py-16">
        <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 p-8 text-center">
          <Shield className="h-8 w-8 mx-auto mb-4 text-amber-600" />
          <h2 className="text-xl font-bold text-veyra-navy mb-2">Admin access required</h2>
          <p className="text-sm text-muted-foreground">{permissionError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <h1 className="text-3xl font-bold text-veyra-navy mb-6">Audit logs</h1>
      {loading && <div className="h-32 bg-secondary/50 rounded-xl animate-pulse" />}
      {!loading && permissionError && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{permissionError}</div>
      )}
      {!loading && !permissionError && events.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-8 text-center">
          <List className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-veyra-navy mb-2">No audit events</h3>
          <p className="text-sm text-muted-foreground">No audit events recorded yet.</p>
        </div>
      )}
      {!loading && !permissionError && events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Audit events ({events.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse divide-y divide-border">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Action</th>
                    <th className="pb-3 font-medium">Admin</th>
                    <th className="pb-3 font-medium">Target</th>
                    <th className="pb-3 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((e) => (
                    <tr key={e.id}>
                      <td className="pb-4 font-medium">{e.action}</td>
                      <td className="pb-4 text-muted-foreground">{e.adminUserId}</td>
                      <td className="pb-4 text-muted-foreground">{e.targetUserId || '—'}</td>
                      <td className="pb-4 text-muted-foreground text-right">{new Date(e.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {error && <div className="rounded-md border border-red-200 bg-red-50 p-4 mt-6 text-sm text-red-800">{error}</div>}
    </div>
  );
}


