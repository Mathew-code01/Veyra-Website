# VEYRA Deployment, Distribution & Release Architecture

**Version:** 1.0 (Production Roadmap & Checklist)  
**Security Status:** Safe Environment Specification (No Plaintext Secrets)  
**Reference Document:** Directives Sections 9, 10, and 18

---

## 1. Multi-Application Ecosystem Architecture

```
                    +------------------------------------------+
                    |             VEYRA Website                |
                    |           (Vercel Production)            |
                    |     Next.js 15 App Router + Auth         |
                    +--------------------+---------------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
        +------------------------------+     +-------------------------------+
        |     Cloudflare R2 Bucket     |     |     VEYRA Platform API        |
        |  (Installers & Update Assets)|     |      (Render Production)      |
        |  Windows / macOS / Linux     |     |  Fastify + Node.js Services   |
        +--------------+---------------+     +---------------+---------------+
                       ^                                     |
                       | Checksums / Signed Metadata         | Authoritative Entitlements
                       |                                     v
        +--------------+---------------+     +-------------------------------+
        |        VEYRA Desktop         |<--->|       Supabase Cloud          |
        |    (Electron + Vite + OS)    |     |   (PostgreSQL + Auth + RLS)   |
        |  Live Copilot & Practice     |     +-------------------------------+
        +------------------------------+
```

---

## 2. Desktop Distribution & Automatic Update Architecture (Cloudflare R2)

### 2.1 Distribution Roles & Boundaries
- **Cloudflare R2:** High-performance, zero-egress cost object storage for raw installer packages (`.exe`, `.dmg`, `.AppImage`) and auto-updater blockmap/checksum metadata (`latest.yml`, `latest-mac.yml`, `latest-linux.yml`).
- **VEYRA Platform API (`/api/v1/releases/check`):** Authoritative gatekeeper verifying user entitlement, release channel (Stable vs Beta), rollout cohort percentage, and minimum required version. It issues authorized, signed download URLs.
- **Desktop Client:** Electron auto-updater verifies SHA256 checksums and digital code signatures before executing background staging and install-on-quit workflows.

### 2.2 Storage Bucket Hierarchy in R2
```
r2://veyra-releases/
├── stable/
│   ├── win32/
│   │   ├── Veyra-Setup-0.5.0.exe
│   │   ├── Veyra-Setup-0.5.0.exe.blockmap
│   │   └── latest.yml
│   ├── darwin/
│   │   ├── Veyra-0.5.0-arm64.dmg
│   │   ├── Veyra-0.5.0-x64.dmg
│   │   └── latest-mac.yml
│   └── linux/
│       ├── Veyra-0.5.0.AppImage
│       └── latest-linux.yml
└── beta/
    └── ...
```

---

## 3. Production Deployment Credentials Checklist

### 3.1 Cloudflare R2
| Required Variable | Environment / Target | Description | Status |
| :--- | :--- | :--- | :--- |
| `R2_ACCOUNT_ID` | CI / Platform Server | Cloudflare 32-character account identifier | To be provisioned |
| `R2_BUCKET_NAME` | CI / Platform Server | Name of the bucket (e.g., `veyra-releases`) | Ready (`veyra-releases`) |
| `R2_ACCESS_KEY_ID` | CI / Platform Server | S3-compatible API token key for publishing | To be provisioned |
| `R2_SECRET_ACCESS_KEY` | CI / Platform Server | S3-compatible API token secret | To be provisioned |
| `R2_PUBLIC_DOMAIN` | Website / Platform | Custom CDN delivery domain (e.g., `releases.veyra.com`) | To be configured |

### 3.2 VEYRA Platform / Render
| Required Variable | Environment / Target | Description | Status |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Render | `production` | Configured |
| `PORT` | Render | `3000` or assigned Render port | Configured |
| `SUPABASE_URL` | Render | Project API URL (`https://<project-id>.supabase.co`) | Existing configuration |
| `SUPABASE_SERVICE_ROLE_KEY` | Render (Server only) | High-privilege service-role key for backend queries | Existing configuration |
| `JWT_SECRET` | Render | Secret used for local desktop session tokens | Configured |
| `CORS_ORIGINS` | Render | Trusted web and local desktop origins | Configured |

### 3.3 Website / Vercel
| Required Variable | Environment / Target | Description | Status |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Vercel | Production canonical URL (`https://veyra.com`) | Ready |
| `NEXT_PUBLIC_PLATFORM_API_URL` | Vercel | Production Platform API (`https://api.veyra.com`) | Ready |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Supabase public project endpoint | Existing configuration |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Supabase anonymous browser client key | Existing configuration |

### 3.4 Desktop Code Signing & Release Verification
| Required Credential | Environment / Target | Description | Status |
| :--- | :--- | :--- | :--- |
| `CSC_LINK` / Windows Cert | GitHub Actions CI | EV or Standard code signing certificate (`.pfx`) | Optional for testing, required for prod |
| `CSC_KEY_PASSWORD` | GitHub Actions CI | Password protecting the Windows PFX certificate | Required when cert is provided |
| `APPLE_ID` / `APPLE_APP_SPECIFIC_PASSWORD` | macOS Runner CI | Apple Developer ID notarization credentials | Required for macOS Gatekeeper |
| `APPLE_TEAM_ID` | macOS Runner CI | 10-character Apple Developer Team ID | Required for macOS |

---

## 4. Release Promotion & Staging Workflow

1. **Local Milestone Validation:**
   - Run `npm run typecheck` across Desktop, Website, and Platform.
   - Run `npm run build` to verify production bundles.
   - Run `git diff --check` to ensure zero whitespace/formatting regressions.
2. **Tagging & SemVer Bump:**
   - Staging releases: `v0.5.0-beta.1`
   - Production stable release: `v0.5.0`
3. **CI Packaging & Artifact Upload:**
   - GitHub Actions runner invokes `electron-builder --publish always` targeting Cloudflare R2 bucket using `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`.
4. **Platform Release Registration:**
   - POST to `/api/v1/admin/releases` with release tag, channel, SHA256 hashes, release notes, and minimum required version.
5. **Entitlement Verification & Gradual Rollout:**
   - Platform controls percentage rollout (e.g. 10% -> 50% -> 100%) and blocks revoked or unentitled devices.
