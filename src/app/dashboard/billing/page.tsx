'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, Info } from 'lucide-react';

export default function BillingPage() {
  const { session, client, logout } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    amountCents: number;
    currency: string;
    status: string;
    paymentDate: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('checkout');
    if (status === 'complete') setCheckoutNotice('Checkout returned. Your subscription will appear here after the Platform verifies payment. This return page does not confirm a charge.');
    if (status === 'cancelled') setCheckoutNotice('Checkout was cancelled. No subscription change was made.');
  }, []);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [subscriptionResult, plansResult, paymentResult] = await Promise.allSettled([
        c.getCurrentSubscription(),
        c.listPlans(),
        c.listPaymentHistory(),
      ]);
      if (cancelled) return;

      const results = [subscriptionResult, plansResult, paymentResult];
      if (results.some((result) => result.status === 'rejected' && isAuthError(result.reason))) {
        logout();
        return;
      }

      if (subscriptionResult.status === 'fulfilled') {
        setSubscription(subscriptionResult.value.subscription);
      } else {
        setError(userFriendlyMessage(subscriptionResult.reason));
      }
      if (plansResult.status === 'fulfilled') {
        setPlans(plansResult.value.plans);
      } else {
        setError((current) => current ?? userFriendlyMessage(plansResult.reason));
      }
      if (paymentResult.status === 'fulfilled') {
        setTransactions(paymentResult.value.transactions);
      } else {
        setError((current) => current ?? userFriendlyMessage(paymentResult.reason));
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [client, session?.accessToken, logout]);

  const updateSubscription = async () => {
    if (!subscription || !client) return;
    setUpdating(true);
    setError(null);
    try {
      const c = client as VeyraPlatformClient;
      if (subscription.cancelAtPeriodEnd) {
        await c.reactivateSubscription(subscription.id);
      } else {
        await c.cancelSubscription({ subscriptionId: subscription.id, atPeriodEnd: true });
      }
      const refreshed = await c.getCurrentSubscription();
      setSubscription(refreshed.subscription);
    } catch (err: any) {
      if (isAuthError(err)) {
        logout();
      } else {
        setError(userFriendlyMessage(err));
      }
    } finally {
      setUpdating(false);
    }
  };

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-veyra-navy mb-2">Billing & subscription</h1>
        <p className="text-muted-foreground">
          Manage your plan and billing. Payment state comes from the Veyra Platform.
        </p>
      </div>

      {checkoutNotice && <div role="status" className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm text-slate-700">{checkoutNotice}</div>}

      {loading && (
        <div className="rounded-xl border border-border bg-card p-8 animate-pulse">
          <div className="h-10 bg-secondary/50 rounded" />
        </div>
      )}

      {!loading && !subscription && !error && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-8 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-veyra-navy mb-2">No active subscription</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You don't have a managed Cloud subscription. A free account can still use supported Local AI or configure a provider key in Desktop.
          </p>
          {plans.length > 0 ? (
            <div className="flex justify-center gap-4">
              {plans.slice(0, 3).map((plan) => (
                <Link key={plan.id} href="/pricing">
                  <Button variant="outline">{plan.name}</Button>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No approved Cloud offer is published for your account's region yet. Local AI and BYOK are separate usage methods and do not require a VEYRA Cloud subscription.
            </p>
          )}
        </div>
      )}

      {!loading && subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current plan</CardTitle>
            <CardDescription>{subscription.planName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-medium">{subscription.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Interval</p>
                <p className="font-medium">{subscription.billingInterval}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Period ends</p>
                <p className="font-medium">
                  {subscription.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : 'Not available'}
                </p>
              </div>
            </div>
            {subscription.cancelAtPeriodEnd && (
              <div className="p-3 rounded-lg border border-amber-100 bg-amber-50 text-sm text-amber-800">
                This subscription will cancel at the end of the current period.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={updateSubscription} disabled={updating}>
              {updating ? 'Updating…' : subscription.cancelAtPeriodEnd ? 'Reactivate' : 'Cancel subscription'}
            </Button>
            <Link href="/pricing"><Button variant="outline">Change plan</Button></Link>
          </CardFooter>
        </Card>
      )}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Payment history</CardTitle>
          <CardDescription>Transactions reported by the Veyra Platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment transactions are available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Amount</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4">{new Date(transaction.paymentDate).toLocaleDateString()}</td>
                      <td className="py-3 pr-4">
                        {new Intl.NumberFormat(undefined, {
                          style: 'currency',
                          currency: transaction.currency,
                        }).format(transaction.amountCents / 100)}
                      </td>
                      <td className="py-3 capitalize">{transaction.status.replaceAll('_', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-8">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <h3 className="font-semibold text-veyra-navy mb-1">About payments</h3>
            <p className="text-sm text-muted-foreground">
              Checkout is initiated through the Veyra Platform. Payment success is determined by verified
              Platform records and webhooks — never by the browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



