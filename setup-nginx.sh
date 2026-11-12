#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONF="${SCRIPT_DIR}/deploy/nginx/hrms.conf"

if [ ! -f "${NGINX_CONF}" ]; then
  echo "[ERROR] Nginx config not found at ${NGINX_CONF}"
  exit 1
fi

echo "[1/4] Copying Nginx site configuration..."
cp "${NGINX_CONF}" /etc/nginx/sites-available/hrms

echo "[2/4] Enabling hrms site in Nginx..."
ln -sf /etc/nginx/sites-available/hrms /etc/nginx/sites-enabled/hrms

echo "[3/4] Removing default Nginx site if enabled..."
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm -f /etc/nginx/sites-enabled/default
fi

echo "[4/4] Testing Nginx syntax and reloading..."
nginx -t
systemctl reload nginx || systemctl restart nginx

echo "=============================================="
echo "Nginx successfully configured for Kiran Automation HRMS!"
echo "=============================================="

