import { API_PATHS } from './endpoints';
import { VeyraApiError, normalizeError, isAuthError } from './errors';
import { appUrl, getTrustedRedirectOrigins } from '@/lib/env';

export type AuthTokenGetter = () => string | null | undefined;
export type AuthTokenSetter = (token: string | null) => void;

/**
 * Typed Veyra Platform client for the Website.
 *
 * - Base URL configured via env (never secrets).
 * * Attaches Supabase JWT as `Authorization: Bearer <token>` on authenticated calls.
 * - Normalizes Platform error responses into VeyraApiError.
 * - Supports request cancellation via AbortController.
 * - Safe retry: only idempotent GET requests are retried (never POST/PUT/DELETE/credit/payment mutations).
 * - Adds X-Request-Id correlation header for tracing.
 * - Never stores or leaks tokens.
 */

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  auth?: boolean;        // whether to attach the JWT (default true)
  idempotent?: boolean;  // whether safe to retry (GET only)
  signal?: AbortSignal;
  retries?: number;
}

interface ClientOptions {
  baseUrl: string;
  getToken: AuthTokenGetter;
  onTokenExpired?: () => boolean | Promise<boolean>;
  onUnauthenticated?: () => void;
}

const DEFAULT_RETRIES = 2;
const RETRY_BACKOFF_MS = 400;

