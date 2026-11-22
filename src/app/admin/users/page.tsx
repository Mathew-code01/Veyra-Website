'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Info,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';

const panel = "rounded-xl border border-[#E2E5EF] bg-white shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]";

export default function AdminUsers() {
  const { session, client, logout } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'restricted'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (!client || !session?.accessToken) {
      setLoading(false);
      return;
    }
    const c = client as VeyraPlatformClient;
    setLoading(true);
    setError(null);
    setPermissionError(null);
    try {
      const r = await c.adminListUsers(page, limit);
      setUsers(r.users ?? []);
      setTotal(r.total ?? 0);
    } catch (err: any) {
      if (isPermissionError(err)) {
        setPermissionError('Admin role required. Your account does not have authorization to list users.');
      } else if (isAuthError(err)) {
        await logout();
      } else {
        setError(userFriendlyMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, [client, session?.accessToken, page, limit, logout]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (statusFilter !== 'all' && u.status?.toLowerCase() !== statusFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesEmail = u.email?.toLowerCase().includes(query);
        const matchesId = u.id?.toLowerCase().includes(query);
        const matchesName = u.displayName?.toLowerCase().includes(query);
        if (!matchesEmail && !matchesId && !matchesName) return false;
      }
      return true;
    });
  }, [users, statusFilter, searchQuery]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#6b4fe0]">Operations</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#182044] sm:text-[32px]">
            User Accounts
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#4E5A7E]">
            Inspect customer profiles, authorization status, and associated devices.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => void loadUsers()} disabled={loading}>
            <RefreshCw size={14} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>
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
          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'active', 'pending', 'restricted'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  statusFilter === status
                    ? 'bg-[#ECE9FB] text-[#6b4fe0]'
                    : 'bg-[#F4F5FA] text-[#8891A9] hover:text-[#182044]'
                }`}
              >
                {status}
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
              placeholder="Search by name, email or ID…"
              className="h-9 w-full rounded-lg border border-[#E2E5EF] bg-white pl-9 pr-3 text-xs text-[#182044] outline-none placeholder:text-[#8891A9] focus:border-[#6b4fe0] focus:ring-2 focus:ring-[#6b4fe0]/20"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${panel} overflow-hidden`}>
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-[#8891A9]">
            Loading user records from Platform API…
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#ECE9FB] text-[#6b4fe0]">
              <Users size={22} />
            </span>
            <h2 className="mt-4 font-semibold text-[#182044]">No users found</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#4E5A7E]">
              {searchQuery
                ? 'No accounts match your search filters.'
                : 'No user accounts are registered on the platform.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E2E5EF] bg-[#F4F5FA]/60 text-xs font-semibold text-[#8891A9]">
                  <th className="py-3.5 pl-6 pr-4">User</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Account ID</th>
                  <th className="px-4 py-3.5">Created</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5EF]">
                {filteredUsers.map((u) => {
                  const isActive = u.status === 'active';
                  const isPending = u.status === 'pending';
                  const isRestricted = u.status === 'restricted';
                  return (
                    <tr key={u.id} className="hover:bg-[#F4F5FA]/40 transition-colors">
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ECE9FB] text-xs font-bold text-[#6b4fe0]">
                            {u.email ? u.email.slice(0, 1).toUpperCase() : 'U'}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#182044] truncate">{u.email}</p>
                            {u.displayName && (
                              <p className="text-xs text-[#8891A9] truncate">{u.displayName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : isPending
                              ? 'bg-amber-50 text-amber-800'
                              : isRestricted
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {isActive ? <UserCheck size={12} /> : null}
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-[#8891A9]">
                        {u.id.slice(0, 16)}…
                      </td>
                      <td className="px-4 py-4 text-xs text-[#4E5A7E]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-4 pl-4 pr-6 text-right">
                        <Link href={`/admin/users/${u.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            View <ArrowRight size={12} className="ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      {total > limit && (
        <div className="flex items-center justify-between px-2 text-xs text-[#8891A9]">
          <p>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} accounts
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={14} /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Operational footnote */}
      <div className="flex items-start gap-3 rounded-xl border border-[#E2E5EF] bg-white p-4 text-xs text-[#8891A9]">
        <Info size={16} className="mt-0.5 shrink-0 text-[#6b4fe0]" />
        <p className="leading-5">
          User operations are handled by the server-side Platform API (<code className="text-[#182044]">GET /api/v1/admin/users</code>). Admin authorization is enforced on every call and recorded in the audit log.
        </p>
      </div>
    </div>
  );
}
