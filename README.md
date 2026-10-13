# BizOS Retail

> Production-minded B2B/B2C retail storefront built with Next.js App Router, TypeScript, React 19 and Zustand.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Tests](https://img.shields.io/badge/tests-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

## Live Demo

**Production:** https://bizos-retail-hf7v.vercel.app/

**Repository:** https://github.com/real-aiman/bizos-retail

---

## What this project demonstrates

BizOS Retail is a full-featured ecommerce frontend designed around a real ERP-backed product catalog rather than hard-coded demo data. It focuses on the engineering details that matter in production: server-side validation, safe pricing, responsive UX, persistent state, SEO, accessibility, analytics hooks, monitoring, testing and operational tooling.

### Core features

- Next.js 15 App Router with TypeScript strict mode
- Server-rendered product catalog with URL-driven search, filters, sorting and pagination
- ERP/BizOS API integration with development fallback data
- Product detail pages with structured data and related products
- Persistent cart and wishlist with hydration-safe Zustand stores
- Cart drawer, toast feedback and sticky mobile purchase actions
- Checkout with Zod validation and server-side order re-pricing
- Promo codes with server-side validation, expiry and minimum-subtotal rules
- Deals page with sale pricing and expiry countdowns
- Product comparison for up to three products
- Recently viewed products and share actions
- Device-only address book and saved delivery details
- Customer dashboard, order history, order details and invoice printing
- Admin dashboard with catalog checks, product filters, CSV export and optional order listing
- Security headers, private-route noindex rules and signed admin sessions
- Optional Google Analytics, Mixpanel and Sentry integrations
- Vitest + React Testing Library coverage for core business logic and UI behavior
- Responsive design for desktop, tablet and mobile

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15, App Router |
| Language | TypeScript, strict mode |
| UI | React 19, CSS, Lucide React |
| State | Zustand 5 |
| Validation | Zod |
| Testing | Vitest, React Testing Library, jsdom |
| Data | BizOS ERP REST API + development fallback |
| Monitoring | Sentry (optional) |
| Analytics | Google Analytics / Mixpanel (optional) |
| Deployment | Vercel / Node 20+ |

## Architecture

```text
src/
├── app/                    # App Router pages, layouts and API routes
├── components/             # Reusable UI components
├── config/                 # Store and business configuration
├── lib/                    # Catalog, pricing, promos, analytics and utilities
├── modules/
│   ├── products/           # Product domain + ERP catalog service
│   └── orders/             # Order domain + server gateway
├── stores/                 # Zustand client state
└── __tests__/              # Unit and component tests
```

The application follows an SSR-first approach. Server components handle catalog and business data wherever possible, while client components are kept around interactive state such as cart, wishlist, comparison and checkout controls.

## Local development

### Requirements

- Node.js 20+
- npm 10+
- A BizOS/ERP API for production data, or the included development fallback

### Setup

```bash
git clone https://github.com/real-aiman/bizos-retail.git
cd bizos-retail
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

### Quality checks

Run the complete local quality gate before pushing:

```bash
npm run qa
```

This runs:

```text
TypeScript typecheck → ESLint → Vitest → Next.js production build
```

Individual commands:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Environment configuration

The complete environment template is available in `.env.example`.

### Required production values

At minimum, configure:

- `BIZOS_API_URL`
- `BIZOS_PRODUCTS_PATH`
- `BIZOS_ORDERS_PATH`
- `BIZOS_TENANT_ID`
- `BIZOS_API_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CURRENCY`
- `NEXT_PUBLIC_LOCALE`

For production, set:

```env
BIZOS_ALLOW_SIMULATED_ORDERS=false
```

Never commit `.env.local`, API keys, admin passwords, Sentry auth tokens or other secrets. The repository ignores local environment files by default.

## Production safety notes

- Order totals are recalculated on the server; client-provided totals are not trusted.
- Promo codes are checked again when an order is placed.
- Simulated orders are intended for local demos only and must be disabled in production.
- Admin access is disabled unless an `ADMIN_PASSWORD` is configured.
- Admin sessions use signed, httpOnly and SameSite cookies.
- Private dashboard/admin pages are protected from indexing.
- CSV exports are generated with formula-safe values.

## Testing

Tests live in `src/__tests__` and cover important business and UI paths including:

- Cart state and quantity rules
- Add-to-cart behavior
- Catalog filtering and pricing
- Promo validation
- Order placement
- Order statistics
- Admin behavior
- Dashboard behavior
- Toast state

Run tests with:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Deployment

The project is suitable for Vercel or another Node.js hosting platform.

For Vercel:

1. Import the GitHub repository.
2. Select the Next.js framework preset.
3. Add the production environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to the deployed domain.
5. Set `BIZOS_ALLOW_SIMULATED_ORDERS=false`.
6. Deploy and verify the catalog, checkout and order API against the real ERP contract.

## Important backend contract

The frontend intentionally does not invent a successful order response. Before production launch, confirm the request/response contract in:

```text
src/modules/orders/services/orderGateway.ts
```

The product feed should provide, where available:

```text
id
name
slug
regularPrice
compareAtPrice
description
images
brand
inStock
departmentName
```

## Project status

**Status: Active portfolio project / production-ready architecture pending final ERP contract verification.**

The remaining production dependency is business-specific: the real ERP order endpoint, payload contract and live product fields must be verified before accepting real customer orders.

## Engineering highlights

This repository intentionally demonstrates more than a visual ecommerce UI:

- Domain-oriented modules for products and orders
- Strict TypeScript and schema validation
- SSR-first Next.js architecture
- Safe server-side pricing and promo validation
- Hydration-safe persisted client state
- Automated tests and a single `npm run qa` quality gate
- Security-minded admin and environment handling
- SEO metadata and structured product data
- Responsive, mobile-first interaction patterns
- Optional observability integrations

## Author

**Aiman Shafiq** — Frontend Developer

React · Next.js · TypeScript · WordPress

Portfolio: https://portf-cyan-theta.vercel.app/

GitHub: https://github.com/real-aiman
