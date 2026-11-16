# Website integration with VEYRA Platform

## Responsibility boundary

The Website owns marketing, registration and sign-in screens, the customer/admin portal, pricing presentation, checkout initiation, support content, and release discovery. It is not the interview runtime. Practice, local inference, microphone/screen capture, context processing, and the live overlay belong to VEYRA Desktop.

Platform is the source of truth for identity, subscriptions, entitlements, pricing, payments, devices, credits, usage, account export/deletion, and release metadata. The Website must render these records without inventing balances, activity, prices, plan features, or payment success.

## Current client architecture

- `src/services/platform/client.ts` is a Website-owned typed REST client.
- `src/services/platform/endpoints.ts` holds endpoint paths.
- `src/components/auth/auth-provider.tsx` supplies the current session and Platform client.
- `src/app/(auth)/actions.ts` performs login, registration, refresh, logout, and recovery through Platform.
- The Website does not consume `packages/sdk` or `packages/contracts`; duplicated types require contract-drift monitoring.
- API base URL comes from `NEXT_PUBLIC_API_BASE_URL`, defaulting to `http://localhost:3000`.
- Website dev/start scripts bind port 5173.

## Verified source-level endpoint map

| Website feature | Platform route(s) called | Status from source inspection |
|---|---|---|
| Registration/login/logout/refresh | `POST /api/v1/auth/register`, `/login`, `/logout`, `/refresh`; `GET/PATCH /api/v1/auth/me` | Connected in client/server actions; external identity service and token lifecycle not integration-tested. |
| Password recovery/reset | `POST /api/v1/auth/password-recovery`; Platform redirects to the Website's `/reset-password`; the reset page requires an active Supabase recovery session before `auth.updateUser` | Redirect route is aligned and the Website guards invalid/expired sessions. Provider delivery and the full email callback still require external Supabase configuration for end-to-end verification. |
| OAuth | `GET /api/v1/auth/oauth/providers`; authorize/callback/link routes are represented in the client | Login and registration now query provider availability and only enable configured Google/GitHub flows. Provider credentials and a real callback remain externally configured and were not exercised. |
| Account overview | profile, current subscription, credit balance, devices, entitlements | Calls Platform. Empty/error/loading display is client-side; no live account data checked. |
| Billing | current subscription, plan list, `/api/v1/payments/history`, cancel/reactivate, checkout | Customer history is implemented and called. Payment success must remain Platform/webhook-owned. |
| Credits and usage | `/api/v1/credits/balance`, `/api/v1/usage` | Both routes exist in current Platform source. Usage is limited to the latest 100 records in current handler. |
| Pricing | `/api/v1/pricing/countries`, `/pricing/detect`, `/pricing/plans` | Region/currency options and plan amounts come from Platform; plan lookup is public, guest users can select a supported region, and authenticated users receive Platform detection. Remote regional price configuration remains unverified. |
| Devices and entitlements | `/api/v1/devices`, device authorize/revoke/replace/last-seen/session revoke, `/api/v1/entitlements` and snapshot endpoints | Client methods exist; Website-to-Desktop revocation propagation is not integration-tested. |
| Download/release | `/api/v1/releases`, `/releases/check`, `/releases/channels`, `/downloads/authorize` | Source methods/routes exist; published assets, signatures, and installation were not verified. |
| Admin | `/api/v1/admin/*`, `/api/v1/account/admin/*` | UI exists; Platform role checks are present, but full denial/ownership tests remain. |

## Session and security notes

The Website stores Platform tokens in cookies: the access token is readable by client JavaScript for direct browser API calls; the refresh token is HttpOnly. Login, registration, refresh, and logout are implemented as Next.js Server Actions. This reduces exposure of the refresh token but leaves the access token exposed to same-origin script execution; evaluate a server-proxy/BFF design before production.

The redirect validator previously rejected valid absolute same-origin URLs by comparing an origin with a full URL. It now compares parsed origins and tests the configured local origin. Relative redirects remain constrained to an explicit path allowlist.

Platform recovery now validates the request origin against `ALLOWED_ORIGINS` and uses the Website `/reset-password` callback route. Website's Supabase browser client enables URL session detection; the reset screen also checks for a recovery session before enabling a password change. This is source-aligned and covered by origin-helper tests, but the external email/provider callback has not been exercised end to end.

## Environment and operations

- Website: `http://localhost:5173`.
- Platform: `http://localhost:3000`.
- Desktop Vite uses 5174 with `strictPort`; Website uses 5173 and Platform uses 3000.
- Do not put Platform service-role, Paystack, OAuth, or signing secrets in `NEXT_PUBLIC_*` variables.
- OAuth, payments, outbound email, and release storage must be described according to actual Platform/provider configuration, not endpoint existence.

## Known limitations

No runtime checkout, OAuth, session refresh, device revocation propagation, account deletion/export, RLS, or release download has yet been verified in this audit. The Website has a custom API client instead of the shared SDK, no Git metadata in the current checkout, and no cross-project integration test environment has been confirmed.
