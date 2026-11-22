'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  Globe,
  Info,
  Laptop,
  Mail,
  Shield,
  ShieldCheck,
  User,
  XCircle,
} from 'lucide-react';

const panel = "rounded-xl border border-[#E2E5EF] bg-white shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]";

export default function AdminUserDetails({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const { session, client, logout } = useAuth();
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
          c.adminLookupUser(userId),
          c.adminListUserRoles(userId),
          c.adminGetSubscription(userId).catch(() => ({ subscription: null })),
        ]);
        if (!cancelled) {
          setUser(u.user);
          setRoles(r.roles ?? []);
          setSubscription(s.subscription ?? null);
        }
      } catch (err: any) {
        if (isPermissionError(err)) {
          setPermissionError('Admin role required. You do not have authorization to view user details.');
        } else if (isAuthError(err)) {
          await logout();
        } else {
          setError(userFriendlyMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [client, session?.accessToken, userId, logout]);

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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[#8891A9]">
        Loading user account details…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6b4fe0] hover:underline"
        >
          <ArrowLeft size={14} /> Back to users
        </Link>
        <div className={`${panel} p-8 text-center`}>
          <h2 className="font-semibold text-[#182044]">User not found</h2>
          <p className="mt-1 text-sm text-[#4E5A7E]">
            Account with ID <code className="font-mono">{userId}</code> was not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6b4fe0] hover:underline"
        >
          <ArrowLeft size={14} /> Back to users
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ECE9FB] text-base font-bold text-[#6b4fe0]">
              {user.email ? user.email.slice(0, 1).toUpperCase() : 'U'}
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#182044]">
                {user.displayName || user.email}
              </h1>
              <p className="text-xs font-mono text-[#8891A9] mt-0.5">{user.id}</p>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              user.status === 'active'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-800'
            }`}
          >
            {user.status || 'Active'}
          </span>
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

      {/* Grid: Account details & Subscriptions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Info Card */}
        <div className={`${panel} p-6`}>
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E5EF]">
            <User size={16} className="text-[#6b4fe0]" />
            <h2 className="font-semibold text-[#182044]">Account Profile</h2>
          </div>
          <dl className="mt-4 divide-y divide-[#E2E5EF] text-sm">
            <div className="flex justify-between py-2.5">
              <dt className="text-[#8891A9]">Email address</dt>
              <dd className="font-medium text-[#182044]">{user.email}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[#8891A9]">Display name</dt>
              <dd className="font-medium text-[#182044]">{user.displayName || '—'}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[#8891A9]">Preferred locale</dt>
              <dd className="font-medium text-[#182044] uppercase">{user.locale || 'en'}</dd>
            </div>
            <div className="flex justify-between py-2.5">
              <dt className="text-[#8891A9]">Created at</dt>
              <dd className="font-medium text-[#182044]">
                {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Subscription Card */}
        <div className={`${panel} p-6`}>
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E5EF]">
            <CreditCard size={16} className="text-[#6b4fe0]" />
            <h2 className="font-semibold text-[#182044]">Subscription &amp; Entitlement</h2>
          </div>
          {subscription ? (
            <dl className="mt-4 divide-y divide-[#E2E5EF] text-sm">
              <div className="flex justify-between py-2.5">
                <dt className="text-[#8891A9]">Current plan</dt>
                <dd className="font-semibold text-[#6b4fe0]">{subscription.planId || 'Cloud AI'}</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="text-[#8891A9]">Status</dt>
                <dd className="font-medium text-emerald-700 capitalize">
                  {subscription.status || 'Active'}
                </dd>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="flex justify-between py-2.5">
                  <dt className="text-[#8891A9]">Renews on</dt>
                  <dd className="font-medium text-[#182044]">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <div className="py-6 text-center text-xs text-[#8891A9]">
              No active subscription found. User is operating in local/free tier.
            </div>
          )}
        </div>
      </div>

      {/* Roles & Permissions Card */}
      <div className={`${panel} p-6`}>
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E5EF]">
          <ShieldCheck size={16} className="text-[#6b4fe0]" />
          <h2 className="font-semibold text-[#182044]">Assigned Roles &amp; Permissions</h2>
        </div>
        {roles.length === 0 ? (
          <p className="mt-4 text-xs text-[#8891A9]">
            This user has standard customer permissions. No administrative roles are granted.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {roles.map((r: any, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-full bg-[#ECE9FB] px-3 py-1 text-xs font-semibold text-[#6b4fe0]"
              >
                <ShieldCheck size={12} />
                {r.role || r}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Admin Audit Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#E2E5EF] bg-white p-4 text-xs text-[#8891A9]">
        <Info size={16} className="mt-0.5 shrink-0 text-[#6b4fe0]" />
        <p className="leading-5">
          Accessing this user's profile and subscription data has been recorded in the platform audit log.
        </p>
      </div>
    </div>
  );
}
