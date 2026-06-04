# CLAUDE.md — Patogh Restaurant Reservation UI

## پروژه

**Patogh (پاتوق)** — سامانه مدیریت و رزرو کافه و رستوران  
پروژه دانشگاهی (درس طراحی نرم‌افزار) · مسئول فرانت‌اند

---

## دستورات اجرا

```bash
pnpm dev      # dev server
pnpm build    # production build
```

---

## Tech Stack

| | |
|---|---|
| Framework | React 18.3.1 + TypeScript |
| Build tool | Vite 6.3.5 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| UI Components | shadcn/ui + Radix UI |
| Routing | React Router 7 |
| Forms | React Hook Form |
| Charts | Recharts |
| Notifications | Sonner (toast) |
| Animation | Motion |
| Icons | lucide-react (فقط از این استفاده کن) |
| Date | date-fns |
| Package manager | pnpm |

---

## ساختار پروژه

```
src/
  app/
    App.tsx                  # routing + layout root
    pages/                   # صفحات
      owner/                 # صفحات مخصوص مدیر رستوران
    components/
      shared/                # کامپوننت‌های مشترک
      ui/                    # shadcn/ui components
  styles/
    theme.css                # CSS custom properties / رنگ‌ها
    tailwind.css             # tailwind directives + animations
    index.css                # entry point استایل
  main.tsx
guidelines/
  Guidelines.md
```

---

## نقش‌های کاربری (3 نقش)

| نقش | توضیح | Route اصلی |
|---|---|---|
| **Customer (مشتری)** | جستجو، رزرو، داشبورد شخصی | `/customer-dashboard` |
| **Manager (مدیر رستوران)** | ثبت رستوران، منو، میزها، مدیریت رزروها | `/manager-dashboard` |
| **Admin (مدیر ارشد)** | تایید رستوران‌ها، نظارت کلان | `/admin` |

---

## Routes

```
# Customer
/                           HomePage
/search                     SearchResults
/restaurant/:id             RestaurantDetails
/reservation/:id            ReservationForm
/reservation-confirmation   ReservationConfirmation
/customer-dashboard         CustomerDashboard
/favorites                  Favorites
/notifications              Notifications
/support                    Support

# Auth
/login                      RoleSelection
/login/customer             LoginPage
/login/owner                LoginPage
/otp-verify                 OTPVerification

# Manager
/onboarding                 RestaurantOnboarding (8 مرحله)
/manager-dashboard          ManagerDashboard
/manager-dashboard/menu     MenuManagement
/manager-dashboard/hours    WorkingHoursSettings

# Admin (باید ساخته شود)
/admin                      AdminDashboard ❌
/admin/login                AdminLogin ❌
```

---

## وضعیت فعلی

### ✅ ساخته شده (UI)
- همه صفحات مشتری
- Auth flow: RoleSelection → Login → OTP
- Manager: Onboarding، ManagerDashboard، MenuManagement، WorkingHours
- کامپوننت‌های مشترک + shadcn/ui کامل

### ❌ هنوز ساخته نشده
- Admin Panel (مدیر ارشد سامانه)
- API integration (صفحات فعلی همه mock data دارن)
- Auth context / state management
- Reservation endpoints (از بک‌اند هنوز نگرفتیم)

---

## API Endpoints (REST/JSON)

> base URL از بک‌اند تیم دریافت می‌شه. token در Authorization header ارسال می‌شه.

### Auth

```
POST /register
  Request:  { PhoneNumber, Password, Role }
  Response: { success, UserId }

POST /login
  Request:  { PhoneNumber, Password }
  Response: { accessToken, PhoneNumber }

POST /send-otp
  Request:  { PhoneNumber }
  Response: { success, message }

POST /verify-otp
  Request:  { PhoneNumber, Code }
  Response: { accessToken, PhoneNumber }
```

### Restaurants

```
GET /restaurants
  Response: { Restaurants: list }

GET /restaurant/:id
  Response: { Name, Description, Location, FoodType, MenuItems: list, Tables: list }

POST /create-restaurant   [Manager]
  Request:  { Name, Description, Location, FoodType, StartTime, EndTime }
  Response: { success, message }

POST /create-menu-item    [Manager]
  Request:  { RestaurantId, Name, Description, Image, Price }
  Response: { success, message }

POST /create-table        [Manager]
  Request:  { RestaurantId, TableNumber, Capacity }
  Response: { success, message }
```

### Admin

```
POST /admin/login
  Request:  { Username, Password }
  Response: { success, message, accessToken }

GET /admin/restaurants   (لیست رستوران‌های pending)
  Response: { Restaurants: list }

POST /admin/approve-restaurant
  Request:  { RestaurantId, IsApproved: boolean }
  Response: { success, message }
```

---

## Auth Flow

```
1. کاربر شماره + پسورد وارد می‌کنه
2. POST /login یا POST /verify-otp
3. accessToken در localStorage ذخیره می‌شه
4. redirect بر اساس Role:
   - "customer" → /customer-dashboard
   - "manager"  → /manager-dashboard
   - "admin"    → /admin
```

---

## Design System

| | |
|---|---|
| Primary (رنگ اصلی) | `#ea580c` (orange-600) |
| Background | `#fafaf9` |
| Foreground | `#1c1917` |
| Accent | `#fff7ed` |
| Destructive | `#dc2626` |
| Border radius | `0.75rem` |
| Direction | RTL — `dir="rtl"` روی root div |
| زبان محتوا | فارسی |
| Dark mode | پشتیبانی شده (`.dark` class) |

رنگ‌ها و tokenها در `src/styles/theme.css` تعریف شدن. مستقیم hex نزن، از CSS variables استفاده کن.

---

## Code Conventions

- **Named exports:** `export const MyComponent = () => {}`  — نه default export برای صفحات
- **Naming:** PascalCase برای components، camelCase برای variables/functions
- **UI Library:** فقط از shadcn/ui و Radix UI — هیچ import جدیدی از MUI نزن
- **Icons:** فقط `lucide-react`
- **Forms:** `react-hook-form`
- **Toasts:** `sonner`
- **Path alias:** `@` → `./src`
- **زبان کامنت/متغیر:** مختلط (انگلیسی یا فارسی — هرجا واضح‌تره)

---

## Roadmap (اولویت‌بندی شده)

1. **API service layer** — ساخت `src/app/services/` با فانکشن‌های fetch برای هر endpoint
2. **Auth context** — `src/app/context/AuthContext.tsx` برای نگه‌داری token و role
3. **وصل کردن صفحات به API** — جایگزینی mock data با API calls
4. **Admin Panel** — صفحات `/admin/login` و `/admin` با تایید/رد رستوران
5. **Reservation endpoints** — دریافت از بک‌اند و integrate کردن
