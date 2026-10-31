# Zyno HRMS Public Deployment Guide (Ubuntu + Cloudflare Quick Tunnel)

This guide documents the architecture, configuration, operation, and maintenance procedures to make the **Zyno HRMS** application publicly accessible over the internet using your local Ubuntu workstation, Nginx reverse proxy, PM2 process manager, and Cloudflare Quick Tunnel.

---

## 1. Architecture Overview

```
                                  Internet
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
    ┌───────────────────────────┐           ┌───────────────────────────┐
    │    Permanent Ngrok URL    │           │  Cloudflare Quick Tunnel  │
    │   (*.ngrok-free.dev)      │           │    (*.trycloudflare.com)  │
    └─────────────┬─────────────┘           └─────────────┬─────────────┘
                  │                                       │
                  └───────────────────┬───────────────────┘
                                      │ (Encrypted HTTPS Ingress)
                                      ▼
                         ┌─────────────────────────┐
                         │   Local Nginx Server    │
                         │        (Port 80)        │
                         └───────────┬─────────────┘
                              │             │
              ┌───────────────┘             └───────────────┐
              │ / (SPA Routing)                             │ /api/*, /uploaded_files/*
              ▼                                             ▼
┌───────────────────────────┐                 ┌───────────────────────────┐
│   Angular 15 Production   │                 │     Node.js / Express     │
│       Static Build        │                 │    (Port 3000 on PM2)     │
│   (dist/zyno-web/index)   │                 │     app.set('trust proxy')│
└───────────────────────────┘                 └─────────────┬─────────────┘
                                                            │ (Internal TCP)
                                                            ▼
                                              ┌───────────────────────────┐
                                              │      MySQL Database       │
                                              │   (127.0.0.1:3306 ONLY)   │
                                              │   Never exposed publicly  │
                                              └───────────────────────────┘
```

### Key Routing Details
- **`https://<public-url>/`** $\rightarrow$ Served directly by Nginx from the compiled Angular static production build (`HRMS/HRMS-FRONTEND/dist/zyno-web`). SPA client-side deep links and page refreshes are handled via `try_files $uri $uri/ /index.html`.
- **`https://<public-url>/api/*`** $\rightarrow$ Reverse-proxied transparently by Nginx to Express on `http://127.0.0.1:3000/api/*`.
- **`https://<public-url>/uploaded_files/*`** (and `/digital_signature/*`, `/leadfile/*`) $\rightarrow$ Proxied to `http://127.0.0.1:3000` to stream documents and image assets.
- **Port 3306 (MySQL)** $\rightarrow$ Strictly bound to localhost (`127.0.0.1`), entirely inaccessible from outside the local machine.

---

## 2. Installation & Prerequisites

Ensure the following tools are installed on Ubuntu:

```bash
# 1. Node.js 18 & npm (via NVM)
nvm use 18

# 2. PM2 (Process Manager)
npm install -g pm2

# 3. Nginx Web Server
sudo apt update && sudo apt install -y nginx

# 4. Cloudflare Tunnel Binary
mkdir -p ~/.local/bin
curl -sSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o ~/.local/bin/cloudflared
chmod +x ~/.local/bin/cloudflared
```

---

## 3. Configuration Files Modified

