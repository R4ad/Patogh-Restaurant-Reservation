# پاتوق — سامانه مدیریت و رزرو کافه/رستوران

> **Patogh** — A full-stack restaurant reservation management system built as a university Software Engineering project.

---

## معرفی / Overview

سامانه **پاتوق** یک پلتفرم کامل برای رزرو میز رستوران است که سه نقش کاربری متمایز را پوشش می‌دهد: مشتری، مدیر رستوران، و ادمین سیستم.

Patogh is a full-stack restaurant reservation platform with three distinct user roles: **Customer**, **Restaurant Manager (Owner)**, and **System Admin**. Built with React + TypeScript on the frontend and ASP.NET Core 8 Clean Architecture on the backend.

---

## ویژگی‌ها / Features

### مشتری / Customer
- ثبت‌نام و ورود با رمز عبور یا OTP
- جستجو و مشاهده لیست رستوران‌ها
- رزرو میز با انتخاب تاریخ، ساعت، و تعداد نفرات
- مشاهده و مدیریت رزروهای فعال

### مدیر رستوران / Restaurant Manager
- ثبت و مدیریت اطلاعات رستوران
- مدیریت میزها (تعداد، ظرفیت)
- مشاهده و تأیید/لغو رزروها
- آپلود تصاویر رستوران

### ادمین / Admin
- تأیید یا رد رستوران‌های جدید
- مشاهده و مدیریت کل سیستم
- مدیریت کاربران و رستوران‌ها

---

## تکنولوژی / Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui |
| **State / Forms** | React Hook Form, React Router v7 |
| **Backend** | ASP.NET Core 8, Clean Architecture (CQRS + MediatR) |
| **ORM / DB** | Entity Framework Core 8, PostgreSQL 16 |
| **Cache / Queue** | Redis 7, Hangfire |
| **Auth** | JWT Bearer + Refresh Tokens, BCrypt.Net-Next |
| **Validation** | FluentValidation |
| **Logging** | Serilog (Console + File) |
| **Infrastructure** | Docker, Docker Compose |

---

## معماری / Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React + Vite)    :5173                           │
│  ↕ REST API                                                 │
│  Backend (ASP.NET Core)     :8080                           │
│  ↕                    ↕                                     │
│  PostgreSQL :5433     Redis :6380  (Docker host ports)      │
└─────────────────────────────────────────────────────────────┘

Backend — Clean Architecture Layers:
  Patogh.Domain        → Entities, Enums, Interfaces
  Patogh.Application   → CQRS Commands/Queries, DTOs, Validators
  Patogh.Infrastructure → Services, JWT, SMS, Hangfire
  Patogh.Persistence   → EF Core DbContext, Migrations, Seeder
  Patogh.API           → Controllers, Middleware, Startup
```

---

## ساختار پروژه / Project Structure

```
Patogh Restaurant Reservation UI/
├── front/                        # React + TypeScript frontend
│   ├── src/
│   │   ├── api/                  # Axios API client + endpoints
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Route-level page components
│   │   │   ├── admin/            # Admin panel pages
│   │   │   ├── manager/          # Restaurant manager pages
│   │   │   └── customer/         # Customer-facing pages
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # TypeScript types/interfaces
│   │   └── lib/                  # Utilities
│   ├── .env.example              # Frontend env template
│   └── package.json
│
├── back/patogh/                  # ASP.NET Core backend
│   ├── src/
│   │   ├── Patogh.API/           # Entry point, controllers
│   │   ├── Patogh.Application/   # CQRS, DTOs, validators
│   │   ├── Patogh.Domain/        # Core entities
│   │   ├── Patogh.Infrastructure/# External services
│   │   └── Patogh.Persistence/   # DB context, migrations, seed
│   ├── docker-compose.yml        # Production compose
│   ├── docker-compose.override.yml # Dev overrides
│   ├── Dockerfile
│   └── .env.example              # Backend env template
│
├── docs/
│   └── API.md                    # API endpoint reference
├── scripts/
│   ├── dev.sh                    # Start all services
│   ├── stop.sh                   # Stop all services
│   └── logs.sh                   # Tail logs
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

