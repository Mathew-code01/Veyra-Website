> **Source recheck — 2026-11-15:** Treat the statements below as historical where they describe external configuration. Current code uses Platform endpoints for auth and cookie sessions; password reset also uses the Supabase JS client. The Website now consumes the configured reset callback before allowing a password change, and the server action sends its configured Website origin to Platform. This flow still depends on Platform validating/allowlisting that destination and requires an end-to-end email callback test. The access token remains JavaScript-readable; CSP is not configured yet.
# Veyra Website — Security Implementation Notes

This document describes the security controls implemented in the Veyra Website and their relationship to the Veyra Platform. Nothing here is claimed that is not implemented.

## Authentication & session (implemented)

- Sign-in is handled through the Veyra Platform (`POST /api/v1/auth/login`, `/api/v1/auth/register`) via server actions.
- On successful login, the Platform returns `accessToken` and `refreshToken`, which are set as secure cookies:
  - `veyra_access_token`: `Secure`, `SameSite=Strict`, `Path=/`, short Max-Age (readable by client JS for direct API calls).
  - `veyra_refresh_token`: `Secure`, `SameSite=Strict`, `HttpOnly`, `Path=/`, longer Max-Age (server-only).
- No credentials are stored in `localStorage`.
- Session expiry: the Platform access token is short-lived; the client uses `POST /api/v1/auth/refresh` to rotate. On 401 / refresh failure, the session is cleared and the user is redirected to `/auth/login`.
- Logout: server action calls `POST /api/v1/auth/logout` then clears cookies and redirects.
- Password recovery: `POST /api/v1/auth/password-recovery` always returns success (anti-enumeration — never reveals whether an account exists).
- OAuth (Google / GitHub): `POST /api/v1/auth/oauth/authorize` → provider callback → `POST /api/v1/auth/oauth/callback` exchanges the code for tokens. Social sign-in is shown only when the Platform reports the provider as configured (`GET /api/v1/auth/oauth/providers`). OAuth state is validated by the Platform endpoints.

## Authorization (server-side)

- The Website never trusts a user ID, role, subscription, or entitlement supplied by the browser.
- All Platform API calls attach the JWT as `Authorization: Bearer <token>`; the Platform derives identity from the verified JWT subject, never from a client-supplied field.
- Admin routes require server-side Platform roles (`admin`, `support`, `auditor`, `billing`). Admin access is never granted based on email, frontend condition, or user-editable metadata.
- The Website normalizes Platform error responses into `VeyraApiError` and never exposes raw stack traces, tokens, or internal details to the client.

## Input validation (implemented)

- All auth forms use Zod schemas via React Hook Form (`zodResolver`) for client-side validation.
- The Platform validates all request bodies server-side against its own Zod contracts (`ErrorResponseSchema`, etc.).
- The Website's integration layer sends typed payloads matching the verified Platform contracts; no API paths, payloads, or response properties are invented.

## Redirect & CSRF protection (implemented)

- Open redirect prevention: `isTrustedRedirect()` validates post-login/post-action destinations against a trusted allowlist (relative paths + configured `NEXT_PUBLIC_APP_URL`). Untrusted destinations fall back to `/`.
- `getSafeRedirect()` is used everywhere a redirect destination is accepted from user input.
- State-changing mutations (login, register, logout, password recovery, device revocation, account deletion) are performed via Next.js Server Actions, which benefit from Next.js CSRF protection for server actions.
- No tokens are leaked in URLs, logs, analytics, or error messages.

## Error handling (implemented)

- Platform errors are normalized by `normalizeError()` into `VeyraApiError` (code, message, status, requestId).
- `userFriendlyMessage()` maps known codes to safe, actionable user messages without exposing internals.
- Sensitive mutations are never automatically retried after an ambiguous failure (no double-charge / double-reserve). Only idempotent GET requests are retried, with capped backoff.
- Error messages never reveal whether an account exists during password recovery.

## Headers & transport (website level)

- Next.js security headers should be configured in `next.config.mjs` / middleware:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Cookies use `Secure` in production and `SameSite=Strict`.
- CSP: the Platform's security middleware sets `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`. The Website should add a Content-Security-Policy header via `next.config.mjs` `headers` before production deployment.

## Environment & secrets (implemented)

- `.env.example` contains placeholders only; no real values.
- `.env` / `.env.local` are gitignored; never committed.
- No service-role credentials, payment secrets, or OAuth secrets are in browser code or client bundles.
- The Supabase service-role key is Platform server-only; never exposed to the Website.

## What is NOT claimed

- No pretend firewall or WAF is implemented at the Website layer.
- No claim that a Website-level rate limiter replaces Platform rate limiting (Platform enforces `authRateLimiter` server-side).
- No claim that emails are sent — the Platform uses a mock email provider (`isLive: false`).
- No claim that payments are processed — the Platform uses a mock payment provider.
- No claim of live OAuth — social sign-in is disabled until providers are configured on the Platform.

## Recommended production hardening

- Add a Content-Security-Policy header via `next.config.mjs`.
- Add request logging / correlation IDs (Platform already sets `X-Request-Id`).
- Rotate and never commit `NEXT_PUBLIC_SUPABASE_ANON_KEY`-level secrets; the anon key is browser-safe by design but should be regenerated if leaked.
- Configure CORS and OAuth callback allowlists in the Platform settings for the production Website origin.
- Move the Website to `moduleResolution: bundler` with strict CSP and verify no `module` exports in config files.
