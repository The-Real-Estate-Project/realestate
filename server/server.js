require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// ─── Database connection ───────────────────────────────────────────────────
const startDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/realestate_bengaluru';

  try {
    await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected → ${uri}`);
  } catch (err) {
    // In production, never fall back — exit immediately with a clear message
    if (isProduction) {
      console.error('❌ MongoDB connection failed. Check your MONGO_URI environment variable.');
      console.error(err.message);
      process.exit(1);
    }

    // Development only: fall back to in-memory MongoDB
    console.log('⚠️  Local MongoDB not available, falling back to in-memory DB...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: 'realestate_bengaluru' },
      });
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('📦 Using in-memory MongoDB (data resets on restart)');

      process.on('SIGINT', async () => {
        await mongod.stop();
        process.exit(0);
      });
    } catch (fallbackErr) {
      console.error('❌ Could not start any MongoDB instance:', fallbackErr.message);
      process.exit(1);
    }
  }
};

// ─── Middleware ────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,        // e.g. https://demohomes-v1.netlify.app
].filter(Boolean);

app.use(cors({
    origin: [
      'http://localhost:5173',
      'https://demohomes.netlify.app'  // add this
    ],
    credentials: true
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Swagger UI ───────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Demo Homes V1 – API Docs',
  customCss: '.swagger-ui .topbar { background-color: #6d28d9; }',
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Expose raw OpenAPI JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/enquiry', require('./routes/enquiryRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Real Estate API is running' });
});

// ─── Seed / sync default admin ────────────────────────────────────────────
const seedAdmin = async () => {
  const Admin = require('./models/Admin');
  const envEmail = process.env.ADMIN_EMAIL || 'admin@demohomesv1.com';
  const envPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
  const envName = process.env.ADMIN_NAME || 'Admin';
  try {
    const existing = await Admin.findOne({});
    if (!existing) {
      // No admin at all — create one
      await Admin.create({ name: envName, email: envEmail, password: envPassword });
      console.log('\n✅ Default admin created');
      console.log(`   📧 Email:    ${envEmail}`);
      console.log(`   🔑 Password: ${envPassword}`);
    } else if (existing.email !== envEmail) {
      // Email in .env changed — update the existing admin to stay in sync
      existing.email = envEmail;
      existing.password = envPassword;
      existing.name = envName;
      await existing.save();
      console.log('\n🔄 Admin credentials synced from .env');
      console.log(`   📧 Email:    ${envEmail}`);
    }
  } catch (error) {
    console.error('Admin seed error:', error.message);
  }
};

// ─── Start ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

(async () => {
  await startDB();
  await seedAdmin();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
    console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
    console.log(`\n🌐 Frontend: http://localhost:5173/home`);
    console.log(`🔐 Admin:    http://localhost:5173/admin/login\n`);
  });
})();
