# ParkSphere Database Architecture

## Collections & Indexes Summary
The database is built on MongoDB Atlas with explicit schemas and indexes defined in Mongoose models.

### Collections:
1. `users`: Identity, authentication credentials, role (`CUSTOMER`, `OPERATOR`, `ADMIN`), email verification state.
   - Indexes: `email: 1` (unique), `role: 1`
2. `vehicles`: Customer registered vehicles.
   - Indexes: `userId: 1`, `registrationNumber: 1` (unique)
3. `parkingFacilities`: Parking lots / garages with geolocation, address, operating hours, and rates.
   - Indexes: `city: 1, isActive: 1`, `operatorId: 1`
4. `parkingSlots`: Physical parking bays within facilities.
   - Indexes: `facilityId: 1, slotNumber: 1` (compound unique), `facilityId: 1, status: 1`, `isEV: 1`
5. `reservations`: Booking state machines, time intervals, assigned slots, and authoritative amounts.
   - Indexes: `slotId: 1, startTime: 1, endTime: 1, status: 1`, `userId: 1, createdAt: -1`, `facilityId: 1, status: 1`, `bookingCode: 1` (unique), `idempotencyKey: 1`
6. `payments`: Payment audit records and transitions (`PENDING`, `COMPLETED`, `REFUNDED`, `FAILED`).
   - Indexes: `reservationId: 1`, `userId: 1, createdAt: -1`
7. `notifications`: In-app user notifications.
   - Indexes: `userId: 1, isRead: 1, createdAt: -1`
8. `reviews`: Customer ratings and feedback.
   - Indexes: `facilityId: 1, rating: -1`, `reservationId: 1` (unique)
9. `auditLogs`: Immutable system audit trail for security and regulatory compliance.
   - Indexes: `actorId: 1, timestamp: -1`, `entityId: 1, timestamp: -1`, `action: 1`
