const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Demo Homes V1 – Real Estate API',
      version: '1.0.0',
      description:
        'REST API for the Demo Homes V1 real estate platform (Bengaluru). Covers property listings, enquiries, and admin management.\n\n' +
        '## Frontend Pages\n\n' +
        '| Route | Description |\n' +
        '|-------|-------------|\n' +
        '| `http://localhost:5173/home` | Home page (hero, featured, newly launched) |\n' +
        '| `http://localhost:5173/properties` | Property listing with filters |\n' +
        '| `http://localhost:5173/properties/:id` | Property detail page |\n' +
        '| `http://localhost:5173/admin/login` | Admin login |\n' +
        '| `http://localhost:5173/admin/dashboard` | Admin dashboard *(auth required)* |\n' +
        '| `http://localhost:5173/admin/add-property` | Add new property *(auth required)* |\n' +
        '| `http://localhost:5173/admin/edit-property/:id` | Edit property *(auth required)* |\n\n' +
        '> Visiting `http://localhost:5173/` automatically redirects to `/home`.',
      contact: {
        name: 'Demo Homes V1',
        email: 'info@demohomesv1.com',
      },
    },
    servers: [
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
          description: 'JWT token from POST /auth/login. Paste without "Bearer " prefix.',
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
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            admin: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
                name: { type: 'string', example: 'Admin' },
                email: { type: 'string', example: 'admin@demohomesv1.com' },
              },
            },
          },
        },

        // ── Property ──────────────────────────────────────────────────────
        Property: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            title: { type: 'string', example: 'Prestige Lakeside Habitat' },
            slug: { type: 'string', example: 'prestige-lakeside-habitat-1693000000000' },
            category: {
              type: 'string',
              enum: ['buy', 'rent', 'new-launch', 'plots-lands'],
              example: 'buy',
            },
            propertyType: {
              type: 'string',
              enum: ['residential', 'commercial', 'plots'],
              example: 'residential',
            },
            unitType: {
              type: 'string',
              enum: [
                '1BHK', '2BHK', '3BHK', '4BHK', '4BHK+',
                'Studio', 'Villa', 'Penthouse', 'Row House', 'Duplex',
                'Office Space', 'Retail Shop', 'Showroom', 'Warehouse', 'Co-working Space',
                'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'NA Plot',
              ],
              example: '3BHK',
            },
            location: { type: 'string', example: 'Whitefield' },
            area: { type: 'string', example: 'East Bengaluru' },
            address: { type: 'string', example: 'Near ITPL, Whitefield, Bengaluru - 560066' },
            priceMin: { type: 'number', example: 8500000 },
            priceMax: { type: 'number', example: 15000000 },
            priceUnit: {
              type: 'string',
              enum: ['total', 'per-sqft', 'per-month', 'per-year', 'on-request'],
              example: 'total',
            },
            estimatedEMI: { type: 'string', example: '₹65,000/month' },
            projectSize: { type: 'string', example: '42 Acres' },
            configurations: {
              type: 'array',
              items: { type: 'string' },
              example: ['2BHK - 1200 sqft', '3BHK - 1600 sqft'],
            },
            totalUnits: { type: 'number', example: 480 },
            possessionDate: { type: 'string', example: 'Dec 2026' },
            overview: {
              type: 'string',
              example: 'A premium residential project offering modern amenities...',
            },
            amenities: {
              type: 'array',
              items: { type: 'string' },
              example: ['Swimming Pool', 'Gym', 'Club House', 'Children Play Area'],
            },
            landmarks: {
              type: 'array',
              items: { type: 'string' },
              example: ['2 km from ITPL', '5 km from Marathahalli'],
            },
            photos: {
              type: 'array',
              items: { type: 'string' },
              example: ['/uploads/1693000000000-123456789.jpg'],
            },
            floorPlans: {
              type: 'array',
              items: { type: 'string' },
              example: ['/uploads/1693000000001-987654321.jpg'],
            },
            mapEmbed: { type: 'string', example: '<iframe src="https://maps.google.com/..."></iframe>' },
            mapLink: { type: 'string', example: 'https://maps.google.com/?q=Whitefield+Bengaluru' },
            isNewLaunch: { type: 'boolean', example: true },
            isActive: { type: 'boolean', example: true },
            isFeatured: { type: 'boolean', example: false },
            whatsappNumber: { type: 'string', example: '919876543210' },
            contactPhone: { type: 'string', example: '+91 98765 43210' },
            contactEmail: { type: 'string', example: 'sales@demohomesv1.com' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ── Enquiry ───────────────────────────────────────────────────────
        EnquiryRequest: {
          type: 'object',
          required: ['name', 'phone'],
          properties: {
            name: { type: 'string', example: 'Rahul Sharma' },
            phone: { type: 'string', example: '+91 98765 43210' },
            email: { type: 'string', format: 'email', example: 'rahul@example.com' },
            message: { type: 'string', example: 'Interested in 3BHK options' },
            propertyId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            propertyTitle: { type: 'string', example: 'Prestige Lakeside Habitat' },
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
            _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d2' },
            name: { type: 'string', example: 'Rahul Sharma' },
            phone: { type: 'string', example: '+91 98765 43210' },
            email: { type: 'string', example: 'rahul@example.com' },
            message: { type: 'string', example: 'Interested in 3BHK options' },
            propertyId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
            propertyTitle: { type: 'string', example: 'Prestige Lakeside Habitat' },
            propertyLocation: { type: 'string', example: 'Whitefield' },
            enquiryType: { type: 'string', example: 'site-visit' },
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
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description here' },
          },
        },
        PaginatedProperties: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                properties: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Property' },
                },
                total: { type: 'number', example: 42 },
                page: { type: 'number', example: 1 },
                pages: { type: 'number', example: 5 },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Admin authentication' },
      { name: 'Properties – Public', description: 'Public property endpoints (no auth required)' },
      { name: 'Properties – Admin', description: 'Admin-only property management (Bearer token required)' },
      { name: 'Enquiries – Public', description: 'Submit enquiry (no auth required)' },
      { name: 'Enquiries – Admin', description: 'Manage enquiries (Bearer token required)' },
      { name: 'Health', description: 'Server health check' },
    ],
    paths: {
      // ── Health ──────────────────────────────────────────────────────────
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: {
            200: {
              description: 'API is running',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'OK' },
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
          description: 'Authenticate admin and receive a JWT token. Default credentials: `admin@demohomesv1.com` / `Admin@123`',
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
              description: 'Login successful',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } },
              },
            },
            401: {
              description: 'Invalid credentials',
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
          summary: 'Get current admin',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Current admin info',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      admin: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          name: { type: 'string' },
                          email: { type: 'string' },
                        },
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

      // ── Properties – Public ─────────────────────────────────────────────
      '/properties': {
        get: {
          tags: ['Properties – Public'],
          summary: 'Get properties (paginated + filtered)',
          parameters: [
            { in: 'query', name: 'category', schema: { type: 'string', enum: ['buy', 'rent', 'new-launch', 'plots-lands'] }, description: 'Filter by category' },
            { in: 'query', name: 'propertyType', schema: { type: 'string', enum: ['residential', 'commercial', 'plots'] }, description: 'Filter by property type' },
            { in: 'query', name: 'unitType', schema: { type: 'string' }, description: 'Filter by unit type (e.g. 3BHK)' },
            { in: 'query', name: 'search', schema: { type: 'string' }, description: 'Full-text search on title/location/area/address' },
            { in: 'query', name: 'featured', schema: { type: 'boolean' }, description: 'Return only featured properties' },
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number' },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 12 }, description: 'Results per page' },
          ],
          responses: {
            200: {
              description: 'List of properties',
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
          summary: 'Get newly launched properties (max 10)',
          responses: {
            200: {
              description: 'New launch properties',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Property' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/properties/featured': {
        get: {
          tags: ['Properties – Public'],
          summary: 'Get featured properties (max 8)',
          responses: {
            200: {
              description: 'Featured properties',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Property' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/properties/{id}': {
        get: {
          tags: ['Properties – Public'],
          summary: 'Get property by ID or slug',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: { type: 'string' },
              description: 'MongoDB ObjectId or URL slug',
            },
          ],
          responses: {
            200: {
              description: 'Property detail',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/Property' },
                    },
                  },
                },
              },
            },
            404: { description: 'Property not found' },
          },
        },
        put: {
          tags: ['Properties – Admin'],
          summary: 'Update property',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Property ObjectId' },
          ],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  description: 'Same fields as POST /properties. Only include fields you want to update. New photos/floorPlans are appended.',
                  properties: {
                    title: { type: 'string' },
                    category: { type: 'string' },
                    isActive: { type: 'boolean' },
                    isFeatured: { type: 'boolean' },
                    photos: { type: 'array', items: { type: 'string', format: 'binary' } },
                    floorPlans: { type: 'array', items: { type: 'string', format: 'binary' } },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Property updated' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Properties – Admin'],
          summary: 'Delete property',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Property ObjectId' },
          ],
          responses: {
            200: { description: 'Property deleted' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not found' },
          },
        },
      },

      // ── Properties – Admin ──────────────────────────────────────────────
      '/properties/admin/all': {
        get: {
          tags: ['Properties – Admin'],
          summary: 'Get all properties (admin view, no filter)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'All properties',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Property' } },
                    },
                  },
                },
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
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['title', 'category', 'propertyType', 'location'],
                  properties: {
                    title: { type: 'string', example: 'Prestige Lakeside Habitat' },
                    category: { type: 'string', enum: ['buy', 'rent', 'new-launch', 'plots-lands'], example: 'buy' },
                    propertyType: { type: 'string', enum: ['residential', 'commercial', 'plots'], example: 'residential' },
                    unitType: { type: 'string', example: '3BHK' },
                    location: { type: 'string', example: 'Whitefield' },
                    area: { type: 'string', example: 'East Bengaluru' },
                    address: { type: 'string', example: 'Near ITPL, Whitefield' },
                    priceMin: { type: 'number', example: 8500000 },
                    priceMax: { type: 'number', example: 15000000 },
                    priceUnit: { type: 'string', enum: ['total', 'per-sqft', 'per-month', 'per-year', 'on-request'], example: 'total' },
                    estimatedEMI: { type: 'string', example: '₹65,000/month' },
                    projectSize: { type: 'string', example: '42 Acres' },
                    'configurations[]': { type: 'array', items: { type: 'string' }, example: ['2BHK - 1200 sqft'] },
                    totalUnits: { type: 'number', example: 480 },
                    possessionDate: { type: 'string', example: 'Dec 2026' },
                    overview: { type: 'string' },
                    'amenities[]': { type: 'array', items: { type: 'string' } },
                    'landmarks[]': { type: 'array', items: { type: 'string' } },
                    mapEmbed: { type: 'string' },
                    mapLink: { type: 'string' },
                    isNewLaunch: { type: 'boolean', example: true },
                    isActive: { type: 'boolean', example: true },
                    isFeatured: { type: 'boolean', example: false },
                    whatsappNumber: { type: 'string', example: '919876543210' },
                    contactPhone: { type: 'string', example: '+91 98765 43210' },
                    contactEmail: { type: 'string', example: 'sales@demohomesv1.com' },
                    photos: { type: 'array', items: { type: 'string', format: 'binary' }, description: 'Up to 20 images (JPEG/PNG/WebP, max 10MB each)' },
                    floorPlans: { type: 'array', items: { type: 'string', format: 'binary' }, description: 'Up to 10 floor plan images' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Property created' },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/properties/{id}/photo': {
        delete: {
          tags: ['Properties – Admin'],
          summary: 'Delete a single photo or floor plan from a property',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Property ObjectId' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['photoUrl', 'type'],
                  properties: {
                    photoUrl: { type: 'string', example: '/uploads/1693000000000-123456789.jpg' },
                    type: { type: 'string', enum: ['photo', 'floorPlan'], example: 'photo' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Photo deleted' },
            401: { description: 'Unauthorized' },
            404: { description: 'Property or photo not found' },
          },
        },
      },

      // ── Enquiries ───────────────────────────────────────────────────────
      '/enquiry': {
        post: {
          tags: ['Enquiries – Public'],
          summary: 'Submit a property enquiry',
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
              description: 'Enquiry submitted',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'Enquiry submitted successfully' },
                      data: { $ref: '#/components/schemas/Enquiry' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validation error (name and phone required)' },
          },
        },
        get: {
          tags: ['Enquiries – Admin'],
          summary: 'Get all enquiries',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'status', schema: { type: 'string', enum: ['new', 'contacted', 'closed'] }, description: 'Filter by status' },
          ],
          responses: {
            200: {
              description: 'List of enquiries',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Enquiry' } },
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
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Enquiry ObjectId' },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['new', 'contacted', 'closed'], example: 'contacted' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Status updated' },
            401: { description: 'Unauthorized' },
            404: { description: 'Enquiry not found' },
          },
        },
        delete: {
          tags: ['Enquiries – Admin'],
          summary: 'Delete enquiry',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Enquiry ObjectId' },
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
  apis: [], // paths defined inline above
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
