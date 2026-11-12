#!/usr/bin/env bash
set -e

# ==============================================================================
# KIRAN AUTOMATION HRMS - Production Service Stop Script
# Usage: ./stop.sh [--all]
# ==============================================================================

STOP_ALL="${1:-}"

echo "========================================================================"
echo "🛑 Stopping Kiran Automation HRMS Services"
echo "========================================================================"

# Stop Backend PM2
if pm2 list | grep -q "hrms-backend"; then
  echo "Stopping hrms-backend in PM2..."
  pm2 stop hrms-backend >/dev/null 2>&1
  echo "✔ Node.js Backend stopped"
fi

if [ "${STOP_ALL}" = "--all" ]; then
  echo "Stopping Nginx..."
  sudo systemctl stop nginx
  echo "Stopping MySQL..."
  sudo systemctl stop mysql
  echo "✔ All services stopped"
fi

echo "========================================================================"
echo "Finished stop operation."
echo "========================================================================"
