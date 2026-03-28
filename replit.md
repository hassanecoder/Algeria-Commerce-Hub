# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.
Contains a full Algerian e-commerce seller dashboard web app.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, shadcn/ui, Recharts

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── seller-dashboard/   # Algerian Seller Dashboard (React/Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed-algeria.ts # Algerian e-commerce seed data
```

## Seller Dashboard Features

### Pages
- **Dashboard** — KPI cards (Revenue DZD, Orders, Customers, Products), revenue chart, top products, sales by wilaya
- **Products** — Product table with Arabic/French names, DZD pricing, CRUD operations
- **Orders** — Orders with Algerian wilayas, payment methods, status management
- **Customers** — Customer profiles by wilaya/commune with order history
- **Analytics** — Revenue trends, category breakdown, payment method breakdown (Algerian-specific)
- **Inventory** — Stock level management with OK/Faible/Critique/Rupture de stock statuses
- **Notifications** — Order alerts, low stock warnings, payment confirmations
- **Settings** — Store configuration

### Algeria-Specific Features
- **Currency**: Algerian Dinar (DZD) — formatted with `fr-DZ` locale
- **Wilayas**: 20 major Algerian provinces for shipping/customer data
- **Payment Methods**: Cash on Delivery, CCP, BaridiMob, CIB, Virement Bancaire
- **Bilingual UI**: French + Arabic product names
- **Seed Data**: 20 products, 50 customers, 200 orders with realistic Algerian data

## Database Schema

- `products` — Products with Arabic names, DZD pricing, stock levels
- `customers` — Customers with wilaya/commune info
- `orders` — Orders with Algerian payment methods and statuses
- `order_items` — Line items for each order
- `notifications` — In-app notification feed

## API Endpoints

- `GET /api/dashboard/stats` — KPI overview
- `GET /api/dashboard/revenue-chart` — Revenue chart data
- `GET /api/dashboard/recent-orders` — Recent orders
- `GET /api/dashboard/top-products` — Top selling products
- `GET /api/dashboard/wilaya-sales` — Sales by Algerian wilaya
- `GET/POST /api/products` — Product management
- `GET/PUT/DELETE /api/products/:id` — Individual product
- `GET /api/orders` — Orders list with filtering
- `GET/PUT /api/orders/:id` — Order detail + status update
- `GET /api/customers` — Customer list
- `GET /api/customers/:id` — Customer detail with order history
- `GET /api/analytics/sales` — Sales analytics
- `GET /api/analytics/categories` — Sales by category
- `GET /api/analytics/payment-methods` — Payment breakdown
- `GET /api/inventory` — Inventory status
- `PUT /api/inventory/:productId/update` — Update stock
- `GET /api/notifications` — Notification feed

## Seed Data

To re-seed: `pnpm --filter @workspace/scripts run seed-algeria`

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client and Zod schemas
- `pnpm --filter @workspace/db run push` — push schema to database
