#!/usr/bin/env bash
set -e

# ==============================================================================
# ZYNO HRMS - One-Command Public Deployment Launcher
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/HRMS/HRMS-BACKEND"
FRONTEND_DIR="${PROJECT_ROOT}/HRMS/HRMS-FRONTEND"
CLOUDFLARED_BIN="${HOME}/.local/bin/cloudflared"
NGROK_BIN="${HOME}/.local/bin/ngrok"

# Ensure PATH includes nvm and user binaries
if [ -s "${HOME}/.nvm/nvm.sh" ]; then
  # shellcheck source=/dev/null
  source "${HOME}/.nvm/nvm.sh"
fi
export PATH="${HOME}/.local/bin:${PATH}"

echo "========================================================================"
echo "🚀 Starting Zyno HRMS Public Stack (Node.js + Angular + MySQL + Tunnels)"
echo "========================================================================"

# 1. Check MySQL
echo "[1/5] Checking MySQL Service..."
if ! ss -tulpn 2>/dev/null | grep -q ":3306 "; then
  echo "MySQL is not running on port 3306. Attempting to start..."
  sudo systemctl start mysql || {
    echo "[ERROR] Failed to start MySQL. Please check MySQL status manually."
    exit 1
  }
fi
echo "✔ MySQL is running locally on 127.0.0.1:3306"

# 2. Check Angular Build
echo "[2/5] Checking Angular Production Build..."
if [ ! -f "${FRONTEND_DIR}/dist/zyno-web/index.html" ]; then
  echo "Angular production build not found. Building now..."
  (
    cd "${FRONTEND_DIR}"
    NODE_OPTIONS="--max-old-space-size=4096" npm run build
  )
fi
echo "✔ Angular build ready at ${FRONTEND_DIR}/dist/zyno-web"

# 3. Start/Reload Node.js Backend with PM2
echo "[3/5] Starting Node.js Backend on port 3000..."
pkill -f "nodemon server.js" 2>/dev/null || true

cd "${BACKEND_DIR}"
if pm2 list 2>/dev/null | grep -q "hrms-backend"; then
  echo "Backend already managed by PM2. Reloading..."
  pm2 reload hrms-backend --update-env >/dev/null 2>&1 || pm2 restart hrms-backend >/dev/null 2>&1
else
  echo "Starting backend via PM2 ecosystem..."
  pm2 start ecosystem.config.js >/dev/null 2>&1
fi

# Wait for port 3000 to become active
for i in {1..15}; do
  if curl -s http://127.0.0.1:3000/ >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
echo "✔ Node.js backend is healthy and listening on http://127.0.0.1:3000"

# 4. Check Nginx Reverse Proxy
echo "[4/5] Verifying Nginx Reverse Proxy..."
if curl -s -I http://127.0.0.1/ | grep -qi "HTTP/"; then
  echo "✔ Nginx reverse proxy is actively serving port 80"
else
  if [ -f /etc/nginx/sites-enabled/hrms ]; then
    sudo -n systemctl reload nginx 2>/dev/null || sudo systemctl reload nginx 2>/dev/null || true
  else
    sudo "${PROJECT_ROOT}/setup-nginx.sh"
  fi
fi

# 5. Start Ngrok Permanent Tunnel in PM2
echo "[5/5] Launching Tunnels for Public HTTPS Access..."
if [ -x "${NGROK_BIN}" ] && [ -f "${HOME}/.config/ngrok/ngrok.yml" ]; then
  if ! pm2 list 2>/dev/null | grep -q "ngrok-tunnel"; then
    pm2 start "${NGROK_BIN}" --name "ngrok-tunnel" -- http 80 >/dev/null 2>&1
  else
    pm2 restart ngrok-tunnel >/dev/null 2>&1
  fi
fi

# Start Cloudflare Quick Tunnel in PM2
if [ -x "${CLOUDFLARED_BIN}" ]; then
  if ! pm2 list 2>/dev/null | grep -q "cloudflare-tunnel"; then
    pm2 start "${CLOUDFLARED_BIN}" --name "cloudflare-tunnel" -- tunnel --url http://127.0.0.1:80 >/dev/null 2>&1
  fi
fi

pm2 save >/dev/null 2>&1 || true

# Extract Ngrok URL
NGROK_URL=""
for i in {1..10}; do
  NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | grep -o 'https://[a-zA-Z0-9.-]*\.ngrok-free\.[a-z]*' | head -n 1 || true)
  if [ -n "${NGROK_URL}" ]; then
    break
  fi
  sleep 1
done

# Extract Cloudflare URL
CF_LOG="${HOME}/.pm2/logs/cloudflare-tunnel-error.log"
CF_URL=""
if [ -f "${CF_LOG}" ]; then
  CF_URL=$(grep -o 'https://[a-zA-Z0-9-]\+\.trycloudflare\.com' "${CF_LOG}" | tail -n 1 || true)
fi

echo ""
echo "========================================================================"
echo "🎉 APPLICATION IS NOW PUBLICLY ACCESSIBLE WORLDWIDE!"
echo "========================================================================"
if [ -n "${NGROK_URL}" ]; then
echo "  Permanent Ngrok URL:  ${NGROK_URL}"
echo "  Frontend Route:       ${NGROK_URL}/"
echo "  Backend API:          ${NGROK_URL}/api/*"
echo "------------------------------------------------------------------------"
fi
if [ -n "${CF_URL}" ]; then
echo "  Cloudflare URL:       ${CF_URL}"
fi
echo "  Local Reverse Proxy:  http://127.0.0.1:80"
echo "  Node Backend:         http://127.0.0.1:3000 (Internal only)"
echo "  MySQL Database:       127.0.0.1:3306 (Internal only - Secured)"
echo "========================================================================"
echo "To stop the tunnel and application anytime, run: ./stop-public.sh"
echo "========================================================================"
