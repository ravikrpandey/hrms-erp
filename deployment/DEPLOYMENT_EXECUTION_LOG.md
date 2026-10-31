# Deployment Execution Log

## Project: HRMS Full-Stack Production Deployment
- **Target Repository:** GitHub (Private)
- **Target Cloud Host:** Oracle Cloud Infrastructure (Ubuntu LTS VM.Standard.A1.Flex)
- **Target Subdomain:** DuckDNS (`https://<subdomain>.duckdns.org`)
- **Target SSL:** Let's Encrypt / Certbot

---

## 1. Project & Secret Audit
- **Git State:** On branch `development` at base commit `c8fb3e4f`.
- **Existing Remote:** `origin git@ssh.dev.azure.com:v3/iotkiranauto/Kiran%20Auto/ERP-HRMS` (Azure DevOps).
- **GitHub CLI:** Installed `gh` v2.103.3 into `~/.local/bin/gh` and configured `~/.bashrc`.
- **Secret Scan Performed:**
  - Database credentials abstracted to environment variables via `process.env.DB_*` in `HRMS/HRMS-BACKEND/app/config/db.config.js`.
  - Created sanitized `.env.example` with placeholders.
  - Root `.gitignore` updated and hardened against `.env`, `*.sql`, `*.log`, `node_modules`, `uploads/`, `uploaded_files/`, `digital_signature/`, `leadfile/`, `masterDocument/`, private keys, and certificates.
- **Frontend Build Status:** Verification in progress (`dist/zyno-web`).
