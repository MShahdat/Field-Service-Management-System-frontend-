# Field Service Management System — Frontend

A production-ready **Next.js frontend** for a complete Field Service Management System. Customers request on-site services, Managers triage requests and assign Technicians by skill + region, Technicians execute work orders and upload reports, and Admins control users, master data, payments, and feedback.



## Overview

This is the **client application** of a full-stack Field Service Management System:

- Public marketing site (home, about, contact, support, technician listing)
- Auth system (credential login/register, email OTP verification, forgot/reset password, Google + Facebook OAuth via backend, manager application flow)
- Four role-based dashboards with analytics, CRUD management, work-order execution, bKash payments, file attachments, service reports, and feedback
- Cookie-based session (`credentials: include`) powered by the Express + Prisma backend, with TanStack Query as the data layer and shadcn/ui + Tailwind CSS v4 for UI

Anyone visiting this repo can understand the whole product: this README covers the frontend in depth and summarizes the backend so the full system is clear.

---

## Live & Repositories

| Part      | Link                                                                               |
| --------- | ---------------------------------------------------------------------------------- |
| Frontend (prod) | https://field-desk-steel.vercel.app/                                      |
| Backend   | https://github.com/MShahdat/Field-Service-Management-System-backend-               |
| Backend API (prod) | `https://field-service-nine.vercel.app/api/v1`                            |

Frontend talks to the backend only through `NEXT_PUBLIC_BASE_URL_API`. There is no Next.js API route in this app.

---

## Key Features

**Public**

- Landing page with hero + how/why sections, navbar, footer
- About Us, Contact, Support, public Technician listing pages
- Global loading and 404 pages, light/dark theming

**Auth**

- Login, Register (Customer / Technician), 6-digit OTP email verification
- Forgot password → OTP → Reset password
- Google & Facebook OAuth (redirect to backend, cookie session)
- Manager application form (name, email, phone, NID, regions, address) → OTP → pending admin approval
- Guest guard, auth guard, role guard, 403 unauthorized page

**Customer (`/customer-dashboard`)**

- Analytics overview (recharts)
- Create / edit / delete / view service requests (category, region, servicing date, preferred time, priority, address)
- Track My Services + Today's Services
- View work orders, pay via bKash (redirect to `bkashURL`), view payment history
- Submit / edit / delete feedback, manage attachments

**Manager (`/manager-dashboard`)**

- Region-scoped analytics overview
- Review My Region Services + Incoming Services
- View skill/region-eligible technicians per work order and assign (with amount) or reject
- Track My Orders + Today's Orders, view payments

**Technician (`/technician-dashboard`)**

- Two-step profile completion (skills + regions modal to become eligible)
- Incoming → My → Today's work orders
- Update status `STARTED` → `COMPLETED`
- Upload service reports + before/after photo attachments, view payments

**Admin (`/admin-dashboard`)**

- System analytics overview
- Approve / reject manager applications
- Manage users (block / activate / delete, profile images)
- Manage all services + today's services
- Master data CRUD: categories, regions, skills (with status + delete flows)
- View all payments and all feedback

---

## Roles & Dashboards

| Role | How to get it | Dashboard | Capabilities |
| ---- | ------------- | --------- | ------------ |
| `CUSTOMER` | Register → OTP → Login | `/customer-dashboard` | Request services, track orders, pay (bKash), feedback |
| `TECHNICIAN` | Register → OTP → Login + complete profile | `/technician-dashboard` | Accept/execute work orders, reports, attachments |
| `MANAGER` | `/manager-apply` → OTP → Admin approval → Login | `/manager-dashboard` | Triage region services, assign technicians, track work orders |
| `ADMIN` / `SUPER_ADMIN` | Seeded in backend | `/admin-dashboard` | Users, managers, services, categories, regions, skills, payments, feedback |

Sidebar navigation is defined per role in `src/route/{admin,customer,manager,technician}/*.route.ts` and rendered by `components/dashboard/app-sidebar.tsx`.

---

## Service Lifecycle

```text
1. CUSTOMER registers → verifies OTP → logs in
   MANAGER applies → verifies OTP → waits for ADMIN approval → logs in

2. CUSTOMER creates Service Request (PENDING)

3. MANAGER reviews My Region / Incoming Services
   → fetches eligible technicians (skill + region match)
   → assigns technician with amount (ASSIGNED + WorkOrder SCHEDULED)
   → or rejects

4. TECHNICIAN sees Incoming Work Order
   → STARTED → executes job
   → uploads service report + before/after attachments
   → COMPLETED

5. CUSTOMER views Work Order → pays via bKash (UNPAID → PAID)
   → submits feedback / rating
```

Password recovery: `/forgot-password` (email) → OTP → `/reset-password` (email + OTP + new password) → `/login`.

---

## Tech Stack

**Frontend (this repo)**

| Category | Technology |
| -------- | ---------- |
| Framework | Next.js 16.3.8 (App Router, route groups), React 19.2.8 |
| Language | TypeScript |
| Data fetching | TanStack React Query 5 + ofetch (cookie auth client in `src/lib/apiClient.ts`) |
| Forms + validation | TanStack React Form + Zod + input-otp |
| UI | Tailwind CSS v4, shadcn/ui + Radix UI, class-variance-authority, lucide-react + react-icons, sonner toasts, next-themes |
| Charts / dates | recharts, date-fns + react-day-picker |
| Quality | Biome (lint/format), babel-plugin-react-compiler |

**Backend (separate repo)**

