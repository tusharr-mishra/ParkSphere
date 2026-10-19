# ParkSphere System Architecture

## Overview
ParkSphere is a modular monolith application designed to offer a complete smart parking management and reservation platform.

```
                    ┌─────────────────────────────────┐
                    │       React 18 SPA (Vite)       │
                    │  Redux Toolkit • React Router   │
                    └────────────────┬────────────────┘
                                     │ HTTP / REST (/api/v1)
                                     ▼
                    ┌─────────────────────────────────┐
                    │      Express Application        │
                    │  Middleware (CORS, Helmet, Auth)│
                    └────────────────┬────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Auth & Users   │         │ Parking & Slots │         │  Reservations   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Mongoose Data Access Layer                        │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │       MongoDB Atlas / Store     │
                    └─────────────────────────────────┘
```

## Layer Responsibilities
1. **Routes (`server/src/modules/<domain>/<domain>.routes.js`)**: Map endpoints and bind validation/authorization middleware.
2. **Middleware (`server/src/middleware/`)**: Authentication (`authenticate`), RBAC (`authorize`), input validation, rate limiting, and centralized error handling.
3. **Controllers (`server/src/modules/<domain>/<domain>.controller.js`)**: Handle HTTP request extraction, status mapping, and structured JSON responses (`{ success, data, message }`).
4. **Services (`server/src/modules/<domain>/<domain>.service.js`)**: Encapsulate all domain business rules, conflict queries, fee calculations, and transaction orchestration.
5. **Models (`server/src/modules/<domain>/<domain>.model.js`)**: Define Mongoose schemas, data validation constraints, and indexes.
