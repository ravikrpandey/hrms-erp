# Zyno HRMS Free Deployment Guide
## GitHub Pages (Frontend) + Cloudflare Workers (Edge API) + Lightsail HTTPS Bridge (Existing MySQL)

---

## Architecture Summary
- **Frontend (Free HTTPS):** `https://ravikrpandey.github.io/hrms-erp/` via GitHub Pages (`.github/workflows/deploy-gh-pages.yml`).
- **Backend Edge API (Free HTTPS):** `https://hrms-api.<subdomain>.workers.dev` via Cloudflare Workers (`cloudflare-worker/`).
- **Lightsail Database + Secure HTTPS Bridge:**
  - Keeps existing `hrms` (`742` tables) and `mytaxfinder_db` (`29` tables) untouched on `127.0.0.1:3306`.
  - Runs `HRMS/HRMS-BACKEND` bound strictly to `127.0.0.1:3000` behind DuckDNS + Let's Encrypt Nginx (`:443`), validating `X-Bridge-Secret` (`403` if missing).
  - Closes public MySQL port `3306` and backend port `3000`.

---

## Step 1: Lock Down Port 3306 in AWS Lightsail Firewall
1. Open **AWS Lightsail Console** → Select your Ubuntu instance → **Networking** tab → **IPv4 Firewall**.
2. Keep **ONLY**:
   - `SSH (22)` (ideally restricted to your IP)
   - `HTTP (80)` (needed for Let's Encrypt renewal & HTTP->HTTPS redirect)
   - `HTTPS (443)`
3. **Delete the `MySQL/Aurora (3306)` rule** from the public firewall.
   - *(In DBeaver, configure the **SSH** tab with your Lightsail IP & key so DBeaver connects securely over SSH Tunnel instead of exposing 3306 publicly.)*

---

## Step 2: Register Free DuckDNS Subdomain
1. Visit https://www.duckdns.org/ and sign in.
2. Create a free subdomain (for example `zynohrms-api.duckdns.org`) and point it to `13.233.107.103`.
3. Copy your DuckDNS Token.

---

## Step 3: Deploy Cloudflare Worker (`workers.dev`)
On your Windows PC (inside `cloudflare-worker/`):

```powershell
cd C:\Users\ravi\Downloads\rv\hrms-erp\cloudflare-worker
npm install
npx wrangler login
npx wrangler deploy
```

Note the printed URL (for example `https://hrms-api.<your-subdomain>.workers.dev`).

---

## Step 4: Set Up Lightsail HTTPS API Bridge (MySQL Untouched)
SSH into your Lightsail Ubuntu server and run:

```bash
git clone --branch main https://github.com/ravikrpandey/hrms-erp.git /var/www/hrms-bridge
chmod +x /var/www/hrms-bridge/deploy/lightsail-bridge/setup-bridge.sh
bash /var/www/hrms-bridge/deploy/lightsail-bridge/setup-bridge.sh
```

The script will:
- Bind MySQL strictly to `127.0.0.1` and enable UFW (`22`, `80`, `443` only).
- Leave `hrms` and `mytaxfinder_db` completely untouched.
- Configure PM2 (`hrms-backend` on `127.0.0.1:3000`), DuckDNS IP sync, Nginx `hrms-bridge` vhost, and Let's Encrypt HTTPS.
- Print your generated `BRIDGE_URL` and `BRIDGE_SECRET`.

---

## Step 5: Connect Cloudflare Worker Secrets to Lightsail
Back on your Windows PC inside `cloudflare-worker/`:

```powershell
npx wrangler secret put BRIDGE_URL
# Paste: https://your-subdomain.duckdns.org

npx wrangler secret put BRIDGE_SECRET
# Paste the secret printed by setup-bridge.sh
```

Test the Worker end-to-end:
```powershell
curl.exe https://hrms-api.<your-subdomain>.workers.dev/health
# Expected: {"status":"ok","database":"connected"}
```

---

## Step 6: Configure & Trigger GitHub Pages
1. On GitHub (`https://github.com/ravikrpandey/hrms-erp`):
   - Go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
   - Go to **Settings → Secrets and variables → Actions → Variables** tab → **New repository variable**:
     - **Name:** `WORKER_API_URL`
     - **Value:** `https://hrms-api.<your-subdomain>.workers.dev`
2. Go to **Actions → Deploy HRMS Frontend to GitHub Pages → Run workflow** (or push to `main`).
3. Visit `https://ravikrpandey.github.io/hrms-erp/` and test login!

---

## Step 7: Security & Functionality Verification Checklist
- [ ] `Test-NetConnection 13.233.107.103 -Port 3306` fails / times out (MySQL not public).
- [ ] `Test-NetConnection 13.233.107.103 -Port 3000` fails / times out (Express not public).
- [ ] Direct `curl https://<your-subdomain>.duckdns.org/health` (without secret) returns **`403 Forbidden`**.
- [ ] `curl https://hrms-api.<your-subdomain>.workers.dev/health` returns **`200 OK` (`{"status":"ok","database":"connected"}`)**.
- [ ] Preflight `OPTIONS` with `Origin: https://ravikrpandey.github.io` returns `Access-Control-Allow-Origin: https://ravikrpandey.github.io`; unauthorized origins return `403`.
- [ ] Browser login (`POST /api/auth/signin`) works on `https://ravikrpandey.github.io/hrms-erp/`, JWT is stored, and page refresh (`F5`) on deep routes renders without 404.
