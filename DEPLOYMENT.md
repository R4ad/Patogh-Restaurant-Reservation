# راهنمای Deployment — پروژه پاتوق

## معماری Production

```
Internet
    │
    ▼
[ Nginx — port 80 ]          ← تنها سرویس عمومی
    │
    ├── /api/*      ─────▶  [ patogh_api — ASP.NET Core 8 — port 8080 ]
    │                               │
    ├── /uploads/*  ─────▶          │  (داخلی)
    │                         ┌─────┴──────┐
    └── /*         ─────▶    [ postgres ]  [ redis ]
    React SPA
```

- **postgres** و **redis**: شبکه داخلی Docker — بدون پورت عمومی
- **patogh_api**: داخلی — فقط از طریق Nginx قابل دسترس
- **nginx**: تنها سرویسی که پورت 80 را Publish می‌کند

---

## پیش‌نیازها

روی Ubuntu VPS:

```bash
# Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# تأیید نصب
docker --version          # 25+
docker compose version    # 2.20+
```

---

## انتقال پروژه به سرور

### روش ۱ — Git Clone (توصیه‌شده)

```bash
# روی سرور
git clone https://github.com/YOUR_USERNAME/patogh.git /opt/patogh
cd /opt/patogh
```

### روش ۲ — rsync از محیط محلی

```bash
# از ماشین محلی
rsync -avz --exclude='node_modules' --exclude='.git' \
  --exclude='front/dist' --exclude='back/patogh/src/*/bin' \
  --exclude='back/patogh/src/*/obj' \
  "/Users/radman/radman/Patogh Restaurant Reservation UI/" \
  user@YOUR_VPS_IP:/opt/patogh/
```

---

## تنظیم متغیرهای محیطی

```bash
cd /opt/patogh

cp .env.production.example .env.production
nano .env.production
```

مقادیر را تنظیم کنید:

```env
DOMAIN=patogh.example.com

POSTGRES_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

HTTP_PORT=80
```

```bash
# محدود کردن دسترسی به فایل
chmod 600 .env.production
```

---

## Build و اجرا

```bash
cd /opt/patogh

# Build همه Image‌ها و اجرا
docker compose -f docker-compose.prod.yml --env-file .env.production \
  up -d --build
```

**مدت Build:** حدود ۳–۵ دقیقه (اولین بار — وابسته به سرعت اینترنت)

### تأیید راه‌اندازی

```bash
# وضعیت Container‌ها
docker compose -f docker-compose.prod.yml ps

# Health check
curl http://localhost/health
# باید: {"status":"Healthy",...}

# بررسی Frontend
curl -I http://localhost/
# باید: HTTP/1.1 200 OK
```

---

## تنظیم SSL با Certbot + Nginx روی Host

> اگر Nginx را داخل Docker اجرا می‌کنید و می‌خواهید HTTPS داشته باشید،
> توصیه می‌شود از یک Nginx روی Host به‌عنوان SSL Terminator استفاده کنید.

```bash
# نصب Certbot
sudo apt install certbot python3-certbot-nginx -y

# نصب Nginx روی host (به عنوان reverse proxy برای Docker)
sudo apt install nginx -y

# پیکربندی Nginx host
sudo nano /etc/nginx/sites-available/patogh
```

```nginx
server {
    listen 80;
    server_name patogh.example.com www.patogh.example.com;

    location / {
        proxy_pass         http://127.0.0.1:80;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/patogh /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# صدور گواهینامه SSL
sudo certbot --nginx -d patogh.example.com -d www.patogh.example.com

# Certbot به‌صورت خودکار Nginx را برای HTTPS تنظیم می‌کند
```

> **نکته:** در این حالت `HTTP_PORT=80` در `.env.production` باقی بماند.
> Nginx host SSL را Handle می‌کند و به Docker Nginx روی پورت 80 فوروارد می‌دهد.

---

## مشاهده لاگ‌ها

