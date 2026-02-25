# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VisitBorsa** (visitborsa.ro) — bilingual (RO/EN) tourism platform focused on Borșa, Maramureș. Accommodation listings (hotels, villas, guesthouses, cabins, apartments, rooms, holiday houses), tourist services (ATV, snowmobile, hiking, etc.), restaurants, and tourist attractions. Admin-controlled promoted content and "location of the month" feature.

## Tech Stack

- **Frontend Web (PWA):** Next.js 15 App Router, React 19, TypeScript strict, TailwindCSS v4, TanStack Query, react-i18next
- **Backend:** NestJS 11, REST API with OpenAPI/Swagger at `/api/docs`, JWT auth
- **Database:** PostgreSQL 16 (Docker Compose, port 5433) with Prisma 6 ORM
- **Email:** Nodemailer with SMTP (Ethereal for dev)
- **Image Storage:** Cloudinary (never store images in DB or locally)
- **Maps:** Mapbox GL JS
- **Monorepo:** pnpm workspaces + Turborepo

## Development Commands

```bash
# Start infrastructure
docker-compose up -d                    # PostgreSQL on port 5433

# Backend (apps/api)
cd apps/api
pnpm prisma migrate dev                 # Run migrations
pnpm prisma db seed                     # Seed test data
pnpm dev                                # Start API on :3001

# Frontend (apps/web)
cd apps/web
pnpm dev                                # Start web on :3000

# From root
pnpm dev                                # Start both via Turborepo
pnpm build                              # Production build (both)
```

## Architecture

```
pensiuni/
├── apps/
│   ├── api/          # NestJS REST API (:3001)
│   └── web/          # Next.js PWA (:3000)
├── packages/
│   └── shared/       # Shared TypeScript types and constants
└── docker-compose.yml
```

### Backend Modules (apps/api/src/)
- `auth/` — JWT register/login with email confirmation, JwtAuthGuard, RolesGuard, CurrentUser decorator, EmailService (Nodemailer)
- `properties/` — Accommodation CRUD with type/price filtering, promoted properties, pagination
- `services/` — Tourist services CRUD with category filtering (ATV, snowmobile, hiking, etc.)
- `restaurants/` — Restaurant CRUD with priceRange filtering
- `attractions/` — Tourist attractions with nearby search (Haversine), location of the month
- `upload/` — Cloudinary image upload (single + multiple)
- `admin/` — Role-protected admin endpoints (approve/reject all entity types, manage users, promoted properties, location of month)
- `users/` — User profile management
- `prisma/` — Global PrismaService module

### Frontend Pages (apps/web/src/app/)
- `/` — Landing with location of month, promoted accommodations, services/restaurants/attractions previews
- `/cazari`, `/cazari/[id]` — Accommodation listing and detail
- `/servicii`, `/servicii/[id]` — Services listing and detail
- `/restaurante`, `/restaurante/[id]` — Restaurants listing and detail
- `/de-vizitat`, `/de-vizitat/[id]` — Tourist attractions listing and detail
- `/despre-borsa` — Static page: Borșa history, geography, traditions
- `/partia-olimpica` — Ski slope info with live webcam
- `/confirm-email` — Email confirmation handler
- `/login`, `/register` — Auth forms (register requires email confirmation)
- `/dashboard` — Client management: cazari, servicii, restaurante, profile
- `/admin/*` — Admin panel: stats, cazari, servicii, restaurante, de-vizitat, promovate, utilizatori

### User Roles
- **Guest**: browse all public pages
- **Client**: CRUD own accommodations/services/restaurants (after email confirmation), upload images
- **Admin**: approve/reject all listings, manage users, manage attractions, set promoted properties & location of month

### Data Model
Core entities: User → Property/Service/Restaurant, TouristAttraction. Properties have status workflow: `PENDING → APPROVED` (admin approves). All content entities have bilingual fields (`*Ro`, `*En`). No county/city system — all content is Borșa-local.

### i18n
Translation files at `apps/web/src/locales/{ro,en}/common.json`. Use `getLocalizedField(item, 'fieldName', locale)` for bilingual DB fields.

### Test Credentials (after seed)
- Admin: `admin@visitborsa.ro` / ``
- Client: `ion@example.com` / ``
- Client: `maria@example.com` / ``

### Key Patterns
- API proxy: Next.js rewrites `/api/*` → `localhost:3001/api/*`
- Auth: JWT Bearer token stored in localStorage, AuthContext provider
- Email confirmation: register → email with token → GET /auth/confirm-email?token=xxx → login
- Type-only imports required for decorated parameters in NestJS (TS `isolatedModules` + `emitDecoratorMetadata`)
- Promoted properties: max 3 with promotionOrder 1-3, admin-selectable
- Location of month: single attraction with isLocationOfMonth flag, admin-selectable
