# ADR 001: Reservation Concurrency & Double-Booking Prevention Strategy

## Status
Accepted

## Context
In ParkSphere, parking slots are discrete physical resources allocated over requested time intervals `[requestedStart, requestedEnd)`. The reservation engine is the core transactional domain where system correctness is non-negotiable. If two concurrent users attempt to book the same slot for overlapping intervals, the system must guarantee that exactly one booking succeeds and the other is safely rejected with `SLOT_UNAVAILABLE` without data corruption, ghost bookings, or inconsistent payment/slot states.

## Decision
We adopt a multi-layered defense to enforce reservation correctness:

1. **Strict Interval Overlap Predicate:**
   A candidate slot reservation conflicts if:
   `existing.startTime < requestedEnd AND existing.endTime > requestedStart`
   The conflict check evaluates only blocking statuses:
   - `CONFIRMED`: Blocks the slot throughout the window.
   - `ACTIVE`: The vehicle is currently occupying the slot.
   - `PENDING`: Blocks the slot temporarily, provided `expiresAt > now`.
   Non-blocking statuses (`CANCELLED`, `EXPIRED`, `COMPLETED`) are explicitly excluded.

2. **MongoDB ACID Transactions with Conditional Guard:**
   - Reservation creation runs inside a MongoDB multi-document session transaction (with graceful fallback/guaranteed atomic operations during unit test or standalone replica sets).
   - Within the transaction session, a re-check of overlapping active reservations is executed before persisting the new reservation.
   - A compound reservation guard / slot versioning pattern guarantees that concurrent transactions detect state modifications and safely abort with conflict.

3. **Idempotency Key Verification:**
   - All booking creation mutations accept an `Idempotency-Key` header (or UUID generated on client form submission).
   - The reservation collection indexes `idempotencyKey` uniquely per user.
   - In the event of network timeouts, duplicate client submits, or automatic retries, the server returns the existing confirmed reservation instead of creating a duplicate reservation or charging twice.

4. **Slot Occupancy Guard at Check-in:**
   - During check-in, an atomic conditional update (`findOneAndUpdate({ _id: slotId, status: 'AVAILABLE' }, { $set: { status: 'OCCUPIED' } })`) guarantees that a slot cannot be checked in more than once simultaneously.

## Consequences
- **Positive:** Mathematically prevents double bookings under race conditions; safe retries; resilient to transient network retries.
- **Trade-offs:** Requires replica set support for MongoDB multi-document transactions in production environments (native in MongoDB Atlas); automated test suite configures `mongodb-memory-server` with replica set capabilities.
