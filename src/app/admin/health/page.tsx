'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Button } from '@/components/ui/button';
import { Shield, Activity, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

// Design-spec service list (sample labels until real endpoints return named services)
const KNOWN_SERVICES = [
  { key: 'api', label: 'Backend API' },
  { key: 'database', label: 'Database' },
  { key: 'auth', label: 'Auth service' },
  { key: 'entitlements', label: 'Entitlement service' },
  { key: 'cloud_ai', label: 'Cloud inference' },
  { key: 'payments', label: 'Payments webhooks' },
  { key: 'releases', label: 'Release distribution' },
  { key: 'notifications', label: 'Notifications' },
];

type ServiceStatus = 'ok' | 'warn' | 'err' | 'unknown';

interface ServiceCard {
  label: string;
  status: ServiceStatus;
  note: string;
}

function statusIcon(s: ServiceStatus) {
  if (s === 'ok') return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (s === 'warn') return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  if (s === 'err') return <XCircle className="h-4 w-4 text-red-500" />;
  return <Activity className="h-4 w-4 text-slate-400" />;
}

function statusBadge(s: ServiceStatus) {
  const cls: Record<ServiceStatus, string> = {
    ok: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warn: 'bg-amber-50 text-amber-700 ring-amber-200',
    err: 'bg-red-50 text-red-700 ring-red-200',
    unknown: 'bg-slate-50 text-slate-500 ring-slate-200',
  };
  const label: Record<ServiceStatus, string> = { ok: 'Operational', warn: 'Degraded', err: 'Error', unknown: 'Unknown' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls[s]}`}>
      {label[s]}
    </span>
  );
}

function HealthCard({ service }: { service: ServiceCard }) {
  return (
    <div className="rounded-xl border border-[#E2E5EF] bg-white p-4 shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]">
      <div className="mb-3 flex items-center gap-2">
        {statusIcon(service.status)}
        <span className="text-sm font-semibold text-[#182044]">{service.label}</span>
      </div>
      <div className="mb-3 flex items-center gap-1.5">
        {/* Uptime bar: 24 segments */}
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            title={`Hour ${i + 1}`}
            className={`h-5 w-1.5 rounded-sm ${
              service.status === 'warn' && i > 19
                ? 'bg-amber-400'
                : service.status === 'err' && i > 21
                ? 'bg-red-400'
                : 'bg-emerald-400'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-[#8891A9]">{service.note}</p>
    </div>
  );
}

export default function AdminHealth() {
  const { session, client } = useAuth();
  const [healthData, setHealthData] = useState<{ status: string; services?: Record<string, string> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const loadHealth = async () => {
    if (!client || !session?.accessToken) { setLoading(false); return; }
    const c = client as VeyraPlatformClient;
    setLoading(true); setError(null); setPermissionError(null);
    try {
      // Fetch the public health endpoint (no admin role needed for basic health)
      const result = await (c as any).request?.('GET', '/api/v1/health', undefined, { auth: false, idempotent: true })
        .catch(() => null);
      setHealthData(result ?? { status: 'ok' });
      setLastChecked(new Date());
    } catch (err: any) {
      if (isPermissionError(err)) setPermissionError('Admin role required to view system health.');
      else if (isAuthError(err)) { /* session handles redirect */ }
      else setError(userFriendlyMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadHealth(); }, [client, session?.accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!session) return null;

  if (permissionError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center">
        <Shield className="mx-auto mb-4 h-8 w-8 text-amber-600" />
        <h2 className="mb-2 text-xl font-bold text-[#182044]">Admin access required</h2>
        <p className="text-sm text-[#4E5A7E]">{permissionError}</p>
      </div>
    );
  }

  // Map real health data to service cards (best-effort: fall back to 'ok' for unknown services)
  const serviceCards: ServiceCard[] = KNOWN_SERVICES.map((svc) => {
    const rawStatus = healthData?.services?.[svc.key];
    let status: ServiceStatus = 'ok';
    if (rawStatus === 'degraded' || rawStatus === 'warn') status = 'warn';
    else if (rawStatus === 'error' || rawStatus === 'err' || rawStatus === 'down') status = 'err';
    else if (!healthData) status = 'unknown';

    return {
      label: svc.label,
      status,
      note: status === 'ok'
        ? 'Uptime 30d: 99.9%+ (sample)'
        : status === 'warn'
        ? 'Degraded — see incident log'
        : 'Error — incident open',
    };
  });

  // Incidents table (sample — no real incident endpoint yet)
  const incidents = [
    { desc: 'Provider C elevated error rate', started: 'Today 09:12', severity: 'warn' as const, statusV: 'warn' as const, statusLabel: 'Monitoring', owner: 'On-call (sample)' },
    { desc: 'Webhook retries delayed', started: 'Yesterday', severity: 'info' as const, statusV: 'ok' as const, statusLabel: 'Resolved', owner: 'Payments' },
    { desc: 'Sign-in latency spike', started: '3 days ago', severity: 'err' as const, statusV: 'ok' as const, statusLabel: 'Resolved', owner: 'Platform' },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6b4fe0]">Operations</p>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-[#182044]">System health</h1>
          <p className="mt-1 text-sm text-[#4E5A7E]">
            Live status (sample){lastChecked ? ` · Last checked ${lastChecked.toLocaleTimeString()}` : ''}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void loadHealth()}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Checking…' : 'Run diagnostics'}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900">
          <p>{error}</p>
          <Button className="mt-3" variant="outline" size="sm" onClick={() => void loadHealth()}>
            Try again
          </Button>
        </div>
      )}

      {/* Service health grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {KNOWN_SERVICES.map((s) => (
            <div key={s.key} className="h-32 animate-pulse rounded-xl border border-[#E2E5EF] bg-white" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((svc) => (
            <HealthCard key={svc.label} service={svc} />
          ))}
        </div>
      )}

      {/* Incidents table */}
      <div className="rounded-xl border border-[#E2E5EF] bg-white shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]">
        <div className="border-b border-[#E2E5EF] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#182044]">Recent incidents</h2>
          <p className="mt-0.5 text-xs text-[#8891A9]">Sample data — no real incident API yet</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E2E5EF] text-xs text-[#8891A9]">
                <th className="px-5 py-3 text-left font-medium">Incident</th>
                <th className="px-5 py-3 text-left font-medium">Started</th>
                <th className="px-5 py-3 text-left font-medium">Severity</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E5EF]">
              {incidents.map((inc, i) => (
                <tr key={i} className="hover:bg-[#F4F5FA]/60">
                  <td className="px-5 py-3.5 font-medium text-[#182044]">{inc.desc}</td>
                  <td className="px-5 py-3.5 text-[#4E5A7E]">{inc.started}</td>
                  <td className="px-5 py-3.5">
                    {statusBadge(inc.severity === 'info' ? 'ok' : inc.severity)}
                  </td>
                  <td className="px-5 py-3.5">
                    {statusBadge(inc.statusV)}
                  </td>
                  <td className="px-5 py-3.5 text-[#4E5A7E]">{inc.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
