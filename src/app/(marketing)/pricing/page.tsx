'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { VeyraPlatformClient } from '@/services/platform/client';
import { userFriendlyMessage, isAuthError, normalizeError } from '@/services/platform/errors';
import { apiBaseUrl } from '@/lib/env';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

function formatCurrency(amount: number, currency: string) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(amount);
}

type PricingPlan = {
  planId: string;
  planName: string;
  planFamily: string;
  description?: string;
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
    (plan.description === undefined || typeof plan.description === 'string') &&
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
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
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
        setError(userFriendlyMessage(normalizeError(err)));
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
        const apiError = normalizeError(err, 'The Platform could not return valid prices for this region.');
        if (!cancelled && !isAuthError(apiError)) {
          setError(cached
            ? 'The Platform is temporarily unavailable. Showing the last verified price; checkout is disabled until the current offer can be confirmed.'
            : userFriendlyMessage(apiError));
        }
      } finally {
        if (!cancelled) setPlansLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [client, detected]);

  useEffect(() => {
    if (!plans.some((plan) => plan.billingInterval === billingInterval) && plans[0]) {
      setBillingInterval(plans[0].billingInterval);
    }
  }, [plans, billingInterval]);

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
        setExchangeRateError(userFriendlyMessage(normalizeError(err, 'Live currency conversion is unavailable.')));
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
      setError(userFriendlyMessage(normalizeError(err, 'Unable to start checkout. Please try again.')));
      setCheckoutPlanId(null);
    }
  };

  const visiblePlans = plans.filter((plan) => plan.billingInterval === billingInterval);
  const hasForeignCurrencyPlans = visiblePlans.some((plan) => plan.currency !== detected?.currency);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
          <div role="status" className="rounded-2xl border border-border bg-white p-8">
            <span className="sr-only">Loading regional pricing</span>
            <div className="h-3 w-28 animate-pulse rounded bg-secondary" />
            <div className="mt-4 h-9 w-2/3 animate-pulse rounded bg-secondary" />
            <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-secondary" />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-56 animate-pulse rounded-xl border border-border bg-background" />
              ))}
            </div>
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
        <section aria-labelledby="pricing-title" className="border-b border-border bg-white py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veyra-indigo">Pricing</p>
            <h1 id="pricing-title" className="mt-3 text-3xl font-bold tracking-tight text-veyra-navy md:text-4xl">
              Simple plans. Honest limits.
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              Prices, offer details, and availability come from the VEYRA Platform. Only published offers appear below.
            </p>
            <div className="mt-7 inline-flex rounded-xl border border-border bg-background p-1" role="group" aria-label="Billing interval">
              {(['monthly', 'yearly'] as const).map((interval) => (
                <button
                  key={interval}
                  type="button"
                  aria-pressed={billingInterval === interval}
                  onClick={() => setBillingInterval(interval)}
                  className={`min-h-10 rounded-lg px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    billingInterval === interval
                      ? 'bg-white text-veyra-navy shadow-sm'
                      : 'text-muted-foreground hover:text-veyra-navy'
                  }`}
                >
                  {interval === 'monthly' ? 'Monthly' : 'Annual'}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="available-plans-title" className="py-12 md:py-16">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            {checkoutNotice && (
              <div role="status" className="mb-6 rounded-xl border border-veyra-design-lavender-200 bg-veyra-design-lavender-50 px-4 py-3 text-sm text-veyra-navy">
                {checkoutNotice}
              </div>
            )}
            {countries.length > 0 && (
              <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label htmlFor="pricing-region" className="text-sm font-semibold text-veyra-navy">
                  Select your billing region
                </label>
                <select
                  id="pricing-region"
                  value={detected ? `${detected.country}:${detected.currency}` : ''}
                  onChange={(event) => {
                    const selected = countries.find((country) => `${country.country}:${country.currency}` === event.target.value);
                    if (selected) setDetected({ country: selected.country, currency: selected.currency, currencySymbol: selected.currencySymbol });
                  }}
                  className="min-h-11 rounded-xl border border-border bg-white px-3 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {countries.map((country) => <option key={`${country.country}:${country.currency}`} value={`${country.country}:${country.currency}`}>{country.countryName} ({country.currency})</option>)}
                </select>
              </div>
            )}
            <div className="mb-6">
              <h2 id="available-plans-title" className="text-2xl font-bold tracking-tight text-veyra-navy">
                Available Cloud plans
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {detected
                  ? `Showing ${billingInterval === 'yearly' ? 'annual' : 'monthly'} offers for ${detected.country}.`
                  : 'Offers are based on the billing region returned by the Platform.'}
              </p>
            </div>
            {error && plans.length > 0 && (
              <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {plansLoading && !plans.length && detected ? (
              <div role="status" className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
                Loading configured plans…
              </div>
            ) : detected && visiblePlans.length > 0 ? (
              <>
              {plansSource === 'cache' && cachedAt && (
                <div role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  Showing the last verified price retrieved {new Date(cachedAt).toLocaleString()}. It is for reference only; reconnect to confirm the offer before checkout.
                </div>
              )}
              {hasForeignCurrencyPlans && !exchangeRate?.rate && exchangeRateError && (
                <div role="status" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  Live currency conversion is unavailable. Offers in a different currency are shown in their published currency.
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visiblePlans.map((plan) => {
                  const offerKey = `${plan.planId}:${plan.billingInterval}`;
                  const isSameCurrency = plan.currency === detected.currency;
                  const canConvert = !isSameCurrency && plan.currency === 'USD' &&
                    typeof exchangeRate?.rate === 'number' && Number.isFinite(exchangeRate.rate) && exchangeRate.rate > 0;
                  const displayCurrency = canConvert ? detected.currency : plan.currency;
                  const displayAmount = plan.amountCents / 100 * (canConvert ? exchangeRate.rate : 1);
                  return <article
                    key={offerKey}
                    className="flex h-full flex-col rounded-2xl border border-border bg-white p-5 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-veyra-indigo">
                          {plan.planFamily} plan
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-veyra-navy">{plan.planName}</h3>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        plan.isAvailable
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        {plan.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">
                        {plan.description}
                      </p>
                    )}
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-3xl font-bold tracking-tight text-veyra-navy">
                        {formatCurrency(displayAmount, displayCurrency)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{plan.billingInterval === 'yearly' ? 'year' : 'month'}
                      </span>
                    </div>
                    <p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground">
                      {isSameCurrency
                        ? 'Published regional price'
                        : canConvert
                          ? `Converted from USD at 1 USD = ${exchangeRate.rate.toFixed(4)} ${detected.currency}.`
                          : `Published in ${plan.currency}; conversion is unavailable.`}
                    </p>
                    <div className="mt-auto border-t border-border pt-5">
                      <Button
                        disabled={!plan.isAvailable || plansSource !== 'live' || checkoutPlanId === offerKey}
                        onClick={() => startCheckout(plan)}
                        className="w-full"
                      >
                        {checkoutPlanId === offerKey
                          ? 'Connecting to checkout…'
                          : !plan.isAvailable
                            ? 'Unavailable'
                          : plansSource !== 'live'
                            ? 'Price needs verification'
                            : session?.accessToken
                            ? 'Continue to checkout'
                            : 'Sign in to continue'}
                      </Button>
                    </div>
                  </article>;
                })}
              </div>
              </>
            ) : plans.length > 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
                <h3 className="text-lg font-semibold text-veyra-navy">
                  No {billingInterval === 'yearly' ? 'annual' : 'monthly'} offers are published for this region
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Try the other billing interval or choose a different supported region. VEYRA does not estimate unpublished prices.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center">
                <h3 className="text-lg font-semibold text-veyra-navy">
                  {error ? 'Regional pricing is unavailable' : detected ? 'No plans are published yet' : 'Choose a supported region'}
                </h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  {error
                    ? error
                    : detected
                      ? 'No Cloud plans are currently available for this region.'
                      : 'The Platform did not return a supported billing region.'}
                </p>
              </div>
              )}
            </div>
          </section>

          <section aria-labelledby="pricing-details-title" className="border-y border-border bg-secondary/40 py-10 md:py-12">
            <div className="mx-auto max-w-5xl px-5 lg:px-8">
              <div className="grid gap-4 md:grid-cols-2">
                <article className="rounded-xl border border-border bg-white p-5 sm:p-6">
                  <h2 id="pricing-details-title" className="font-semibold text-veyra-navy">Plan details</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The public pricing service does not provide feature limits or usage allowances. This page shows only published offer details and does not estimate what a plan includes.
                  </p>
                  <Link href="/features" className="mt-4 inline-flex text-sm font-semibold text-veyra-indigo hover:text-veyra-violet">
                    Explore VEYRA features
                  </Link>
                </article>
                <article className="rounded-xl border border-[#D6CBFF] bg-[#F5F2FF] p-5 sm:p-6">
                  <h2 className="font-semibold text-veyra-navy">Cloud is one way to use VEYRA</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Bring-your-own-provider and local modes are separate from VEYRA Cloud subscriptions. Provider charges and hardware requirements are separate.
                  </p>
                  <Link href="/ai-configuration" className="mt-4 inline-flex text-sm font-semibold text-veyra-indigo hover:text-veyra-violet">
                    Compare AI configuration modes
                  </Link>
                </article>
              </div>
            </div>
          </section>
      </main>
      <Footer />
    </div>
  );
}
