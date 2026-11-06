# ☠ Grand Line Goods

A full-stack, pirate-themed merch store built as a portfolio project. It has a product catalog, a persistent cart, user accounts, Stripe checkout (test mode), order history, and an admin dashboard. The design is a "pirate gazette" look, with newsprint paper, wanted-poster styling, and scroll-triggered animations.

**Live demo:** https://grand-line-goods.vercel.app/
**Author:** [Darrel Cedric Cirineo](https://github.com/saidwich)

![Homepage](screenshots/home.png)

> **Fan project.** Not for sale and not affiliated with any official brand. All product names are fictional.

---

## Screenshots

| Product page | Cart |
| --- | --- |
| ![Product page](screenshots/product.png) | ![Cart](screenshots/cart.png) |

| Admin dashboard | Checkout (Stripe test mode) |
| --- | --- |
| ![Admin](screenshots/admin.png) | ![Checkout](screenshots/checkout.png) |

---

## Features

**Storefront**
- Product catalog with category filters
- Product detail pages with live stock and low-stock badges
- Rotating "Featured" wanted poster in the hero that cycles through in-stock products
- Scroll-triggered card animations, a flipping cart counter, and a scrolling ticker

**Cart and checkout**
- Cart saved in `localStorage`, so it survives refreshes
- Quantity limits based on available stock
- Stripe Checkout in test mode
- Order confirmation page and order history for each user

**Accounts**
- Signup and login with hashed passwords
- Session stored in a signed, `httpOnly` JWT cookie
- Role-based access (`USER` and `ADMIN`)

**Admin dashboard**
- Create, edit, and delete products
- View all orders and update their status (`PENDING`, `PAID`, `SHIPPED`)
- Protected on the server, so non-admins are redirected

---

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Actions, Cache Components), React, TypeScript |
| Styling | Tailwind CSS, Google Fonts (Anton, DM Sans, Special Elite, Playfair Display, Cinzel) |
| Animation | Motion (`motion/react`) |
| Database | PostgreSQL on Neon |
| ORM | Prisma 6 |
| Auth | Custom: `bcryptjs` + `jose` (JWT in an httpOnly cookie) |
| Validation | Zod |
| Payments | Stripe Checkout (test mode) |
| Hosting | Vercel |

---

## Try it

- **Customer:** sign up with any email address
- **Admin:** `admin@grandlinegoods.dev` / `admin123`
- **Test card:** `4242 4242 4242 4242`, any future expiry date, any CVC

Payments run in Stripe's sandbox, so no real money is ever charged.

> The database is on Neon's free tier, which sleeps when idle. The first page load after a quiet period can take a couple of seconds.

---

## Technical decisions

- **Prices are stored as integer cents.** This avoids floating-point rounding errors.
- **The server never trusts the browser's prices.** At checkout, the API re-reads every price and stock level from the database and builds the order from that.
- **Stock is decremented exactly once per order.** The update happens in a transaction guarded by `status: PENDING`, so refreshing the success page can't double-deduct stock.
- **Authorization is checked on the server.** Admin pages and actions call `requireAdmin()`, so hiding the link in the UI is not the only protection.
- **Hand-built auth.** Passwords are hashed with bcrypt, and the session is a signed JWT in an `httpOnly`, `sameSite=lax` cookie. This keeps the dependency surface small and the flow easy to explain.
- **Deleting a product that was already ordered sets its stock to 0** instead of removing it, so order history never breaks.
- **Suspense around data fetching.** Each page streams a fast shell first, then fills in database content, which works with Next.js 16 Cache Components.

---

## Run locally

**Requirements:** Node.js 20+, a free [Neon](https://neon.tech) database, and a free [Stripe](https://stripe.com) account (sandbox).

```bash
git clone https://github.com/saidwich/grand-line-goods.git
cd grand-line-goods
npm install
```

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string |
| `SESSION_SECRET` | Random 64-character hex string (see below) |
| `STRIPE_SECRET_KEY` | Stripe sandbox secret key (`sk_test_...`) |
| `APP_URL` | `http://localhost:3000` locally, your Vercel URL in production |

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create the tables, add sample data, and start the app:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open http://localhost:3000.

> **Warning:** `npx prisma db seed` deletes all products and orders before re-adding the sample data. It also creates a demo admin account, so change that password before deploying.

---

## Project structure

```
app/
  page.tsx               Homepage (hero, filters, product grid)
  products/[slug]/       Product detail page
  cart/                  Cart page
  checkout/success/      Order confirmation
  orders/                Customer order history
  login/  signup/        Auth pages
  admin/                 Admin dashboard (products, orders)
  api/checkout/          Creates the order and Stripe session
  actions/               Server actions (auth, admin)
components/              Header, Hero, WantedPoster, ProductCard, etc.
lib/                     Prisma client, session, cart context, Stripe
prisma/                  Schema and seed script
```

---

## What I would add next

- Stripe webhooks, so payments are confirmed even if the customer closes the tab
- Image uploads in the admin form (for example Cloudinary)
- Product reviews and ratings
- Wishlist
- A "Bounty" loyalty points system
- Search and sorting
- Automated tests (Playwright for the checkout flow)

---

## Credits

Built by **Darrel Cedric Cirineo**. All artwork in the interface (hat mark, poster, layout) is original or generated for this project.
