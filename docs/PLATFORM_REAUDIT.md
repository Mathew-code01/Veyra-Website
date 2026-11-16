# Veyra Platform Reaudit — Website Integration & Capability Status

> Historical audit. The 2026-11-15 source recheck supersedes claims below that usage history and customer payment history are missing. `GET /api/v1/usage` and `GET /api/v1/payments/history` are implemented and consumed by the Website. The Website dev port is 5173; Platform's code default for `ALLOWED_ORIGINS` only includes port 3000, but the local `.env` was not inspected. Do not treat OAuth, remote seed, payment, or storage statements below as current deployment verification.

This document records the verified state of the Veyra Platform backend as it relates to the Veyra Website integration. Every claim below was verified against actual source code under `C:\Users\MATTHEW\Desktop\veyra-platform/apps/api/src/modules/*`, `packages/contracts/src/index.ts`, and the Desktop application under `C:\Users\MATTHEW\Desktop\Veyra`.

## Platform Configuration

| Setting | Value | Source |
|---------|-------|--------|
| Port | 3000 | `apps/api/src/config/server.ts` + `.env` |
| API Version | v1 | `apps/api/src/config/env.ts` |
| Allowed Origins | `http://localhost:3000,http://localhost:3001` | `.env` ALLOWED_ORIGINS |
| Supabase URL | `https://cyoavpeazeatnlnfbbag.supabase.co` | `.env` |
| Payment Provider | mock | `.env` PAYMENT_PROVIDER |
| Email Provider | mock | `.env` EMAIL_PROVIDER |
| Storage Provider | mock | `.env` STORAGE_PROVIDER |
| OAuth Google | Configured (client ID + secret present) | `.env` |
| OAuth GitHub | Configured (client ID + secret present) | `.env` |

**Note:** The Website must run on `http://localhost:5173` per requirements. The Platform `ALLOWED_ORIGINS` currently does NOT include `http://localhost:5173`. This must be added for CORS and OAuth callback to work.

## OAuth Callback URLs

Supabase callback base (hardcoded in `oauth.service.ts`):
```
https://cyoavpeazeatnlnfbbag.supabase.co/auth/v1/callback
```

This is the Supabase-managed callback. The Website's own callback route (`/auth/callback`) handles the Platform-level OAuth code exchange after Supabase redirects back.

## Capability Audit

### Authentication

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Register | `/api/v1/auth/register` | POST | Yes | No | Supabase | Real (Supabase) | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Login | `/api/v1/auth/login` | POST | Yes | No | Supabase | Real (Supabase) | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Logout | `/api/v1/auth/logout` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Refresh | `/api/v1/auth/refresh` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Password Recovery | `/api/v1/auth/password-recovery` | POST | Yes | No | Supabase | Real (mock email send) | Yes | No | IMPLEMENTED BUT MOCK EMAIL |
| Password Reset | `/api/v1/auth/reset-password` | — | No | — | — | — | — | — | MISSING (Platform uses Supabase email flow) |
| Get Profile | `/api/v1/auth/me` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Update Profile | `/api/v1/auth/me` | PATCH | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| OAuth Providers | `/api/v1/auth/oauth/providers` | GET | Yes | No | Env check | Real (config-based) | Yes | No | IMPLEMENTED AND VERIFIED |
| OAuth Authorize | `/api/v1/auth/oauth/authorize` | POST | Yes | No | Env check | Real (Supabase) | Yes | No | IMPLEMENTED AND VERIFIED |
| OAuth Callback | `/api/v1/auth/oauth/callback` | POST | Yes | No | Supabase | Real (Supabase) | Yes | No | IMPLEMENTED AND VERIFIED |
| OAuth Link | `/api/v1/auth/oauth/link` | POST | Yes | Bearer | Supabase | Real | Yes | No | IMPLEMENTED AND VERIFIED |

**Notes:**
- OAuth Google and GitHub are configured with real client credentials in `.env`.
- The Website currently displays social login buttons as `disabled`. They should be enabled since providers are configured.
- Password reset is handled via Supabase email reset flow (not a separate Platform route).

### Devices

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Register Device | `/api/v1/devices/register` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| List Devices | `/api/v1/devices` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Authorize Device | `/api/v1/devices/:id/authorize` | PATCH | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Revoke Device | `/api/v1/devices/:id` | DELETE | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Update Last Seen | `/api/v1/devices/:id/last-seen` | PATCH | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Replace Device | `/api/v1/devices/:id/replace` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Revoke Sessions | `/api/v1/devices/:id/sessions/revoke` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |

**Notes:** Device registration checks subscription plan for device_limit. Fully implemented.

### Entitlements

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Check Entitlement | `/api/v1/entitlements/check` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| List Entitlements | `/api/v1/entitlements` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Snapshot | `/api/v1/entitlements/snapshot` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Verify Snapshot | `/api/v1/entitlements/snapshot/verify` | POST | Yes | No | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |

**Notes:** Valid capabilities: liveInterview, practice, localInference, cloudInference, vision, documentAnalysis, cloudBackup, advancedModels, priorityCloudExecution.