| File | Purpose of Modification |
| :--- | :--- |
| `HRMS/HRMS-FRONTEND/angular.json` | Configured `fileReplacements` in production build to swap `environment.ts` with `environment.prod.ts`. |
| `HRMS/HRMS-FRONTEND/src/app/environments/environment.prod.ts` | Configured centralized `serverUrl: ''` so all API and file requests use relative paths against whatever domain serves the page. |
| `HRMS/HRMS-BACKEND/.env` | Created environment configuration with `PORT=3000`, `HOST=127.0.0.1`, and MySQL credentials. |
| `HRMS/HRMS-BACKEND/app/config/db.config.js` | Updated database configuration to read from `process.env` with existing safe fallbacks. |
| `HRMS/HRMS-BACKEND/server.js` | Added `app.set("trust proxy", 1);` for reverse proxy compatibility and bound HTTP listener to `127.0.0.1:3000`. |
| `HRMS/HRMS-BACKEND/ecosystem.config.js` | Configured PM2 cluster descriptor for `hrms-backend` with automatic restarts and logging. |
| `deploy/nginx/hrms.conf` | Complete Nginx virtual host defining SPA static file root, `/api/` reverse proxy, timeout directives, and websocket headers. |
| `setup-nginx.sh` | Idempotent automation script to install Nginx site config into `/etc/nginx/sites-available/hrms` and reload Nginx. |

---

## 4. Environment Variables Required

Store these variables in `HRMS/HRMS-BACKEND/.env` (excluded by `.gitignore`):

```env
NODE_ENV=production
PORT=3000
SERVER_PORT=3000
HOST=127.0.0.1
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=devuser
DB_PASSWORD=DevUser@12345!
DB_NAME=hrms
```

---

## 5. Startup and Shutdown Commands

### One-Command Quick Start
From the project root:
```bash
./start-public.sh
```
This script automatically:
1. Verifies that MySQL is running on `127.0.0.1:3306`.
2. Checks that Angular production assets exist in `dist/zyno-web`.
3. Starts the Node.js backend under PM2 on `127.0.0.1:3000`.
4. Ensures Nginx is running and serving the `hrms` reverse proxy configuration on port 80.
5. Launches Cloudflare Quick Tunnel and outputs your live HTTPS URL.

### One-Command Graceful Shutdown
From the project root:
```bash
./stop-public.sh
```
This terminates the public Cloudflare tunnel, stops the PM2 backend process, and leaves local MySQL and Nginx in an idle state.

---

## 6. Process Management & Operational Commands

### PM2 (Node.js Backend)
```bash
# View running process status
pm2 status

# View live backend logs
pm2 logs hrms-backend

# Restart backend
pm2 restart hrms-backend

# Stop backend
pm2 stop hrms-backend

# Save PM2 process list for system reboot
pm2 save
```

### Nginx
```bash
# Apply and verify the HRMS configuration
sudo ./setup-nginx.sh

# Test Nginx syntax
sudo nginx -t

# Reload Nginx without downtime
sudo systemctl reload nginx

# View Nginx access & error logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Cloudflare Tunnel
```bash
# Run manual quick tunnel against local Nginx
cloudflared tunnel --url http://127.0.0.1:80

# Check running tunnel processes
pgrep -fl cloudflared

# Terminate active tunnel
pkill -f "cloudflared tunnel"
```

---

## 7. How to Regenerate the Public URL

Because Cloudflare Quick Tunnels provide free, on-demand HTTPS ingress without requiring custom domain registration, each tunnel launch generates a unique subdomain (e.g. `https://random-word-abc.trycloudflare.com`).

To generate a new URL or reconnect after network interruption:
```bash
./stop-public.sh
./start-public.sh
```
The new public HTTPS URL will be printed immediately in your terminal.

---

## 8. Security Considerations

1. **Private MySQL Isolation:** MySQL is strictly bound to `127.0.0.1:3306`. It does not accept inbound connections from public IP addresses.
2. **Reverse Proxy Masking:** Node.js port 3000 is bound strictly to `127.0.0.1`. All inbound requests enter through Nginx on port 80, which normalizes paths, filters malicious headers, and enforces `client_max_body_size 50M`.
3. **No Hardcoded Credentials:** Database credentials and listening ports are managed through environment variables in `HRMS/HRMS-BACKEND/.env`.
4. **HTTPS Everywhere:** All public traffic is encrypted in transit between external clients and Cloudflare's edge network via TLS 1.3.
5. **No Debug Exposure:** Production build mode strips TypeScript maps and stack trace disclosure.