---

## پیش‌نیازها / Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) ≥ 24
- [Node.js](https://nodejs.org/) ≥ 20 (for frontend dev server)
- `npm` ≥ 10 (bundled with Node.js)

Optional (for backend local development without Docker):
- [.NET SDK 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)

---

## اجرای سریع با Docker / Quick Start (Docker)

```bash
# 1. Clone the repository
git clone <repo-url>
cd "Patogh Restaurant Reservation UI"

# 2. Set up backend environment variables
cp back/patogh/.env.example back/patogh/.env
# Edit back/patogh/.env and set your own passwords

# 3. Start backend services (API + PostgreSQL + Redis)
cd back/patogh
docker compose up -d

# 4. Set up frontend environment
cd ../../front
cp .env.example .env.local
# .env.local already has VITE_API_URL=http://localhost:8080

# 5. Install dependencies and start frontend
npm install
npm run dev
```

---

## اجرا با اسکریپت / Run with Scripts

```bash
# Start all services (Docker backend + frontend dev server)
./scripts/dev.sh

# Stop all services
./scripts/stop.sh

# Tail API logs
./scripts/logs.sh
```

---

## آدرس‌های توسعه / Development URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger |
| Hangfire Dashboard | http://localhost:8080/hangfire |
| PostgreSQL | localhost:5433 |
| Redis | localhost:6380 |

---

## متغیرهای محیطی / Environment Variables

### Backend (`back/patogh/.env`)

Copy `back/patogh/.env.example` → `back/patogh/.env` and fill in:

| Variable | Description |
|---|---|
| `POSTGRES_PASSWORD` | PostgreSQL database password |
| `REDIS_PASSWORD` | Redis authentication password |
| `JWT_SECRET` | JWT signing secret (≥ 32 chars; generate: `openssl rand -base64 48`) |

### Frontend (`front/.env.local`)

Copy `front/.env.example` → `front/.env.local`:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | Backend API base URL |
| `VITE_USE_MOCK` | `false` | Use mock data (no backend needed) |

---

## مایگریشن و Seed داده / Database Migration & Seed

Migrations are applied **automatically on startup** via `IApplicationBuilder` extension (`MigrateAndSeedAsync`).

Seed data includes 2 sample restaurants, 6 tables, sample menu items, and 5 test users.

To apply manually (if running backend outside Docker):
```bash
cd back/patogh
dotnet ef database update --project src/Patogh.Persistence --startup-project src/Patogh.API
```

---

## حساب‌های آزمایشی / Test Accounts

> **Development only — change these credentials before production deployment.**

| Role | Phone | Password |
|---|---|---|
| Admin | `09000000000` | `Test@1234` |
| Restaurant Manager | `09111111111` | `Test@1234` |
| Customer | `09333333333` | `Test@1234` |

---

## مستندات API / API Documentation

Full API documentation is available at **http://localhost:8080/swagger** when the backend is running.

See [`docs/API.md`](docs/API.md) for a summary of all endpoint groups.

---

## وضعیت پروژه / Project Status

- [x] Authentication (Password + OTP login, JWT + Refresh tokens)
- [x] Restaurant management (CRUD, approval workflow)
- [x] Table management
- [x] Reservation system (create, confirm, cancel, complete)
- [x] Admin panel
- [x] Manager dashboard
- [x] Customer dashboard
- [x] Docker Compose setup
- [ ] Unit and integration tests
- [ ] Email/SMS notifications (stub only)
- [ ] Production deployment configuration

---

## کارهای آینده / Future Work

- [ ] Real SMS gateway integration
- [ ] Payment gateway integration
- [ ] Reservation reminder notifications
- [ ] Customer reviews and ratings
- [ ] Advanced search and filtering
- [ ] Mobile-responsive improvements
- [ ] Comprehensive test suite

---

## مجوز / License

MIT — see [LICENSE](LICENSE)

---

## نویسنده / Author

Developed as a university Software Engineering project.