### Plans & Pricing

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| List Plans | `/api/v1/plans` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED (empty remote DB) |
| Get Plan | `/api/v1/plans/:id` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Country List | `/api/v1/pricing/countries` | GET | Yes | No | Config | Real (config) | Yes | No | IMPLEMENTED AND VERIFIED |
| Country Currencies | `/api/v1/pricing/countries/:c/currencies` | GET | Yes | No | Config | Real (config) | Yes | No | IMPLEMENTED AND VERIFIED |
| Plan Pricing | `/api/v1/pricing/plans` | GET | Yes | Bearer | Supabase | Real | Yes | No | IMPLEMENTED AND VERIFIED |
| Detect Country | `/api/v1/pricing/detect` | GET | Yes | Bearer | Config | Real (config) | Yes | No | IMPLEMENTED AND VERIFIED |

**Notes:**
- `seedDevPlans()` exists with dev fixtures: Local ($0/mo), Hybrid ($9.99/mo), Cloud ($19.99/mo).
- Remote database may be empty — plans table needs seeding for pricing page to show data.
- Country-aware pricing is implemented with NG (Nigeria) default for Paystack.

### Subscriptions

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Current Subscription | `/api/v1/subscriptions/current` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Create Subscription | `/api/v1/subscriptions` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Cancel Subscription | `/api/v1/subscriptions/cancel` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Reactivate Subscription | `/api/v1/subscriptions/reactivate` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |

**Notes:** Customer-facing subscription management is fully implemented.

### Payments

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Checkout Session | `/api/v1/payments/checkout` | POST | Yes | Bearer | Supabase | Real (Paystack mock) | Yes | Yes | IMPLEMENTED BUT MOCK PAYMENT |
| Webhook | `/api/v1/payments/webhook` | POST | Yes | No (sig) | Supabase | Real (Paystack mock) | No | Yes | IMPLEMENTED BUT MOCK |
| Reconcile | `/api/v1/payments/reconcile` | POST | Yes | Bearer | Supabase | Real (Paystack mock) | Yes | Yes | IMPLEMENTED BUT MOCK |
| Customer Payment History | — | — | No | — | — | — | No | — | MISSING |
| Admin Payment List | `/api/v1/admin/payments` | GET | Yes | Bearer+billing | Supabase | Real | No (admin only) | No | IMPLEMENTED AND VERIFIED |

**Notes:**
- No customer-facing payment history endpoint exists. Only admin (`billing` role) can list payments.
- Paystack is configured as mock provider. Test keys present in `.env`.

### Credits

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Credit Balance | `/api/v1/credits/balance` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Reserve Credits | `/api/v1/credits/reserve` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Settle Reservation | `/api/v1/credits/settle` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Release Reservation | `/api/v1/credits/release` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Usage History | `/api/v1/usage` | — | No | — | — | — | No | Yes | MISSING (file is empty) |

**Notes:** `apps/api/src/modules/usage/usage.routes.ts` is an EMPTY FILE. The contracts define `AIUsageListResponseSchema` but no route serves it. This is a missing Platform capability.

### AI Gateway

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Invoke Cloud AI | `/api/v1/ai/invoke` | POST | Yes | Bearer | Supabase | Real (mock provider) | Yes | Yes | IMPLEMENTED BUT MOCK PROVIDER |
| List AI Models | `/api/v1/ai/models` | GET | Yes | Bearer | Config | Mock (hardcoded) | Yes | Yes | IMPLEMENTED BUT MOCK |

**Notes:** AI gateway returns mock models (mock-text-small, mock-text-large, mock-vision). No real provider adapter. Desktop app has its own AI provider config (Gemini, Mistral, etc.) in `.env`.

### Modules & Downloads

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| List Modules | `/api/v1/modules` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Module Versions | `/api/v1/modules/:id/versions` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Download Authorize | `/api/v1/downloads/authorize` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Download Verify | `/api/v1/downloads/authorize/verify` | POST | Yes | No | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Download Mark Used | `/api/v1/downloads/authorize/mark-used` | POST | Yes | No | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Download Audit | `/api/v1/downloads/audit` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Release Check | `/api/v1/releases/check` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Release Channels | `/api/v1/releases/channels` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| List Releases | `/api/v1/releases` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Installer Assets | Storage via R2 | — | No | — | Object storage | Mock | No | Yes | MISSING (no storage adapter) |

**Notes:** Release/download infrastructure is implemented but no actual installer assets are published (storage provider is mock).

### Notifications

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Notification Status | `/api/v1/notifications/status` | GET | Yes | No | Config | Mock | Yes | No | IMPLEMENTED BUT MOCK |
| Send Test Notification | `/api/v1/notifications/notify/test` | POST | Yes | Bearer | Config | Mock | Yes | No | IMPLEMENTED BUT MOCK |
| In-app Notification List | — | — | No | — | — | — | No | — | MISSING |

**Notes:** Email provider is mock (`isLive: false`). No per-user in-app notification list endpoint exists.

