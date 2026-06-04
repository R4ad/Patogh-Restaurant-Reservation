Design a modern, clean, high-fidelity, fully responsive Persian / RTL web application UI for a cafe & restaurant reservation SaaS + marketplace called “Patogh” / “پاتوق”.

Use the uploaded reference image as inspiration for overall structure and screen flow, but improve everything: spacing, hierarchy, typography, grid, responsiveness, accessibility, and production-ready quality. The final output must feel like a real implementable product with complete flows and edge cases. Do NOT omit any required screens; design all missing pages needed for a complete product.

====================================================
GLOBAL DESIGN RULES (MUST FOLLOW)
====================================================
- Language: Persian
- Direction: RTL on all screens
- Tone/Style: modern, minimal, warm, premium, calm, restaurant/cafe-oriented
- Primary color: warm orange (use for main CTAs, highlights, active states)
- Neutrals: off-white/light gray backgrounds, dark readable text, subtle borders
- Components: rounded cards, subtle shadows, clean dividers, comfortable spacing
- Imagery: realistic high-quality cafe/food photos (placeholders allowed but realistic)
- Typography: Persian-friendly font choices, clear hierarchy (H1/H2/body/caption)
- Accessibility: strong contrast for text, visible focus states, large touch targets on mobile
- Responsiveness:
  - Desktop: full layout, multi-column grids, sidebars, tables
  - Tablet: reduced columns, compact spacing
  - Mobile: stacked layout, full-width cards, sticky bottom CTA when relevant, drawer navigation
- Create both: (1) Customer-facing experience (2) Restaurant owner dashboard experience
- Maintain consistent design system across all screens (same components, same tokens)
- Provide realistic Persian sample data/content everywhere (names, addresses, prices, statuses)

====================================================
INFORMATION ARCHITECTURE (DESIGN ALL THESE)
====================================================

A) CUSTOMER (MARKETPLACE) SCREENS

A1) Landing / Customer Home Page
- Header: logo “پاتوق”, nav items, search shortcut, “ورود / ثبت‌نام”
- Hero:
  - Headline: “بهترین کافه و رستوران‌ها را پیدا کنید و آنلاین رزرو کنید”
  - Supporting text
  - Primary CTA: “جستجو”
- Search & Filter bar (desktop inline, mobile in a sheet/drawer):
  - City (dropdown)
  - Category/type (کافه/رستوران/فست‌فود/…)
  - Date picker (Persian date UI style)
  - Time picker
  - Guest count stepper
  - Optional: price level, rating, “فقط دارای ظرفیت”
- Featured restaurants section: cards with image, name, rating, city/area, category, price level, quick “رزرو”
- Collections/Highlights: “محبوب‌ترین‌ها”, “پیشنهاد امروز”
- “How it works” section (3 steps): جستجو → انتخاب زمان → رزرو
- Footer: links, support, social, city links

A2) Search Results / Listing Page
- Sticky search summary bar
- Filters:
  - Desktop: left/right sidebar (RTL appropriate)
  - Mobile: filter drawer + sort bottom sheet
- Sort options (rating, distance, price, most available)
- Results: grid on desktop, list on mobile
- Each card: image, title, rating, tags, “مشاهده” + “رزرو”
- States:
  - Loading skeleton
  - Empty results state with suggestions
  - Error state (retry)

A3) Restaurant / Cafe Details Page
- Hero/gallery with thumbnails
- Info card:
  - Name, rating, category tags, price level
  - Address + map preview
  - Working hours
  - Amenities chips (Wi‑Fi, فضای باز, پارکینگ, …)
  - Buttons: “ذخیره”, “اشتراک‌گذاری”, “تماس”
- Tabs (sticky on scroll):
  - منو
  - گالری
  - نظرات
  - اطلاعات
- Menu tab:
  - Category sections
  - Items with image, name, description, price, labels (محبوب/گیاهی/تند/…)
- Reviews tab:
  - Rating summary + distribution
  - Review list
  - Button “ثبت نظر”
- Info tab:
  - About, rules, cancellation policy, contact, location details
- Reservation widget/card (desktop sticky side, mobile fixed bottom CTA):
  - Date, time, guest count, available slots
  - CTA: “ادامه رزرو”
- States:
  - No menu items
  - No reviews
  - No gallery images

A4) Reservation Flow (Customer)
A4-1) Reservation Step 1: Select Date/Time/Guests (if not already selected)
- Show available slots, disabled slots, capacity indicators
- CTA to continue

A4-2) Reservation Form Page (Customer Details)
- Summary card: restaurant, chosen date/time/guests
- Form fields:
  - نام و نام خانوادگی (required)
  - شماره موبایل (required)
  - توضیحات/درخواست ویژه (optional)
- Validation: inline errors, required markers
- CTA: “ثبت درخواست رزرو”
- Loading state for submit

A4-3) Reservation Confirmation (Success)
- Success message
- Summary card with reservation code
- Buttons: “مشاهده رزروهای من” + “بازگشت به خانه”

A4-4) Reservation Pending / Status Page (optional but recommended)
- Show timeline: ثبت شد → در انتظار تایید → تایید/رد
- Explain expected response time
- Actions: contact restaurant, back

