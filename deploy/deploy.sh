#!/usr/bin/env bash
set -e

# ==============================================================================
# ZYNO HRMS - Production Pull & Deployment Automation Script
# Usage: ./deploy.sh [branch]
# Default branch: main
# Target Path: /var/www/hrms
# ==============================================================================

DEPLOY_BRANCH="${1:-main}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [ -d "${PROJECT_ROOT}/HRMS/HRMS-BACKEND" ]; then
  BACKEND_DIR="${PROJECT_ROOT}/HRMS/HRMS-BACKEND"
  FRONTEND_DIR="${PROJECT_ROOT}/HRMS/HRMS-FRONTEND"
else
  BACKEND_DIR="${PROJECT_ROOT}/HRMS-BACKEND"
  FRONTEND_DIR="${PROJECT_ROOT}/HRMS-FRONTEND"
fi

if [ "${PROJECT_ROOT}" = "/var/www/hrms" ] || [ -d "/var/www/hrms/dist/zyno-web" ]; then
  DIST_DIR="/var/www/hrms/dist/zyno-web"
else
  DIST_DIR="${FRONTEND_DIR}/dist/zyno-web"
fi

echo "========================================================================"
echo "🚀 Deploying Zyno HRMS from GitHub [Branch: ${DEPLOY_BRANCH}]"
echo "Target: ${PROJECT_ROOT}"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "========================================================================"

# 1. Fetch latest changes from GitHub
echo "[1/6] Fetching latest approved changes from GitHub..."
cd "${PROJECT_ROOT}"
git fetch origin "${DEPLOY_BRANCH}"

CURRENT_COMMIT="$(git rev-parse HEAD)"
LATEST_COMMIT="$(git rev-parse "origin/${DEPLOY_BRANCH}")"

if [ "${CURRENT_COMMIT}" = "${LATEST_COMMIT}" ]; then
  echo "✔ Code is already at latest commit: ${CURRENT_COMMIT:0:8}"
else
  echo "Updating from ${CURRENT_COMMIT:0:8} to ${LATEST_COMMIT:0:8}..."
  git checkout "${DEPLOY_BRANCH}"
  git pull origin "${DEPLOY_BRANCH}"
fi

# 2. Install Backend Dependencies
echo "[2/6] Installing backend dependencies..."
cd "${BACKEND_DIR}"
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    echo "[WARN] .env not found! Copying from .env.example. Please configure credentials."
    cp .env.example .env
  else
    echo "[ERROR] .env file is missing in ${BACKEND_DIR}!"
    exit 1
  fi
fi

npm ci --omit=dev --legacy-peer-deps || npm install --omit=dev --legacy-peer-deps

# 3. Build Angular Production Frontend
echo "[3/6] Building Angular frontend for production..."
cd "${FRONTEND_DIR}"
npm ci --legacy-peer-deps || npm install --legacy-peer-deps
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Deploy build artifacts to target directory
mkdir -p "${DIST_DIR}"
if [ -d "${FRONTEND_DIR}/dist/zyno-web" ] && [ "${FRONTEND_DIR}/dist/zyno-web" != "${DIST_DIR}" ]; then
  find "${DIST_DIR}" -mindepth 1 -delete
  cp -r "${FRONTEND_DIR}/dist/zyno-web/"* "${DIST_DIR}/"
fi
echo "✔ Angular build deployed to ${DIST_DIR}"

# 4. Restart Node.js Backend via PM2
echo "[4/6] Restarting Node.js Backend with PM2..."
cd "${BACKEND_DIR}"
if pm2 list | grep -q "hrms-backend"; then
  pm2 reload hrms-backend --update-env
else
  pm2 start ecosystem.config.js
fi
pm2 save

# 5. Health Check
echo "[5/6] Verifying Backend Health..."
HEALTHY=false
for i in {1..20}; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ || true)
  if [ "${HTTP_CODE}" = "200" ]; then
    HEALTHY=true
    break
  fi
  echo "Waiting for backend on http://127.0.0.1:3000 (attempt ${i}/20)..."
  sleep 2
done

if [ "${HEALTHY}" = "true" ]; then
  echo "✔ Backend is responding successfully with HTTP 200"
else
  echo "[ERROR] Backend health check failed! HTTP Code: ${HTTP_CODE}"
  pm2 logs hrms-backend --lines 20 --nostream
  exit 1
fi

# 6. Reload Nginx
echo "[6/6] Reloading Nginx Reverse Proxy..."
sudo nginx -t
sudo systemctl reload nginx

echo "========================================================================"
echo "🎉 Deployment completed successfully!"
echo "Active Commit: $(git rev-parse --short HEAD)"
echo "========================================================================"
