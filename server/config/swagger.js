const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Demo Homes V1 – Real Estate API',
      version: '2.0.0',
      description:
        'REST API for the **Demo Homes V1** real estate platform (Bengaluru).\n\n' +
        'Covers property listings with photo/video media, customer enquiries, and admin management.\n\n' +
        '## Authentication\n\n' +
        'Admin endpoints require a **Bearer JWT token**.\n' +
        '1. Call `POST /auth/login` with admin credentials.\n' +
        '2. Copy the `token` from the response.\n' +
        '3. Click **Authorize** (top right), paste the token, click **Authorize**.\n\n' +
        '## Frontend Pages\n\n' +
        '| Route | Description |\n' +
        '|-------|-------------|\n' +
        '| `/home` | Home page – hero, featured & newly launched |\n' +
        '| `/properties` | Property listing with filters & search |\n' +
        '| `/properties/:slug` | Property detail – gallery, videos, amenities, map |\n' +
        '| `/admin/login` | Admin login |\n' +
        '| `/admin/dashboard` | Admin dashboard *(auth required)* |\n' +
        '| `/admin/add-property` | Add new property *(auth required)* |\n' +
        '| `/admin/edit-property/:id` | Edit property *(auth required)* |\n\n' +
        '> Visiting `/` automatically redirects to `/home`.',
      contact: {
        name: 'Demo Homes V1',
        email: 'admin@demohomesv1.com',
      },
    },
    servers: [
      {
        url: 'https://realestate-dwbk.onrender.com/api',
        description: 'Production server (Render)',
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from POST /auth/login. Paste the token value only — without the "Bearer " prefix.',
        },
      },
      schemas: {

        // ── Auth ──────────────────────────────────────────────────────────
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@demohomesv1.com' },
            password: { type: 'string', example: 'Admin@123' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                _id:   { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
                name:  { type: 'string', example: 'Admin' },
                email: { type: 'string', example: 'admin@demohomesv1.com' },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },

        // ── Property ──────────────────────────────────────────────────────
        Property: {
          type: 'object',
          properties: {
            _id:   { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            title: { type: 'string', example: 'Prestige Lakeside Habitat' },
            slug:  { type: 'string', example: 'prestige-lakeside-habitat-1693000000000' },
            category: {
              type: 'string',
              enum: ['buy', 'rent'],
              example: 'buy',
            },
            propertyType: {
              type: 'string',
              enum: ['residential', 'commercial'],
              example: 'residential',
            },
            unitType: {
              type: 'string',
              enum: [
                'apartment', 'land', 'low-rise-floor', 'residential-plots', 'independent-floors',
                'shop', 'retail-shops', 'food-court', 'sco-plots', 'industrial-plot',
              ],
              example: 'apartment',
            },
            location:      { type: 'string', example: 'Whitefield, Bengaluru' },
            area:          { type: 'string', example: 'Phase 2, Whitefield' },
            address:       { type: 'string', example: 'Near ITPL, Whitefield, Bengaluru – 560066' },
            priceMin:      { type: 'number', example: 1.2 },
            priceMax:      { type: 'number', example: 2.5 },
            priceUnit: {
              type: 'string',
              enum: ['Cr', 'L', 'K'],
              example: 'Cr',
            },
            estimatedEMI:  { type: 'string', example: '₹65,000/month' },
            projectSize:   { type: 'string', example: '5 Acres' },
            configurations: {
              type: 'array',
              items: { type: 'string' },
              example: ['2 BHK', '3 BHK', '4 BHK'],
            },
            totalUnits:    { type: 'number', example: 480 },
            possessionDate: { type: 'string', example: 'Dec 2026' },
            overview: {
              type: 'string',
              example: 'A premium residential project offering modern amenities in the heart of Whitefield.',
            },
            amenities: {
              type: 'array',
              items: { type: 'string' },
              example: ['Swimming Pool', 'Gym / Fitness Center', 'Clubhouse', 'Children Play Area'],
            },
            landmarks: {
              type: 'array',
              items: { type: 'string' },
              example: ['2 min to ITPL', '5 km from Marathahalli'],
            },
            photos: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://res.cloudinary.com/demo/image/upload/v1/demohomes-v1/photo1.jpg'],
              description: 'Cloudinary image URLs (production) or /uploads/filename (development)',
            },
            floorPlans: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://res.cloudinary.com/demo/image/upload/v1/demohomes-v1/floorplan1.jpg'],
            },
            videos: {
              type: 'array',
              items: { type: 'string' },
              example: ['https://res.cloudinary.com/demo/video/upload/v1/demohomes-v1/videos/tour.mp4'],
              description: 'Cloudinary video URLs – max 3 videos per property (MP4/MOV/WebM/AVI, up to 200 MB each)',
            },
            mapEmbed:  { type: 'string', example: 'https://maps.google.com/maps?q=Whitefield+Bengaluru&output=embed' },
            mapLink:   { type: 'string', example: 'https://maps.app.goo.gl/xyz123' },
            isNewLaunch: { type: 'boolean', example: true },
            isActive:    { type: 'boolean', example: true },
            isFeatured:  { type: 'boolean', example: false },
            whatsappNumber: { type: 'string', example: '919876543210' },
            contactPhone:   { type: 'string', example: '+91 98765 43210' },
            contactEmail:   { type: 'string', example: 'sales@demohomesv1.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Enquiry ───────────────────────────────────────────────────────
        EnquiryRequest: {
          type: 'object',
          required: ['name', 'phone'],
          properties: {
            name:             { type: 'string', example: 'Rahul Sharma' },
            phone:            { type: 'string', example: '+91 98765 43210' },
            email:            { type: 'string', format: 'email', example: 'rahul@example.com' },
            message:          { type: 'string', example: 'Interested in 3 BHK options. Please share more details.' },
            propertyId:       { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            propertyTitle:    { type: 'string', example: 'Prestige Lakeside Habitat' },
            propertyLocation: { type: 'string', example: 'Whitefield' },
            enquiryType: {
              type: 'string',
              enum: ['buy', 'rent', 'site-visit', 'general'],
              example: 'site-visit',
            },
          },
        },
        Enquiry: {
          type: 'object',
          properties: {
            _id:              { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d2' },
            name:             { type: 'string', example: 'Rahul Sharma' },
            phone:            { type: 'string', example: '+91 98765 43210' },
            email:            { type: 'string', example: 'rahul@example.com' },
            message:          { type: 'string', example: 'Interested in 3 BHK options.' },
            propertyId:       { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            propertyTitle:    { type: 'string', example: 'Prestige Lakeside Habitat' },
            propertyLocation: { type: 'string', example: 'Whitefield' },
            enquiryType:      { type: 'string', example: 'site-visit' },
            status: {
              type: 'string',
              enum: ['new', 'contacted', 'closed'],
              example: 'new',
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Common ────────────────────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Error description here' },
          },
        },
        PaginatedProperties: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Property' },
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 42 },
                page:  { type: 'number', example: 1 },
                pages: { type: 'number', example: 4 },
                limit: { type: 'number', example: 12 },
              },
            },
          },
        },
        PropertyListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Property' },
            },
          },
        },
        PropertyResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { $ref: '#/components/schemas/Property' },
          },
        },
      },
    },

    tags: [
      { name: 'Health',                description: 'Server health check' },
      { name: 'Auth',                  description: 'Admin authentication' },
      { name: 'Properties – Public',   description: 'Public property endpoints — no auth required' },
      { name: 'Properties – Admin',    description: 'Admin-only property management — Bearer token required' },
      { name: 'Enquiries – Public',    description: 'Submit customer enquiry — no auth required' },
      { name: 'Enquiries – Admin',     description: 'Manage enquiries — Bearer token required' },
    ],

    paths: {

      // ── Health ──────────────────────────────────────────────────────────
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Server health check',
          description: 'Returns OK when the API is running. Useful for uptime monitoring.',
          responses: {
            200: {
              description: 'API is running',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status:  { type: 'string', example: 'OK' },
                      message: { type: 'string', example: 'Real Estate API is running' },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // ── Auth ────────────────────────────────────────────────────────────
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Admin login',
          description: 'Authenticate as admin and receive a JWT token valid for 7 days.\n\n**Default credentials:** `admin@demohomesv1.com` / `Admin@123`',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful — copy the `token` and use it in Authorize',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } },
              },
            },
            400: { description: 'Email or password missing' },
            401: {
              description: 'Invalid email or password',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current admin profile',
          description: 'Returns the profile of the currently authenticated admin.',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Admin profile',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'object',
                        properties: {
                          _id:   { type: 'string' },
                          name:  { type: 'string' },
                          email: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized — token missing or expired' },
          },
        },
      },

      // ── Properties – Public ─────────────────────────────────────────────
      '/properties': {
        get: {
          tags: ['Properties – Public'],
          summary: 'Get properties (paginated + filtered)',
          description: 'Returns active properties. Supports full-text search and multiple filter combinations.',
          parameters: [
            {
              in: 'query', name: 'category',
              schema: { type: 'string', enum: ['buy', 'rent'] },
              description: 'Filter by listing category',
            },
            {
              in: 'query', name: 'propertyType',
              schema: { type: 'string', enum: ['residential', 'commercial'] },
              description: 'Filter by property type',
            },
            {
              in: 'query', name: 'unitType',
              schema: {
                type: 'string',
                enum: ['apartment', 'land', 'low-rise-floor', 'residential-plots', 'independent-floors', 'shop', 'retail-shops', 'food-court', 'sco-plots', 'industrial-plot'],
              },
              description: 'Filter by unit type',
            },
            {
              in: 'query', name: 'search',
              schema: { type: 'string' },
              description: 'Full-text search on title, location, area, and overview',
            },
            {
              in: 'query', name: 'featured',
              schema: { type: 'boolean' },
              description: 'Set to `true` to return only featured properties',
            },
            {
              in: 'query', name: 'page',
              schema: { type: 'integer', default: 1 },
              description: 'Page number (default: 1)',
            },
            {
              in: 'query', name: 'limit',
              schema: { type: 'integer', default: 12 },
              description: 'Results per page (default: 12)',
            },
          ],
          responses: {
            200: {
              description: 'Paginated list of properties',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PaginatedProperties' } },
              },
            },
          },
        },
      },

      '/properties/new-launches': {
        get: {
          tags: ['Properties – Public'],
          summary: 'Get newly launched properties',
          description: 'Returns up to 10 active properties marked as New Launch, sorted by most recent.',
          responses: {
            200: {
              description: 'New launch properties',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PropertyListResponse' } },
              },
            },
          },
        },
      },

      '/properties/featured': {
        get: {
          tags: ['Properties – Public'],
          summary: 'Get featured properties',
          description: 'Returns up to 8 active properties marked as Featured, sorted by most recent.',
          responses: {
            200: {
              description: 'Featured properties',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PropertyListResponse' } },
              },
            },
          },
        },
      },

      '/properties/{id}': {
        get: {
          tags: ['Properties – Public'],
          summary: 'Get property by ID or slug',
          description: 'Accepts either a MongoDB ObjectId (`64f1a2b3...`) or a URL-friendly slug (`prestige-lakeside-1693000000000`).',
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'MongoDB ObjectId or URL slug',
              example: 'prestige-lakeside-habitat-1693000000000',
            },
          ],
          responses: {
            200: {
              description: 'Property detail',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PropertyResponse' } },
              },
            },
            404: {
              description: 'Property not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },

        put: {
          tags: ['Properties – Admin'],
          summary: 'Update property',
          description: 'Update any field of an existing property. New photos, floor plans, or videos are **appended** to existing ones (not replaced). Send only the fields you want to change.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'Property MongoDB ObjectId',
            },
          ],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    title:          { type: 'string' },
                    category:       { type: 'string', enum: ['buy', 'rent'] },
                    propertyType:   { type: 'string', enum: ['residential', 'commercial'] },
                    unitType:       { type: 'string' },
                    location:       { type: 'string' },
                    area:           { type: 'string' },
                    address:        { type: 'string' },
                    priceMin:       { type: 'number' },
                    priceMax:       { type: 'number' },
                    priceUnit:      { type: 'string', enum: ['Cr', 'L', 'K'] },
                    estimatedEMI:   { type: 'string' },
                    projectSize:    { type: 'string' },
                    configurations: { type: 'string', description: 'JSON-encoded string array e.g. ["2 BHK","3 BHK"]' },
                    totalUnits:     { type: 'number' },
                    possessionDate: { type: 'string' },
                    overview:       { type: 'string' },
                    amenities:      { type: 'string', description: 'JSON-encoded string array' },
                    landmarks:      { type: 'string', description: 'JSON-encoded string array' },
                    mapEmbed:       { type: 'string' },
                    mapLink:        { type: 'string' },
                    isNewLaunch:    { type: 'boolean' },
                    isActive:       { type: 'boolean' },
                    isFeatured:     { type: 'boolean' },
                    whatsappNumber: { type: 'string' },
                    contactPhone:   { type: 'string' },
                    contactEmail:   { type: 'string' },
                    photos: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      description: 'New photos to append (JPEG/PNG/WebP, max 200 MB each)',
                    },
                    floorPlans: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      description: 'New floor plan images to append',
                    },
                    videos: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      description: 'New videos to append (MP4/MOV/WebM/AVI, max 200 MB each, up to 3 total)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Property updated successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PropertyResponse' } },
              },
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            404: { description: 'Property not found' },
          },
        },

        delete: {
          tags: ['Properties – Admin'],
          summary: 'Delete property',
          description: 'Permanently deletes a property and all associated images and videos from Cloudinary.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'Property MongoDB ObjectId',
            },
          ],
          responses: {
            200: { description: 'Property deleted successfully' },
            401: { description: 'Unauthorized' },
            404: { description: 'Property not found' },
          },
        },
      },

      // ── Properties – Admin ──────────────────────────────────────────────
      '/properties/admin/all': {
        get: {
          tags: ['Properties – Admin'],
          summary: 'Get all properties (admin view)',
          description: 'Returns all properties including inactive ones. Supports search and pagination.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'query', name: 'search',
              schema: { type: 'string' },
              description: 'Filter by title or location',
            },
            {
              in: 'query', name: 'page',
              schema: { type: 'integer', default: 1 },
            },
            {
              in: 'query', name: 'limit',
              schema: { type: 'integer', default: 20 },
            },
          ],
          responses: {
            200: {
              description: 'All properties (including inactive)',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PaginatedProperties' } },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/properties/': {
        post: {
          tags: ['Properties – Admin'],
          summary: 'Create new property',
          description: 'Creates a new property listing. Accepts `multipart/form-data` to support photo, floor plan, and video file uploads.\n\n**Media limits:**\n- Photos: up to 20 (JPEG/PNG/WebP)\n- Floor Plans: up to 10 (JPEG/PNG/WebP)\n- Videos: up to 3 (MP4/MOV/WebM/AVI, max 200 MB each)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['title', 'category', 'propertyType', 'unitType', 'location'],
                  properties: {
                    title:          { type: 'string', example: 'Prestige Lakeside Habitat' },
                    category:       { type: 'string', enum: ['buy', 'rent'], example: 'buy' },
                    propertyType:   { type: 'string', enum: ['residential', 'commercial'], example: 'residential' },
                    unitType: {
                      type: 'string',
                      enum: ['apartment', 'land', 'low-rise-floor', 'residential-plots', 'independent-floors', 'shop', 'retail-shops', 'food-court', 'sco-plots', 'industrial-plot'],
                      example: 'apartment',
                    },
                    location:       { type: 'string', example: 'Whitefield, Bengaluru' },
                    area:           { type: 'string', example: 'Phase 2, Whitefield' },
                    address:        { type: 'string', example: 'Near ITPL, Whitefield, Bengaluru – 560066' },
                    priceMin:       { type: 'number', example: 1.2 },
                    priceMax:       { type: 'number', example: 2.5 },
                    priceUnit:      { type: 'string', enum: ['Cr', 'L', 'K'], example: 'Cr' },
                    estimatedEMI:   { type: 'string', example: '₹65,000/month' },
                    projectSize:    { type: 'string', example: '5 Acres' },
                    configurations: { type: 'string', description: 'JSON-encoded array e.g. ["2 BHK","3 BHK"]', example: '["2 BHK","3 BHK"]' },
                    totalUnits:     { type: 'number', example: 200 },
                    possessionDate: { type: 'string', example: 'Dec 2026' },
                    overview:       { type: 'string', example: 'A premium residential project...' },
                    amenities:      { type: 'string', description: 'JSON-encoded array', example: '["Swimming Pool","Gym"]' },
                    landmarks:      { type: 'string', description: 'JSON-encoded array', example: '["2 min to ITPL","Near Phoenix Mall"]' },
                    mapEmbed:       { type: 'string', example: 'https://maps.google.com/maps?q=Whitefield&output=embed' },
                    mapLink:        { type: 'string', example: 'https://maps.app.goo.gl/xyz123' },
                    isNewLaunch:    { type: 'boolean', example: false },
                    isActive:       { type: 'boolean', example: true },
                    isFeatured:     { type: 'boolean', example: false },
                    whatsappNumber: { type: 'string', example: '919876543210' },
                    contactPhone:   { type: 'string', example: '+91 98765 43210' },
                    contactEmail:   { type: 'string', example: 'sales@demohomesv1.com' },
                    photos: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      description: 'Up to 20 property images (JPEG/PNG/WebP)',
                    },
                    floorPlans: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      description: 'Up to 10 floor plan images (JPEG/PNG/WebP)',
                    },
                    videos: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      description: 'Up to 3 property tour videos (MP4/MOV/WebM/AVI, max 200 MB each)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Property created successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PropertyResponse' } },
              },
            },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/properties/{id}/photo': {
        delete: {
          tags: ['Properties – Admin'],
          summary: 'Delete a single photo from a property',
          description: 'Removes one photo from the property\'s photos array and deletes it from Cloudinary.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'Property MongoDB ObjectId',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['photoPath'],
                  properties: {
                    photoPath: {
                      type: 'string',
                      example: 'https://res.cloudinary.com/demo/image/upload/v1/demohomes-v1/photo1.jpg',
                      description: 'Full URL of the photo to delete (as stored in the property document)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Photo deleted — returns updated property',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PropertyResponse' } },
              },
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Property not found' },
          },
        },
      },

      // ── Enquiries ───────────────────────────────────────────────────────
      '/enquiry': {
        post: {
          tags: ['Enquiries – Public'],
          summary: 'Submit a property enquiry',
          description: 'Allows customers to submit an enquiry for a specific property or a general enquiry. Only `name` and `phone` are required.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EnquiryRequest' },
              },
            },
          },
          responses: {
            201: {
              description: 'Enquiry submitted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Enquiry submitted successfully' },
                      data:    { $ref: '#/components/schemas/Enquiry' },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation error — name and phone are required',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
              },
            },
          },
        },

        get: {
          tags: ['Enquiries – Admin'],
          summary: 'Get all enquiries',
          description: 'Returns all customer enquiries. Optionally filter by status.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'query', name: 'status',
              schema: { type: 'string', enum: ['new', 'contacted', 'closed'] },
              description: 'Filter by enquiry status',
            },
          ],
          responses: {
            200: {
              description: 'List of enquiries',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Enquiry' },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/enquiry/{id}': {
        put: {
          tags: ['Enquiries – Admin'],
          summary: 'Update enquiry status',
          description: 'Update the status of an enquiry: `new` → `contacted` → `closed`.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'Enquiry MongoDB ObjectId',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['new', 'contacted', 'closed'],
                      example: 'contacted',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Enquiry status updated' },
            401: { description: 'Unauthorized' },
            404: { description: 'Enquiry not found' },
          },
        },

        delete: {
          tags: ['Enquiries – Admin'],
          summary: 'Delete enquiry',
          description: 'Permanently removes an enquiry from the database.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'string' },
              description: 'Enquiry MongoDB ObjectId',
            },
          ],
          responses: {
            200: { description: 'Enquiry deleted' },
            401: { description: 'Unauthorized' },
            404: { description: 'Enquiry not found' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
