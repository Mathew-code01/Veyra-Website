> **Source recheck — 2026-11-15:** This is a historical dependency list. The current Platform source now registers and the Website consumes `GET /api/v1/usage` and `GET /api/v1/payments/history`; those two items below are no longer missing. Their live database behavior, pagination, remote configuration, and production data have not been integration-tested. Provider, OAuth, email, storage, plans, and installer availability still require current environment verification.
# Veyra Website — Outstanding Backend Dependency Report

This document is a historical dependency report. The follow-up below supersedes its original missing-endpoint claims; remaining configuration statuses must be verified against the target deployment.

## Follow-up verification (2026-11-15)

- `GET /api/v1/usage` is implemented and consumed by the Website credits page. The API derives identity from the bearer token and scopes the query to that user.
- `GET /api/v1/payments/history` is implemented and consumed by the Website billing page through the authenticated user-scoped database client.
- These source-level integrations do not prove that production Supabase is configured or contains records. Mock payment, email, storage, OAuth, plan seeding, and release-asset status remain deployment-dependent.

## 1. Usage history / metering (missing endpoint)

- Required: customer-facing AI usage history (`GET /api/v1/usage` or equivalent returning `AIUsageListResponse`).
- Platform state: `apps/api/src/modules/usage/usage.routes.ts` is empty. The contracts define `AIUsageListResponseSchema` but no route serves it.
- Website impact: Credits page shows balance (verified endpoint) but no detailed usage history. A note directs users to contact support.

## 2. Customer payment history (missing endpoint)

- Required: endpoint for a user to list their own payment transactions.
- Platform state: only `GET /api/v1/admin/payments` (billing role) exists. No customer-facing payment history endpoint.
- Website impact: Billing page shows current subscription (verified) but not transaction history.

## 3. OAuth providers not configured (Google / GitHub)

- Required: Google and GitHub OAuth configured in Supabase, with `GOOGLE_CLIENT_ID/SECRET` and `GITHUB_CLIENT_ID/SECRET` set.
- Platform state: OAuth routes exist but `isOAuthProviderConfigured()` returns `false` until providers are configured (per Platform production-readiness audit).
- Website impact: Social sign-in buttons render as disabled with a note that OAuth requires Platform configuration.

## 4. Admin roles not seeded

- Required: at least one admin role (`admin`, `support`, `auditor`, `billing`) seeded in the Platform DB.
- Platform state: `admin_roles` table exists but has no rows. First administrator must be created directly in the Platform database.
- Website impact: Admin portal loads but all admin endpoints return 403 until an admin role exists. Admin pages show an "admin access required" notice explaining this.

## 5. Plans not seeded remotely

- Required: subscription plans seeded in the remote Platform DB.
- Platform state: plans table populated with dev fixtures locally but empty remotely (per production-readiness audit).
- Website impact: Pricing page shows a "no plans available" forthcoming state; no prices are invented.

## 6. Real payment provider not wired

- Required: Paystack (or other) payment adapter.
- Platform state: mock payment provider by default; Paystack integration not wired; webhook signature verification is a mock.
- Website impact: Checkout initiates via Platform endpoint, but payment success is determined by Platform records/webhooks — no live payments activated.

## 7. Real email provider not configured

- Required: SMTP / live email provider.
- Platform state: mock email provider active (`isLive: false`, `liveEmailsEnabled: false`).
- Website impact: Password recovery and contact form acknowledge submission but no real email is guaranteed. A note states this.

## 8. Object storage (R2/S3) not implemented

- Required: storage adapter for release/download assets.
- Platform state: release assets reference object storage URLs but no storage adapter exists.
- Website impact: Download page shows "no verified installers available"; no fake download URLs or version numbers.

## 9. Desktop installer assets not published

- Required: actual installer packages (Windows/macOS/Linux) in release system.
- Platform state: releases API verified but no installer assets published.
- Website impact: Desktop download page is honest about unavailable installers; links to Platform release system.

## 10. Website-hosted interview practice engine (not supported)

- Required: Platform endpoint for a website-based practice session.
- Platform state: none. Practice is a Desktop application capability.
- Website impact: Practice page explains practice runs in the Desktop app and links to download; no fake practice engine.

## 11. Desktop-level live listening / screen capture / local inference (not supported by Website)

- Required: Desktop application capabilities.
- Platform state: none on the Website.
- Website impact: Live assistant page explains these run in the Desktop app; the Website never claims browser-based listening, screen capture, or local AI inference.

## Backend work required (summary)

| # | Capability | Platform work needed |
|---|------------|---------------------|
| 1 | Usage history endpoint | Implement `GET /api/v1/usage` returning `AIUsageListResponse` |
| 2 | Customer payment history | Implement customer-facing payment transaction list |
| 3 | OAuth providers | Configure Google/GitHub in Supabase; set env vars |
| 4 | Admin roles | Seed first admin role via DB/CLI |
| 5 | Plans | Seed plans into remote DB |
| 6 | Paystack adapter | Replace mock payment provider |
| 7 | Email provider | Configure SMTP; enable live emails |
| 8 | R2 storage | Implement object storage adapter for release assets |
| 9 | Installer assets | Publish actual desktop installer packages |
