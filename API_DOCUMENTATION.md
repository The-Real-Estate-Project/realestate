# Demo Homes V1 — API Documentation

**Base URL:** `http://localhost:5000/api`
**Version:** 1.0.0
**Database:** MongoDB (`realestate_bengaluru`)

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Properties — Public](#2-properties--public)
3. [Properties — Admin](#3-properties--admin)
4. [Enquiries — Public](#4-enquiries--public)
5. [Enquiries — Admin](#5-enquiries--admin)
6. [Health Check](#6-health-check)
7. [Data Models](#7-data-models)
8. [Enum Reference](#8-enum-reference)
9. [Error Responses](#9-error-responses)
10. [Quick Test (curl)](#10-quick-test-curl)

---

## Authentication

All admin-protected routes require a **Bearer token** in the `Authorization` header.

```
Authorization: Bearer <JWT_TOKEN>
```

Tokens are obtained from the login endpoint and expire in **7 days** (configurable via `JWT_EXPIRE` in `.env`).

---

## 1. Authentication

### POST `/api/auth/login`
Login as admin and receive a JWT token.

- **Access:** Public
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "admin@demohomesv1.com",
  "password": "Admin@123"
}
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "_id": "6997fda4b584c2ba4192454e",
    "name": "Admin",
    "email": "admin@demohomesv1.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response — 401 Unauthorized:**
```json
{
  "message": "Invalid email or password"
}
```

---

### GET `/api/auth/me`
Get the currently logged-in admin's profile.

- **Access:** Private (JWT required)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "_id": "6997fda4b584c2ba4192454e",
    "name": "Admin",
    "email": "admin@demohomesv1.com"
  }
}
```

**Error Response — 401 Unauthorized:**
```json
{
  "message": "Not authorized, no token"
}
```

---

## 2. Properties — Public

### GET `/api/properties`
Get all active properties with optional filters and pagination.

- **Access:** Public

**Query Parameters:**

| Parameter      | Type    | Required | Description |
|----------------|---------|----------|-------------|
| `category`     | string  | No       | `buy` \| `rent` \| `new-launch` \| `plots-lands` |
| `propertyType` | string  | No       | `residential` \| `commercial` \| `plots` |
| `unitType`     | string  | No       | See Enum Reference below |
| `search`       | string  | No       | Searches title, location, area, overview |
| `featured`     | boolean | No       | `true` to return only featured properties |
| `page`         | number  | No       | Page number (default: `1`) |
| `limit`        | number  | No       | Results per page (default: `12`) |

**Example Requests:**
```
GET /api/properties
GET /api/properties?category=buy
GET /api/properties?category=rent&propertyType=residential
GET /api/properties?propertyType=commercial&unitType=shop
GET /api/properties?search=Whitefield
GET /api/properties?featured=true
GET /api/properties?category=new-launch&page=2&limit=6
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "abc123",
      "title": "Luxury 3 BHK Apartment in Whitefield",
      "slug": "luxury-3-bhk-apartment-in-whitefield-1716000000000",
      "category": "buy",
      "propertyType": "residential",
      "unitType": "apartment",
      "location": "Whitefield, Bengaluru",
      "area": "Phase 2",
      "address": "123, ITPL Main Road, Whitefield",
      "priceMin": 1.2,
      "priceMax": 1.8,
      "priceUnit": "Cr",
      "estimatedEMI": "₹ 85,000/month",
      "projectSize": "5 Acres",
      "configurations": ["2 BHK", "3 BHK"],
      "totalUnits": 200,
      "possessionDate": "Dec 2026",
      "overview": "Premium residential project...",
      "amenities": ["Swimming Pool", "Gym / Fitness Center"],
      "landmarks": ["5 min to ITPL", "Near Phoenix Mall"],
      "photos": ["/uploads/1716000000000-123456789.jpg"],
      "floorPlans": ["/uploads/1716000000001-987654321.jpg"],
      "mapEmbed": "https://maps.google.com/maps?...",
      "mapLink": "https://maps.app.goo.gl/...",
      "isNewLaunch": false,
      "isActive": true,
      "isFeatured": true,
      "whatsappNumber": "+919876543210",
      "contactEmail": "info@demohomesv1.com",
      "contactPhone": "+919876543210",
      "createdAt": "2024-05-18T10:00:00.000Z",
      "updatedAt": "2024-05-18T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 4,
    "limit": 12
  }
}
```

---

### GET `/api/properties/featured`
Get featured properties (up to 8 results, sorted by newest).

- **Access:** Public

**Example Request:**
```
GET /api/properties/featured
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": [ ...array of property objects... ]
}
```

---

### GET `/api/properties/new-launches`
Get all new launch properties (up to 10 results, sorted by newest).

- **Access:** Public

**Example Request:**
```
GET /api/properties/new-launches
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": [ ...array of property objects... ]
}
```

---

### GET `/api/properties/:id`
Get a single property by MongoDB `_id` or `slug`.

- **Access:** Public

**URL Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `id`      | string | MongoDB ObjectId (24-char hex) **or** property slug |

**Example Requests:**
```
GET /api/properties/abc123def456abc123def456
GET /api/properties/luxury-3-bhk-apartment-in-whitefield-1716000000000
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": { ...full property object... }
}
```

**Error Response — 404 Not Found:**
```json
{
  "message": "Property not found"
}
```

---

## 3. Properties — Admin

> All endpoints in this section require `Authorization: Bearer <token>` header.

---

### GET `/api/properties/admin/all`
Get **all** properties (including inactive ones) for admin management.

- **Access:** Private

**Query Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `search`  | string | No       | Searches title and location |
| `page`    | number | No       | Page number (default: `1`) |
| `limit`   | number | No       | Results per page (default: `20`) |

**Example Request:**
```
GET /api/properties/admin/all
GET /api/properties/admin/all?search=Koramangala&page=1&limit=20
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": [ ...all properties including inactive... ],
  "pagination": {
    "total": 60,
    "page": 1,
    "pages": 3
  }
}
```

---

### POST `/api/properties`
Create a new property listing.

- **Access:** Private
- **Content-Type:** `multipart/form-data` (required for file uploads)

**Form Fields:**

| Field            | Type     | Required | Description |
|------------------|----------|----------|-------------|
| `title`          | string   | ✅ Yes   | Property title |
| `category`       | string   | ✅ Yes   | `buy` \| `rent` \| `new-launch` \| `plots-lands` |
| `propertyType`   | string   | ✅ Yes   | `residential` \| `commercial` \| `plots` |
| `unitType`       | string   | ✅ Yes   | See Enum Reference |
| `location`       | string   | ✅ Yes   | Location in Bengaluru |
| `area`           | string   | No       | Sub-area / sector |
| `address`        | string   | No       | Full address |
| `priceMin`       | number   | No       | Minimum price |
| `priceMax`       | number   | No       | Maximum price |
| `priceUnit`      | string   | No       | `Cr` \| `L` \| `K` (default: `Cr`) |
| `estimatedEMI`   | string   | No       | e.g. `₹ 50,000/month` |
| `projectSize`    | string   | No       | e.g. `5 Acres` |
| `totalUnits`     | number   | No       | Total units in project |
| `possessionDate` | string   | No       | e.g. `Dec 2026` |
| `overview`       | string   | No       | Property description |
| `amenities`      | JSON string | No   | `["Swimming Pool", "Gym"]` |
| `configurations` | JSON string | No   | `["2 BHK", "3 BHK"]` |
| `landmarks`      | JSON string | No   | `["5 min to ITPL"]` |
| `mapEmbed`       | string   | No       | Google Maps embed src URL |
| `mapLink`        | string   | No       | Google Maps share link |
| `isNewLaunch`    | boolean  | No       | `true` \| `false` (default: `false`) |
| `isFeatured`     | boolean  | No       | `true` \| `false` (default: `false`) |
| `isActive`       | boolean  | No       | `true` \| `false` (default: `true`) |
| `whatsappNumber` | string   | No       | WhatsApp contact number |
| `contactPhone`   | string   | No       | Phone number |
| `contactEmail`   | string   | No       | Email address |
| `photos`         | file(s)  | No       | Images — JPEG/PNG/WebP, max 10MB each, max 20 files |
| `floorPlans`     | file(s)  | No       | Floor plan images, max 10 files |

**Success Response — 201 Created:**
```json
{
  "success": true,
  "data": { ...newly created property object... }
}
```

**Error Response — 400 Bad Request:**
```json
{
  "message": "Property title is required"
}
```

---

### PUT `/api/properties/:id`
Update an existing property.

- **Access:** Private
- **Content-Type:** `multipart/form-data`

**URL Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `id`      | string | MongoDB ObjectId of the property |

**Form Fields:** Same as POST. Only include fields you want to update.
New photos/floorPlans are **appended** to existing ones (not replaced).

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": { ...updated property object... }
}
```

