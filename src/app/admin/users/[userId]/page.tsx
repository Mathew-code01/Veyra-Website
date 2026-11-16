'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Shield, Info, AlertTriangle } from 'lucide-react';

export default function AdminUserDetails({
  params,
}: {
  params: { userId: string };
}) {
  const { session, client } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    let cancelled = false;
    const load = async () => {
      try {
        const [u, r, s] = await Promise.all([
          c.adminLookupUser(params.userId),
          c.adminListUserRoles(params.userId),
          c.adminGetSubscription(params.userId),
        ]);
        if (!cancelled) {
          setUser(u.user);
          setRoles(r.roles);
          setSubscription(s.subscription);
        }
      } catch (err: any) {
        if (isPermissionError(err)) {
          setPermissionError('You do not have the admin role required to view user details.');
        } else if (!isAuthError(err)) {
          setError(userFriendlyMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [client, session?.accessToken, params.userId]);

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

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 lg:px-8 lg:py-16">
        <div className="rounded-xl border border-border bg-card p-8 animate-pulse">
          <div className="h-10 bg-secondary/50 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-6">
        <Link href="/admin/users" className="text-sm text-veyra-indigo hover:underline">&larr; Back to users</Link>
        <h1 className="text-2xl font-bold text-veyra-navy mb-2">User: {user.email}</h1>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 mb-6 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm"><span className="font-medium">Email:</span> {user.email}</p>
            <p className="text-sm"><span className="font-medium">Status:</span> {user.status}</p>
            <p className="text-sm"><span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No roles assigned.</p>
            ) : (
              roles.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{r.role}</span>
                  <Badge variant="secondary">{r.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subscription ? (
              <>
                <p className="text-sm"><span className="font-medium">Plan:</span> {subscription.planId}</p>
                <p className="text-sm"><span className="font-medium">Status:</span> {subscription.status}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No subscription.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-8">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <h3 className="font-semibold text-veyra-navy mb-1">Data boundary</h3>
            <p className="text-sm text-muted-foreground">
              Admins see account, role, and subscription data. Private CVs, interview recordings, and local
              files are not exposed through the Platform, regardless of admin access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



