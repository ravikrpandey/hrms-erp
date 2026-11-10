#!/usr/bin/env bash

# ==============================================================================
# ZYNO HRMS - Production Service Status & Health Audit Script
# Usage: ./status.sh [domain.duckdns.org]
# ==============================================================================

DOMAIN="${1:-}"

echo "========================================================================"
echo "🩺 ZYNO HRMS Health & Service Status"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "========================================================================"

# 1. MySQL Status
echo -n "• MySQL Service: "
if systemctl is-active --quiet mysql; then
  echo "RUNNING"
else
  echo "STOPPED / INACTIVE"
fi

echo -n "• MySQL Port 3306 Binding: "
if ss -tulpn 2>/dev/null | grep -q "127.0.0.1:3306"; then
  echo "SECURE (Bound to 127.0.0.1 only - Not exposed)"
elif ss -tulpn 2>/dev/null | grep -q "0.0.0.0:3306"; then
  echo "WARNING: Bound to 0.0.0.0 (Potentially exposed publicly!)"
else
  echo "Not listening or inaccessible"
fi

# 2. PM2 Node.js Backend Status
echo ""
echo "• Node.js Backend (PM2):"
pm2 status hrms-backend 2>/dev/null || echo "hrms-backend not running in PM2"

echo -n "• Backend HTTP Health (http://127.0.0.1:3000/): "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ || echo "FAILED")
echo "HTTP Status ${HTTP_CODE}"

# 3. Nginx Status
echo ""
echo -n "• Nginx Service: "
if systemctl is-active --quiet nginx; then
  echo "RUNNING"
else
  echo "STOPPED"
fi

echo -n "• Nginx Configuration Syntax: "
sudo nginx -t 2>/dev/null && echo "OK" || echo "SYNTAX ERROR"

# 4. Domain & SSL Status
if [ -n "${DOMAIN}" ]; then
  echo ""
  echo "• Public Domain: ${DOMAIN}"
  echo -n "• DNS Resolution: "
  RESOLVED_IP=$(dig +short "${DOMAIN}" | tail -n1)
  if [ -n "${RESOLVED_IP}" ]; then
    echo "Resolves to ${RESOLVED_IP}"
  else
    echo "DNS resolution failed or dig not available"
  fi

  echo -n "• HTTPS Response: "
  HTTPS_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}/" || echo "FAILED")
  echo "HTTP Status ${HTTPS_CODE}"
fi

echo "========================================================================"