**Error Response — 404 Not Found:**
```json
{
  "message": "Property not found"
}
```

---

### DELETE `/api/properties/:id`
Permanently delete a property and all its associated uploaded images.

- **Access:** Private

**URL Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `id`      | string | MongoDB ObjectId of the property |

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

**Error Response — 404 Not Found:**
```json
{
  "message": "Property not found"
}
```

---

### DELETE `/api/properties/:id/photo`
Remove a single photo from a property and delete the file from disk.

- **Access:** Private
- **Content-Type:** `application/json`

**URL Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `id`      | string | MongoDB ObjectId of the property |

**Request Body:**
```json
{
  "photoPath": "/uploads/1716000000000-123456789.jpg"
}
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": { ...updated property object without deleted photo... }
}
```

---

## 4. Enquiries — Public

### POST `/api/enquiry`
Submit a property enquiry.

- **Access:** Public
- **Content-Type:** `application/json`

**Request Body:**

| Field               | Type   | Required | Description |
|---------------------|--------|----------|-------------|
| `name`              | string | ✅ Yes   | Full name |
| `phone`             | string | ✅ Yes   | Contact phone number |
| `email`             | string | No       | Email address |
| `message`           | string | No       | Custom message |
| `propertyId`        | string | No       | MongoDB ObjectId of the property |
| `propertyTitle`     | string | No       | Property title (for reference) |
| `propertyLocation`  | string | No       | Property location (for reference) |
| `enquiryType`       | string | No       | `general` \| `callback` \| `site-visit` \| `whatsapp` (default: `general`) |

