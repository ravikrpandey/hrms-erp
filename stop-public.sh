#!/usr/bin/env bash

# ==============================================================================
# ZYNO HRMS - Graceful Shutdown Script
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure PATH includes nvm and user binaries
if [ -s "${HOME}/.nvm/nvm.sh" ]; then
  # shellcheck source=/dev/null
  source "${HOME}/.nvm/nvm.sh"
fi
export PATH="${HOME}/.local/bin:${PATH}"

echo "========================================================================"
echo "🛑 Stopping Zyno HRMS Public Deployment..."
echo "========================================================================"

# 1. Stop Public Tunnels in PM2
if command -v pm2 >/dev/null 2>&1; then
  echo "[1/3] Terminating public tunnels in PM2..."
  pm2 delete ngrok-tunnel >/dev/null 2>&1 || true
  pm2 delete cloudflare-tunnel >/dev/null 2>&1 || true
fi
pkill -f "ngrok" 2>/dev/null || true
pkill -f "cloudflared" 2>/dev/null || true
echo "✔ Public tunnels stopped."

# 2. Stop Node.js Backend PM2 Process
if command -v pm2 >/dev/null 2>&1; then
  if pm2 list 2>/dev/null | grep -q "hrms-backend"; then
    echo "[2/3] Stopping PM2 backend service..."
    pm2 stop hrms-backend >/dev/null 2>&1 || true
    echo "✔ Backend stopped in PM2."
  else
    echo "[2/3] PM2 service 'hrms-backend' is not currently active."
  fi
fi

# 3. Clean up any remaining node processes on port 3000
echo "[3/3] Checking port 3000..."
if ss -tulpn 2>/dev/null | grep -q ":3000 "; then
  pkill -f "server.js" 2>/dev/null || true
fi

echo "========================================================================"
echo "✔ All public tunnel and backend services have been cleanly stopped."
echo "  Note: MySQL and Nginx remain in their standard local idle states."
echo "========================================================================"