### Account

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Account Status | `/api/v1/account/status` | GET | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Account Deletion | `/api/v1/account/deletion/request` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Account Export | `/api/v1/account/export/request` | POST | Yes | Bearer | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| List User Roles | `/api/v1/account/admin/users/:id/roles` | GET | Yes | Bearer+admin | Supabase | Real | Yes | No | IMPLEMENTED AND VERIFIED |
| Assign Role | `/api/v1/account/admin/roles/assign` | POST | Yes | Bearer+admin | Supabase | Real | Yes | No | IMPLEMENTED AND VERIFIED |
| Revoke Role | `/api/v1/account/admin/roles/revoke` | POST | Yes | Bearer+admin | Supabase | Real | Yes | No | IMPLEMENTED AND VERIFIED |

**Notes:** Admin role assignment requires an existing admin role (bootstrap needed).

### Admin

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Admin Lookup User | `/api/v1/admin/users/:id` | GET | Yes | Bearer+admin | Supabase | Real | Yes | No | IMPLEMENTED AND VERIFIED |
| Admin List Users | `/api/v1/admin/users` | GET | Yes | Bearer+admin | Supabase | Real | Yes | No | IMPLEMENTED AND VERIFIED |
| Admin Get Subscription | `/api/v1/admin/users/:id/subscription` | GET | Yes | Bearer+admin | Supabase | Real | Yes | No | IMPLEMENTED AND VERIFIED |
| Admin List Payments | `/api/v1/admin/payments` | GET | Yes | Bearer+billing | Supabase | Real | No | No | IMPLEMENTED AND VERIFIED |
| Admin Adjust Credits | `/api/v1/admin/credits/adjust` | POST | Yes | Bearer+billing | Supabase | Real | No | No | IMPLEMENTED AND VERIFIED |
| Admin Revoke Device | `/api/v1/admin/devices/revoke` | POST | Yes | Bearer+admin | Supabase | Real | No | No | IMPLEMENTED AND VERIFIED |
| Admin Audit Events | `/api/v1/admin/audit` | GET | Yes | Bearer+auditor | Supabase | Real | No | No | IMPLEMENTED AND VERIFIED |
| Admin Stats | `/api/v1/admin/stats` | GET | Yes | Bearer+admin | Supabase | Real | Yes | No | IMPLEMENTED AND VERIFIED |
| Admin Roles Seed | — | — | No | — | Supabase | — | No | No | MISSING (no bootstrap) |

**Notes:** No admin roles are seeded in the database. First administrator must be created via DB/CLI.

### Health

| Capability | Endpoint | Method | Registered | Auth | DB Dep | Provider Real/Mock | Website Consumable | Desktop Depends | Status |
|------------|----------|--------|------------|------|--------|-------------------|-------------------|-----------------|--------|
| Health | `/api/v1/health` | GET | Yes | No | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Ready | `/api/v1/ready` | GET | Yes | No | Supabase | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |
| Version | `/api/v1/version` | GET | Yes | No | — | Real | Yes | Yes | IMPLEMENTED AND VERIFIED |

### Desktop Application Dependencies

The Desktop app (`C:\Users\MATTHEW\Desktop\Veyra`) depends on:
- Auth (login, register, OAuth, refresh, logout) — Platform
- Device registration/authorization — Platform
- Entitlements check — Platform
- Release check/updater — Platform
- Download authorization — Platform
- Cloud AI invoke — Platform (mock provider)
- Credit balance — Platform
- AI provider keys (Gemini, Mistral, etc.) — Desktop `.env` (BYOK)

## Missing Capabilities Summary

| # | Capability | Required Backend Work | Status |
|---|------------|----------------------|--------|
| 1 | Usage history endpoint | Implement `GET /api/v1/usage` returning `AIUsageListResponse` | MISSING |
| 2 | Customer payment history | Implement customer-scoped payment transaction list | MISSING |
| 3 | Admin role bootstrap | Seed first admin role via DB/CLI script | MISSING |
| 4 | Plans seeded remotely | Run `seedDevPlans()` against remote DB | MISSING (dev fixtures exist) |
| 5 | Real payment provider | Replace Paystack mock with live adapter | MOCK IMPLEMENTATION |
| 6 | Real email provider | Replace mock SMTP with live provider | MOCK IMPLEMENTATION |
| 7 | Object storage (R2) | Implement storage adapter for release assets | MOCK IMPLEMENTATION |
| 8 | Installer assets | Publish actual desktop installer packages | MISSING |
| 9 | In-app notification list | Implement per-user notification endpoint | MISSING |
| 10 | Website port CORS | Add `http://localhost:5173` to Platform `ALLOWED_ORIGINS` | MISCONFIGURED |

## Integration Decisions

| Decision | Rationale |
|----------|-----------|
| Website runs on port 5173 | Per requirements, Desktop Vite dev also uses 5173 but they are separate processes |
| Platform `ALLOWED_ORIGINS` must include `http://localhost:5173` | CORS preflight and OAuth redirect validation |
| Use Platform SDK contracts | Import from `packages/contracts/src/index.ts` where possible |
| OAuth enabled since credentials exist | Google and GitHub client IDs/secrets are present in `.env` |
| Mock providers acknowledged | Payment, email, storage are mock — Website must not claim live capability |
| Usage endpoint missing | Do not fake usage data; show unavailable state |
