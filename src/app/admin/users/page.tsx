'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, UserPlus, AlertTriangle, Shield, Info } from 'lucide-react';

export default function AdminUsers() {
  const { session, client } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  [session, client];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    let cancelled = false;
    const load = async () => {
      try {
        const r = await c.adminListUsers(1, 50);
        if (!cancelled) {
          setUsers(r.users);
          setTotal(r.total);
        }
      } catch (err: any) {
        if (isPermissionError(err)) {
          setPermissionError('You do not have the admin role required to list users.');
        } else if (!isAuthError(err)) {
          setError(userFriendlyMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
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
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-veyra-navy mb-2">Users</h1>
          <p className="text-muted-foreground">Platform-wide user management.</p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add user
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="rounded-xl border border-border bg-card p-8 animate-pulse">
          <div className="h-10 bg-secondary/50 rounded" />
        </div>
      )}

      {!loading && permissionError && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {permissionError}
        </div>
      )}

      {!loading && !permissionError && users.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-8 text-center">
          <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-veyra-navy mb-2">No users</h3>
          <p className="text-sm text-muted-foreground">No users found.</p>
        </div>
      )}

      {!loading && !permissionError && users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Users ({total})</CardTitle>
            <CardDescription>All platform users.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">User</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-accent/50 transition-colors">
                      <td className="pb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center">
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{u.email}</p>
                            <p className="text-xs text-muted-foreground">{u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="pb-4">
                        <Badge variant="secondary">{u.status}</Badge>
                      </td>
                      <td className="pb-4 text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="pb-4 text-right">
                        <Link href={`/admin/users/${u.id}`}>
                          <Button variant="outline">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
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
            <h3 className="font-semibold text-veyra-navy mb-1">User management</h3>
            <p className="text-sm text-muted-foreground">
              User lookup and listing uses Platform admin endpoints (GET /api/v1/admin/users). Admin role
              is enforced server-side by the Platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



