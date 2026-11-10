#!/usr/bin/env bash
set -e

# ==============================================================================
# ZYNO HRMS - Production Service Start Script
# Usage: ./start.sh
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [ -d "${PROJECT_ROOT}/HRMS/HRMS-BACKEND" ]; then
  BACKEND_DIR="${PROJECT_ROOT}/HRMS/HRMS-BACKEND"
else
  BACKEND_DIR="${PROJECT_ROOT}/HRMS-BACKEND"
fi

echo "========================================================================"
echo "🚀 Starting Zyno HRMS Production Services"
echo "========================================================================"

# 1. MySQL
echo "[1/3] Ensuring MySQL is active..."
if ! systemctl is-active --quiet mysql; then
  sudo systemctl start mysql
fi
echo "✔ MySQL is active"

# 2. PM2 Node.js Backend
echo "[2/3] Ensuring Backend is running under PM2..."
cd "${BACKEND_DIR}"
if pm2 list | grep -q "hrms-backend"; then
  pm2 reload hrms-backend >/dev/null 2>&1 || pm2 restart hrms-backend >/dev/null 2>&1
else
  pm2 start ecosystem.config.js >/dev/null 2>&1
fi
echo "✔ Node.js Backend is running under PM2"

# 3. Nginx
echo "[3/3] Ensuring Nginx is active..."
if ! systemctl is-active --quiet nginx; then
  sudo systemctl start nginx
else
  sudo systemctl reload nginx
fi
echo "✔ Nginx reverse proxy is active"

echo "========================================================================"
echo "✔ All Zyno HRMS services are up and running!"
echo "========================================================================"
