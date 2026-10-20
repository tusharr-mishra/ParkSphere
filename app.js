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

// Connect to MongoDB with automatic local fallback
const dbPromise = mongoose
  .connect(DB_URL, { serverSelectionTimeoutMS: 4000 })
  .then(() => {
    const dbTarget = DB_URL.includes('mongodb+srv') ? 'MongoDB Atlas (Online Cloud)' : 'MongoDB Local';
    console.log(`Database connected: ${dbTarget}`);
    return mongoose.connection.getClient();
  })
  .catch(async (err) => {
    if (process.env.ATLASDB_URL && DB_URL !== 'mongodb://127.0.0.1:27017/parksphere') {
      console.warn(`Atlas connection failed (${err.message}). Falling back to local MongoDB...`);
      await mongoose.connect('mongodb://127.0.0.1:27017/parksphere');
      console.log('Connected to Local MongoDB fallback');
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
