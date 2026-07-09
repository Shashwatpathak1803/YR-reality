# Real Estate Backend API

Production-ready backend for a Real Estate Website & Admin Panel. Built with Node.js, Express, MongoDB/Mongoose, JWT auth, Cloudinary media storage, and a clean Controller → Service → Repository architecture.

## Tech Stack

- Node.js + Express.js (ES Modules)
- MongoDB + Mongoose
- JWT Authentication (access + refresh tokens) + Bcrypt password hashing
- Multer (memory storage) + Cloudinary
- express-validator
- Helmet, CORS, express-rate-limit, express-mongo-sanitize, xss-clean
- Morgan logging
- Swagger (`/api-docs`)

## Architecture

```
Request → Route → Validator → Controller → Service → Repository → Model → MongoDB
                                   ↓
                            Business logic lives here
```

- **Controllers**: parse req/res, call services, shape the response.
- **Services**: business logic (slug generation, linking customers to enquiries, Cloudinary uploads, etc).
- **Repositories**: all direct Mongoose/DB access. `BaseRepository` gives every module generic CRUD + a shared `ApiFeatures` query builder (search, filter, sort, pagination).
- Simple modules (Category, Offer, Testimonial, FAQ) reuse `BaseService` + a `makeCrudController` factory to avoid duplicate boilerplate. Modules with real business rules (Property, Blog, Auth, Enquiry, SiteVisit, Customer, Settings, Media) have dedicated services.

## Project Structure

```
backend/
  src/
    config/        # env, db, cloudinary, swagger
    constants/      # http status codes, enums (roles, statuses)
    controllers/     # request handlers
    middlewares/     # auth, error handling, validation, upload, rate limit
    models/          # Mongoose schemas
    repositories/    # DB access layer
    routes/          # Express routers
    services/        # business logic
    seed/            # createAdmin.js one-time script
    utils/           # ApiError, ApiResponse, asyncHandler, tokens, slugify, ApiFeatures
    uploads/         # (unused with memory storage, kept for local fallback)
    app.js
  server.js
  .env.example
  package.json
```

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in your real values
```

Required environment variables (see `.env.example`):

```
PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRES, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES,
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
CLIENT_URL, ADMIN_URL
```

### Create the first Admin

There is no public signup route (by design — this is an internal admin panel). Create the first Super Admin with:

```bash
node src/seed/createAdmin.js "Your Name" admin@example.com "StrongPass123!"
```

### Run

```bash
npm run dev     # nodemon
npm start       # production
```

API base URL: `http://localhost:5000/api`
Swagger docs: `http://localhost:5000/api-docs`

## Authentication

- `POST /api/auth/login` — sets httpOnly `token` + `refreshToken` cookies, also returns `accessToken` in the body for header-based clients.
- `POST /api/auth/logout` — protected, clears cookies and stored refresh token.
- `GET /api/auth/me` — protected, returns the logged-in admin.
- `PUT /api/auth/change-password` — protected.
- `POST /api/auth/forgot-password` / `POST /api/auth/reset-password` — future-ready; token generation is implemented, wire up an email service to actually deliver it.
- `POST /api/auth/refresh-token` — future-ready refresh flow using the `refreshToken` cookie.

Send the JWT either as the `token` cookie (browser clients) or `Authorization: Bearer <token>` header (mobile/other clients).

## API Overview

All list endpoints support: `?search=`, `?sort=field,-field2`, `?fields=field1,field2`, `?page=&limit=`, plus direct field filters and range filters like `?price[gte]=100000&price[lte]=500000`.

Every response follows:
```json
{ "success": true, "message": "...", "data": ..., "meta": { "page":1,"limit":10,"total":42,"totalPages":5 } }
```

| Module | Base Path | Public | Admin (protected) |
|---|---|---|---|
| Properties | `/api/properties` | GET list/detail, `/featured`, `/category/:category`, `/slug/:slug` | POST, PUT, DELETE |
| Categories | `/api/categories` | GET | POST, PUT, DELETE |
| Offers | `/api/offers` | GET | POST, PUT, DELETE |
| Testimonials | `/api/testimonials` | GET | POST, PUT, DELETE |
| Blogs | `/api/blogs` | GET list/detail/`slug/:slug` | POST, PUT, DELETE |
| FAQs | `/api/faqs` | GET | POST, PUT, DELETE |
| Enquiries | `/api/enquiries` | POST (public form) | GET, PUT, DELETE |
| Site Visits | `/api/site-visits` | POST (public form) | GET, PUT, DELETE |
| Customers | `/api/customers` | — | full CRUD (auto-created from enquiries/visits) |
| Settings | `/api/settings` | GET | PUT |
| Media | `/api/media` | — | upload / list / delete (Cloudinary) |

### File uploads

Multipart form-data field names:
- Properties: `images[]`, `videos[]`, `brochure`, `floorPlan`
- Category: `icon`, `image`
- Offer: `banner`
- Testimonial: `photo`
- Blog: `thumbnail`
- Settings: `logo`
- Generic media library: `file` (single) or `files[]` (multiple) via `/api/media/upload*`

Files are streamed from memory directly to Cloudinary — nothing touches local disk.

## Security

- Helmet security headers
- CORS restricted to `CLIENT_URL` / `ADMIN_URL`
- Global + auth-specific rate limiting
- `express-mongo-sanitize` + `xss-clean` against injection/XSS
- Bcrypt password hashing (cost factor 12)
- JWT stored in httpOnly cookies

## Error Handling

Centralized `errorHandler` normalizes Mongoose CastError/ValidationError/duplicate-key errors, JWT errors, and custom `ApiError`s into a consistent JSON shape, with stack traces only in development.

## Future-Ready (scaffolded, not wired up)

- Role-based authorization (`restrictTo` middleware + `ROLES` enum already in place — just add roles to routes)
- Refresh token rotation (`/api/auth/refresh-token`)
- Forgot/reset password (token generation done; plug in an email provider to send it)
- Sales Executive module, CRM, notifications, Email/SMS/WhatsApp, payment gateway, activity/audit logs — the modular repository/service/controller pattern makes these additive: create a new model + repository + service + controller + route file and register it in `routes/index.js` without touching existing modules.
