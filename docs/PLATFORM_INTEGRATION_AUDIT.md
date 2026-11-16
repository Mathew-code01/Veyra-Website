> **Source recheck — 2026-11-15:** Older sections below are historical. Current source contains `GET /api/v1/usage` and `GET /api/v1/payments/history`, both used by Website pages. The current Platform route tree and configured remote services must be checked before relying on older claims about missing routes or live provider configuration.
# Veyra Website — Platform Integration Audit

This document records the Website/Platform integration baseline. Older findings below are historical where superseded by the dated verification addendum. Endpoint existence is verified from source; live external configuration and production data are not inferred from local tests.

Endpoints marked "verified" exist in route implementations. Recheck dated follow-ups before relying on any older "missing" claim.

## Source of truth

- Platform API base (local dev): `http://localhost:3000`
- Website base (local dev): `http://localhost:5173`
- API version: `v1` (all routes under `/api/v1`)
- Platform repo: `C:\Users\MATTHEW\Desktop\veyra-platform`
- Website repo: `C:\Users\MATTHEW\Desktop\veyra-website`

## Follow-up verification (2026-11-15)

- Customer usage history is implemented at `GET /api/v1/usage`; the authenticated route derives the user from the verified bearer token and the service filters records to that user.
- Customer payment history is implemented at `GET /api/v1/payments/history`; it uses the authenticated Supabase user client and returns that user's RLS-scoped transactions.
- The Website credits and billing pages call these endpoints through `VeyraPlatformClient`. This verifies source wiring, not a live Supabase deployment or presence of production rows.
- The Website dev server is configured for port `5173`. Platform's code default for `ALLOWED_ORIGINS` only includes `http://localhost:3000`; configure the Website origin in the Platform environment for local browser calls. The local `.env` was not inspected.
- OAuth provider state, remote plan seeding, payment-provider credentials, email, object storage, and installer assets require deployment-level verification. Mock payments remain non-production; no live payment or provider request was made.
- Current verification: Website typecheck/lint/tests passed (21 tests); Platform API typecheck/build passed and API tests passed (118 before the focused reconciliation authorization regression tests).

## Authentication model (verified)

The Website calls Platform auth endpoints from Next.js server actions. The Platform authenticates against Supabase Auth and returns session tokens; the Website stores them in cookies and attaches the access token to authenticated Platform requests. The Platform verifies the JWT and derives `user_id` from the token, never from a client-supplied field. The `@supabase/supabase-js` package in the Website is not evidence that the Website itself is the active identity authority.

- Service-role key is server-only; never exposed to the website or browser bundle.
- The website must never store tokens in localStorage.
- Session refresh: `POST /api/v1/auth/refresh` (requires Bearer token + `refreshToken` body).
- Logout: `POST /api/v1/auth/logout` (requires Bearer token).

## Verified endpoints

All endpoints below are verified present in `apps/api/src/modules/*/auth.routes.ts` etc. (route files were read directly). All require `Authorization: Bearer <token>` unless marked "No auth".

### Auth (module: auth)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/auth/register` | POST | No | `{ email, password }` | `{ ok, requestId, accessToken, refreshToken, expiresIn, user }` | Yes |
| `/api/v1/auth/login` | POST | No | `{ email, password }` | `{ ok, requestId, accessToken, refreshToken, expiresIn, user }` | Yes |
| `/api/v1/auth/logout` | POST | Bearer | none | `{ ok, requestId }` | Yes |
| `/api/v1/auth/refresh` | POST | Bearer | `{ refreshToken }` | `{ ok, requestId, accessToken, refreshToken, expiresIn, user }` | Yes |
| `/api/v1/auth/password-recovery` | POST | No | `{ email }` | `{ ok, requestId }` (always success — anti-enumeration) | Yes |
| `/api/v1/auth/me` | GET | Bearer | none | `{ ok, requestId, profile }` | Yes |
| `/api/v1/auth/me` | PATCH | Bearer | `{ displayName?, locale? }` | `{ ok, requestId, profile }` | Yes |
| `/api/v1/auth/oauth/providers` | GET | No | none | `{ ok, requestId, providers: [{ provider, configured }] }` | Yes |
| `/api/v1/auth/oauth/authorize` | POST | No | `{ provider, redirectTo? }` | `{ ok, requestId, provider, authorizationUrl, state }` | Yes |
| `/api/v1/auth/oauth/callback` | POST | No | `{ provider, code, state, redirectTo? }` | `{ ok, requestId, accessToken, refreshToken, expiresIn, user }` | Yes |
| `/api/v1/auth/oauth/link` | POST | Bearer | `{ provider, code, state }` | `{ ok, requestId, provider, linked }` | Yes |

