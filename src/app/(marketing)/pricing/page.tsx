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

type PricingPlan = {
  planId: string;
  planName: string;
  planFamily: string;
  currency: string;
  amountCents: number;
  billingInterval: 'monthly' | 'yearly';
  isAvailable: boolean;
};

type CachedPricing = {
  version: 1;
  country: string;
  currency: string;
  fetchedAt: string;
  plans: PricingPlan[];
};

const PRICING_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const pricingCacheKey = (country: string, currency: string) =>
  `veyra:pricing:v1:${country.toUpperCase()}:${currency.toUpperCase()}`;

function isPricingPlan(value: unknown, currency: string): value is PricingPlan {
  if (!value || typeof value !== 'object') return false;
  const plan = value as Partial<PricingPlan>;
  return typeof plan.planId === 'string' && plan.planId.length > 0 &&
    typeof plan.planName === 'string' && typeof plan.planFamily === 'string' &&
    (plan.currency === currency || plan.currency === 'USD') && Number.isSafeInteger(plan.amountCents) && plan.amountCents! > 0 &&
    (plan.billingInterval === 'monthly' || plan.billingInterval === 'yearly') &&
    typeof plan.isAvailable === 'boolean';
}

function readCachedPricing(country: string, currency: string): CachedPricing | null {
  try {
    const raw = localStorage.getItem(pricingCacheKey(country, currency));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const cached = value as Partial<CachedPricing>;
    const fetchedAt = typeof cached.fetchedAt === 'string' ? Date.parse(cached.fetchedAt) : NaN;
    if (cached.version !== 1 || cached.country !== country || cached.currency !== currency ||
      !Number.isFinite(fetchedAt) || fetchedAt > Date.now() ||
      Date.now() - fetchedAt > PRICING_CACHE_MAX_AGE_MS || !Array.isArray(cached.plans) ||
      cached.plans.length === 0 || !cached.plans.every((plan) => isPricingPlan(plan, currency))) return null;
    return cached as CachedPricing;
  } catch {
    return null;
  }
}

function validatePricingPlans(value: unknown, currency: string): PricingPlan[] {
  if (!Array.isArray(value) || !value.every((plan) => isPricingPlan(plan, currency))) {
    throw new Error('The Platform returned invalid regional pricing data.');
  }
  return value;
}

