'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Info,
  RefreshCw,
  Search,
  Shield,
  WalletCards,
  XCircle,
} from 'lucide-react';

const panel = "rounded-xl border border-[#E2E5EF] bg-white shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]";

export default function AdminSubscriptions() {
  const { session, client, logout } = useAuth();
  const [lookupUserId, setLookupUserId] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !session?.accessToken) return;
    if (!lookupUserId.trim()) return;
    const c = client as VeyraPlatformClient;
    setBusy(true);
    setError(null);
    setSubscription(null);
    setSearched(true);
    setPermissionError(null);
    try {
      const res = await c.adminGetSubscription(lookupUserId.trim());
      setSubscription(res.subscription ?? null);
    } catch (err: any) {
      if (isPermissionError(err)) {
        setPermissionError('Admin role required to inspect user subscriptions.');
      } else if (isAuthError(err)) {
        await logout();
      } else {
        setError(userFriendlyMessage(err));
      }
    } finally {
      setBusy(false);
    }
  };

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
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#6b4fe0]">Entitlements</p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#182044] sm:text-[32px]">
          Subscriptions &amp; Plans
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4E5A7E]">
          Inspect user active subscriptions, billing cycles, quota allocations and payment sources.
        </p>
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

      {/* Lookup box */}
      <div className={`${panel} max-w-2xl p-6`}>
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E5EF]">
          <Search size={16} className="text-[#6b4fe0]" />
          <h2 className="font-semibold text-sm text-[#182044]">Lookup Subscription by User ID</h2>
        </div>
        <form onSubmit={handleLookup} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-64 flex-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8891A9]">
              User ID
            </label>
            <input
              type="text"
              value={lookupUserId}
              onChange={(e) => setLookupUserId(e.target.value)}
              placeholder="e.g. usr_8f2a... or UUID"
              className="mt-1.5 h-10 w-full rounded-lg border border-[#E2E5EF] bg-white px-3 text-xs text-[#182044] outline-none font-mono placeholder:text-[#8891A9] focus:border-[#6b4fe0] focus:ring-2 focus:ring-[#6b4fe0]/20"
              required
            />
          </div>
          <Button type="submit" disabled={busy || !lookupUserId.trim()}>
            {busy ? 'Searching…' : 'Inspect subscription'}
          </Button>
        </form>

        {/* Subscription result */}
        {searched && (
          <div className="mt-6 pt-5 border-t border-[#E2E5EF]">
            {subscription ? (
              <div className="rounded-xl border border-[#E2E5EF] bg-[#F4F5FA]/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#182044]">
                    Plan: {subscription.planId || 'Cloud AI'}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {subscription.status || 'Active'}
                  </span>
                </div>
                <dl className="mt-3 divide-y divide-[#E2E5EF] text-xs">
                  <div className="flex justify-between py-1.5">
                    <dt className="text-[#8891A9]">Subscription ID</dt>
                    <dd className="font-mono text-[#182044]">{subscription.id || '—'}</dd>
                  </div>
                  {subscription.currentPeriodEnd && (
                    <div className="flex justify-between py-1.5">
                      <dt className="text-[#8891A9]">Period End</dt>
                      <dd className="text-[#182044]">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                  {subscription.cancelAtPeriodEnd != null && (
                    <div className="flex justify-between py-1.5">
                      <dt className="text-[#8891A9]">Auto-renews</dt>
                      <dd className="text-[#182044]">
                        {subscription.cancelAtPeriodEnd ? 'No (cancelling)' : 'Yes'}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            ) : (
              <p className="text-xs text-[#8891A9] text-center py-2">
                No subscription record found for this user.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Directory Link */}
      <div className={`${panel} max-w-2xl p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-[#182044]">Browse All Accounts</h3>
            <p className="text-xs text-[#8891A9] mt-0.5">
              Select any account from the user directory to view its subscription details and assigned quotas.
            </p>
          </div>
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              Open user directory <ExternalLink size={12} className="ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-start gap-3 rounded-xl border border-[#E2E5EF] bg-white p-4 text-xs text-[#8891A9]">
        <Info size={16} className="mt-0.5 shrink-0 text-[#6b4fe0]" />
        <p className="leading-5">
          Subscriptions are managed authoritatively by VEYRA Platform. Plan entitlements and monthly quota resets are processed by backend billing workers.
        </p>
      </div>
    </div>
  );
}