**OAuth note:** The OAuth routes exist in code but gate on `isOAuthProviderConfigured(provider)`, which returns false unless Google/GitHub are configured in Supabase. The Platform production-readiness audit confirms OAuth is not yet configured. The website must treat OAuth as optionally available and gracefully degrade when `providers` returns `configured: false`.

### Devices (module: devices)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/devices/register` | POST | Bearer | `{ installationId, deviceName?, platform? }` | `{ ok, requestId, device, deviceCredentialHash }` | Yes |
| `/api/v1/devices` | GET | Bearer | none | `{ ok, requestId, devices: [...] }` | Yes |
| `/api/v1/devices/:deviceId/authorize` | PATCH | Bearer | none | `{ ok, requestId, device }` | Yes |
| `/api/v1/devices/:deviceId` | DELETE | Bearer | none | `{ ok, requestId, device }` | Yes |
| `/api/v1/devices/:deviceId/last-seen` | PATCH | Bearer | none | `{ ok, requestId }` | Yes |
| `/api/v1/devices/:deviceId/replace` | POST | Bearer | `{ installationId, deviceName?, platform? }` | `{ ok, requestId, device, deviceCredentialHash }` | Yes |
| `/api/v1/devices/:deviceId/sessions/revoke` | POST | Bearer | none | `{ ok, requestId }` | Yes |

### Entitlements (module: entitlements)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/entitlements/check` | POST | Bearer | `{ capability }` | `{ ok, requestId, capability, entitled, reason?, expiresAt? }` | Yes |
| `/api/v1/entitlements` | GET | Bearer | none | `{ ok, requestId, entitlements: [...] }` | Yes |
| `/api/v1/entitlements/snapshot` | POST | Bearer | none | `{ ok, requestId, snapshot, expiresAt }` | Yes |
| `/api/v1/entitlements/snapshot/verify` | POST | No | `{ snapshot }` | `{ ok, requestId, valid, payload?, reason? }` | Yes |

Valid capabilities (verified in `entitlements.service.ts` `CAPABILITIES`): `liveInterview`, `practice`, `localInference`, `cloudInference`, `vision`, `documentAnalysis`, `cloudBackup`, `advancedModels`, `priorityCloudExecution`.

### Plans (module: plans)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/plans` | GET | Bearer | none | `{ ok, requestId, plans: [...] }` | Yes |
| `/api/v1/plans/:planId` | GET | Bearer | none | `{ ok, requestId, plan }` | Yes |

**Pricing note:** The plans table is populated with dev fixtures locally but the production-readiness audit reports no plans seeded remotely. The website must handle an empty plan list and show a forthcoming/unavailable pricing state rather than inventing prices.

### Subscriptions (module: subscriptions)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/subscriptions/current` | GET | Bearer | none | `{ ok, requestId, subscription: {...} \| null }` | Yes |
| `/api/v1/subscriptions` | POST | Bearer | `{ planId, billingInterval, paymentMethodId? }` | `{ ok, requestId, subscription }` | Yes |
| `/api/v1/subscriptions/cancel` | POST | Bearer | `{ subscriptionId, atPeriodEnd? }` | `{ ok, requestId, subscription }` | Yes |
| `/api/v1/subscriptions/reactivate` | POST | Bearer | `{ subscriptionId }` | `{ ok, requestId, subscription }` | Yes |

### Payments (module: payments)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/payments/checkout` | POST | Bearer | `{ planId, billingInterval, successUrl, cancelUrl }` | `{ ok, requestId, checkoutUrl, checkoutSessionId }` | Yes |
| `/api/v1/payments/webhook` | POST | No (signature verified) | Paystack webhook payload | `{ ok, requestId, processed, reason? }` | Yes |
| `/api/v1/payments/reconcile` | POST | Bearer | none | `{ ok, requestId, reconciled, subscriptions }` | Yes |

**Payment note:** Uses a mock payment provider by default. Paystack is configured via env but no real Paystack adapter is wired (per production-readiness audit). Webhook signature verification is a mock that returns true. The website must never mark a payment successful based on browser state; it trusts Platform payment state only.