```bash
# لاگ همه سرویس‌ها (آخرین ۱۰۰ خط)
docker compose -f docker-compose.prod.yml logs --tail=100

# لاگ فقط API
docker compose -f docker-compose.prod.yml logs -f api

# لاگ فقط Nginx
docker compose -f docker-compose.prod.yml logs -f nginx

# لاگ دائمی (فایل) — API از Serilog در /app/logs می‌نویسد
docker exec patogh_api ls /app/logs/
```

---

## به‌روزرسانی نسخه

```bash
cd /opt/patogh

# دریافت آخرین تغییرات
git pull origin main

# Build مجدد و راه‌اندازی با Zero-Downtime (Container‌های قدیمی بلافاصله حذف می‌شوند)
docker compose -f docker-compose.prod.yml --env-file .env.production \
  up -d --build

# حذف Image‌های قدیمی
docker image prune -f
```

---

## پشتیبان‌گیری

### PostgreSQL

```bash
# گرفتن Backup
docker exec patogh_postgres \
  pg_dump -U postgres Patogh_DB > /opt/backups/patogh-$(date +%Y%m%d).sql

# بازیابی
docker exec -i patogh_postgres \
  psql -U postgres Patogh_DB < /opt/backups/patogh-20240101.sql
```

### فایل‌های آپلودشده

```bash
# Backup Volume
docker run --rm \
  -v patogh_uploads:/data \
  -v /opt/backups:/backup \
  alpine tar czf /backup/uploads-$(date +%Y%m%d).tar.gz -C /data .
```

---

## عملیات متداول

```bash
# توقف
docker compose -f docker-compose.prod.yml stop

# راه‌اندازی مجدد
docker compose -f docker-compose.prod.yml restart

# توقف کامل و حذف Container‌ها (Volume‌ها باقی می‌مانند)
docker compose -f docker-compose.prod.yml down

# توقف کامل + حذف Volume‌ها (⚠️ داده‌ها پاک می‌شوند)
docker compose -f docker-compose.prod.yml down -v

# ورود به Shell API Container
docker exec -it patogh_api /bin/bash

# اجرای Migration دستی
docker exec patogh_api dotnet ef database update
```

---

## Health Checks

| Endpoint | توضیح |
|----------|-------|
| `GET /health` | گزارش کامل وضعیت (DB + Redis + Hangfire) |
| `GET /health/live` | Liveness probe — فقط بررسی می‌کند که پروسه زنده است |
| `GET /health/ready` | Readiness probe — بررسی اتصال به DB و Redis |

---

## نکات امنیتی

| موضوع | وضعیت |
|-------|--------|
| PostgreSQL بدون پورت عمومی | ✓ |
| Redis بدون پورت عمومی | ✓ |
| API بدون پورت عمومی | ✓ |
| JWT Secret در `.env` (خارج از Image) | ✓ |
| Data Protection Keys در Volume دائمی | ✓ |
| Rate Limiting روی Auth endpoints (5/min) | ✓ |
| Swagger UI فقط از داخل شبکه Docker | ✓ |
| Hangfire Dashboard فقط Localhost | ✓ |
| OTP تک‌بار مصرف با TTL 2 دقیقه | ✓ |
| OTP در Production در Log نمی‌آید | ✓ |

---

## عیب‌یابی

### Container‌ها راه‌اندازی نمی‌شوند

```bash
docker compose -f docker-compose.prod.yml logs api | tail -50
```

**رایج‌ترین علت‌ها:**
- `JWT_SECRET` خالی یا کوتاه‌تر از 32 کاراکتر است
- `POSTGRES_PASSWORD` در `.env.production` تنظیم نشده
- پورت 80 روی سرور قبلاً استفاده شده (`sudo lsof -i :80`)

### API با خطای Database راه نمی‌افتد

```bash
# بررسی health postgres
docker exec patogh_postgres pg_isready -U postgres
# Migration دستی
docker exec patogh_api dotnet Patogh.API.dll migrate
```

### Frontend خطای 502 Bad Gateway می‌دهد

API هنوز Health Check را پاس نکرده. صبر کنید:
```bash
watch -n5 'curl -s http://localhost/health | python3 -m json.tool'
```