export class VeyraPlatformClient {
  private baseUrl: string;
  private getToken: AuthTokenGetter;
  private onTokenExpired?: () => boolean | Promise<boolean>;
  private onUnauthenticated?: () => void;

  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.getToken = options.getToken;
    this.onTokenExpired = options.onTokenExpired;
    this.onUnauthenticated = options.onUnauthenticated;
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown,
    opts: { auth?: boolean; idempotent?: boolean; signal?: AbortSignal; retries?: number; headers?: Record<string, string> } = {},
  ): Promise<T> {
    const {
      auth = true,
      idempotent = false,
      signal,
      retries = DEFAULT_RETRIES,
      headers: additionalHeaders,
    } = opts;

    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-Id': crypto.randomUUID?.() ?? String(Date.now()),
      ...additionalHeaders,
    };

    // Attach Supabase JWT for authenticated calls. Token is never logged or exposed.
    if (auth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const fetchWithRetry = async (attempt: number): Promise<T> => {
      let res: Response;
      try {
        res = await fetch(url, {
          method,
          headers: { ...headers },
          body: body ? JSON.stringify(body) : undefined,
          signal,
        });
      } catch (err) {
        // Network failure — retry only if idempotent and attempts remain
        if (attempt < retries && idempotent) {
          await sleep(RETRY_BACKOFF_MS * (attempt + 1));
          return fetchWithRetry(attempt + 1);
        }
        throw normalizeError(err);
      }

      // Successful parse
      if (res.ok) {
        try {
          return (await res.json()) as T;
        } catch {
          return {} as T;
        }
      }

      // Error response — parse the Platform error envelope
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      const error: VeyraApiError = normalizeError(data);

      // Auth errors: surface once; caller handles redirect/logout
      if (isAuthError(error)) {
        if (attempt === 0 && auth && this.onTokenExpired) {
          const refreshed = await this.onTokenExpired();
          const token = this.getToken();
          if (refreshed && token) {
            headers.Authorization = `Bearer ${token}`;
            return fetchWithRetry(attempt + 1);
          }
        }
        if (attempt === 0 && auth) {
          this.onUnauthenticated?.();
        }
        throw error;
      }

      // 429 rate limit — retry if idempotent and attempts remain
      if (error.status === 429 && attempt < retries && idempotent) {
        await sleep(RETRY_BACKOFF_MS * (attempt + 1));
        return fetchWithRetry(attempt + 1);
      }

      throw error;
    };

    return fetchWithRetry(0);
  }

  /* ========================================================================
   * Authentication
   * ======================================================================== */

  async register(email: string, password: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      user: { id: string; email: string; emailConfirmed: boolean };
    }>('POST', API_PATHS.authRegister, { email, password }, { auth: false });
  }

  async login(email: string, password: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      user: { id: string; email: string; emailConfirmed: boolean };
    }>('POST', API_PATHS.authLogin, { email, password }, { auth: false });
  }

  async logout() {
    return this.request<{ ok: boolean; requestId: string }>('POST', API_PATHS.authLogout);
  }

  async refresh(refreshToken: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      user: { id: string; email: string; emailConfirmed: boolean };
    }>('POST', API_PATHS.authRefresh, { refreshToken }, { auth: false });
  }

  async passwordRecovery(email: string) {
    return this.request<{ ok: boolean; requestId: string }>(
      'POST',
      API_PATHS.authPasswordRecovery,
      { email },
      { auth: false, headers: { Origin: appUrl } },
    );
  }

  async getProfile() {
    return this.request<{
      ok: boolean;
      requestId: string;
      profile: {
        id: string;
        email: string;
        displayName: string | undefined;
        locale: string;
        status: string;
        createdAt: string;
      };
    }>('GET', API_PATHS.authMe);
  }

  async updateProfile(body: { displayName?: string; locale?: string }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      profile: {
        id: string;
        email: string;
        displayName: string | undefined;
        locale: string;
        status: string;
        createdAt: string;
      };
    }>('PATCH', API_PATHS.authMe, body);
  }

  /* ========================================================================
   * OAuth (Google / GitHub)
   * ======================================================================== */

  async getOAuthProviders() {
    return this.request<{
      ok: boolean;
      requestId: string;
      providers: Array<{ provider: 'google' | 'github'; configured: boolean }>;
    }>('GET', API_PATHS.authOAuthProviders, undefined, { auth: false });
  }

  async oauthAuthorize(body: { provider: 'google' | 'github'; redirectTo?: string }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      provider: 'google' | 'github';
      authorizationUrl: string;
      state: string;
    }>('POST', API_PATHS.authOAuthAuthorize, body, { auth: false });
  }

  async getDesktopAuthRequest(transactionId: string) {
    return this.request<{ ok: true; requestId: string; devicePublicKey: string; expiresAt: string }>(
      'GET', `/api/v1/auth/desktop/transactions/${encodeURIComponent(transactionId)}/browser`, undefined,
      { auth: false, idempotent: true },
    );
  }

  async authorizeDesktopAuth(transactionId: string, sessionEnvelope: {
    version: 1; ephemeralPublicKey: string; iv: string; tag: string; ciphertext: string;
  }) {
    return this.request<{ ok: true; requestId: string; authorized: true }>(
      'POST', `/api/v1/auth/desktop/transactions/${encodeURIComponent(transactionId)}/authorize`,
      { sessionEnvelope },
    );
  }

  async oauthCallback(body: {
    provider: 'google' | 'github';
    code: string;
    state: string;
    redirectTo?: string;
  }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
      user: {
        id: string;
        email: string;
        emailConfirmed: boolean;
        provider: 'google' | 'github';
        isNewUser: boolean;
      };
    }>('POST', API_PATHS.authOAuthCallback, body, { auth: false });
  }

  async oauthLink(body: { provider: 'google' | 'github'; code: string; state: string }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      provider: 'google' | 'github';
      linked: boolean;
    }>('POST', API_PATHS.authOAuthLink, body);
  }

  /* ========================================================================
   * Devices
   * ======================================================================== */

  async registerDevice(body: {
    installationId: string;
    deviceName?: string;
    platform?: 'windows' | 'macos' | 'linux';
  }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      device: {
        id: string;
        installationId: string;
        deviceName: string | undefined;
        platform: string | undefined;
        isAuthorized: boolean;
        isRevoked: boolean;
        lastSeenAt: string | undefined;
        createdAt: string;
      };
      deviceCredentialHash: string;
    }>('POST', API_PATHS.devicesRegister, body);
  }

  async listDevices() {
    return this.request<{
      ok: boolean;
      requestId: string;
      devices: Array<{
        id: string;
        installationId: string;
        deviceName: string | undefined;
        platform: string | undefined;
        isAuthorized: boolean;
        isRevoked: boolean;
        lastSeenAt: string | undefined;
        createdAt: string;
      }>;
    }>('GET', API_PATHS.devicesList);
  }

  async authorizeDevice(deviceId: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      device: {
        id: string;
        installationId: string;
        deviceName: string | undefined;
        platform: string | undefined;
        isAuthorized: boolean;
        isRevoked: boolean;
        lastSeenAt: string | undefined;
        createdAt: string;
      };
    }>('PATCH', API_PATHS.devicesAuthorize(deviceId));
  }

  async revokeDevice(deviceId: string) {
    return this.request<{ ok: boolean; requestId: string }>('DELETE', API_PATHS.devicesRevoke(deviceId));
  }

  async updateDeviceLastSeen(deviceId: string) {
    return this.request<{ ok: boolean; requestId: string }>(
      'PATCH',
      API_PATHS.devicesLastSeen(deviceId),
    );
  }

  async replaceDevice(body: {
    installationId: string;
    deviceName?: string;
    platform?: string;
  }, deviceId: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      device: {
        id: string;
        installationId: string;
        deviceName: string | undefined;
        platform: string | undefined;
        isAuthorized: boolean;
        isRevoked: boolean;
        lastSeenAt: string | undefined;
        createdAt: string;
      };
      deviceCredentialHash: string;
    }>('POST', API_PATHS.devicesReplace(deviceId), body);
  }

  async revokeDeviceSessions(deviceId: string) {
    return this.request<{ ok: boolean; requestId: string }>(
      'POST',
      API_PATHS.devicesRevokeSessions(deviceId),
    );
  }

  /* ========================================================================
   * Entitlements
   * ======================================================================== */

  async checkEntitlement(capability: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      capability: string;
      entitled: boolean;
      reason: string | undefined;
      expiresAt: string | undefined;
    }>('POST', API_PATHS.entitlementsCheck, { capability });
  }

  async listEntitlements() {
    return this.request<{
      ok: boolean;
      requestId: string;
      entitlements: Array<{
        capability: string;
        entitled: boolean;
        reason: string | undefined;
        expiresAt: string | undefined;
      }>;
    }>('GET', API_PATHS.entitlementsList);
  }

  async getEntitlementSnapshot() {
    return this.request<{
      ok: boolean;
      requestId: string;
      snapshot: string;
      expiresAt: string;
    }>('POST', API_PATHS.entitlementsSnapshot);
  }

  async verifyEntitlementSnapshot(snapshot: string) {
    return this.request<{
      ok: true;
      requestId: string;
      valid: boolean;
      payload?: {
        userId: string;
        entitlements: Array<{ capability: string; entitled: boolean }>;
        expiresAt: string;
      };
      reason: string | undefined;
    }>('POST', API_PATHS.entitlementsSnapshotVerify, { snapshot }, { auth: false });
  }

  /* ========================================================================
   * Plans
   * ======================================================================== */

  async listPlans() {
    return this.request<{
      ok: boolean;
      requestId: string;
      plans: Array<{
        id: string;
        name: string;
        family: 'local' | 'hybrid' | 'cloud';
        description: string | undefined;
        billingInterval: 'monthly' | 'yearly';
        priceCents: number;
        currency: string;
        features: Record<string, boolean>;
        deviceLimit: number;
        isActive: boolean;
        isPublished: boolean;
        isDevFixture: boolean;
        cloudAiMonthlyCostLimitCents: number | null;
        createdAt: string;
      }>;
    }>('GET', API_PATHS.plansList);
  }

  async getPlan(planId: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      plan: {
        id: string;
        name: string;
        family: 'local' | 'hybrid' | 'cloud';
        description: string | undefined;
        billingInterval: 'monthly' | 'yearly';
        priceCents: number;
        currency: string;
        features: Record<string, boolean>;
        deviceLimit: number;
        isActive: boolean;
        isPublished: boolean;
        isDevFixture: boolean;
        cloudAiMonthlyCostLimitCents: number | null;
        createdAt: string;
      };
    }>('GET', API_PATHS.plansGet(planId));
  }

  async updateCloudPlanCostLimit(planId: string, monthlyLimitCents: number | null) {
    return this.request<{ ok: true; requestId: string; planId: string; monthlyLimitCents: number | null }>(
      'PUT', `/api/v1/admin/plans/${encodeURIComponent(planId)}/cloud-cost-limit`, { monthlyLimitCents },
    );
  }

  /* ========================================================================
   * Pricing (country-aware)
   * ======================================================================== */

  async listPricingCountries() {
    return this.request<{
      ok: boolean;
      requestId: string;
      countries: Array<{
        country: string;
        countryName: string;
        currency: string;
        currencySymbol: string;
        currencyExponent: number;
        isSupported: boolean;
      }>;
    }>('GET', API_PATHS.pricingCountries, undefined, { auth: false });
  }

  async getPlanPricing(country: string, currency: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      country: string;
      currency: string;
      currencySymbol: string;
      currencyExponent: number;
      plans: Array<{
        planId: string;
        planName: string;
        planFamily: string;
        description?: string;
        currency: string;
        amountCents: number;
        billingInterval: 'monthly' | 'yearly';
        isAvailable: boolean;
      }>;
    }>('GET', `${API_PATHS.pricingPlans}?country=${encodeURIComponent(country)}&currency=${encodeURIComponent(currency)}`, undefined, { auth: false });
  }

  async detectCountry() {
    return this.request<{
      ok: boolean;
      requestId: string;
      country: string;
      currency: string;
      currencySymbol: string;
      detectedBy: 'user_preference' | 'geolocation' | 'default';
    }>('GET', API_PATHS.pricingDetect);
  }

  /* ========================================================================
   * Subscriptions
   * ======================================================================== */

  async getCurrentSubscription() {
    return this.request<{
      ok: boolean;
      requestId: string;
      subscription: {
        id: string;
        planId: string;
        planName: string;
        billingInterval: 'monthly' | 'yearly';
        status: string;
        currentPeriodStart: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
        canceledAt: string | undefined;
        trialStart: string | undefined;
        trialEnd: string | undefined;
        createdAt: string;
        updatedAt: string;
      } | null;
    }>('GET', API_PATHS.subscriptionsCurrent);
  }

  async createSubscription(body: {
    planId: string;
    billingInterval: 'monthly' | 'yearly';
    paymentMethodId?: string;
  }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      subscription: {
        id: string;
        planId: string;
        billingInterval: 'monthly' | 'yearly';
        status: string;
        currentPeriodStart: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
        createdAt: string;
        updatedAt: string;
      };
    }>('POST', API_PATHS.subscriptionsCreate, body);
  }

  async cancelSubscription(body: { subscriptionId: string; atPeriodEnd?: boolean }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      subscription: {
        id: string;
        status: string;
        cancelAtPeriodEnd: boolean;
        canceledAt: string | undefined;
      };
    }>('POST', API_PATHS.subscriptionsCancel, body);
  }

  async reactivateSubscription(subscriptionId: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      subscription: {
        id: string;
        status: string;
        cancelAtPeriodEnd: boolean;
      };
    }>('POST', API_PATHS.subscriptionsReactivate, { subscriptionId });
  }

  /* ========================================================================
   * Payments
   * ======================================================================== */

  async createCheckoutSession(body: {
    planId: string;
    billingInterval: 'monthly' | 'yearly';
    currency: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      checkoutUrl: string;
      checkoutSessionId: string;
    }>('POST', API_PATHS.paymentsCheckout, body);
  }

  async listPaymentHistory() {
    return this.request<{
      ok: boolean;
      requestId: string;
      transactions: Array<{
        id: string;
        subscriptionId?: string;
        amountCents: number;
        currency: string;
        status: 'pending' | 'succeeded' | 'failed' | 'refunded' | 'disputed';
        paymentDate: string;
      }>;
    }>('GET', API_PATHS.paymentsHistory, undefined, { idempotent: true });
  }

  /* ========================================================================
   * Credits
   * ======================================================================== */

  async getCreditBalance() {
    return this.request<{
      ok: boolean;
      requestId: string;
      balance: { balanceCents: number; currency: string };
    }>('GET', API_PATHS.creditsBalance);
  }

  async listUsageHistory() {
    return this.request<{
      ok: boolean;
      requestId: string;
      usage: Array<{
        id: string;
        userId: string;
        modelId: string;
        capability: string;
        executionMode: string;
        billingOwner: string;
        tokensInput?: number;
        tokensOutput?: number;
        audioSeconds?: number;
        ttsCharacters?: number;
        visionImages?: number;
        costCents: number;
        creditsUsed: number;
        createdAt: string;
      }>;
    }>('GET', API_PATHS.usageHistory, undefined, { idempotent: true });
  }

  async getCloudAllowance() {
    return this.request<{
      ok: true;
      requestId: string;
      allowance: {
        entitled: boolean;
        reason?: string;
        limitCents: number | null;
        usedCents: number;
        remainingCents: number | null;
        percentUsed: number | null;
        periodStart: string | null;
        periodEnd: string | null;
      };
    }>('GET', '/api/v1/usage/cloud-allowance', undefined, { idempotent: true });
  }

  async reserveCredits(body: {
    amountCents: number;
    idempotencyKey: string;
    service?: string;
    referenceId?: string;
  }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      reservationId: string;
      balanceCents: number;
    }>('POST', API_PATHS.creditsReserve, body);
  }

  async settleReservation(reservationId: string) {
    return this.request<{ ok: boolean; requestId: string }>(
      'POST',
      API_PATHS.creditsSettle,
      { reservationId },
    );
  }

  async releaseReservation(reservationId: string) {
    return this.request<{ ok: boolean; requestId: string }>(
      'POST',
      API_PATHS.creditsRelease,
      { reservationId },
    );
  }

  /* ========================================================================
   * Cloud AI
   * ======================================================================== */

  async invokeCloudAI(body: {
    modelId: string;
    capability: string;
    input: string;
    consent: boolean;
    stream?: boolean;
  }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      result: string;
      modelId: string;
      capability: string;
      tokensInput: number | undefined;
      tokensOutput: number | undefined;
      costCents: number;
      creditsUsed: number;
      stream: boolean;
    }>('POST', API_PATHS.aiInvoke, body);
  }

  async listAIModels() {
    return this.request<{
      ok: boolean;
      requestId: string;
      models: Array<{
        id: string;
        modelId: string;
        name: string;
        providerId: string;
        providerName: string;
        contextLimit: number | undefined;
        inputModalities: string[];
        outputModalities: string[];
        supportsVision: boolean;
        supportsAudio: boolean;
        supportsStreaming: boolean;
        supportsStructuredOutput: boolean;
        capabilities: string[];
        isAvailable: boolean;
      }>;
    }>('GET', API_PATHS.aiModels);
  }

  /* ========================================================================
   * Modules / catalogue
   * ======================================================================== */

  async listModules() {
    return this.request<{
      ok: boolean;
      requestId: string;
      modules: Array<{
        id: string;
        moduleId: string;
        name: string;
        description: string | undefined;
        category: string;
        isActive: boolean;
        isDeprecated: boolean;
        deprecationDate: string | undefined;
        createdAt: string;
      }>;
    }>('GET', API_PATHS.modulesList);
  }

  async listModuleVersions(moduleId: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      moduleId: string;
      versions: Array<{
        id: string;
        version: string;
        supportedOs: string[];
        cpuRequirements: string | undefined;
        memoryRequirementsMb: number | undefined;
        gpuRequirements: string | undefined;
        vramRequirementsMb: number | undefined;
        runtimeRequirements: string | undefined;
        capabilityDeclarations: Record<string, boolean>;
        packageSizeBytes: number | undefined;
        packageHashSha256: string | undefined;
        compatibilityConstraints: Record<string, unknown>;
        releaseStatus: string;
        createdAt: string;
      }>;
    }>('GET', API_PATHS.modulesVersions(moduleId));
  }

  /* ========================================================================
   * Downloads
   * ======================================================================== */

  async authorizeDownload(moduleVersionId: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      authorizationToken: string;
      expiresAt: string;
      downloadUrl: string;
    }>('POST', API_PATHS.downloadsAuthorize, { moduleVersionId });
  }

  async verifyDownloadAuthorization(token: string) {
    return this.request<{
      ok: true;
      requestId: string;
      valid: boolean;
      payload?: {
        userId: string;
        entitlements: Array<{ capability: string; entitled: boolean }>;
        expiresAt: string;
      };
      reason: string | undefined;
    }>('POST', API_PATHS.downloadsVerify, { token }, { auth: false });
  }

  async listDownloadAudit() {
    return this.request<{
      ok: boolean;
      requestId: string;
      audits: Array<{
        id: string;
        moduleVersionId: string | undefined;
        downloadedAt: string;
        success: boolean;
        errorMessage: string | undefined;
      }>;
    }>('GET', API_PATHS.downloadsAudit);
  }

  /* ========================================================================
   * Releases / Desktop updater
   * ======================================================================== */

  async checkForUpdate(body: {
    platform: 'windows' | 'macos' | 'linux';
    architecture: 'x64' | 'arm64';
    currentVersion: string;
    channel?: string;
  }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      updateAvailable: boolean;
      release: {
        id: string;
        channelId: string;
        channelIdText: string;
        version: string;
        platform: 'windows' | 'macos' | 'linux';
        architecture: 'x64' | 'arm64';
        minSupportedVersion: string | undefined;
        isMandatory: boolean;
        rolloutPercentage: number;
        releaseNotes: string | undefined;
        isRollbackCompatible: boolean;
        createdAt: string;
      } | undefined;
      assets: Array<{
        id: string;
        assetId: string;
        assetType: 'installer' | 'checksum' | 'signature';
        packageUrl: string;
        packageHashSha256: string;
        packageSizeBytes: number | undefined;
        signedMetadata: string | undefined;
        createdAt: string;
      }>;
    }>('POST', API_PATHS.releasesCheck, body);
  }

  async listReleaseChannels() {
    return this.request<{
      ok: boolean;
      requestId: string;
      channels: Array<{
        id: string;
        channelId: string;
        name: string;
        description: string | undefined;
        isActive: boolean;
        createdAt: string;
      }>;
    }>('GET', API_PATHS.releasesChannels);
  }

  async listReleases() {
    return this.request<{
      ok: boolean;
      requestId: string;
      releases: Array<{
        id: string;
        channelId: string;
        channelIdText: string;
        version: string;
        platform: 'windows' | 'macos' | 'linux';
        architecture: 'x64' | 'arm64';
        minSupportedVersion: string | undefined;
        isMandatory: boolean;
        rolloutPercentage: number;
        releaseNotes: string | undefined;
        isRollbackCompatible: boolean;
        createdAt: string;
      }>;
    }>('GET', API_PATHS.releasesList);
  }

  /* ========================================================================
   * Notifications
   * ======================================================================== */

  async sendTestNotification(body: { to: string; subject: string; body: string }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      messageId: string;
      provider: string;
      isLive: boolean;
    }>('POST', API_PATHS.notificationsTest, body);
  }

  async getNotificationStatus() {
    return this.request<{
      ok: boolean;
      provider: string;
      isLive: boolean;
      liveEmailsEnabled: boolean;
      message: string;
    }>('GET', API_PATHS.notificationsStatus);
  }

  /* ========================================================================
   * Account
   * ======================================================================== */

  async getAccountStatus() {
    return this.request<{
      ok: boolean;
      requestId: string;
      account: {
        id: string;
        email: string;
        status: string;
        locale: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | undefined;
      };
    }>('GET', API_PATHS.accountStatus);
  }

  async requestAccountDeletion(body: { reason?: string; confirmPassword: string }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      accountId: string;
      status: string;
      deletionScheduledAt: string;
      dataRetentionDays: number;
    }>('POST', API_PATHS.accountDeletionRequest, body);
  }

  async requestAccountExport(body: { includeAuditEvents?: boolean; includeUsageRecords?: boolean }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      exportId: string;
      status: string;
      downloadUrl: string | undefined;
      expiresAt: string | undefined;
    }>('POST', API_PATHS.accountExportRequest, body);
  }

  async adminListUserRoles(userId: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      roles: Array<{
        id: string;
        role: string;
        isActive: boolean;
        grantedAt: string;
        grantedBy: string | null;
      }>;
    }>('GET', API_PATHS.accountAdminRolesList(userId));
  }

  async adminAssignRole(body: { userId: string; role: 'admin' | 'support' | 'auditor' | 'billing' }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      userId: string;
      role: string;
      granted: boolean;
    }>('POST', API_PATHS.accountAdminRolesAssign, body);
  }

  async adminRevokeRole(body: { userId: string; role: 'admin' | 'support' | 'auditor' | 'billing' }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      userId: string;
      role: string;
      revoked: boolean;
    }>('POST', API_PATHS.accountAdminRolesRevoke, body);
  }

  /* ========================================================================
   * Admin (role-gated by Platform)
   * ======================================================================== */

  async adminLookupUser(userId: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      user: {
        id: string;
        email: string;
        displayName: string | undefined;
        status: string;
        locale: string;
        createdAt: string;
      };
    }>('GET', API_PATHS.adminLookupUser(userId));
  }

  async adminAdjustCredits(body: {
    userId: string;
    amountCents: number;
    reason: string;
    idempotencyKey: string;
  }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      userId: string;
      amountCents: number;
      newBalance: number;
    }>('POST', API_PATHS.adminAdjustCredits, body);
  }

  async adminRevokeDevice(body: {
    deviceId: string;
    userId: string;
    reason: string;
  }) {
    return this.request<{
      ok: boolean;
      requestId: string;
      deviceId: string;
      userId: string;
    }>('POST', API_PATHS.adminRevokeDevice, body);
  }

  async adminListAuditEvents() {
    return this.request<{
      ok: boolean;
      requestId: string;
      auditEvents: Array<{
        id: string;
        adminUserId: string;
        targetUserId: string | undefined;
        action: string;
        targetType: string | undefined;
        targetId: string | undefined;
        metadata: Record<string, unknown>;
        createdAt: string;
      }>;
    }>('GET', API_PATHS.adminAudit);
  }

  async adminListUsers(page = 1, pageSize = 50) {
    return this.request<{
      ok: boolean;
      requestId: string;
      users: Array<{ id: string; email: string; status: string; locale: string; createdAt: string }>;
      total: number;
      page: number;
      pageSize: number;
    }>('GET', `${API_PATHS.adminListUsers}?page=${page}&pageSize=${pageSize}`);
  }

  async adminGetSubscription(userId: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      subscription: {
        id: string;
        userId: string;
        planId: string;
        status: string;
        currentPeriodStart: string;
        currentPeriodEnd: string;
        cancelAtPeriodEnd: boolean;
      };
    }>('GET', API_PATHS.adminGetSubscription(userId));
  }

  async adminListPayments(page = 1, pageSize = 50) {
    return this.request<{
      ok: boolean;
      requestId: string;
      transactions: Array<{
        id: string;
        subscriptionId: string;
        amountCents: number;
        currency: string;
        status: string;
        paymentDate: string;
      }>;
      total: number;
      page: number;
      pageSize: number;
    }>('GET', `${API_PATHS.adminListPayments}?page=${page}&pageSize=${pageSize}`);
  }

  /* ========================================================================
   * Exchange Rates
   * ======================================================================== */

  async listPricingCountries() {
    return this.request<{
      ok: boolean;
      requestId: string;
      countries: Array<{
        country: string;
        countryName: string;
        currency: string;
        currencySymbol: string;
        currencyExponent: number;
        isSupported: boolean;
      }>;
    }>('GET', API_PATHS.pricingCountries, undefined, { auth: false });
  }

  async getCountryCurrencies(country: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      country: string;
      currencies: Array<{
        country: string;
        countryName: string;
        currency: string;
        currencySymbol: string;
        currencyExponent: number;
        isSupported: boolean;
      }>;
    }>('GET', API_PATHS.pricingCountryCurrencies(country), undefined, { auth: false });
  }

  async getPlanPricing(country: string, currency: string) {
    return this.request<{
      ok: boolean;
      requestId: string;
      country: string;
      currency: string;
      currencySymbol: string;
      currencyExponent: number;
      plans: Array<{
        planId: string;
        planName: string;
        planFamily: string;
        description?: string;
        currency: string;
        amountCents: number;
        billingInterval: 'monthly' | 'yearly';
        isAvailable: boolean;
      }>;
    }>('GET', `${API_PATHS.pricingPlans}?country=${encodeURIComponent(country)}&currency=${encodeURIComponent(currency)}`, undefined, { auth: false });
  }

  async listExchangeRates(baseCurrency = 'USD') {
    return this.request<{
      ok: boolean;
      requestId: string;
      baseCurrency: string;
      rates: Record<string, number>;
      updatedAt: string;
    }>('GET', `${API_PATHS.exchangeRateLatest}?baseCurrency=${encodeURIComponent(baseCurrency)}`, undefined, { auth: false });
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string) {
    return this.request<{
      ok: true;
      requestId: string;
      fromCurrency: string;
      toCurrency: string;
      rate: number;
      timestamp: string;
    }>('GET', `${API_PATHS.exchangeRate}?fromCurrency=${encodeURIComponent(fromCurrency)}&toCurrency=${encodeURIComponent(toCurrency)}`, undefined, { auth: false });
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string) {
    return this.request<{
      ok: true;
      requestId: string;
      amount: number;
      fromCurrency: string;
      toCurrency: string;
      convertedAmount: number;
      rate: number;
      isLive: boolean;
      rateTimestamp: string;
    }>('POST', API_PATHS.exchangeConvert, {
      amount,
      fromCurrency,
      toCurrency,
    }, { auth: false });
  }

  async getHistoricalExchangeRate(fromCurrency: string, toCurrency: string, date: string) {
    return this.request<{
      ok: true;
      requestId: string;
      fromCurrency: string;
      toCurrency: string;
      date: string;
      rate: number;
      timestamp: string;
    }>('GET', `${API_PATHS.exchangeHistorical}?fromCurrency=${encodeURIComponent(fromCurrency)}&toCurrency=${encodeURIComponent(toCurrency)}&date=${encodeURIComponent(date)}`, undefined, { auth: false });
  }

  async adminStats() {
    return this.request<{
      ok: boolean;
      requestId: string;
      stats: {
        totalUsers: number;
        totalSubscriptions: number;
        activeSubscriptions: number;
        totalRevenueCents: number;
        totalCreditsIssued: number;
      };
    }>('GET', API_PATHS.adminStats);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