### Credits (module: credits)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/credits/balance` | GET | Bearer | none | `{ ok, requestId, balance: { balanceCents, currency } }` | Yes |
| `/api/v1/credits/reserve` | POST | Bearer | `{ amountCents, idempotencyKey, service?, referenceId? }` | `{ ok, requestId, reservationId, balanceCents }` | Yes |
| `/api/v1/credits/settle` | POST | Bearer | `{ reservationId }` | `{ ok, requestId }` | Yes |
| `/api/v1/credits/release` | POST | Bearer | `{ reservationId }` | `{ ok, requestId }` | Yes |

### Modules / Module catalogue (module: modules)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/modules` | GET | Bearer | none | `{ ok, requestId, modules: [...] }` | Yes |
| `/api/v1/modules/:moduleId/versions` | GET | Bearer | none | `{ ok, requestId, moduleId, versions: [...] }` | Yes |

### Downloads (module: downloads)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/downloads/authorize` | POST | Bearer | `{ moduleVersionId }` | `{ ok, requestId, authorizationToken, expiresAt, downloadUrl }` | Yes |
| `/api/v1/downloads/authorize/verify` | POST | No | `{ token }` | `{ ok, requestId, valid, packageHash }` | Yes |
| `/api/v1/downloads/authorize/mark-used` | POST | No | `{ token }` | `{ ok, requestId }` | Yes |
| `/api/v1/downloads/audit` | GET | Bearer | none | `{ ok, requestId, audits: [...] }` | Yes |

### Releases / Desktop updater (module: releases)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/releases/check` | POST | Bearer | `{ platform, architecture, currentVersion, channel? }` | `{ ok, requestId, updateAvailable, release?, assets: [...] }` | Yes |
| `/api/v1/releases/channels` | GET | Bearer | none | `{ ok, requestId, channels: [...] }` | Yes |
| `/api/v1/releases` | GET | Bearer | none | `{ ok, requestId, releases: [...] }` | Yes |

**Release note:** Release assets reference object storage URLs (Cloudflare R2 proposed) but no storage adapter is implemented. The website must only display installer downloads verified through this API; no fake download URLs.

### AI gateway (module: ai-gateway)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/ai/invoke` | POST | Bearer | `{ modelId, capability, input, consent, stream?, executionMode?, ... }` | `{ ok, requestId, result, modelId, capability, costCents, creditsUsed, ... }` | Yes |
| `/api/v1/ai/models` | GET | Bearer | none | `{ ok, requestId, models: [...] }` | Yes |

**AI note:** Returns mock model info (`mock-text-small`, `mock-text-large`, `mock-vision`) with a `mock` provider. No real inference provider. The website must not claim live AI features are backed by a real provider.

### Pricing (module: pricing)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/pricing/countries` | GET | No | none | `{ ok, requestId, countries: [...] }` | Yes |
| `/api/v1/pricing/countries/:country/currencies` | GET | No | none | `{ ok, requestId, country, currencies: [...] }` | Yes |
| `/api/v1/pricing/plans` | GET | Bearer | `?country=&currency=` | `{ ok, requestId, country, currency, plans: [...] }` | Yes |
| `/api/v1/pricing/detect` | GET | Bearer | none | `{ ok, requestId, country, currency, currencySymbol, detectedBy }` | Yes |

### Notifications (module: notifications)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/notifications/notify/test` | POST | Bearer | `{ to, subject, body }` | `{ ok, requestId, messageId, provider, isLive }` | Yes |
| `/api/v1/notifications/status` | GET | No | none | `{ ok, provider, isLive, liveEmailsEnabled, message }` | Yes |

**Notification note:** Uses a mock email provider (`isLive: false`, `liveEmailsEnabled: false`, message: "Mock email provider active. No real emails sent."). The website must not claim an email was sent when only the mock adapter is configured.

### Backups / Consent (module: backups)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/backups/:category` | GET | Bearer | none | `{ ok, requestId, backup }` | Yes |
| `/api/v1/backups/:category` | POST | Bearer | `{ encryptionEnabled?, retentionDays?, status? }` | `{ ok, requestId, backup }` | Yes |
| `/api/v1/backups/:category` | DELETE | Bearer | none | `{ ok, requestId }` | Yes |
| `/api/v1/consent/:category` | GET | Bearer | none | `{ ok, requestId, consent }` | Yes |
| `/api/v1/consent/:category` | POST | Bearer | `{ consentGiven }` | `{ ok, requestId, consent }` | Yes |

