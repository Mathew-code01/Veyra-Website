'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError } from '@/services/platform/errors';
import { apiBaseUrl } from '@/lib/env';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

function formatCurrency(amountCents: number, currency: string) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(amountCents / 100);
}

export default function PricingPage() {
  const { session, client } = useAuth();
  const [countries, setCountries] = useState<any[]>([]);
  const [detected, setDetected] = useState<{ country: string; currency: string; currencySymbol: string } | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (!client) return;
    const c = client as VeyraPlatformClient;
    let cancelled = false;
    const load = async () => {
      try {
        // Fetch countries (no auth required)
        const countriesResult = await fetch(`${apiBaseUrl}/api/v1/pricing/countries`);
        const countriesData = await countriesResult.json();
        if (countriesData.ok) {
          const supportedCountries = countriesData.countries.filter((country: any) => country.isSupported);
          setCountries(supportedCountries);
          const firstRegion = supportedCountries[0];
          if (firstRegion) {
            setDetected((current) => current ?? {
              country: firstRegion.country,
              currency: firstRegion.currency,
              currencySymbol: firstRegion.currencySymbol,
            });
          }
        }

        // Detect country (requires auth)
        if (session?.accessToken) {
          const detectResult = await c.detectCountry();
          if (detectResult.ok) {
            setDetected((current) => current ?? {
              country: detectResult.country,
              currency: detectResult.currency,
              currencySymbol: detectResult.currencySymbol,
            });
          }
        }
      } catch (err: any) {
        setError(userFriendlyMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [client, session?.accessToken]);

  useEffect(() => {
    if (!client || !detected) return;
    const c = client as VeyraPlatformClient;
    let cancelled = false;
    setPlans([]);
    setPlansLoading(true);
    const load = async () => {
      try {
        const result = await c.getPlanPricing(detected.country, detected.currency);
        if (!cancelled && result.ok) {
          setPlans(result.plans);
        }
      } catch (err: any) {
        if (!isAuthError(err)) {
          setError(userFriendlyMessage(err));
        }
      } finally {
        if (!cancelled) setPlansLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [client, detected]);

  const startCheckout = async (plan: { planId: string; billingInterval: 'monthly' | 'yearly' }) => {
    if (!session?.accessToken) {
      window.location.assign(`/login?redirectTo=${encodeURIComponent('/pricing')}`);
      return;
    }

    if (!client) return;
    setCheckoutPlanId(plan.planId);
    setError(null);
    try {
      const result = await (client as VeyraPlatformClient).createCheckoutSession({
        planId: plan.planId,
        billingInterval: plan.billingInterval,
        successUrl: `${window.location.origin}/dashboard/billing?checkout=complete`,
        cancelUrl: `${window.location.origin}/pricing?checkout=cancelled`,
      });
      window.location.assign(result.checkoutUrl);
    } catch (err: any) {
      setError(userFriendlyMessage(err));
      setCheckoutPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="max-w-3xl mx-auto px-4 lg:px-8 py-20">
          <h1 className="text-display-md font-bold text-veyra-navy mb-6">Pricing</h1>
          <div className="rounded-xl border border-border bg-card p-8 animate-pulse">
            <div className="h-10 bg-secondary rounded w-1/3" />
            <div className="h-8 bg-secondary rounded w-1/2 mt-4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <section className="py-16 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-display-md font-bold text-veyra-navy mb-6">Pricing</h1>
            <p className="text-lg text-muted-foreground">
              Plans and pricing are configured in the Veyra Platform and fetched live.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 lg:px-8">
            {countries.length > 0 && (
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor="pricing-region" className="text-sm font-medium text-slate-700">Prices shown for your selected region</label>
                <select
                  id="pricing-region"
                  value={detected ? `${detected.country}:${detected.currency}` : ''}
                  onChange={(event) => {
                    const selected = countries.find((country) => `${country.country}:${country.currency}` === event.target.value);
                    if (selected) setDetected({ country: selected.country, currency: selected.currency, currencySymbol: selected.currencySymbol });
                  }}
                  className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm"
                >
                  {countries.map((country) => <option key={`${country.country}:${country.currency}`} value={`${country.country}:${country.currency}`}>{country.countryName} ({country.currency})</option>)}
                </select>
              </div>
            )}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 mb-8 text-sm text-red-800">
                {error}
              </div>
            )}

            {plansLoading && detected ? (
              <div role="status" className="rounded-xl border border-border bg-white p-8 text-center text-sm text-slate-600">Loading configured plans...</div>
            ) : detected && plans.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan: any) => (
                  <Card key={plan.planId} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{plan.planName}</CardTitle>
                      <CardDescription>{plan.planFamily}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-veyra-navy">
                          {formatCurrency(plan.amountCents, detected.currency)}
                        </span>
                        <span className="text-sm text-muted-foreground">/{plan.billingInterval}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Available: {plan.isAvailable ? 'Yes' : 'No'}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        disabled={!plan.isAvailable || checkoutPlanId === plan.planId}
                        onClick={() => startCheckout(plan)}
                        className="w-full"
                      >
                        {checkoutPlanId === plan.planId
                          ? 'Connecting to checkout…'
                          : session?.accessToken
                            ? 'Continue to checkout'
                            : 'Sign in to continue'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-8 text-center">
                <h3 className="text-lg font-semibold text-veyra-navy mb-2">{error ? 'Regional pricing is unavailable' : detected ? 'No plans available yet' : 'Regional pricing could not be loaded'}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {error ? 'The pricing service could not be reached. Please try again later.' : detected ? 'Commercial pricing has not been configured in the Platform for this region.' : 'The Platform did not return a supported region for pricing.'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Prices, currencies, allowances, and included features come from the Platform.
                  No prices are invented here.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="py-20 bg-secondary/50">
          <div className="max-w-3xl mx-auto px-4 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-veyra-navy mb-6">How billing works</h2>
              <ul className="space-y-4 text-sm text-muted-foreground max-w-lg mx-auto">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-3 w-3 rounded-full bg-veyra-indigo" />
                  <span>Checkout is initiated through the Platform ({'/api/v1/payments/checkout'}).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-3 w-3 rounded-full bg-veyra-indigo" />
                  <span>Payment state comes from verified Platform records and webhooks — never from the browser.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-3 w-3 rounded-full bg-veyra-indigo" />
                  <span>Subscriptions can be cancelled or reactivated through your dashboard.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
