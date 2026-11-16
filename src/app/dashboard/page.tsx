'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui';
import Link from 'next/link';
import { CreditCard, Activity, Monitor, User, Clock, Download, Settings2 } from 'lucide-react';

function StatCard({ title, value, delta, Icon }: {
  title: string;
  value: string;
  delta?: string;
  Icon: any;
}) {
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

export default function DashboardOverview() {
  const { session, client, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [credits, setCredits] = useState<{ balanceCents: number; currency: string } | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [entitlements, setEntitlements] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadOverview = useCallback(async () => {
    if (!client || !session?.accessToken) {
      setLoading(false);
      return;
    }
    const c = client as VeyraPlatformClient;
    setLoading(true);
    setError(null);
    try {
      const [p, s, cr, d, e] = await Promise.all([
        c.getProfile(),
        c.getCurrentSubscription(),
        c.getCreditBalance(),
        c.listDevices(),
        c.listEntitlements(),
      ]);
      setProfile(p.profile);
      setSubscription(s.subscription);
      setCredits(cr.balance);
      setDevices(d.devices);
      setEntitlements(e.entitlements);
    } catch (err: any) {
      if (isAuthError(err)) {
        await logout();
      } else {
        setError(userFriendlyMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, [client, session?.accessToken, logout]);

  useEffect(() => { void loadOverview(); }, [loadOverview]);

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
        <h1 className="text-3xl font-bold text-veyra-navy mb-6">Dashboard</h1>
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="h-24 bg-secondary animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const authorizedDevices = devices.filter((d) => d.isAuthorized && !d.isRevoked).length;
  const activeEntitlements = entitlements.filter((e) => e.entitled).length;

  if (loading) return (
    <div className="space-y-6" aria-label="Loading account overview" aria-busy="true">
      <div className="space-y-2"><Skeleton className="h-8 w-56" /><Skeleton className="h-4 w-80" /></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[1,2,3].map((item) => <Skeleton key={item} className="h-28 rounded-2xl" />)}</div>
      <div className="grid gap-4 lg:grid-cols-2">{[1,2].map((item) => <Skeleton key={item} className="h-56 rounded-2xl" />)}</div>
    </div>
  );

  if (error) return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-white p-6 shadow-sm sm:p-8" role="alert">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">Account data unavailable</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">We couldn’t load your overview.</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
      <Button className="mt-5" onClick={() => void loadOverview()}>Try again</Button>
    </section>
  );

  return (
    <div className="space-y-7">
      <section className="relative isolate overflow-hidden rounded-3xl border border-indigo-100 bg-[radial-gradient(ellipse_at_88%_10%,rgba(129,110,255,0.17),transparent_32%),linear-gradient(120deg,#fff_0%,#fafaff_58%,#f1f1ff_100%)] p-6 shadow-[0_24px_70px_-52px_rgba(49,46,129,0.4)] sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Badge className="border-indigo-100 bg-white text-indigo-800">Account overview</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Welcome back{profile?.displayName ? `, ${profile.displayName}` : ''}.</h1>
            <p className="mt-2 text-sm text-slate-600">Your plan, devices, and usage in one place.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/download"><Button variant="outline" className="border-slate-300 bg-white"><Download className="mr-2 h-4 w-4" />Get Desktop</Button></Link>
            <Link href="/dashboard/settings"><Button className="bg-indigo-700 hover:bg-indigo-800"><Settings2 className="mr-2 h-4 w-4" />Account settings</Button></Link>
          </div>
        </div>
        <p className="mt-5 max-w-2xl text-xs text-slate-500">Signed in as <span className="font-medium text-slate-700">{profile?.email ?? session.user?.email}</span></p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Subscription status"
          value={subscription?.status ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) : 'No active plan'}
          delta={subscription?.status === 'active' ? 'Active' : 'No active plan'}
          Icon={CreditCard}
        />
        <StatCard
          title="Available credits"
          value={credits
            ? new Intl.NumberFormat(undefined, { style: 'currency', currency: credits.currency }).format(credits.balanceCents / 100)
            : 'Unavailable'}
          delta={credits?.currency}
          Icon={Activity}
        />
        <StatCard
          title="Authorised devices"
          value={String(authorizedDevices)}
          delta={`${devices.length} registered`}
          Icon={Monitor}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Active entitlements"
          value={String(activeEntitlements)}
          delta={`${entitlements.length} total`}
          Icon={User}
        />
        <StatCard
          title="Plan"
          value={subscription?.planName || 'None'}
          delta={subscription?.billingInterval || ''}
          Icon={Activity}
        />
        <StatCard
          title="Member since"
          value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'}
          Icon={Clock}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Your subscription</CardTitle>
            <CardDescription>{subscription?.planName || 'No active plan'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Status: <span className="font-medium">{subscription?.status || '—'}</span>
            </p>
            {subscription?.currentPeriodEnd && (
              <p className="text-sm text-muted-foreground">
                Period ends: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
            {subscription?.cancelAtPeriodEnd && (
              <p className="text-sm text-muted-foreground text-destructive">
                Cancels at end of period
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/billing">
              <Button variant="outline" size="sm">Manage billing</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent devices</CardTitle>
            <CardDescription>{devices.length} registered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {devices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No devices registered.</p>
            ) : (
              devices.slice(0, 3).map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-muted-foreground">{d.deviceName || d.installationId}</span>
                  <Badge variant={d.isAuthorized && !d.isRevoked ? 'success' : 'secondary'}>
                    {d.isRevoked ? 'Revoked' : d.isAuthorized ? 'Authorised' : 'Pending'}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/devices">
              <Button variant="outline" size="sm">Manage devices</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entitlements</CardTitle>
            <CardDescription>{activeEntitlements} active</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {entitlements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No entitlements.</p>
            ) : (
              entitlements.slice(0, 3).map((e) => (
                <div key={e.capability} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-muted-foreground">{e.capability}</span>
                  <Badge variant={e.entitled ? 'success' : 'secondary'}>
                    {e.entitled ? 'Entitled' : 'Not entitled'}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Common account tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/practice"><Button variant="outline" size="sm">Start practice</Button></Link>
              <Link href="/dashboard/live-assistant"><Button variant="outline" size="sm">Live assistant</Button></Link>
              <Link href="/dashboard/devices"><Button variant="outline" size="sm">Register device</Button></Link>
              <Link href="/dashboard/settings"><Button variant="outline" size="sm">Settings</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
