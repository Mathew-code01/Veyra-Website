'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Activity, Users, CreditCard, Monitor, Shield, ArrowRight, FileClock } from 'lucide-react';

function StatCard({ title, value, delta, Icon }: { title: string; value: string; delta?: string; Icon: any }) {
  return (
    <Card className="overflow-hidden border-slate-200/80 shadow-[0_12px_34px_-28px_rgba(15,23,42,0.35)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Icon className="h-4 w-4" /></span>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-veyra-navy">{value}</span>
          {delta && <span className="text-xs font-medium text-muted-foreground">{delta}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminOverview() {
  const { session, client, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!client || !session?.accessToken) { setLoading(false); return; }
    const c = client as VeyraPlatformClient;
    setLoading(true); setError(null); setPermissionError(null); setStats(null);
    try {
      const result = await c.adminStats();
      setStats(result.stats);
    } catch (err: any) {
      if (isPermissionError(err)) setPermissionError('Your account does not have the server-side role required for this operation.');
      else if (isAuthError(err)) await logout();
      else setError(userFriendlyMessage(err));
    } finally { setLoading(false); }
  }, [client, session?.accessToken, logout]);

  useEffect(() => { void loadStats(); }, [loadStats]);

  if (!session) return null;

  if (permissionError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center shadow-sm">
        <Shield className="mx-auto mb-4 h-8 w-8 text-amber-600" />
        <h2 className="mb-2 text-xl font-bold text-veyra-navy">Admin access required</h2>
        <p className="text-sm text-muted-foreground">{permissionError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-indigo-700">Operations</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-slate-950">Admin overview</h1>
        <p className="mt-2 text-sm text-slate-600">Platform-wide statistics returned by authorized Platform APIs.</p>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900"><p>{error}</p><Button className="mt-3" variant="outline" onClick={() => void loadStats()}>Try again</Button></div>}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading admin statistics" aria-busy="true">
          {[1,2,3,4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24 bg-secondary/50" />
            </Card>
          ))}
        </div>
      )}

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total users" value={String(stats.totalUsers)} Icon={Users} />
            <StatCard title="Total subscriptions" value={String(stats.totalSubscriptions)} Icon={Activity} />
            <StatCard title="Active subscriptions" value={String(stats.activeSubscriptions)} Icon={CreditCard} />
            <StatCard title="Credits issued" value={String(stats.totalCreditsIssued)} Icon={Monitor} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Users className="h-5 w-5" /></span><div><CardTitle>Users</CardTitle><CardDescription>Review customer accounts</CardDescription></div></div></CardHeader>
              <CardContent><Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">Open user management <ArrowRight className="h-4 w-4" /></Link></CardContent>
            </Card>
            <Card>
              <CardHeader><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><CreditCard className="h-5 w-5" /></span><div><CardTitle>Billing</CardTitle><CardDescription>Inspect payment and plan records</CardDescription></div></div></CardHeader>
              <CardContent><Link href="/admin/payments" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">Open payments <ArrowRight className="h-4 w-4" /></Link></CardContent>
            </Card>
            <Card>
              <CardHeader><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><FileClock className="h-5 w-5" /></span><div><CardTitle>Audit trail</CardTitle><CardDescription>Review administrative activity</CardDescription></div></div></CardHeader>
              <CardContent><Link href="/admin/audit" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">Open audit logs <ArrowRight className="h-4 w-4" /></Link></CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}


