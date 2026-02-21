# 🏠 Demo Homes V1 — Real Estate Platform

> A full-stack real estate platform for discovering and managing properties across Bengaluru.

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + TailwindCSS 3 |
| **Backend** | Node.js + Express 4 |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (Admin only) |
| **Media** | Cloudinary (images + videos) |
| **Docs** | Swagger / OpenAPI 3.0 |

---

## ✨ Features

### 🌐 Public-Facing

- **Home page** — Hero section with smart search bar
- **Location autocomplete** — Suggests Bengaluru areas as you type (150+ areas)
- **Category tabs** — Buy · Rent · New Launch · Plots & Lands
- **Property type filters** — Residential / Commercial + unit sub-types
- **Paginated property listing** with sort, filter, and keyword search
- **Property detail page** — Photo gallery, videos, floor plans, amenities, map, contact
- **Video playback** — Multi-video support with HTML5 player (up to 3 videos per listing)
- **Enquiry modal** — WhatsApp deep-link + direct call options
- **Fully responsive** — Mobile-first layout

### 🔐 Admin Panel

- Secure JWT login (admin only — no user registration)
- Add / Edit / Delete property listings
- Upload up to 20 photos, 10 floor plans, and 3 videos per property
- Cloudinary-backed media (persistent across deploys)
- Toggle **featured** and **active** status per property
- New Launch flag support
- Enquiry management with status tracking (new → in-progress → resolved)
- Swagger API documentation at `/api-docs`

---

## 🗂️ Project Structure

```
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level page components
│       ├── context/         # AuthContext (admin session)
│       └── utils/           # helpers, constants, API client
│
└── server/                  # Express backend
    ├── config/              # DB, Cloudinary, Swagger config
    ├── controllers/         # Business logic
    ├── models/              # Mongoose schemas
    ├── routes/              # API route definitions
    └── uploads/             # (local dev fallback only)
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js v18+
- MongoDB (local) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

---

### 1 — Backend

```bash
cd server
cp .env.example .env
# Fill in your values (see Environment Variables section below)
npm install
npm run dev
```

Server → `http://localhost:5000`
Swagger UI → `http://localhost:5000/api-docs`

**Default Admin Credentials** (set via `.env`):

| Field | Default |
|---|---|
| Email | `admin@demohomesv1.com` |
| Password | `Admin@123` |

> ⚠️ Change these before going live!

---

### 2 — Frontend

```bash
cd client
npm install
npm run dev
```

Frontend → `http://localhost:5173`

The Vite dev server proxies `/api` and `/uploads` to `localhost:5000` automatically.

---

## 🔑 Environment Variables

### `server/.env`

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/realestate_dev

# Auth
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRE=7d

# Admin account (auto-seeded on first run)
ADMIN_EMAIL=admin@demohomesv1.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=Admin

# Cloudinary (required for image & video uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### `client/.env` (production only)

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

> In development the Vite proxy handles `/api` — `VITE_API_URL` is only needed for production builds.

---

## 🌍 Deployment

### Frontend → Netlify

1. Push the repo to GitHub.
2. Connect the repo in [Netlify](https://app.netlify.com).
3. Set **Base directory** to `client`, **Build command** to `npm run build`, **Publish directory** to `dist`.
4. Add environment variable: `VITE_API_URL=https://<your-render-url>/api`
5. Add a `client/public/_redirects` file with: `/* /index.html 200` (enables client-side routing).
6. Deploy.

### Backend → Render

1. Create a new **Web Service** pointing at your repo.
2. Set **Root Directory** to `server`, **Build Command** to `npm install`, **Start Command** to `node server.js`.
3. Add all environment variables from `server/.env` (MongoDB Atlas URI, Cloudinary keys, JWT secret, admin credentials).
4. Do **not** set a `PORT` env var — Render assigns it automatically.
5. Deploy.

### Database → MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://cloud.mongodb.com).
2. Create a database user and whitelist `0.0.0.0/0` (allow all IPs) for Render compatibility.
3. Copy the connection string into `MONGO_URI` on Render.

---

## 📡 API Reference

Interactive docs available at `GET /api-docs` on the running server.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Admin login → returns JWT |

### Properties (Public)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/properties` | Paginated list with filters (category, propertyType, unitType, search, featured) |
| `GET` | `/api/properties/featured` | Featured properties (max 6) |
| `GET` | `/api/properties/new-launches` | New launch properties (max 6) |
| `GET` | `/api/properties/:id` | Single property by ID or slug |

### Properties (Admin — JWT required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/properties/admin/all` | All properties (active + inactive) |
| `POST` | `/api/properties` | Create property (multipart: photos, floorPlans, videos) |
| `PUT` | `/api/properties/:id` | Update property (multipart: same fields) |
| `DELETE` | `/api/properties/:id` | Delete property + all Cloudinary media |
| `DELETE` | `/api/properties/:id/photo` | Remove a single photo by path |
| `DELETE` | `/api/properties/:id/floorplan` | Remove a single floor plan by path |

### Enquiries

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/enquiry` | — | Submit a new enquiry |
| `GET` | `/api/enquiry` | Admin | List all enquiries |
| `PUT` | `/api/enquiry/:id` | Admin | Update enquiry status |

---

## 🗺️ Frontend Routes

| Route | Page |
|---|---|
| `/` | Home — Hero, Search, Featured, New Launches |
| `/properties` | Property listing with filters |
| `/properties/:slug` | Property detail — Gallery, Videos, Floor Plans, Map |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Dashboard — Properties & Enquiries |
| `/admin/add-property` | Add new property |
| `/admin/edit-property/:id` | Edit existing property |

---

## 📸 Media Uploads

| Field | Type | Max Count | Accepted Formats |
|---|---|---|---|
| `photos` | Image | 20 | JPG, PNG, WebP |
| `floorPlans` | Image | 10 | JPG, PNG, WebP |
| `videos` | Video | 3 | MP4, MOV, WebM, AVI |

All media is stored on **Cloudinary** and returns permanent `https://res.cloudinary.com/...` URLs. Nothing is stored on the server filesystem in production.

---

## 🛠️ Scripts

| Directory | Command | Description |
|---|---|---|
| `server/` | `npm run dev` | Start backend with nodemon |
| `server/` | `node server.js` | Start backend (production) |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Production build → `dist/` |
| `client/` | `npm run preview` | Preview production build locally |

---

## 📝 License

This project is proprietary. All rights reserved.