**Example Request Body:**
```json
{
  "name": "Ravi Kumar",
  "phone": "+919876543210",
  "email": "ravi@example.com",
  "message": "I am interested in this property. Please call me.",
  "propertyId": "abc123def456abc123def456",
  "propertyTitle": "Luxury 3 BHK Apartment in Whitefield",
  "propertyLocation": "Whitefield, Bengaluru",
  "enquiryType": "callback"
}
```

**Success Response — 201 Created:**
```json
{
  "success": true,
  "message": "Enquiry submitted successfully! We will contact you soon.",
  "data": {
    "_id": "enq123abc456",
    "name": "Ravi Kumar",
    "phone": "+919876543210",
    "email": "ravi@example.com",
    "message": "I am interested in this property. Please call me.",
    "propertyId": "abc123def456abc123def456",
    "propertyTitle": "Luxury 3 BHK Apartment in Whitefield",
    "propertyLocation": "Whitefield, Bengaluru",
    "enquiryType": "callback",
    "status": "new",
    "createdAt": "2024-05-18T10:00:00.000Z"
  }
}
```

**Error Response — 400 Bad Request:**
```json
{
  "message": "Name and phone are required"
}
```

---

## 5. Enquiries — Admin

> All endpoints in this section require `Authorization: Bearer <token>` header.

---

### GET `/api/enquiry`
Get all enquiries with optional status filter and pagination.

- **Access:** Private

**Query Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `status`  | string | No       | `new` \| `contacted` \| `closed` |
| `page`    | number | No       | Page number (default: `1`) |
| `limit`   | number | No       | Results per page (default: `20`) |