A5) Customer Auth (Role-based)
A5-1) Role Selection Screen
- Two cards:
  - “ورود/ثبت‌نام مشتری”
  - “ورود/ثبت‌نام صاحب رستوران”
- Explanation of differences

A5-2) Customer Login/Signup (Mobile + OTP)
- Enter mobile number
- OTP verification screen
- Resend code, timer
- Optional: complete profile after first login:
  - Name
  - Email (optional)
  - City

A6) Customer Dashboard (My Account)
- Desktop: sidebar
- Mobile: bottom nav or drawer
- Sections:
  - Overview widgets (next reservation, pending count)
  - “رزروهای من” list with status badges:
    - در انتظار تایید
    - تایید شده
    - رد شده
    - لغو شده
    - انجام شده
  - Each reservation card: restaurant image, date/time, guests, status, actions:
    - “جزئیات”
    - “لغو رزرو” (if allowed)
- Filters inside dashboard (status, date)

A7) Reservation Details (Customer)
- Full details:
  - Restaurant info, address, phone
  - Date/time/guests
  - User note
  - Status timeline
  - Reservation code
- Actions:
  - Cancel reservation (with modal confirmation)
  - Contact restaurant
  - Reserve again

A8) Cancel Reservation Flow (Customer)
- Cancel modal:
  - Confirm text
  - Optional reason dropdown
  - “انصراف” + “تایید لغو”
- Success toast + updated status

A9) Favorites / Saved Places (Customer)
- Grid/list of saved restaurants
- Empty state “هنوز جایی ذخیره نکرده‌اید”
- Actions: remove, view details

A10) Customer Profile & Settings
- Edit profile
- Notification preferences
- Privacy
- Save button
- Success/failure states

A11) Write Review Flow (Customer)
- Rating stars
- Textarea
- Upload optional photos (optional)
- Submit
- Success state
- Error state

A12) Customer Notifications
- Notification list
- Types: reservation approved/rejected, reminders, promos
- Empty state

A13) Support / Help
- FAQ
- Contact support form
- Ticket success state

A14) System pages (Customer side)
- 404 page
- 500/error page
- Maintenance/info page (optional)

====================================================

B) RESTAURANT OWNER (MANAGER) SCREENS — FULL PANEL

B1) Owner Auth (Mobile + OTP)
- Owner login/signup screens distinct from customer
- OTP verify
- Optional: invite/team access later (see B12)

B2) Restaurant Onboarding / Registration (MULTI-STEP WIZARD)
Create a complete multi-step onboarding with a progress indicator and save-as-draft.
Steps:
1) Business basics:
   - نام مجموعه
   - نوع مجموعه (کافه/رستوران/…)
   - توضیح کوتاه
2) Contact & owner info:
   - نام مدیر
   - شماره تماس
   - ایمیل (optional)
3) Location:
   - شهر
   - آدرس کامل
   - انتخاب روی نقشه
4) Working hours:
   - روزهای هفته
   - ساعت شروع/پایان
   - break time (optional)
5) Capacity & reservation settings:
   - ظرفیت کلی
   - مدت هر رزرو (مثلا ۹۰ دقیقه)
   - فاصله بین رزروها
   - حداکثر نفرات در هر رزرو
6) Reservation policy:
   - قوانین حضور
   - قوانین لغو
   - توضیحات برای مشتری
7) Media upload:
   - لوگو
   - کاور
   - گالری تصاویر
8) Review & submit:
   - Summary review page
   - Submit for approval

After submission:
- “در انتظار تایید پاتوق” status page with next steps
- If rejected: show required fixes checklist

B3) Owner Dashboard Home
- Sidebar navigation (RTL)
- Top stats cards:
  - رزروهای امروز
  - درخواست‌های در انتظار
  - تایید شده‌ها
  - لغو شده‌ها
- Chart: reservations over time (week/month)
- Today schedule preview
- Recent requests list with quick actions
- Notifications preview

B4) Reservation Requests Management (Owner)
- Desktop: responsive table
  Columns: نام مشتری، تاریخ، ساعت، تعداد نفرات، وضعیت، کانال (پاتوق/تلفنی/دستی), عملیات
- Actions:
  - تایید
  - رد
  - مشاهده جزئیات
- Bulk actions (optional): approve/reject multiple
- Filters: date range, status, guests count
- Search by customer name/mobile
- Mobile: table becomes cards with the same info

B5) Reservation Details (Owner)
- Customer: name + phone + call button
- Reservation details: date/time/guests
- Customer note
- Internal notes (private)
- Status timeline
- Actions:
  - Approve / Reject (with reason modal)
  - Edit reservation (if allowed)
  - Assign table (if using table management)
  - Message/call customer
- Toast feedback on actions

B6) Reservation Calendar / Schedule View (Owner)
- Calendar (month/week/day)
- List view toggle
- Time slots view for a day
- Visual occupancy indicator
- Tap opens reservation details

B7) Working Hours & Closed Dates (Owner)
- Weekly hours editor
- Add exceptions:
  - تعطیلات
  - ساعات خاص
