#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# KIRAN AUTOMATION HRMS - Non-Destructive Lightsail HTTPS API Bridge Setup
#
# Safety Guarantees:
# - NEVER creates, drops, alters, or overwrites any MySQL database or table
# - NEVER removes existing Nginx virtual hosts (preserves mytaxfinder)
# - Binds Express strictly to 127.0.0.1:3000 and MySQL to 127.0.0.1:3306
# - Restricts UFW firewall to ports 22, 80, and 443 only
# ==============================================================================

REPO_URL="https://github.com/ravikrpandey/hrms-erp.git"
BRIDGE_ROOT="/var/www/hrms-bridge"
BACKEND_DIR="${BRIDGE_ROOT}/HRMS/HRMS-BACKEND"

echo "========================================================================"
echo "Kiran Automation HRMS Lightsail HTTPS Bridge Setup (MySQL untouched)"
echo "========================================================================"

read -rp "Enter your DuckDNS full domain (e.g. myhrms-api.duckdns.org): " BRIDGE_DOMAIN
read -rp "Enter your DuckDNS subdomain only (e.g. myhrms-api): " DUCKDNS_SUB
read -rsp "Enter your DuckDNS token (hidden): " DUCKDNS_TOKEN
echo ""
read -rp "Enter your Cloudflare Worker URL (e.g. https://hrms-api.xxx.workers.dev): " WORKER_URL
read -rsp "Enter existing MySQL password for mytaxuser (hidden): " DB_PASS
echo ""

# Generate strong random secrets for JWT & Worker->Lightsail bridge auth
BRIDGE_SECRET=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)

echo "[1/7] Installing required runtime packages (preserving existing MySQL)..."
sudo apt-get update -y
sudo apt-get install -y git curl build-essential nginx certbot python3-certbot-nginx ufw openssl

if [ ! -s "${HOME}/.nvm/nvm.sh" ]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
# shellcheck source=/dev/null
source "${HOME}/.nvm/nvm.sh"
nvm install 18.20.8
nvm use 18.20.8
nvm alias default 18.20.8

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

echo "[2/7] Locking down MySQL to 127.0.0.1 and UFW firewall (22, 80, 443 only)..."
MYSQL_CNF="/etc/mysql/mysql.conf.d/mysqld.cnf"
if [ -f "${MYSQL_CNF}" ] && grep -Eq '^\s*bind-address\s*=\s*0\.0\.0\.0' "${MYSQL_CNF}"; then
  sudo sed -i 's/^\s*bind-address\s*=.*/bind-address = 127.0.0.1/' "${MYSQL_CNF}"
  sudo systemctl restart mysql
  echo "  Updated MySQL bind-address to 127.0.0.1 (public 3306 disabled locally)."
fi

sudo ufw allow 22/tcp >/dev/null
sudo ufw allow 80/tcp >/dev/null
sudo ufw allow 443/tcp >/dev/null
sudo ufw delete allow 3306/tcp 2>/dev/null || true
sudo ufw delete allow 3000/tcp 2>/dev/null || true
sudo ufw --force enable

echo "[3/7] Configuring DuckDNS IP sync..."
mkdir -p "${HOME}/duckdns"
cat > "${HOME}/duckdns/duck.sh" <<EOF
#!/usr/bin/env bash
curl -s "https://www.duckdns.org/update?domains=${DUCKDNS_SUB}&token=${DUCKDNS_TOKEN}&ip=" -o "${HOME}/duckdns/duck.log"
EOF
chmod 700 "${HOME}/duckdns/duck.sh"
"${HOME}/duckdns/duck.sh"
(crontab -l 2>/dev/null | grep -v 'duckdns/duck.sh'; echo "*/10 * * * * ${HOME}/duckdns/duck.sh >/dev/null 2>&1") | crontab -

echo "[4/7] Cloning/Updating HRMS backend code in ${BRIDGE_ROOT}..."
sudo mkdir -p "${BRIDGE_ROOT}"
sudo chown -R "${USER}:${USER}" "${BRIDGE_ROOT}"
if [ -d "${BRIDGE_ROOT}/.git" ]; then
  git -C "${BRIDGE_ROOT}" fetch origin main
  git -C "${BRIDGE_ROOT}" checkout main
  git -C "${BRIDGE_ROOT}" pull origin main
else
  git clone --branch main "${REPO_URL}" "${BRIDGE_ROOT}"
fi

