'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, isPermissionError } from '@/services/platform/errors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Activity, AlertTriangle, Shield, Info } from 'lucide-react';

export default function AdminPlans() {
  const { session, client } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [allowanceInputs, setAllowanceInputs] = useState<Record<string, string>>({});
  const [savingPlanId, setSavingPlanId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!client || !session?.accessToken) return;
    const c = client as VeyraPlatformClient;
    c.listPlans()
      .then((r) => {
        setPlans(r.plans);
        setAllowanceInputs(Object.fromEntries(r.plans.map((plan) => [
          plan.id,
          plan.cloudAiMonthlyCostLimitCents == null ? '' : (plan.cloudAiMonthlyCostLimitCents / 100).toFixed(2),
        ])));
      })
      .catch((err: any) => {
        if (isPermissionError(err)) setPermissionError('Admin role required.');
        else if (!isAuthError(err)) setError(userFriendlyMessage(err));
      })
      .finally(() => setLoading(false));
  }, [client, session?.accessToken]);

  if (!session) return null;

  const saveAllowance = async (planId: string) => {
    if (!client) return;
    const raw = allowanceInputs[planId]?.trim() ?? '';
    const amount = raw === '' ? null : Math.round(Number(raw) * 100);
    if (amount !== null && (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000)) {
      setError('Enter a positive monthly USD cost limit up to $10,000, or leave it blank to disable Cloud AI for this plan.');
      return;
    }
    setSavingPlanId(planId);
    setError(null);
    setSaveMessage(null);
    try {
      await (client as VeyraPlatformClient).updateCloudPlanCostLimit(planId, amount);
      setPlans((current) => current.map((plan) => plan.id === planId ? { ...plan, cloudAiMonthlyCostLimitCents: amount } : plan));
      setSaveMessage('Internal Cloud AI cost limit saved.');
    } catch (err: any) {
      if (isPermissionError(err)) setPermissionError('Billing administrator access required.');
      else setError(userFriendlyMessage(err));
    } finally {
      setSavingPlanId(null);
    }
  };

  if (permissionError) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 lg:px-8 lg:py-16">
        <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 p-8 text-center">
          <Shield className="h-8 w-8 mx-auto mb-4 text-amber-600" />
          <h2 className="text-xl font-bold text-veyra-navy mb-2">Admin access required</h2>
          <p className="text-sm text-muted-foreground">{permissionError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 lg:px-8 lg:py-12">
      <h1 className="text-3xl font-bold text-veyra-navy mb-6">Plans & pricing</h1>
      {loading && <div className="h-32 bg-secondary/50 rounded-xl animate-pulse" />}
      {!loading && permissionError && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{permissionError}</div>
      )}
      {!loading && !permissionError && plans.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-8 text-center">
          <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-veyra-navy mb-2">No plans configured</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The Platform has no plans seeded. Commercial pricing has not been configured.
          </p>
        </div>
      )}
      {!loading && !permissionError && plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse divide-y divide-border">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Plan</th>
                    <th className="pb-3 font-medium">Family</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Interval</th>
                    <th className="pb-3 font-medium">Internal monthly Cloud cost limit</th>
                    <th className="pb-3 font-medium text-center">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((p) => (
                    <tr key={p.id}>
                      <td className="pb-4 font-medium">{p.name}</td>
                      <td className="pb-4 text-muted-foreground">{p.family}</td>
                      <td className="pb-4">${(p.priceCents / 100).toFixed(2)}</td>
                      <td className="pb-4 text-muted-foreground">{p.billingInterval}</td>
                      <td className="pb-4">
                        <div className="flex min-w-56 items-center gap-2">
                          <label className="sr-only" htmlFor={`cloud-limit-${p.id}`}>Monthly provider cost limit in USD</label>
                          <span aria-hidden="true">$</span>
                          <input
                            id={`cloud-limit-${p.id}`}
                            inputMode="decimal"
                            value={allowanceInputs[p.id] ?? ''}
                            onChange={(event) => setAllowanceInputs((current) => ({ ...current, [p.id]: event.target.value }))}
                            placeholder="Disabled"
                            className="h-9 w-24 rounded-md border border-border bg-background px-2 text-sm"
                          />
                          <Button size="sm" variant="outline" disabled={savingPlanId === p.id} onClick={() => saveAllowance(p.id)}>
                            {savingPlanId === p.id ? 'Saving…' : 'Save'}
                          </Button>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Cost ceiling per subscription period, not user credits.</p>
                      </td>
                      <td className="pb-4 text-center">
                        <Badge variant={p.isActive ? 'success' : 'secondary'}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      {error && <div className="rounded-md border border-red-200 bg-red-50 p-4 mt-6 text-sm text-red-800">{error}</div>}
      {saveMessage && <div role="status" className="rounded-md border border-emerald-200 bg-emerald-50 p-4 mt-6 text-sm text-emerald-800">{saveMessage}</div>}
    </div>
  );
}