Node.js + TypeScript + Express.js v5, PostgreSQL + Prisma ORM, JWT access/refresh + Passport.js (Google/Facebook), Zod, Cloudinary (files), bKash (payments), Nodemailer + EJS (OTP emails), Redis (cache), tsup + tsx, Biome. See the [backend repo](https://github.com/MShahdat/Field-Service-Management-System-backend-) for full API docs.

---

## Architecture

```text
Browser (Next.js App Router)
  ├── (publicGroup): /, /about-us, /contact, /support, /technician
  ├── (authGroup): /login, /register, /register/email-verify,
  │                /forgot-password, /reset-password, /manager-apply
  └── (dashboardGroup): /admin-dashboard, /customer-dashboard,
                        /manager-dashboard, /technician-dashboard
        │
        │  ofetch + TanStack Query (credentials: include, cookies)
        ▼
Express API  <BASE_URL>/api/v1
  /auth, /service, /workorder, /payment (bKash), /manager,
  /technician, /category, /region, /skill, /user,
  /feedback, /attachment, /service-report, /analytics
        │
        ├── PostgreSQL (Prisma)   ├── Redis   ├── Cloudinary   ├── bKash
```

Auth is cookie-session based. `GET /auth/me` (`useGetMe`, query key `["user"]`) is the single source of truth for the logged-in user on the frontend.


---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- The backend running (local or hosted) — see the [backend repo](https://github.com/MShahdat/Field-Service-Management-System-backend-)

### Installation

```bash
# 1. Clone the frontend
git clone https://github.com/MShahdat/Field-Service-Management-System-frontend-.git
cd Field-Service-Management-System-frontend-

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env  # or create .env manually (see below)

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

---

## Environment Variables

Only two public variables are used (`src/lib/apiClient.ts`, `src/api/auth.api.ts`):

```env
NEXT_PUBLIC_BASE_URL_API=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `NEXT_PUBLIC_BASE_URL_API` | Yes | Backend base URL, must end with `/api/v1`. Local: `http://localhost:5000/api/v1`. Prod: `https://field-service-nine.vercel.app/api/v1` |
| `NEXT_PUBLIC_APP_URL` | Yes | Frontend URL (used for redirects/metadata) |

No secret keys or OAuth client IDs are needed here — OAuth and payments are handled by the backend.

---

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | `biome check` (lint) |
| `npm run format` | `biome format --write` |

---

## Auth & Route Protection

- `useGetMe` (`GET /auth/me`, `retry: false`) holds the session. Login/register/logout invalidate the `["user"]` query and redirect via `getDashboardUrl(role)`:
  - `ADMIN` / `SUPER_ADMIN` → `/admin-dashboard`
  - `MANAGER` → `/manager-dashboard`
  - `TECHNICIAN` → `/technician-dashboard`
  - `CUSTOMER` → `/customer-dashboard`
- `GuestGuard` (auth pages): logged-in users are bounced to their dashboard, except `/register/email-verify`, `/forgot-password`, `/reset-password`.
- `RoleGuard` (`roles: UserRole[]`): used by each dashboard layout; wrong role → 403 `UnauthorizedPage`, logged out → `/login`.
- Strong-password Zod rules (8–40 chars, upper/lower/number/special) on login/register/reset.

---

## API Integration

Base client: `ofetch.create({ baseURL: NEXT_PUBLIC_BASE_URL_API, credentials: "include" })`. Barrel export: `src/api/index.ts`.

| Module | Key calls |
| ------ | --------- |
| `auth.api.ts` | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`, `POST /auth/email-verify`, `POST /auth/forgot-password`, `POST /auth/reset-password`, backend redirects `/auth/google`, `/auth/facebook` |
| `service.api.ts` | `GET /service/my-services`, `GET /service/all-services`, `POST /service`, `PUT /service/:id`, `PATCH /service/delete/:id`, `GET /service/:id`, `GET /service/my-region`, `GET /service/workOrder/:id`, `POST /service/assign-technician` |
| `order.api.ts` | `GET /workorder/my-workorder`, `GET /workorder/:id`, `PATCH /workorder/update`, `GET /workorder/today` |
| `payment.api.ts` | `POST /payment/create` → `bkashURL`, `GET /payment/payment-info` |
| `manager.api.ts` | `POST /manager/manager-apply`, `POST /manager/email-verify`, `GET /manager/all-managers`, `POST /manager/manager-approved` |
| `technician.api.ts` | `PUT /technician/me/profile` |
| `category / region / skills` | Public list (`GET /category/all`, `GET /region`, `GET /skill/all`) + admin CRUD |
| `user.api.ts` | `PATCH /user/profile-image`, `GET /user/all-users`, `PATCH /user/status-update/:id` |
| `feedback / report / attatchment` | Feedback CRUD, service-report FormData upload, attachment FormData upload (max 10) |
| `analytics.api.ts` | `GET /analytics/admin`, `/customer`, `/manager`, `/technician` |

For full request/response shapes and backend-only endpoints, see the [backend README](https://github.com/MShahdat/Field-Service-Management-System-backend-).

---

## Deployment

- Any Node host or Vercel works (`next build` → `next start`).
- Set `NEXT_PUBLIC_BASE_URL_API` to the hosted backend (`https://field-service-nine.vercel.app/api/v1`) and `NEXT_PUBLIC_APP_URL` to the hosted frontend URL.
- Backend CORS + `FRONTEND_URL` must allow the frontend origin, since auth relies on cookies.
