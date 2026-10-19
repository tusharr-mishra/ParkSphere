require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

const ExpressError = require('./utils/ExpressError');

// Route Handlers
const authRoutes = require('./routes/auth');
const parkingRoutes = require('./routes/parking');
const reservationRoutes = require('./routes/reservations');
const vehicleRoutes = require('./routes/vehicles');
const userRoutes = require('./routes/users');
const operatorRoutes = require('./routes/operator');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parksphere';

// ----------------------------------------------------
// Database Connection
// ----------------------------------------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`[MongoDB] Connected to database at: ${MONGO_URI}`))
  .catch((err) => console.error(`[MongoDB] Initial connection error: ${err.message}`));

// ----------------------------------------------------
// Template Engine & Static Files Configuration
// ----------------------------------------------------
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ----------------------------------------------------
// Request Parsers & Method Override
// ----------------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

// ----------------------------------------------------
// Express Session & Flash Messages
// ----------------------------------------------------
const sessionConfig = {
  name: 'parksphere.sid',
  secret: process.env.SESSION_SECRET || 'parksphere_development_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// ----------------------------------------------------
// Global Locals Middleware (User Session & Flash Alerts)
// ----------------------------------------------------
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  next();
});

// ----------------------------------------------------
// Core Application Routes
// ----------------------------------------------------
// Home Page
app.get('/', (req, res) => {
  res.render('pages/home', { title: 'ParkSphere | Smart Parking Platform' });
});

// Operational Health Check (API)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Domain Routes
app.use('/', authRoutes);
app.use('/parking', parkingRoutes);
app.use('/reservations', reservationRoutes);
app.use('/customer/vehicles', vehicleRoutes);
app.use('/customer', userRoutes);
app.use('/operator', operatorRoutes);
app.use('/admin', adminRoutes);

// ----------------------------------------------------
// 404 Catch-All Handler
// ----------------------------------------------------
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'The requested page or resource could not be found.'));
});

// ----------------------------------------------------
// Centralized Error Handling Middleware
// ----------------------------------------------------
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong!' } = err;
  res.status(statusCode).render('pages/error', {
    statusCode,
    message,
    title: `${statusCode} Error - ParkSphere`,
  });
});

// ----------------------------------------------------
// Server Bootstrap
// ----------------------------------------------------
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🅿️  ParkSphere Server running on http://localhost:${PORT}`);
    console.log(`  🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
