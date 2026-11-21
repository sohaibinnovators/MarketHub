# MarketHub

MarketHub is a **frontend portfolio demonstration** of a premium multi-vendor marketplace built with Next.js and Tailwind CSS. It simulates customer shopping and seller management using **browser localStorage**—there is no backend, real authentication, payment processing, or live marketplace activity.

> This is not a production-ready multi-vendor marketplace. Orders, sellers, reviews, and notifications are demo data for UI/UX presentation only.

## Features

### Customer experience
- Product discovery with search, filters, sorting, and pagination
- Product details, variants, stock checks, related products, and reviews
- Cart, wishlist, comparison (max 3), and recently viewed history
- Simulated checkout and order history with status timelines
- Customer dashboard, profile settings, and notification center
- Seller discovery and public seller storefronts

### Seller experience
- Demo seller dashboard (NovaTech Labs)
- Product create / edit / delete with image previews
- Store profile management
- Seller-specific order views and status updates
- Demo sales analytics synchronized with local order records

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- localStorage for demo persistence

## Getting started

### Requirements
- Node.js 20+ recommended

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production build

```bash
npm run build
npm start
```

### Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment variables

No environment variables are required. The demo runs entirely in the browser with local seed data.

Do not add real API keys, payment secrets, or authentication credentials to this project.

## Demo contexts

| Role | Identity | Notes |
| --- | --- | --- |
| Customer | Alex Rivera | Customer Hub at `/account` |
| Seller | NovaTech Labs (`seller-1`) | Seller Hub at `/seller-dashboard` |

Login / signup pages validate form fields only and redirect into the demo customer hub. Passwords are never stored.

## Important limitations

- No backend, database, or external marketplace APIs
- No real authentication, email, SMS, or push notifications
- No real payments, payouts, or shipping
- Image uploads create temporary browser previews (data URLs), not hosted files
- Reviews, orders, and analytics are simulated demo records
- Clearing browser storage or using **Reset demo data** in Account → Profile Settings restores seed defaults

## Project structure (high level)

- `app/` — App Router pages (shop, account, seller dashboard)
- `components/` — UI, catalog, orders, account, and seller components
- `lib/` — types, seed data, cart helpers, marketplace/store/experience providers
- `public/` — static assets

## Deployment (Vercel)

The app is compatible with Vercel as a standard Next.js frontend:

1. Push the repository to GitHub/GitLab/Bitbucket (or import locally).
2. Create a new Vercel project from the repo.
3. Use default Next.js build settings (`next build`).
4. Deploy—no environment variables are required for the demo.

After deploy, remind visitors that cart/orders/reviews persist in **their browser only**.

## License

Private portfolio project. All rights reserved by the project owner unless otherwise stated.
