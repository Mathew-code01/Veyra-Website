'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Info,
  Receipt,
  RefreshCw,
  Shield,
  XCircle,
} from 'lucide-react';

const panel = "rounded-xl border border-[#E2E5EF] bg-white shadow-[0_12px_36px_-28px_rgba(24,32,68,0.34)]";

interface PaymentTransaction {
  id: string;
  subscriptionId: string;
  amountCents: number;
  currency: string;
  status: string;
  paymentDate: string;
}

export default function AdminPayments() {
  const { session, client, logout } = useAuth();
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    if (!client || !session?.accessToken) {
      setLoading(false);
      return;
    }
    const c = client as VeyraPlatformClient;
    setLoading(true);
    setError(null);
    setPermissionError(null);
    try {
      const r = await c.adminListPayments(1, 50);
      setPayments(r.transactions ?? []);
    } catch (err: any) {
      if (isPermissionError(err)) {
        setPermissionError('Billing role required. Your account does not have authorization to view transactions.');
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
    void loadPayments();
  }, [loadPayments]);

  if (!session) return null;

  if (permissionError) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/70 p-10 text-center">
        <Shield className="mx-auto mb-4 h-10 w-10 text-amber-600" />
        <h2 className="mb-2 text-xl font-bold text-[#182044]">Billing authorization required</h2>
        <p className="text-sm text-[#4E5A7E]">{permissionError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#6b4fe0]">Financial operations</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#182044] sm:text-[32px]">
            Payments &amp; Transactions
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#4E5A7E]">
            Verified ledger of customer invoice payments, subscription billings and payment webhook events.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadPayments()} disabled={loading}>
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

      {/* Table */}
      <div className={`${panel} overflow-hidden`}>
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-[#8891A9]">
            Loading payment transactions…
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#ECE9FB] text-[#6b4fe0]">
              <Receipt size={22} />
            </span>
            <h2 className="mt-4 font-semibold text-[#182044]">No payment transactions found</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#4E5A7E]">
              Payment events recorded through checkout providers will appear here once processed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#E2E5EF] bg-[#F4F5FA]/60 text-xs font-semibold text-[#8891A9]">
                  <th className="py-3.5 pl-6 pr-4">Transaction ID</th>
                  <th className="px-4 py-3.5">Subscription</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5EF]">
                {payments.map((p) => {
                  const isPaid = p.status?.toLowerCase() === 'paid' || p.status?.toLowerCase() === 'succeeded';
                  const isPending = p.status?.toLowerCase() === 'pending';
                  const amount = (p.amountCents / 100).toFixed(2);
                  return (
                    <tr key={p.id} className="hover:bg-[#F4F5FA]/40 transition-colors">
                      <td className="py-4 pl-6 pr-4 font-mono text-xs font-medium text-[#182044]">
                        {p.id}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-[#8891A9]">
                        {p.subscriptionId ? p.subscriptionId.slice(0, 16) + '…' : '—'}
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#182044]">
                        {amount} {p.currency?.toUpperCase() || 'USD'}
                      </td>
                      <td className="px-4 py-4 text-xs text-[#4E5A7E]">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-4 pl-4 pr-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700'
                              : isPending
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {p.status || 'Processed'}
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

      {/* Security notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#E2E5EF] bg-white p-4 text-xs text-[#8891A9]">
        <Info size={16} className="mt-0.5 shrink-0 text-[#6b4fe0]" />
        <p className="leading-5">
          Payment operations and verification are handled by the authoritative Platform payment service. Client-side state never grants entitlements or marks invoices as paid.
        </p>
      </div>
    </div>
  );
}
