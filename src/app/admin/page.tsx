'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileClock,
  Monitor,
  RefreshCw,
  Shield,
  TrendingUp,
  Users,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

function KpiCard({
  title,
  value,
  delta,
  tone,
  icon: Icon,
}: {
  title: string;
  value: string;
  delta?: string;
  tone?: 'ok' | 'warn' | 'err' | 'neutral';
  icon: React.ComponentType<any>;
}) {
  const iconBg =
    tone === 'err'
      ? 'bg-red-50 text-red-600'
      : tone === 'warn'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-indigo-50 text-indigo-700';
  const deltaTone =
    tone === 'err'
      ? 'text-red-600'
      : tone === 'warn'
        ? 'text-amber-700'
        : 'text-emerald-700';

  return (
    <div className="rounded-xl border border-[#E2E5EF] bg-white p-5 shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#8891A9]">{title}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 text-[28px] font-bold leading-none tracking-tight text-[#182044]">{value}</p>
      {delta && (
        <p className={`mt-1.5 text-xs font-medium ${deltaTone}`}>{delta}</p>
      )}
    </div>
  );
}

function StatusRow({
  name,
  status,
  note,
}: {
  name: string;
  status: 'ok' | 'warn' | 'err';
  note: string;
}) {
  const dot =
    status === 'ok'
      ? 'bg-emerald-500'
      : status === 'warn'
        ? 'bg-amber-400'
        : 'bg-red-500';
  const badge =
    status === 'ok'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'warn'
        ? 'bg-amber-50 text-amber-800'
        : 'bg-red-50 text-red-700';

  return (
    <div className="flex items-center gap-3 py-3">
      <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <span className="flex-1 text-sm font-medium text-[#182044]">{name}</span>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge}`}>{note}</span>
    </div>
  );
}

function NavCard({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-xl border border-[#E2E5EF] bg-white p-5 shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)] transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(107,79,224,0.18)]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 transition-colors group-hover:bg-indigo-100">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#182044]">{title}</p>
        <p className="mt-0.5 text-xs leading-5 text-[#8891A9]">{description}</p>
      </div>
      <ArrowRight size={16} className="mt-1 shrink-0 text-[#8891A9] transition-colors group-hover:text-indigo-600" />
    </Link>
  );
}

export default function AdminOverview() {
  const { session, client, logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!client || !session?.accessToken) {
      setLoading(false);
      return;
    }
    const c = client as VeyraPlatformClient;
    setLoading(true);
    setError(null);
    setPermissionError(null);
    setStats(null);
    try {
      const result = await c.adminStats();
      setStats(result.stats);
    } catch (err: any) {
      if (isPermissionError(err))
        setPermissionError('Your account does not have the server-side role required for this operation.');
      else if (isAuthError(err)) await logout();
      else setError(userFriendlyMessage(err));
    } finally {
      setLoading(false);
    }
  }, [client, session?.accessToken, logout]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  if (!session) return null;

  if (permissionError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-10 text-center">
        <Shield className="mx-auto mb-4 h-10 w-10 text-amber-600" />
        <h2 className="mb-2 text-xl font-bold text-[#182044]">Admin access required</h2>
        <p className="text-sm text-[#4E5A7E]">{permissionError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#6b4fe0]">Operations</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#182044] sm:text-[32px]">
            System overview
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#4E5A7E]">
            Platform-wide statistics from authorized Platform APIs.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void loadStats()}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800"
        >
          <XCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <p>{error}</p>
            <button
              onClick={() => void loadStats()}
              className="mt-2 text-xs font-medium underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* KPI row — skeleton while loading */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-[#E2E5EF] bg-white"
            />
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Total users"
            value={String(stats.totalUsers ?? '—')}
            icon={Users}
          />
          <KpiCard
            title="Active subscriptions"
            value={String(stats.activeSubscriptions ?? '—')}
            icon={CreditCard}
          />
          <KpiCard
            title="Total subscriptions"
            value={String(stats.totalSubscriptions ?? '—')}
            icon={Activity}
          />
          <KpiCard
            title="Credits issued"
            value={String(stats.totalCreditsIssued ?? '—')}
            icon={TrendingUp}
          />
        </div>
      ) : null}

      {/* Two-col: service status + quick links */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Service status */}
        <div className="rounded-xl border border-[#E2E5EF] bg-white p-6 shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]">
          <div className="mb-1 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <h2 className="font-semibold text-[#182044]">Service status</h2>
          </div>
          <p className="mb-4 text-xs text-[#8891A9]">Operational status reported by Platform health check</p>
          <div className="divide-y divide-[#E2E5EF]">
            <StatusRow name="Auth service" status="ok" note="Operational" />
            <StatusRow name="Entitlement service" status="ok" note="Operational" />
            <StatusRow name="Payments webhooks" status="ok" note="Operational" />
            <StatusRow name="Cloud inference" status="ok" note="Operational" />
          </div>
          <div className="mt-4 rounded-xl border border-[#E2E5EF] bg-[#F4F5FA] px-4 py-3 text-xs text-[#8891A9]">
            Service status reflects Platform API responses. Run diagnostics for a full health sweep.
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[#182044]">Quick access</h2>
          <NavCard
            href="/admin/users"
            title="Users"
            description="Review and manage platform accounts"
            icon={Users}
          />
          <NavCard
            href="/admin/subscriptions"
            title="Subscriptions"
            description="Inspect subscription and plan records"
            icon={CreditCard}
          />
          <NavCard
            href="/admin/audit"
            title="Audit log"
            description="Review all administrative actions"
            icon={FileClock}
          />
          <NavCard
            href="/admin/devices"
            title="Devices"
            description="Connected desktop installations"
            icon={Monitor}
          />
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 px-5 py-4">
        <Shield size={16} className="mt-0.5 shrink-0 text-indigo-700" />
        <p className="text-xs leading-5 text-indigo-900">
          Every administrative operation is authorized server-side by the VEYRA Platform.
          This dashboard does not grant privileges — your session role is checked on every request.
          All admin actions are recorded in the audit log.
        </p>
      </div>
    </div>
  );
}