echo "[5/7] Writing protected .env and installing backend dependencies..."
cd "${BACKEND_DIR}"
umask 077
cat > .env <<EOF
NODE_ENV=production
PORT=3000
SERVER_PORT=3000
HOST=127.0.0.1
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=mytaxuser
DB_PASSWORD=${DB_PASS}
DB_NAME=hrms
JWT_SECRET=${JWT_SECRET}
BRIDGE_SECRET=${BRIDGE_SECRET}
CORS_ORIGINS=https://ravikrpandey.github.io
APP_PUBLIC_URL=${WORKER_URL%/}/
APP_FRONTEND_URL=https://ravikrpandey.github.io/hrms-erp
LOG_LEVEL=info
EOF
chmod 600 .env

npm ci --omit=dev --legacy-peer-deps || npm install --omit=dev --legacy-peer-deps

# Start PM2 without overwriting existing PM2 apps
if pm2 list | grep -q "hrms-backend"; then
  pm2 reload hrms-backend --update-env
else
  pm2 start ecosystem.config.js
fi

ERP_DIR="${BRIDGE_ROOT}/ERP/elan_backend"
echo "  Setting up ERP backend in ${ERP_DIR}..."
cd "${ERP_DIR}"
cat > .env <<EOF
NODE_ENV=production
PORT=3001
SERVER_PORT=3001
HOST=127.0.0.1
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=mytaxuser
DB_PASSWORD=${DB_PASS}
DB_NAME=hrms
JWT_SECRET=${JWT_SECRET}
BRIDGE_SECRET=${BRIDGE_SECRET}
CORS_ORIGINS=https://ravikrpandey.github.io
APP_PUBLIC_URL=${WORKER_URL%/}/erp-api
APP_FRONTEND_URL=https://ravikrpandey.github.io/hrms-erp/erp
LOG_LEVEL=info
EOF
chmod 600 .env

npm ci --omit=dev --legacy-peer-deps || npm install --omit=dev --legacy-peer-deps

if pm2 list | grep -q "erp-backend"; then
  pm2 reload erp-backend --update-env
else
  pm2 start ecosystem.config.js
fi
pm2 save

echo "[6/7] Configuring isolated Nginx HTTPS site for ${BRIDGE_DOMAIN}..."
# Temporary HTTP vhost first so Certbot can issue initial certificate cleanly
sudo tee "/etc/nginx/sites-available/hrms-bridge" >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${BRIDGE_DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 200 'HRMS Bridge Pending SSL';
        add_header Content-Type text/plain;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/hrms-bridge /etc/nginx/sites-enabled/hrms-bridge
sudo nginx -t
sudo systemctl reload nginx

sudo certbot --nginx -d "${BRIDGE_DOMAIN}" --non-interactive --agree-tos --register-unsafely-without-email

# Install hardened bridge Nginx config with secret validation
TMP_CONF=$(mktemp)
sed -e "s|__BRIDGE_DOMAIN__|${BRIDGE_DOMAIN}|g" \
    -e "s|__BRIDGE_SECRET__|${BRIDGE_SECRET}|g" \
    "${BRIDGE_ROOT}/deploy/lightsail-bridge/hrms-bridge.conf" > "${TMP_CONF}"
sudo cp "${TMP_CONF}" /etc/nginx/sites-available/hrms-bridge
rm -f "${TMP_CONF}"

sudo nginx -t
sudo systemctl reload nginx

echo "[7/7] Verifying bridge authentication and MySQL health..."
UNAUTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://${BRIDGE_DOMAIN}/health" || echo "000")
AUTH_RES=$(curl -s -H "X-Bridge-Secret: ${BRIDGE_SECRET}" "https://${BRIDGE_DOMAIN}/health")
AUTH_ERP_RES=$(curl -s -H "X-Bridge-Secret: ${BRIDGE_SECRET}" "https://${BRIDGE_DOMAIN}/erp-api/health")

echo "  Unauthenticated direct access check (expected 403): HTTP ${UNAUTH_CODE}"
echo "  Authenticated HRMS bridge health check: ${AUTH_RES}"
echo "  Authenticated ERP bridge health check:  ${AUTH_ERP_RES}"
echo ""
echo "========================================================================"
echo "Lightsail HTTPS Bridge Ready!"
echo "IMPORTANT: Store these two secrets in your Cloudflare Worker via Wrangler:"
echo "  1) BRIDGE_URL    = https://${BRIDGE_DOMAIN}"
echo "  2) BRIDGE_SECRET = ${BRIDGE_SECRET}"
echo "AND ALSO remember to remove port 3306 from AWS Lightsail Console Firewall!"
echo "========================================================================"
