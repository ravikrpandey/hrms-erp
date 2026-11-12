#!/usr/bin/env bash
set -e

# ==============================================================================
# KIRAN AUTOMATION HRMS - Production Automated Backup Script
# Usage: ./backup.sh
# Performs consistent MySQL dump + Document archive + 7-day retention
# ==============================================================================

umask 077
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKUP_DIR="${PROJECT_ROOT}/backups"
TIMESTAMP="$(date +'%Y%m%d_%H%M%S')"

if [ -d "${PROJECT_ROOT}/HRMS/HRMS-BACKEND" ]; then
  BACKEND_DIR="${PROJECT_ROOT}/HRMS/HRMS-BACKEND"
else
  BACKEND_DIR="${PROJECT_ROOT}/HRMS-BACKEND"
fi

mkdir -p "${BACKUP_DIR}/db"
mkdir -p "${BACKUP_DIR}/files"

echo "========================================================================"
echo "📦 Starting Kiran Automation HRMS Automated Backup"
echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "========================================================================"

# Read database credentials from .env if present
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_USER="hrms_user"
DB_NAME="hrms"
DB_PASS=""

if [ -f "${BACKEND_DIR}/.env" ]; then
  # shellcheck source=/dev/null
  DB_HOST=$(grep -E '^DB_HOST=' "${BACKEND_DIR}/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'") || true
  DB_PORT=$(grep -E '^DB_PORT=' "${BACKEND_DIR}/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'") || true
  DB_USER=$(grep -E '^DB_USER=' "${BACKEND_DIR}/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
  DB_NAME=$(grep -E '^DB_NAME=' "${BACKEND_DIR}/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
  DB_PASS=$(grep -E '^DB_PASSWORD=' "${BACKEND_DIR}/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
fi
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"

DB_DUMP_FILE="${BACKUP_DIR}/db/hrms_db_${TIMESTAMP}.sql.gz"
MY_CNF_TMP=$(mktemp)
trap 'rm -f "${MY_CNF_TMP}"' EXIT
chmod 600 "${MY_CNF_TMP}"
cat > "${MY_CNF_TMP}" <<EOF
[client]
user=${DB_USER}
password=${DB_PASS}
host=${DB_HOST}
port=${DB_PORT}
EOF

echo "[1/3] Creating MySQL database dump for '${DB_NAME}'..."
mysqldump --defaults-extra-file="${MY_CNF_TMP}" \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --quick \
  --default-character-set=utf8mb4 \
  "${DB_NAME}" | gzip -9 > "${DB_DUMP_FILE}"
rm -f "${MY_CNF_TMP}"

echo "✔ Database dump saved: ${DB_DUMP_FILE} ($(du -h "${DB_DUMP_FILE}" | cut -f1))"

# 2. Archive Persistent Uploaded Files & Documents
echo "[2/3] Archiving employee documents and uploaded signatures..."
DOC_ARCHIVE="${BACKUP_DIR}/files/hrms_documents_${TIMESTAMP}.tar.gz"

tar -czf "${DOC_ARCHIVE}" \
  -C "${BACKEND_DIR}" \
  --exclude="node_modules" \
  uploaded_files digital_signature leadfile masterDocument 2>/dev/null || true

echo "✔ Document archive saved: ${DOC_ARCHIVE} ($(du -h "${DOC_ARCHIVE}" | cut -f1))"

# 3. Retention policy: Keep last 7 days of backups
echo "[3/3] Enforcing 7-day retention policy..."
find "${BACKUP_DIR}/db" -type f -name "*.sql.gz" -mtime +7 -delete
find "${BACKUP_DIR}/files" -type f -name "*.tar.gz" -mtime +7 -delete

echo "========================================================================"
echo "✔ Backup completed successfully!"
echo "Backups stored in: ${BACKUP_DIR}"
echo "========================================================================"
