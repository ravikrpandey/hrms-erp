# Zyno HRMS Production Deployment & Hosting Guide
## Oracle Cloud Always Free (ARM64) + DuckDNS + HTTPS + GitHub

---

## 1. System Architecture

```
                                  Internet
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │   https://<subdomain>.duckdns.org       │
                │        (Let's Encrypt SSL/TLS)          │
                └────────────────────┬────────────────────┘
                                     │ (Port 80/443)
                                     ▼
                      ┌─────────────────────────────┐
                      │    Oracle Cloud Ubuntu      │
                      │   (UFW: 22, 80, 443 ONLY)   │
                      └──────────────┬──────────────┘
                                     │
                                     ▼
                      ┌─────────────────────────────┐
                      │     Nginx Web Server        │
                      └──────────────┬──────────────┘
                       │                            │
        ┌──────────────┘                            └──────────────┐
        │ / (SPA Static Files)                                     │ /api/*, /uploaded_files/*
        ▼                                                          ▼
┌───────────────────────────┐                        ┌───────────────────────────┐
│   Angular 15 Production   │                        │     Node.js / Express     │
│   (/var/www/hrms/dist)    │                        │   (127.0.0.1:3000 on PM2) │
└───────────────────────────┘                        └─────────────┬─────────────┘
                                                                   │ (Internal TCP)
                                                                   ▼
                                                     ┌───────────────────────────┐
                                                     │      MySQL 8.4 LTS        │
                                                     │     (127.0.0.1:3306)      │
                                                     │   Never exposed publicly  │
                                                     └───────────────────────────┘
```

---

## 2. Phase 1: Oracle Cloud Always Free VM Provisioning

1. Sign in to your Oracle Cloud Console: https://cloud.oracle.com/
2. Navigate to **Compute** -> **Instances** -> **Create Instance**.
3. Select configuration:
   - **Name:** `hrms-production`
   - **Image:** Canonical Ubuntu 22.04 Minimal or Standard.
   - **Shape:** `Ampere VM.Standard.A1.Flex` (ARM64)
     - **OCPUs:** 2
     - **Memory:** 12 GB
   - **Networking:** Create new or use default VCN with a **Public Subnet** and **Assign a public IPv4 address**.
   - **SSH Keys:** Generate or upload your public SSH key (`id_rsa.pub` or `id_ed25519.pub`).
   - **Boot Volume:** 50 GB.
4. **VCN Security List Configuration**:
   - Go to **Networking** -> **Virtual Cloud Networks** -> your VCN -> **Security Lists** -> **Default Security List**.
   - Under **Ingress Rules**, ensure the following ports are open:
     - `Port 22` (TCP, SSH)
     - `Port 80` (TCP, HTTP)
     - `Port 443` (TCP, HTTPS)
   - **IMPORTANT:** Ensure ports `3306` (MySQL) and `3000` (Node.js) are NOT opened in the Security List.

---

## 3. Phase 2: Ubuntu Server Hardening & Dependencies

Connect to the instance via SSH:
```bash
ssh -i /path/to/private_key ubuntu@<ORACLE_VM_PUBLIC_IP>
```

### 3.1 System Updates & Firewall
```bash
sudo apt update && sudo apt upgrade -y
sudo hostnamectl set-hostname hrms-production

# Configure UFW Firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 3.2 Install Dependencies (Node.js 18, MySQL 8.4, Nginx, PM2, Certbot)
```bash
# 1. Install Git, Curl, Build Tools
sudo apt install -y git curl build-essential certbot python3-certbot-nginx

# 2. Install Node.js 18 via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18.20.8
nvm use 18.20.8
nvm alias default 18.20.8

# 3. Install PM2 globally
npm install -g pm2

# 4. Install Nginx
sudo apt install -y nginx

# 5. Install MySQL Server 8.4 LTS
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

---

## 4. Phase 3: DuckDNS Configuration

