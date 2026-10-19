import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

import { ENV } from './config/env.js';
import { requestIdMiddleware } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './utils/errors.js';
import { sendSuccess } from './utils/response.js';

// Domain routes
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import vehiclesRoutes from './modules/vehicles/vehicles.routes.js';
import parkingRoutes from './modules/parking/parking.routes.js';
import slotsRoutes from './modules/slots/slots.routes.js';
import reservationsRoutes from './modules/reservations/reservations.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import reviewsRoutes from './modules/reviews/reviews.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import auditLogsRoutes from './modules/auditLogs/auditLogs.routes.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'Idempotency-Key'],
  })
);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request tracing
app.use(requestIdMiddleware);

// HTTP Logging - structured and privacy-safe
if (ENV.NODE_ENV !== 'test') {
  app.use(
    morgan((tokens, req, res) => {
      return JSON.stringify({
        level: 'HTTP',
        timestamp: new Date().toISOString(),
        requestId: req.id,
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: parseInt(tokens.status(req, res), 10),
        durationMs: parseFloat(tokens['response-time'](req, res)),
      });
    })
  );
}

// Rate limiting on sensitive auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    details: null,
  },
});
app.use('/api/v1/auth', authLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1
      ? 'connected'
      : mongoose.connection.readyState === 2
        ? 'connecting'
        : 'disconnected';

  return sendSuccess(
    res,
    {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV,
      database: dbStatus,
    },
    'ParkSphere API operational'
  );
});

// Mount domain routes under /api/v1
const apiV1Router = express.Router();
apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/users', usersRoutes);
apiV1Router.use('/vehicles', vehiclesRoutes);
apiV1Router.use('/parking', parkingRoutes);
apiV1Router.use('/slots', slotsRoutes);
apiV1Router.use('/reservations', reservationsRoutes);
apiV1Router.use('/payments', paymentsRoutes);
apiV1Router.use('/notifications', notificationsRoutes);
apiV1Router.use('/reviews', reviewsRoutes);
apiV1Router.use('/analytics', analyticsRoutes);
apiV1Router.use('/admin', adminRoutes);
apiV1Router.use('/audit-logs', auditLogsRoutes);

app.use('/api/v1', apiV1Router);

// 404 Catch-all handler
app.use((req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Centralized error handler
app.use(errorHandler);

export default app;
