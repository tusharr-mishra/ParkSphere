// ParkSphere - Server entry point and Express configuration
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const { MongoStore } = require('connect-mongo');

const ExpressError = require('./utils/ExpressError');

// Route modules
const authRoutes = require('./routes/auth');
const parkingRoutes = require('./routes/parking');
const reservationRoutes = require('./routes/reservations');
const vehicleRoutes = require('./routes/vehicles');
const userRoutes = require('./routes/users');
const operatorRoutes = require('./routes/operator');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'parksphere_development_session_secret_9876';

// Global application default locals to prevent ReferenceError in templates
app.locals.currentUser = null;
app.locals.success = [];
app.locals.error = [];

// Database configuration (Atlas Cloud or local fallback)
const DB_URL = process.env.ATLASDB_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parksphere';

// Auto-seed initial parking facilities if the database collection is empty
const seedInitialDataIfEmpty = async (force = false) => {
  try {
    const Facility = require('./models/facility');
    const Slot = require('./models/slot');
    const facilityCount = await Facility.countDocuments();

    if (facilityCount === 0 || force) {
      console.log('[AutoSeed] Facility collection is empty. Populating catalog with smart parking facilities...');
      const { facilitiesData } = require('./init/data');

      for (const fData of facilitiesData) {
        const facility = await Facility.create(fData);
        const slotTypes = ['COMPACT', 'SEDAN', 'SEDAN', 'SUV', 'TWO_WHEELER'];
        const slotsToInsert = [];

        for (let i = 1; i <= (facility.totalSlots || 30); i++) {
          const slotNumber = `${String.fromCharCode(65 + Math.floor((i - 1) / 10))}-${String(((i - 1) % 10) + 1).padStart(2, '0')}`;
          const slotType = slotTypes[i % slotTypes.length];
          const isEV = i % 4 === 0;

          slotsToInsert.push({
            facility: facility._id,
            slotNumber,
            slotType,
            isEV,
            status: 'AVAILABLE',
          });
        }

        await Slot.insertMany(slotsToInsert);
      }

      const totalSlots = await Slot.countDocuments();
      console.log(`[AutoSeed] Success: Populated ${facilitiesData.length} facilities and ${totalSlots} bays!`);
    } else {
      console.log(`[AutoSeed] Database verified: ${facilityCount} parking facilities ready.`);
    }
  } catch (err) {
    console.error('[AutoSeed] Error during seeding:', err.message);
  }
};

// Connect to MongoDB with automatic local fallback
const dbPromise = mongoose
  .connect(DB_URL, { serverSelectionTimeoutMS: 4000 })
  .then(async () => {
    const dbTarget = DB_URL.includes('mongodb+srv') ? 'MongoDB Atlas (Online Cloud)' : 'MongoDB Local';
    console.log(`Database connected: ${dbTarget}`);
    await seedInitialDataIfEmpty();
    return mongoose.connection.getClient();
  })
  .catch(async (err) => {
    if (process.env.ATLASDB_URL && DB_URL !== 'mongodb://127.0.0.1:27017/parksphere') {
      console.warn(`Atlas connection failed (${err.message}). Falling back to local MongoDB...`);
      await mongoose.connect('mongodb://127.0.0.1:27017/parksphere');
      console.log('Connected to Local MongoDB fallback');
      await seedInitialDataIfEmpty();
      return mongoose.connection.getClient();
    }
    console.error('Database connection error:', err.message);
    throw err;
  });

// View engine setup (EJS with EJS-Mate layouts)
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing and method override for PUT/DELETE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

// Persistent session store sharing the active Mongoose connection
const sessionStore = MongoStore.create({
  clientPromise: dbPromise,
  crypto: {
    secret: SESSION_SECRET,
  },
  touchAfter: 24 * 3600, // Lazy session update
});

sessionStore.on('error', (err) => {
  console.error('Mongo session store error:', err.message);
});

const sessionConfig = {
  name: 'parksphere.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
};

app.use(session(sessionConfig));
app.use(flash());

// ----------------------------------------------------
// Global Locals Middleware (User Session, Alerts & Currency Helper)
// ----------------------------------------------------
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.formatPrice = (amount, currency = 'INR') => {
    const val = Number(amount || 0);
    const symbols = {
      INR: '₹',
      USD: '$',
      GBP: '£',
      EUR: '€',
      AED: 'AED',
      SGD: 'S$',
      JPY: '¥',
      AUD: 'A$',
    };
    const sym = symbols[currency] || (currency === 'India' ? '₹' : '$');
    if (sym === '₹' || sym === '¥') {
      return sym + ' ' + Math.round(val);
    }
    return sym + ' ' + val.toFixed(2);
  };
  res.locals.MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || '';
  next();
});

// Root redirect to parking explore catalog
app.get('/', (req, res) => {
  res.redirect('/parking');
});

// Operational health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Database catalog seed endpoint (auto or manual sync)
app.get('/seed', async (req, res) => {
  try {
    const Facility = require('./models/facility');
    const Slot = require('./models/slot');
    const count = await Facility.countDocuments();
    const force = req.query.force === 'true';

    if (count === 0 || force) {
      if (force) {
        await Facility.deleteMany({});
        await Slot.deleteMany({});
      }
      await seedInitialDataIfEmpty(force);
      const newCount = await Facility.countDocuments();
      return res.send(`
        <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;padding:40px;max-width:580px;margin:50px auto;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);text-align:center;">
          <h2 style="color:#10b981;margin-bottom:12px;">🎉 Catalog Seeded Successfully!</h2>
          <p style="color:#475569;font-size:16px;line-height:1.5;">Loaded <strong>${newCount}</strong> verified smart parking facilities and parking bays into MongoDB Atlas.</p>
          <a href="/parking" style="display:inline-block;margin-top:20px;padding:12px 28px;background:#6366f1;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;">Go to ParkSphere Explore</a>
        </div>
      `);
    }

    return res.send(`
      <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;padding:40px;max-width:580px;margin:50px auto;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);text-align:center;">
        <h2 style="color:#3b82f6;margin-bottom:12px;">ℹ️ Database Already Seeded</h2>
        <p style="color:#475569;font-size:16px;line-height:1.5;">There are already <strong>${count}</strong> verified parking facilities active in MongoDB Atlas.</p>
        <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;">
          <a href="/parking" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;">View Parking Facilities</a>
          <a href="/seed?force=true" style="display:inline-block;padding:12px 20px;background:#f1f5f9;color:#475569;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;" onclick="return confirm('Reload initial catalog?');">Re-seed Catalog</a>
        </div>
      </div>
    `);
  } catch (err) {
    return res.status(500).send(`Error seeding catalog: ${err.message}`);
  }
});

// Mount resource routes
app.use('/', authRoutes);
app.use('/parking', parkingRoutes);
app.use('/reservations', reservationRoutes);
app.use('/customer/vehicles', vehicleRoutes);
app.use('/customer', userRoutes);
app.use('/operator', operatorRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'The requested page or resource could not be found.'));
});

// Centralized error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong!' } = err;
  res.locals.currentUser = (req.session && req.session.user) ? req.session.user : null;
  res.locals.success = [];
  res.locals.error = [err.message || message];
  res.status(statusCode).render('pages/error', {
    statusCode,
    message: err.message || message,
    title: `${statusCode} Error - ParkSphere`,
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`ParkSphere server running on port ${PORT}`);
  });
}

module.exports = app;
