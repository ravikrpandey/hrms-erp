# Deployment Execution Log

## Project: HRMS Full-Stack Production Deployment
- **Central Source Repository:** https://github.com/ravikrpandey/hrms-erp.git (`main`)
- **Frontend Target:** GitHub Pages (`https://ravikrpandey.github.io/hrms-erp/`)
- **Edge API Gateway:** Cloudflare Workers (`https://hrms-api.<subdomain>.workers.dev`)
- **Database & HTTPS Bridge Host:** AWS Lightsail Ubuntu (`13.233.107.103`, MySQL `8.0.46`)

---

## 1. Completed Database Migration on AWS Lightsail (Verified)
- **Dump Audited & Sanitized:** `dump-hrms-202611091732.sql` (`83.22 MB`, `30,298` lines, `0` DB create/drop/`USE` statements). Stripped legacy ``DEFINER=`hrms_user`@`%` `` and assigned `DEFINER=`mytaxuser`@`%`` on `insert_august_attendance` and `test_proc`.
- **Imported & Verified on `13.233.107.103`:**
  - `hrms`: `0` -> **`742` tables**, **`122.23 MB`**, **`447,292` approx rows**, `1,921` foreign key constraints, `utf8mb4` across all tables.
  - Stored Procedures: **`2`** (`insert_august_attendance`, `test_proc`), `CALL hrms.test_proc()` returned `TEST OK`.
  - Co-hosted `mytaxfinder_db`: **`29` -> `29` tables** (completely untouched).
  - Temporary import archives and temporary transfer SSH key cleaned up.

---

## 2. Application & Edge Architecture Implemented
- **Frontend (GitHub Pages):**
  - Updated `HRMS/HRMS-FRONTEND/src/app/environments/environment.prod.ts` (`__WORKER_API_URL__` token, removed `localhost:4200`).
  - Removed hardcoded `localhost` references in `registration.service.ts`, `header.component.ts`, and `sidebar-menu.component.ts`.
  - Added `.github/workflows/deploy-gh-pages.yml` building with `--base-href /hrms-erp/`, `404.html` SPA fallback, and `.nojekyll`.
- **Cloudflare Worker (`cloudflare-worker/`):**
  - Implemented strict origin CORS (`https://ravikrpandey.github.io`), path allowlisting, security headers, and encrypted `X-Bridge-Secret` upstream HTTPS proxy (`src/index.js`, `wrangler.toml`).
- **Lightsail HTTPS Bridge (`HRMS/HRMS-BACKEND` + `deploy/lightsail-bridge/`):**
  - Added constant-time `X-Bridge-Secret` verification (`crypto.timingSafeEqual`), `CORS_ORIGINS` enforcement, `/health` endpoint, `/masterDocument` static route, and `x-powered-by` suppression in `HRMS/HRMS-BACKEND/server.js`.
  - Updated `HRMS/HRMS-BACKEND/app/config/auth.config.js` to read `process.env.JWT_SECRET` and updated legacy `emerpapi` / `emerp` `baseUrl` values in `auth.controller.js`, `emp_sign_controller.js`, and `documentmaster.controller.js` to use `APP_PUBLIC_URL` / `APP_FRONTEND_URL`.
  - Added `deploy/lightsail-bridge/hrms-bridge.conf`, `deploy/lightsail-bridge/setup-bridge.sh`, and `deploy/lightsail-bridge/CLOUDFLARE_GITHUB_PAGES_GUIDE.md`.

---

## 3. Remaining Live Deployment Steps (Requires Interactive Auth / Firewall)
1. Push updated repo commit to GitHub `main`.
2. Remove public MySQL port `3306` in AWS Lightsail Console Firewall.
3. Deploy Cloudflare Worker (`npx wrangler login && npx wrangler deploy`).
4. Run `deploy/lightsail-bridge/setup-bridge.sh` on Lightsail Ubuntu (with DuckDNS subdomain/token and existing `mytaxuser` password).
5. Set Worker secrets (`BRIDGE_URL`, `BRIDGE_SECRET`) via `npx wrangler secret put`.
6. Set GitHub Repository Variable `WORKER_API_URL` and enable GitHub Pages (`Source: GitHub Actions`).
