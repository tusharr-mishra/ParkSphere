# ParkSphere API Specification

## Conventions
- **Base URL:** `/api/v1`
- **Response Format:**
  - Success:
    ```json
    {
      "success": true,
      "data": { ... },
      "message": "Operation completed successfully"
    }
    ```
  - Error:
    ```json
    {
      "success": false,
      "code": "ERROR_CODE",
      "message": "Human readable message",
      "details": null
    }
    ```

## Module Endpoints
- `/health` - Health check (uptime, environment, DB status)
- `/api/v1/auth` - Registration, OTP email verification, login, logout, password reset
- `/api/v1/users` - User profiles and settings
- `/api/v1/vehicles` - Customer vehicle management (license plate, EV flag, type)
- `/api/v1/parking` - Facility search, filters, slot listings, availability queries
- `/api/v1/operator/facilities` - Operator facility management and slots
- `/api/v1/reservations` - Bookings, conflict checking, check-in, check-out
- `/api/v1/payments` - Transaction records and statuses
- `/api/v1/notifications` - In-app alerts and notifications
- `/api/v1/reviews` - Reviews and ratings
- `/api/v1/analytics` - Aggregation pipelines for customer, operator, and admin metrics
- `/api/v1/admin` - Governance, user moderation, audit logs
