# BengaluruHomes - Real Estate Website

A full-stack real estate website for showcasing and managing properties in Bengaluru.

## Tech Stack

**Frontend:** React 18 + Vite + TailwindCSS
**Backend:** Node.js + Express + MongoDB
**Auth:** JWT (Admin only)

---

## Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

---

### 1. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and credentials
npm install
npm run dev
```

Server runs at: `http://localhost:5000`

**Default Admin:**
- Email: `admin@bengaluruhomes.com`
- Password: `Admin@123`
> Change these in `.env` before deploying!

---

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home - Hero, Featured Properties, New Launches |
| `/properties` | Property listing with filters |
| `/properties/:id` | Property detail page |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin property & enquiry management |
| `/admin/add-property` | Add new property |
| `/admin/edit-property/:id` | Edit existing property |

---

## API Endpoints

### Public
- `GET /api/properties` — List properties (with filters)
- `GET /api/properties/featured` — Featured properties
- `GET /api/properties/new-launches` — New launch properties
- `GET /api/properties/:id` — Single property
- `POST /api/enquiry` — Submit enquiry

### Admin (JWT required)
- `GET /api/properties/admin/all` — All properties
- `POST /api/properties` — Add property
- `PUT /api/properties/:id` — Update property
- `DELETE /api/properties/:id` — Delete property
- `GET /api/enquiry` — All enquiries
- `PUT /api/enquiry/:id` — Update enquiry status

---

## Features

### Public
- Home page with hero section, search, filters
- Property type tabs: Buy, Rent, New Launch, Plots/Lands
- Property type dropdown: Residential / Commercial / Plots
- Unit type filter (dynamic based on property type)
- Featured properties carousel
- Newly launched projects section
- Property detail with photo gallery, amenities, floor plans, map
- Enquiry modal with WhatsApp & call options

### Admin
- Secure JWT login
- Add/Edit/Delete properties
- Upload multiple property photos & floor plans
- Toggle active/featured status
- Manage enquiries (status tracking)

---

## Environment Variables (server/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/realestate_bengaluru
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@bengaluruhomes.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=Admin
```
