'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function CreditsPage() {
  const { session, client, logout } = useAuth();
  const [balance, setBalance] = useState<{ balanceCents: number; currency: string } | null>(null);
  const [usage, setUsage] = useState<Array<{
    id: string;
    modelId: string;
    capability: string;
    tokensInput?: number;
    tokensOutput?: number;
    costCents: number;
    createdAt: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<{
    entitled: boolean;
    reason?: string;
    limitCents: number | null;
    usedCents: number;
    remainingCents: number | null;
    percentUsed: number | null;
    periodStart: string | null;
    periodEnd: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    let cancelled = false;
    const load = async () => {
      let loadError: string | null = null;
      const [balanceResult, usageResult, allowanceResult] = await Promise.allSettled([
        c.getCreditBalance(),
        c.listUsageHistory(),
        c.getCloudAllowance(),
      ]);
      if (cancelled) return;

      const authFailure = [balanceResult, usageResult, allowanceResult].find(
        (result) => result.status === 'rejected' && isAuthError(result.reason),
      );
      if (authFailure) {
        logout();
        return;
      }

      if (balanceResult.status === 'fulfilled') {
        setBalance(balanceResult.value.balance);
      } else {
        loadError = userFriendlyMessage(balanceResult.reason);
      }
      if (usageResult.status === 'fulfilled') {
        setUsage(usageResult.value.usage);
      } else if (!loadError) {
        loadError = userFriendlyMessage(usageResult.reason);
      }
      if (allowanceResult.status === 'fulfilled') {
        setAllowance(allowanceResult.value.allowance);
      } else if (!loadError) {
        loadError = userFriendlyMessage(allowanceResult.reason);
      }
      setError(loadError);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [client, session?.accessToken, logout]);

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-veyra-navy mb-2">Credits & usage</h1>
        <p className="text-muted-foreground">
          View your credit balance and usage. Credits are managed by the Veyra Platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credit balance</CardTitle>
          <CardDescription>Available credits for AI usage.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-veyra-navy">
              {balance
                ? new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: balance.currency,
                  }).format(balance.balanceCents / 100)
                : loading
                  ? 'Loading…'
                  : 'Unavailable'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            The balance and recorded cloud usage are reported by the Veyra Platform.
          </p>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Amounts are shown in the currency returned by the Platform.
        </CardFooter>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Cloud AI subscription usage</CardTitle>
          <CardDescription>
            Managed Cloud AI usage is checked against the allowance for your active billing period. Local AI and BYOK usage do not use this allowance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-16 animate-pulse rounded-md bg-secondary/60" aria-label="Loading Cloud AI allowance" />
          ) : allowance?.entitled && allowance.limitCents !== null ? (
            <>
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <span className="font-semibold text-veyra-navy">{allowance.percentUsed ?? 0}% of allowance used</span>
                <span className="text-sm text-muted-foreground">
                  ${((allowance.remainingCents ?? 0) / 100).toFixed(2)} remaining
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-secondary"
                role="meter"
                aria-label="Cloud AI allowance used"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={allowance.percentUsed ?? 0}
              >
                <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${allowance.percentUsed ?? 0}%` }} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Resets with your subscription period{allowance.periodEnd ? ` on ${new Date(allowance.periodEnd).toLocaleDateString()}` : ''}. This is an internal fair-use allowance; provider costs vary by model and workload.
              </p>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-secondary/40 p-5">
              <p className="font-medium text-veyra-navy">No active Cloud AI allowance</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {allowance?.reason ?? 'The Platform has not returned an active Cloud AI subscription for this account.'} You can continue using eligible local models or your own provider credentials.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 mt-6 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-secondary/50 p-8">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <h3 className="font-semibold text-veyra-navy mb-1">Usage details</h3>
            <p className="text-sm text-muted-foreground">
              Usage records include cloud model activity recorded by the Platform. Local inference does not appear here.
            </p>
          </div>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent cloud usage</CardTitle>
          <CardDescription>Most recent usage records available from the Platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading usage records…</p>
          ) : usage.length === 0 ? (
            <p className="text-sm text-muted-foreground">No usage records are available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="py-3 pr-4 font-medium">Date</th>
                    <th className="py-3 pr-4 font-medium">Model</th>
                    <th className="py-3 pr-4 font-medium">Capability</th>
                    <th className="py-3 pr-4 font-medium">Tokens</th>
                    <th className="py-3 font-medium">Cost (cents)</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.map((record) => (
                    <tr key={record.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4">{new Date(record.createdAt).toLocaleString()}</td>
                      <td className="py-3 pr-4">{record.modelId}</td>
                      <td className="py-3 pr-4">{record.capability}</td>
                      <td className="py-3 pr-4">
                        {(record.tokensInput ?? 0) + (record.tokensOutput ?? 0) || '—'}
                      </td>
                      <td className="py-3">{record.costCents}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