- Block specific date/time ranges
- Save states

B8) Capacity & Slot Settings (Owner)
- Slot interval settings (e.g., 15/30 mins)
- Max reservations per slot
- Max guests per slot
- Buffer time
- Deposit/prepayment toggle (optional)
- Overbooking rules (optional)
- Preview of customer availability UI

B9) Restaurant Profile Management (Owner)
- Edit:
  - name, categories, tags
  - description
  - amenities
  - address + map
  - contact info
  - social links
  - price level
- Save + success/error states

B10) Menu Management (Owner) — FULL CRUD
- Menu overview page:
  - Categories list (sortable)
  - Items list per category
  - Search items
- Add/Edit Category:
  - name
  - visibility toggle
- Add/Edit Menu Item:
  - نام آیتم
  - توضیح
  - قیمت
  - دسته‌بندی
  - تصویر
  - برچسب‌ها (محبوب/گیاهی/تند/…)
  - موجود/ناموجود toggle
- Reorder categories/items via drag handle
- Delete confirmation modal
- Empty states: no categories / no items
- Bulk availability toggle (optional)

B11) Gallery / Media Management (Owner)
- Upload multiple images
- Set cover image
- Reorder
- Delete with confirm
- Compression/loading progress UI
- Empty state

B12) Staff / Team Management (Owner) (recommended)
- Invite staff by phone/email
- Roles:
  - Owner/Admin
  - Manager
  - Support/Viewer
- Permissions matrix UI (simple)
- Remove member / change role

B13) Reviews Management (Owner)
- View reviews list
- Reply to a review
- Report a review (optional)
- Rating analytics summary

B14) Notifications Center (Owner)
- In-app notifications list
- Mark as read
- Empty state

B15) Analytics & Reports (Owner)
- KPIs: approval rate, cancellations, peak hours, average guests
- Charts
- Export button (CSV/PDF optional UI)
- Date range filter

B16) Payments/Billing (Optional if product includes subscription)
- Subscription plan card
- Invoices list
- Payment method UI
(If not applicable, still create a placeholder “به‌زودی” empty state screen)

B17) Owner Settings
- Account settings
- Notification preferences
- Security:
  - session list
  - logout all
- Business verification status:
  - pending/approved/rejected + required actions checklist

B18) Owner Support
- Help center link
- Contact support form inside panel
- Ticket list

====================================================

C) SHARED COMPONENTS + UI KIT (MUST CREATE)
====================================================
Create a reusable component library and tokens:
- Color tokens (primary, neutrals, success, warning, error, info)
- Typography scale (H1/H2/H3/body/caption)
- Spacing system (e.g., 4/8/12/16/24/32)
- Grid system for desktop/tablet/mobile (RTL)
Components:
- Header (customer)
- Footer
- Sidebar (owner + customer dashboard)
- Bottom navigation (mobile customer)
- Drawer navigation (mobile)
- Restaurant card (variants: default, compact, horizontal)
- Reservation card (variants)
- Search/filter bar (desktop + mobile sheet)
- Inputs: text, textarea, phone, OTP, select, date picker style, time picker style, stepper
- Buttons: primary, secondary, outline, text, destructive + icon button
- Badges: statuses (pending/approved/rejected/cancelled/completed)
- Tabs
- Table (responsive)
- Pagination
- Breadcrumbs (optional)
- Modal/dialog
- Toast/snackbar
- Tooltip (optional)
- File upload component (with progress)
- Map preview component
- Empty state component (illustration + title + action)
- Skeleton loaders for cards/tables/details

Component States (DESIGN THEM):
- Default, Hover, Active, Focus (visible), Disabled
- Error, Success, Warning
- Loading (spinners/skeleton)
- Validation messages patterns

====================================================
D) REQUIRED EDGE CASES & STATES (MUST INCLUDE)
====================================================
Design explicit UI for:
- Empty data:
  - No reservations (customer & owner)
  - No favorites
  - No menu categories/items
  - No gallery images
  - No notifications
  - No reviews
- Loading:
  - Home sections loading
  - Search results loading
  - Restaurant details loading
  - Dashboard tables loading
- Errors:
  - Network error with retry
  - Form validation error examples (phone invalid, required fields)
  - Upload failed state with retry
  - Access blocked (restaurant pending approval) state
- 404 / not found page

====================================================
E) CONTENT REQUIREMENTS (MUST FOLLOW)
====================================================
- Use realistic Persian content:
  - Restaurant names (e.g., “کافه نارنج”, “رستوران سنتی بهار”)
  - Locations (Tehran, Shiraz, Isfahan neighborhoods)
  - Prices in تومان
  - Dates in Persian style
  - Status labels in Persian
- Use consistent icon style and spacing
- Keep UI uncluttered but complete

====================================================
OUTPUT REQUIREMENTS
====================================================
- Provide full designs for Desktop, Tablet, Mobile for key screens.
- Ensure all screens share the same design system and components.
- Deliver high-fidelity, production-ready UI screens with consistent naming and layout.
- Do NOT skip the restaurant owner onboarding, menu management, schedule/capacity settings, and reservation management flows.