### Account (module: account)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/account/status` | GET | Bearer | none | `{ ok, requestId, account }` | Yes |
| `/api/v1/account/deletion/request` | POST | Bearer | `{ reason?, confirmPassword }` | `{ ok, requestId, accountId, status, deletionScheduledAt, dataRetentionDays }` | Yes |
| `/api/v1/account/export/request` | POST | Bearer | `{ includeAuditEvents?, includeUsageRecords? }` | `{ ok, requestId, exportId, status, downloadUrl?, expiresAt? }` | Yes |
| `/api/v1/account/admin/users/:userId/roles` | GET | Bearer + admin | none | `{ ok, requestId, roles: [...] }` | Yes |
| `/api/v1/account/admin/roles/assign` | POST | Bearer + admin | `{ userId, role }` | `{ ok, requestId, userId, role, granted }` | Yes |
| `/api/v1/account/admin/roles/revoke` | POST | Bearer + admin | `{ userId, role }` | `{ ok, requestId, userId, role, revoked }` | Yes |

Valid roles: `admin`, `support`, `auditor`, `billing`.

### Admin (module: admin)

| Endpoint | Method | Auth | Request | Response | Verified |
|----------|--------|------|---------|----------|----------|
| `/api/v1/admin/users/:userId` | GET | Bearer + admin | none | `{ ok, requestId, user }` | Yes |
| `/api/v1/admin/credits/adjust` | POST | Bearer + billing | `{ userId, amountCents, reason, idempotencyKey }` | `{ ok, requestId, userId, amountCents, newBalance }` | Yes |
| `/api/v1/admin/devices/revoke` | POST | Bearer + admin | `{ deviceId, userId, reason }` | `{ ok, requestId, deviceId, userId }` | Yes |
| `/api/v1/admin/audit` | GET | Bearer + auditor | none | `{ ok, requestId, auditEvents: [...] }` | Yes |
| `/api/v1/admin/users` | GET | Bearer + admin | `?page=&pageSize=` | `{ ok, requestId, users, total, page, pageSize }` | Yes |
| `/api/v1/admin/users/:userId/subscription` | GET | Bearer + admin | none | `{ ok, requestId, subscription }` | Yes |
| `/api/v1/admin/payments` | GET | Bearer + billing | `?page=&pageSize=` | `{ ok, requestId, transactions, total, page, pageSize }` | Yes |
| `/api/v1/admin/stats` | GET | Bearer + admin | none | `{ ok, requestId, stats }` | Yes |

**Admin note:** Admin routes enforce server-side roles (`admin`, `billing`, `auditor`). The production-readiness audit reports no admin roles are seeded in the database, so admin operations will return 403 until roles exist. The website must not grant admin access based on email or frontend state.

### Health / Version (module: routes/health)

| Endpoint | Method | Auth | Response | Verified |
|----------|--------|------|----------|----------|
| `/api/v1/health` | GET | No | `{ ok, status, service, version, environment, uptimeMs, dependencies, requestId }` | Yes |
| `/api/v1/ready` | GET | No | `{ ok, status, service, version, environment, uptimeMs, dependencies, requestId }` | Yes |
| `/api/v1/version` | GET | No | `{ ok, service, version, apiVersion, requestId }` | Yes |

## Missing / unimplemented capabilities

The following capabilities referenced in the product requirements do **not** have verified Platform endpoints and must not be faked:

1. **Usage history / metering** — `apps/api/src/modules/usage/usage.routes.ts` is empty. No endpoint exists to list per-user AI usage records. The contracts define `AIUsageListResponseSchema` but no route serves it. Backend work required: implement `GET /api/v1/usage` (or equivalent) returning `AIUsageListResponse`.

2. **Billing history / payment transactions (customer-facing)** — No customer-facing endpoint exists to list a user's own payment transactions. Admin has `GET /api/v1/admin/payments` (billing role only). Backend work required: implement customer payment history endpoint.

3. **OAuth (Google/GitHub) configured** — Routes exist but `isOAuthProviderConfigured()` returns false until providers are configured in Supabase. Backend work: configure Google/GitHub OAuth in Supabase Dashboard and set `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`.

4. **Admin roles seeded** — `admin_roles` table exists but has no rows. Backend work: seed admin roles or implement role assignment (chicken-and-egg: first admin must be created via DB/CLI).

5. **Plans seeded remotely** — Plans table empty remotely (dev fixtures only locally). Backend work: seed plans.

6. **Real payment provider** — Mock adapter only. Paystack integration not wired. Backend work: implement Paystack adapter.