**Example Requests:**
```
GET /api/enquiry
GET /api/enquiry?status=new
GET /api/enquiry?status=contacted&page=1&limit=10
```

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "enq123abc456",
      "name": "Ravi Kumar",
      "phone": "+919876543210",
      "email": "ravi@example.com",
      "message": "Interested in property.",
      "propertyId": "abc123def456abc123def456",
      "propertyTitle": "Luxury 3 BHK Apartment in Whitefield",
      "propertyLocation": "Whitefield, Bengaluru",
      "enquiryType": "callback",
      "status": "new",
      "createdAt": "2024-05-18T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 2
  }
}
```

---

### PUT `/api/enquiry/:id`
Update the status of an enquiry.

- **Access:** Private
- **Content-Type:** `application/json`

**URL Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `id`      | string | MongoDB ObjectId of the enquiry |

**Request Body:**
```json
{
  "status": "contacted"
}
```

| Status value | Meaning |
|-------------|---------|
| `new`       | Freshly submitted, not yet actioned |
| `contacted` | Admin has reached out to the lead |
| `closed`    | Enquiry resolved / closed |

**Success Response — 200 OK:**
```json
{
  "success": true,
  "data": {
    "_id": "enq123abc456",
    "status": "contacted",
    ...
  }
}
```

**Error Response — 404 Not Found:**
```json
{
  "message": "Enquiry not found"
}
```

---

### DELETE `/api/enquiry/:id`
Permanently delete an enquiry record.

- **Access:** Private

**URL Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `id`      | string | MongoDB ObjectId of the enquiry |

**Success Response — 200 OK:**
```json
{
  "success": true,
  "message": "Enquiry deleted"
}
```

---

## 6. Health Check

### GET `/api/health`
Check if the API server is running.

- **Access:** Public

**Success Response — 200 OK:**
```json
{
  "status": "OK",
  "message": "Real Estate API is running"
}
```

---

## 7. Data Models

### Property
```
_id             ObjectId      Auto-generated
title           String        Required
slug            String        Auto-generated from title + timestamp
category        String        Required — buy | rent | new-launch | plots-lands
propertyType    String        Required — residential | commercial | plots
unitType        String        Required — see Enum Reference
location        String        Required — Bengaluru area
area            String        Optional — sub-area
address         String        Optional — full address
priceMin        Number        Optional
priceMax        Number        Optional
priceUnit       String        Cr | L | K  (default: Cr)
estimatedEMI    String        Optional — e.g. "₹ 85,000/month"
projectSize     String        Optional — e.g. "5 Acres"
configurations  [String]      Optional — e.g. ["2 BHK", "3 BHK"]
totalUnits      Number        Optional
possessionDate  String        Optional — e.g. "Dec 2026"
overview        String        Optional — description
amenities       [String]      Optional
landmarks       [String]      Optional
photos          [String]      File paths — e.g. ["/uploads/filename.jpg"]
floorPlans      [String]      File paths
mapEmbed        String        Optional — Google Maps iframe src
mapLink         String        Optional — Google Maps share URL
isNewLaunch     Boolean       Default: false
isActive        Boolean       Default: true
isFeatured      Boolean       Default: false
whatsappNumber  String        Optional
contactPhone    String        Optional
contactEmail    String        Optional
createdAt       Date          Auto (timestamps)
updatedAt       Date          Auto (timestamps)
```

### Enquiry
```
_id               ObjectId   Auto-generated
name              String     Required
phone             String     Required
email             String     Optional
message           String     Optional
propertyId        ObjectId   Optional — ref: Property
propertyTitle     String     Optional — copy for display
propertyLocation  String     Optional
enquiryType       String     general | callback | site-visit | whatsapp
status            String     new | contacted | closed  (default: new)
createdAt         Date       Auto (timestamps)
updatedAt         Date       Auto (timestamps)
```

### Admin
```
_id        ObjectId   Auto-generated
name       String     Required
email      String     Required, unique
password   String     Bcrypt hashed
createdAt  Date       Auto
updatedAt  Date       Auto
```

---

## 8. Enum Reference

### `category`
| Value          | Label         |
|----------------|---------------|
| `buy`          | Buy           |
| `rent`         | Rent          |
| `new-launch`   | New Launch    |
| `plots-lands`  | Plots / Lands |

### `propertyType`
| Value         | Label       |
|---------------|-------------|
| `residential` | Residential |
| `commercial`  | Commercial  |
| `plots`       | Plots       |

### `unitType`
| Value                | Label               | propertyType  |
|----------------------|---------------------|---------------|
| `apartment`          | Apartment           | residential   |
| `land`               | Land                | residential   |
| `low-rise-floor`     | Low Rise Floor      | residential   |
| `residential-plots`  | Residential Plots   | residential / plots |
| `independent-floors` | Independent Floors  | residential   |
| `shop`               | Shop                | commercial    |
| `retail-shops`       | Retail Shops        | commercial    |
| `food-court`         | Food Court          | commercial    |
| `sco-plots`          | SCO Plots           | commercial    |
| `industrial-plot`    | Industrial Plot     | plots         |

### `priceUnit`
| Value | Meaning        |
|-------|----------------|
| `Cr`  | Crore (₹ Cr)   |
| `L`   | Lakh (₹ L)     |
| `K`   | Thousand (₹ K) |

### `enquiryType`
| Value        | Description                  |
|--------------|------------------------------|
| `general`    | General information enquiry  |
| `callback`   | Request a phone callback     |
| `site-visit` | Schedule a site visit        |
| `whatsapp`   | WhatsApp message enquiry     |

### `enquiry status`
| Value       | Description                      |
|-------------|----------------------------------|
| `new`       | Just submitted, not yet actioned |
| `contacted` | Admin has contacted the lead     |
| `closed`    | Enquiry resolved                 |

---

## 9. Error Responses

All error responses follow this structure:

```json
{
  "message": "Human-readable error description"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request / validation error |
| `401` | Unauthorized — missing or invalid token |
| `404` | Resource not found |
| `500` | Internal server error |

---

## 10. Quick Test (curl)

### Health check
```bash
curl http://localhost:5000/api/health
```

### Admin login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demohomesv1.com","password":"Admin@123"}'
```

### Get all properties
```bash
curl http://localhost:5000/api/properties
```

### Get properties filtered
```bash
curl "http://localhost:5000/api/properties?category=buy&propertyType=residential&page=1&limit=6"
```

### Get featured properties
```bash
curl http://localhost:5000/api/properties/featured
```

### Get new launches
```bash
curl http://localhost:5000/api/properties/new-launches
```

### Get single property
```bash
curl http://localhost:5000/api/properties/<property-id-or-slug>
```

### Submit an enquiry
```bash
curl -X POST http://localhost:5000/api/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ravi Kumar",
    "phone": "+919876543210",
    "email": "ravi@example.com",
    "enquiryType": "callback",
    "propertyTitle": "Test Property"
  }'
```

### Create a property (admin)
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -F "title=Luxury Apartment Whitefield" \
  -F "category=buy" \
  -F "propertyType=residential" \
  -F "unitType=apartment" \
  -F "location=Whitefield, Bengaluru" \
  -F "priceMin=1.2" \
  -F "priceMax=1.8" \
  -F "priceUnit=Cr" \
  -F "isNewLaunch=true" \
  -F "isFeatured=true" \
  -F "amenities=[\"Swimming Pool\",\"Gym / Fitness Center\"]" \
  -F "configurations=[\"2 BHK\",\"3 BHK\"]" \
  -F "photos=@/path/to/image.jpg"
```

### Get all enquiries (admin)
```bash
curl http://localhost:5000/api/enquiry \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Update enquiry status (admin)
```bash
curl -X PUT http://localhost:5000/api/enquiry/<enquiry-id> \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"contacted"}'
```

### Delete a property (admin)
```bash
curl -X DELETE http://localhost:5000/api/properties/<property-id> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

*Generated for Demo Homes V1 — Real Estate API v1.0.0*