export default function PricingPage() {
  const { session, client } = useAuth();
  const [countries, setCountries] = useState<any[]>([]);
  const [detected, setDetected] = useState<{ country: string; currency: string; currencySymbol: string } | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [plansSource, setPlansSource] = useState<'live' | 'cache' | null>(null);
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<{ rate: number; timestamp: string; isLive: boolean } | null>(null);
  const [exchangeRateError, setExchangeRateError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);

  useEffect(() => {
    const checkout = new URLSearchParams(window.location.search).get('checkout');
    if (checkout === 'complete') setCheckoutNotice('Checkout returned successfully. The Platform will show an active plan only after payment is verified.');
    if (checkout === 'cancelled') setCheckoutNotice('Checkout was cancelled. No subscription change was made.');
  }, []);

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
    setError(null);
    const cached = readCachedPricing(detected.country, detected.currency);
    setPlans(cached?.plans ?? []);
    setPlansSource(cached ? 'cache' : null);
    setCachedAt(cached?.fetchedAt ?? null);
    setPlansLoading(true);
    const load = async () => {
      try {
        const result = await c.getPlanPricing(detected.country, detected.currency);
        if (!result.ok) throw new Error('The Platform could not load pricing for this region.');
        const livePlans = validatePricingPlans(result.plans, detected.currency);
        const pricingMetadata = result as typeof result & { source?: 'live' | 'cache'; retrievedAt?: string; checkoutAvailable?: boolean };
        const responseIsCached = pricingMetadata.source === 'cache' || pricingMetadata.checkoutAvailable === false;
        const retrievedAt = responseIsCached && typeof pricingMetadata.retrievedAt === 'string' && Number.isFinite(Date.parse(pricingMetadata.retrievedAt))
          ? pricingMetadata.retrievedAt
          : new Date().toISOString();
        if (!cancelled) {
          setPlans(livePlans);
          setPlansSource(responseIsCached ? 'cache' : 'live');
          setCachedAt(responseIsCached ? retrievedAt : null);
          try {
            const key = pricingCacheKey(detected.country, detected.currency);
            if (livePlans.length) {
              localStorage.setItem(key, JSON.stringify({ version: 1, country: detected.country, currency: detected.currency, fetchedAt: retrievedAt, plans: livePlans } satisfies CachedPricing));
            } else {
              localStorage.removeItem(key);
            }
          } catch {
            // A storage restriction does not prevent live pricing or checkout.
          }
        }
      } catch (err: any) {
        if (!cancelled && !isAuthError(err)) {
          setError(cached
            ? 'The Platform is temporarily unavailable. Showing the last verified price; checkout is disabled until the current offer can be confirmed.'
            : userFriendlyMessage(err));
        }
      } finally {
        if (!cancelled) setPlansLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [client, detected]);

  // Fetch exchange rate for the detected currency
  useEffect(() => {
    if (!client || !detected) return;
    const c = client as VeyraPlatformClient;
    let cancelled = false;
    const load = async () => {
      try {
        // Only fetch exchange rate if the detected currency differs from USD
        if (detected.currency === 'USD') {
          setExchangeRate({ rate: 1, timestamp: new Date().toISOString(), isLive: true });
          return;
        }
        const result = await c.getExchangeRate('USD', detected.currency);
        if (!result.ok) throw new Error('Failed to fetch exchange rate');
        setExchangeRate({
          rate: result.rate,
          timestamp: result.timestamp,
          isLive: true,
        });
      } catch (err: any) {
        // Exchange rate failure should not block pricing display
        setExchangeRateError(err instanceof Error ? err.message : 'Failed to load exchange rate');
      }
    };
    load();
    return () => { cancelled = true; };
  }, [client, detected]);

  const startCheckout = async (plan: { planId: string; billingInterval: 'monthly' | 'yearly'; currency: string }) => {
    if (plansSource !== 'live') {
      setError('Reconnect to the Platform to verify the current offer before checkout.');
      return;
    }
    if (!session?.accessToken) {
      window.location.assign(`/login?redirectTo=${encodeURIComponent('/pricing')}`);
      return;
    }

    if (!client) return;
    const offerKey = `${plan.planId}:${plan.billingInterval}`;
    setCheckoutPlanId(offerKey);
    setError(null);
    try {
      const result = await (client as VeyraPlatformClient).createCheckoutSession({
        planId: plan.planId,
        billingInterval: plan.billingInterval,
        currency: plan.currency,
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

        <section className="border-b border-border bg-indigo-50/60 py-10">
          <div className="mx-auto grid max-w-5xl gap-4 px-4 md:grid-cols-3 lg:px-8">
            <div className="rounded-xl border border-indigo-100 bg-white p-5">
              <h2 className="font-semibold text-veyra-navy">Managed Cloud AI</h2>
              <p className="mt-2 text-sm text-muted-foreground">A VEYRA Cloud subscription appears here only when an approved regional plan and price are published.</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5">
              <h2 className="font-semibold text-veyra-navy">Bring your own provider</h2>
              <p className="mt-2 text-sm text-muted-foreground">Connect a supported provider in Desktop. Provider usage is billed by that provider under its own account and terms.</p>
            </div>
            <div className="rounded-xl border border-border bg-white p-5">
              <h2 className="font-semibold text-veyra-navy">Local AI</h2>
              <p className="mt-2 text-sm text-muted-foreground">Run compatible models on your computer. Availability and hardware requirements depend on your device.</p>
            </div>
          </div>
          <p className="mx-auto mt-4 max-w-5xl px-4 text-xs text-muted-foreground lg:px-8">Local inference and BYOK are usage methods, not VEYRA Cloud subscriptions. Hybrid use combines the methods you configure; it does not imply an included cloud allowance.</p>
        </section>

        {checkoutNotice && <div role="status" className="mx-auto mt-6 max-w-5xl rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700">{checkoutNotice}</div>}

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 lg:px-8">
            {countries.length > 0 && (
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor="pricing-region" className="text-sm font-medium text-slate-700">Regional prices and explicitly configured USD offers</label>
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

            {plansLoading && !plans.length && detected ? (
              <div role="status" className="rounded-xl border border-border bg-white p-8 text-center text-sm text-slate-600">Loading configured plans...</div>
            ) : detected && plans.length > 0 ? (
              <>
              {plansSource === 'cache' && cachedAt && <div role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Showing the last verified price retrieved {new Date(cachedAt).toLocaleString()}. It is for reference only; reconnect to confirm the offer before checkout.</div>}
              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const offerKey = `${plan.planId}:${plan.billingInterval}`;
                  const rate = exchangeRate?.rate ?? 1;
                  const isSameCurrency = plan.currency === detected.currency;
                  const convertedAmount = isSameCurrency ? plan.amountCents : Math.round((plan.amountCents * rate) * 100) / 100;
                  const rateInfo = exchangeRate?.rate ? `1 USD = ${exchangeRate.rate.toFixed(4)} ${detected.currency}` : null;
                  return <Card key={offerKey} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{plan.planName}</CardTitle>
                      <CardDescription>{plan.planFamily}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold text-veyra-navy">
                          {formatCurrency(convertedAmount, plan.currency)}
                        </span>
                        <span className="text-sm text-muted-foreground">/{plan.billingInterval}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {isSameCurrency
                          ? 'Regional price'
                          : `Converted from USD at rate ${exchangeRate?.rate?.toFixed(4)}. ${exchangeRate?.isLive ? '' : 'Uses cached rate — may be stale.'}`}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        disabled={!plan.isAvailable || plansSource !== 'live' || checkoutPlanId === offerKey}
                        onClick={() => startCheckout(plan)}
                        className="w-full"
                      >
                        {checkoutPlanId === offerKey
                          ? 'Connecting to checkout…'
                          : plansSource !== 'live'
                            ? 'Price needs verification'
                            : session?.accessToken
                            ? 'Continue to checkout'
                            : 'Sign in to continue'}
                      </Button>
                    </CardFooter>
                  </Card>;
                })}
              </div>
              </>
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
