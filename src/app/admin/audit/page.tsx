'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle2,
  FileClock,
  Filter,
  Info,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  X,
  XCircle,
} from 'lucide-react';

const panel = "rounded-xl border border-[#E2E5EF] bg-white shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]";

export default function AdminAudit() {
  const { session, client, logout } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    if (!client || !session?.accessToken) {
      setLoading(false);
      return;
    }
    const c = client as VeyraPlatformClient;
    setLoading(true);
    setError(null);
    setPermissionError(null);
    try {
      const r = await c.adminListAuditEvents();
      setEvents(r.auditEvents ?? []);
    } catch (err: any) {
      if (isPermissionError(err)) {
        setPermissionError('Auditor or Admin role required to inspect the platform audit trail.');
      } else if (isAuthError(err)) {
        await logout();
      } else {
        setError(userFriendlyMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, [client, session?.accessToken, logout]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const uniqueActions = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.action) set.add(e.action);
    });
    return Array.from(set);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (actionFilter !== 'all' && e.action !== actionFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesAction = e.action?.toLowerCase().includes(query);
        const matchesAdmin = e.adminUserId?.toLowerCase().includes(query);
        const matchesTarget = e.targetUserId?.toLowerCase().includes(query);
        const matchesTargetId = e.targetId?.toLowerCase().includes(query);
        if (!matchesAction && !matchesAdmin && !matchesTarget && !matchesTargetId) return false;
      }
      return true;
    });
  }, [events, actionFilter, searchQuery]);

  if (!session) return null;

  if (permissionError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-10 text-center">
        <Shield className="mx-auto mb-4 h-10 w-10 text-amber-600" />
        <h2 className="mb-2 text-xl font-bold text-[#182044]">Auditor access required</h2>
        <p className="text-sm text-[#4E5A7E]">{permissionError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#6b4fe0]">Security &amp; Governance</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#182044] sm:text-[32px]">
            Audit Logs
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#4E5A7E]">
            Immutable record of all administrative operations, role modifications and data access.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadEvents()} disabled={loading}>
          <RefreshCw size={14} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <XCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className={`${panel} p-4 sm:p-5`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Action Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActionFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                actionFilter === 'all'
                  ? 'bg-[#ECE9FB] text-[#6b4fe0]'
                  : 'bg-[#F4F5FA] text-[#8891A9] hover:text-[#182044]'
              }`}
            >
              All Actions
            </button>
            {uniqueActions.slice(0, 4).map((action) => (
              <button
                key={action}
                onClick={() => setActionFilter(action)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  actionFilter === action
                    ? 'bg-[#ECE9FB] text-[#6b4fe0]'
                    : 'bg-[#F4F5FA] text-[#8891A9] hover:text-[#182044]'
                }`}
              >
                {action.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8891A9]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actor, action or target…"
              className="h-9 w-full rounded-lg border border-[#E2E5EF] bg-white pl-9 pr-3 text-xs text-[#182044] outline-none placeholder:text-[#8891A9] focus:border-[#6b4fe0] focus:ring-2 focus:ring-[#6b4fe0]/20"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Table + Optional Details Drawer */}
      <div className={`grid gap-6 ${selectedEvent ? 'lg:grid-cols-[1fr_360px]' : ''}`}>
        {/* Table */}
        <div className={`${panel} overflow-hidden`}>
          {loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-[#8891A9]">
              Loading audit events…
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#ECE9FB] text-[#6b4fe0]">
                <FileClock size={22} />
              </span>
              <h2 className="mt-4 font-semibold text-[#182044]">No audit events recorded</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-[#4E5A7E]">
                {searchQuery
                  ? 'No audit events match your search query.'
                  : 'Administrative actions will appear here once executed.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E5EF] bg-[#F4F5FA]/60 text-xs font-semibold text-[#8891A9]">
                    <th className="py-3.5 pl-6 pr-4">Time</th>
                    <th className="px-4 py-3.5">Action</th>
                    <th className="px-4 py-3.5">Actor (Admin ID)</th>
                    <th className="px-4 py-3.5">Target</th>
                    <th className="py-3.5 pl-4 pr-6 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E5EF]">
                  {filteredEvents.map((e) => {
                    const isSelected = selectedEvent?.id === e.id;
                    return (
                      <tr
                        key={e.id}
                        onClick={() => setSelectedEvent(isSelected ? null : e)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#ECE9FB]/40'
                            : 'hover:bg-[#F4F5FA]/40'
                        }`}
                      >
                        <td className="py-3.5 pl-6 pr-4 text-xs text-[#4E5A7E] whitespace-nowrap">
                          {e.createdAt ? new Date(e.createdAt).toLocaleString() : '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-xs text-[#182044]">
                            {e.action}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-[#8891A9]">
                          {e.adminUserId ? e.adminUserId.slice(0, 14) + '…' : 'system'}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-[#8891A9]">
                          {e.targetUserId || e.targetId || '—'}
                        </td>
                        <td className="py-3.5 pl-4 pr-6 text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 size={11} /> Success
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Drawer */}
        {selectedEvent && (
          <div className={`${panel} p-6 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E5EF]">
                <h3 className="font-semibold text-sm text-[#182044]">Event Details</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-[#8891A9] hover:text-[#182044]"
                >
                  <X size={16} />
                </button>
              </div>

              <dl className="mt-4 divide-y divide-[#E2E5EF] text-xs">
                <div className="py-2.5">
                  <dt className="text-[#8891A9]">Event ID</dt>
                  <dd className="mt-0.5 font-mono font-medium text-[#182044] break-all">
                    {selectedEvent.id}
                  </dd>
                </div>
                <div className="py-2.5">
                  <dt className="text-[#8891A9]">Action</dt>
                  <dd className="mt-0.5 font-semibold text-[#6b4fe0]">
                    {selectedEvent.action}
                  </dd>
                </div>
                <div className="py-2.5">
                  <dt className="text-[#8891A9]">Actor</dt>
                  <dd className="mt-0.5 font-mono text-[#182044] break-all">
                    {selectedEvent.adminUserId || 'system'}
                  </dd>
                </div>
                <div className="py-2.5">
                  <dt className="text-[#8891A9]">Target</dt>
                  <dd className="mt-0.5 font-mono text-[#182044] break-all">
                    {selectedEvent.targetUserId || selectedEvent.targetId || '—'}
                  </dd>
                </div>
                <div className="py-2.5">
                  <dt className="text-[#8891A9]">Timestamp</dt>
                  <dd className="mt-0.5 text-[#4E5A7E]">
                    {selectedEvent.createdAt ? new Date(selectedEvent.createdAt).toISOString() : '—'}
                  </dd>
                </div>
                {selectedEvent.metadata && (
                  <div className="py-2.5">
                    <dt className="text-[#8891A9]">Metadata</dt>
                    <dd className="mt-1">
                      <pre className="rounded-lg bg-[#F4F5FA] p-2 text-[10px] text-[#182044] overflow-x-auto">
                        {JSON.stringify(selectedEvent.metadata, null, 2)}
                      </pre>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E2E5EF]">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => setSelectedEvent(null)}
              >
                Close details
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Compliance Note */}
      <div className="flex items-start gap-3 rounded-xl border border-[#E2E5EF] bg-white p-4 text-xs text-[#8891A9]">
        <Info size={16} className="mt-0.5 shrink-0 text-[#6b4fe0]" />
        <p className="leading-5">
          Audit entries are generated automatically by Platform service decorators. Records are append-only and cannot be mutated or deleted from this console.
        </p>
      </div>
    </div>
  );
}