7. **Real email provider** — Mock adapter only (`isLive: false`). Backend work: configure SMTP/email provider.

8. **Object storage (R2)** — No storage adapter. Release/download assets reference object storage URLs but none are served. Backend work: implement R2/S3 adapter.

9. **Desktop download assets** — No actual installer packages exist in storage. The website can show the download page but cannot offer verified installer downloads until releases + assets exist.

10. **Interview practice engine (website-based)** — No Platform endpoint supports a website-hosted practice session. Practice is a Desktop capability. The website should link to Desktop download and document practice as a Desktop feature.

11. **Live interview listening/screen capture** — These are Desktop application capabilities (local AI inference, screen understanding). The website must not claim to perform desktop-level listening or screen capture.

## Error response contract (verified)

All Platform errors return a standardized envelope:

```json
{
  "ok": false,
  "requestId": "<string>",
  "error": {
    "code": "<string>",
    "message": "<string>",
    "status": <number>,
    "details": { ... } | undefined
  }
}
```

The website must normalize these into user-facing messages and never display raw `details.stack`, tokens, or internal backend details.

## SDK usage decision

The Platform SDK (`packages/sdk`) lives in the Platform repo and is not published as a consumable package for the Website. The Website will maintain its own typed integration layer under `src/services/platform/` that mirrors the SDK's method signatures and endpoint contracts, importing shared types from the Platform contracts where practical. This avoids duplicating business logic while keeping the Website repo self-contained.

The Website integration layer will:
- Use a single `VeyraPlatformClient` class with base URL config
- Attach the Supabase JWT as `Authorization: Bearer <token>`
- Normalize errors into a `VeyraApiError` type
- Support request cancellation via `AbortController`
- Apply safe retry (idempotent GETs only; never retry POST/PUT/DELETE/credit/payment mutations automatically)
- Add `X-Request-Id` correlation header

## Environment configuration

Website `.env.example` will contain placeholders only:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Platform API base URL (browser-safe) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (browser-safe) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (browser-safe) |
| `NEXT_PUBLIC_APP_URL` | Website public URL |
| `NEXT_PUBLIC_ENABLE_GSAP` | Feature flag for GSAP animations |

No secrets (service-role keys, payment secrets, OAuth secrets) appear in `.env.example` or client code.

## Security controls to implement (website level)

- CSP header via Next.js headers
- Secure cookies (session stored in httpOnly cookie where applicable)
- CSRF protection on state-changing mutations
- OAuth state validation and PKCE handling (delegated to Platform endpoints)
- Trusted redirect allowlist (only relative paths and `NEXT_PUBLIC_APP_URL`)
- Input validation with Zod matching Platform contracts
- No tokens in URLs, logs, analytics, or error messages
- Rate-limit-sensitive UX (retry only safe idempotent operations)
- Generic auth errors (no account enumeration)
- Open redirect prevention

## Integration decisions

| Decision | Rationale |
|----------|-----------|
| Use Supabase Auth client in browser for sign-in | Per `WEBSITE_INTEGRATION.md` and `docs/architecture/website-integration.md` |
| Send Supabase JWT as Bearer token to Platform API | Platform verifies JWT and derives user_id |
| Maintain local typed client mirroring Platform SDK | SDK is in Platform repo, not published; avoids coupling repos |
| Never retry non-idempotent mutations | Prevents double charges / double credit reservation |
| Show unavailable state for missing endpoints | Per product rules: do not fake success |
| OAuth shown only when Platform reports configured provider | Prevents broken social login flows |
| Admin access requires server-side role; never frontend-derived | Platform enforces roles server-side |
| Mock email/payment adapters acknowledged as mock | Do not claim emails sent or payments processed |

## Backend work required (summary)

| # | Capability | Required backend work |
|---|------------|----------------------|
| 1 | Usage history endpoint | Implement `GET /api/v1/usage` returning `AIUsageListResponse` |
| 2 | Customer payment history | Implement customer-facing payment transaction list |
| 3 | OAuth providers | Configure Google/GitHub in Supabase; set env vars |
| 4 | Admin roles | Seed first admin role via DB/CLI |
| 5 | Plans | Seed plans into remote DB |
| 6 | Paystack adapter | Replace mock payment provider |
| 7 | Email provider | Configure SMTP; enable live emails |
| 8 | R2 storage | Implement object storage adapter for release assets |
| 9 | Installer assets | Publish actual desktop installer packages |