1. Log in to [DuckDNS](https://www.duckdns.org/).
2. Create your preferred subdomain: `your-subdomain.duckdns.org`.
3. Point the subdomain to your Oracle VM public IP.
4. Set up automatic IP synchronization on the Ubuntu server:
```bash
mkdir -p ~/duckdns
cat << 'EOF' > ~/duckdns/duck.sh
#!/bin/bash
curl -s "https://www.duckdns.org/update?domains=YOUR_SUBDOMAIN&token=YOUR_DUCKDNS_TOKEN&ip=" -o ~/duckdns/duck.log
EOF
chmod 700 ~/duckdns/duck.sh

# Add to crontab (runs every 10 minutes)
(crontab -l 2>/dev/null; echo "*/10 * * * * ~/duckdns/duck.sh >/dev/null 2>&1") | crontab -
~/duckdns/duck.sh
```

---

## 5. Phase 4: Deploy from GitHub using Dedicated Deploy Key

1. Generate a dedicated read-only deploy key on the Oracle VM:
```bash
ssh-keygen -t ed25519 -C "oracle-hrms-deploy" -f ~/.ssh/id_ed25519_deploy -N ""
cat ~/.ssh/id_ed25519_deploy.pub
```
2. In GitHub, go to `https://github.com/ravikrpandey/hrms-erp` -> **Settings** -> **Deploy keys** -> **Add deploy key**:
   - **Title:** `Oracle Cloud Production`
   - Paste the public key.
   - Leave "Allow write access" unchecked (read-only least privilege).
3. Configure SSH client on the VM:
```bash
cat << 'EOF' >> ~/.ssh/config
Host github.com
    IdentityFile ~/.ssh/id_ed25519_deploy
    IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```
4. Clone the repository into `/var/www/hrms`:
```bash
sudo mkdir -p /var/www/hrms
sudo chown -R $USER:$USER /var/www/hrms
git clone git@github.com:ravikrpandey/hrms-erp.git /var/www/hrms
chmod +x /var/www/hrms/deploy/*.sh
```

---

## 6. Phase 5: MySQL Database Setup & Migration

### 6.1 Create Production Database & Dedicated User
```sql
sudo mysql -e "CREATE DATABASE hrms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER 'hrms_user'@'127.0.0.1' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';"
sudo mysql -e "GRANT ALL PRIVILEGES ON hrms.* TO 'hrms_user'@'127.0.0.1';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### 6.2 Export Database from Source Machine (Laptop / Local)
Run on source workstation:
```bash
mysqldump -u devuser -p \
  --single-transaction \
  --routines \
  --triggers \
  --events \
  --default-character-set=utf8mb4 \
  hrms | gzip -9 > hrms_backup.sql.gz

# Secure copy to Oracle VM
scp -i /path/to/key hrms_backup.sql.gz ubuntu@<ORACLE_VM_IP>:~/
```

### 6.3 Import & Verify on Production VM
```bash
zcat ~/hrms_backup.sql.gz | mysql -u hrms_user -p hrms

# Verify table count (should equal 742 tables)
mysql -u hrms_user -p -e "SELECT count(*) AS total_tables FROM information_schema.tables WHERE table_schema = 'hrms';"
```

---

## 7. Phase 6: Production Nginx & Let's Encrypt SSL

1. Install initial Nginx virtual host for SSL issuance:
```bash
sudo sed -i 's/${DOMAIN_NAME}/YOUR_SUBDOMAIN.duckdns.org/g' /var/www/hrms/deploy/nginx/hrms-production.conf
sudo cp /var/www/hrms/deploy/nginx/hrms-production.conf /etc/nginx/sites-available/hrms
sudo ln -sf /etc/nginx/sites-available/hrms /etc/nginx/sites-enabled/hrms
sudo rm -f /etc/nginx/sites-enabled/default
```
2. Request Let's Encrypt SSL certificate:
```bash
sudo certbot --nginx -d YOUR_SUBDOMAIN.duckdns.org
```
3. Verify automatic renewal dry-run:
```bash
sudo certbot renew --dry-run
```

---

## 8. Phase 7: Application Deployment & Lifecycle Commands

Run the full deployment script:
```bash
cd /var/www/hrms/deploy
./deploy.sh main
```

Daily Operations:
- **Status Check:** `./status.sh YOUR_SUBDOMAIN.duckdns.org`
- **Backup:** `./backup.sh` (schedule in crontab at 02:00 daily)
- **Restart Services:** `./start.sh`
- **Stop Backend:** `./stop.sh`
