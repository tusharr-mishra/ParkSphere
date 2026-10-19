# PARKSPHERE
**Smart Parking Management & Reservation Platform**

## Contents
1. Project Charter & North Star
2. Scope, Non-Goals & Product Principles
3. User Roles & Permission Model
4. Complete Feature Catalog
5. Functional Requirements
6. Non-Functional Requirements
7. System Architecture
8. Repository & GitHub Blueprint
9. Frontend Architecture
10. Backend Architecture
11. Database Design
12. API Contract Blueprint
13. Critical Workflows & State Machines
14. Security Blueprint
15. Smart Layer (No Forced AI)
16. Testing & Quality Strategy
17. Observability, Reliability & Performance
18. Deployment & Environment Management
19. Development Roadmap & Milestones
20. Definition of Done & Acceptance Gates
21. Git/GitHub Working Model
22. Resume, Demo & FAANG/MAANG Positioning
23. Interview Preparation Checklist
24. Future Extensions & Decision Log
- Appendix A. Seed Data
- Appendix B. Suggested Environment Variables
- Appendix C. First 30 Tasks

---

## 1. Project Charter & North Star

ParkSphere is a production-style full-stack parking platform. It is designed to demonstrate practical software engineering: secure authentication, domain modeling, robust reservation logic, role-based workflows, database correctness, testability, deployment, and polished user experience.

### 1.1 Product goal
Provide one coherent system in which customers can discover and reserve parking, operators can run parking facilities, and administrators can govern the platform. The system must remain understandable as a modular monolith and should be defendable in a technical interview.

### 1.2 North-star experience
Register → Email OTP verification → Login → Find parking → View availability → Select vehicle/slot → Reserve → Payment record → Confirmation email → Check-in → Active parking → Check-out → Final fee → Receipt → Review

### 1.3 Engineering north star
- Correctness over cleverness: a reliable reservation engine is more valuable than unnecessary AI.
- Security by default: authorization and validation are server responsibilities.
- Observable behavior: important actions should be auditable and testable.
- Professional UX: loading, empty, error, success and confirmation states are first-class requirements.
- Deployable software: the finished project should run outside the developer laptop and have repeatable setup steps.

### 1.4 Success criteria
| Area | Target outcome |
|---|---|
| Product | A complete end-to-end parking reservation journey works without manual database edits. |
| Engineering | Critical business logic is modular, validated and covered by automated tests. |
| Security | No passwords/secrets in source control; protected APIs enforce role permissions. |
| Database | Relationships, indexes and aggregations are deliberate and documented. |
| UX | Customer, operator and admin workflows look and behave like a real web product. |
| Deployment | Frontend, backend and database are deployable with documented environment variables. |
| Resume | Project can be explained in terms of architecture, trade-offs, correctness, security and metrics. |

---

## 2. Scope, Non-Goals & Product Principles

### 2.1 In scope - mandatory
- Authentication: registration, SMTP OTP verification, login, logout, forgot/reset password, change password.
- JWT authentication, protected routes, server-side role-based access control.
- Customer profile and vehicle management.
- Parking facilities, slots, availability, pricing and facility details.
- Search, filtering, sorting and pagination.
- Reservation engine with time conflict detection and concurrency-safe booking strategy.
- Reservation lifecycle: PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED, EXPIRED.
- Check-in/check-out and final parking fee calculation.
- Payment records with success/failure/refund states (real gateway is optional).
- Email and in-app notifications.
- Customer, operator and admin dashboards.
- Analytics using MongoDB aggregation.
- Reviews and ratings.
- Audit logs for important platform actions.
- Validation, error handling, security hardening, testing and deployment.

### 2.2 Smart layer - controlled scope
- Rule-based slot recommendation based on vehicle compatibility, EV requirements, availability, price and optional proximity preference.
- Historical demand scoring by hour/day/facility.
- Optional lightweight forecasting model only after the core product is complete and only if enough meaningful historical data exists.

### 2.3 Explicit non-goals
- No forced AI/ML in the core.
- No IoT hardware dependency.
- No blockchain.
- No microservices for architectural theatre.
- No Kubernetes or Kafka.
- No unnecessary Redis layer.
- No computer vision/ANPR unless later justified by a real requirement.
- No chatbot unless it solves a demonstrable product problem.

### 2.4 Product principles
1. Every feature must belong to a real user workflow.
2. Every important mutation is validated on the server.
3. UI visibility is not authorization.
4. Critical database operations must be designed for conflict and failure.
5. Use reusable modules/components instead of copy-paste pages.
6. Prefer the simplest architecture that remains production-like.
7. Document decisions when a trade-off matters.
8. Do not mark a feature complete until it satisfies the acceptance gate in Section 20.

---

## 3. User Roles & Permission Model

### 3.1 Roles
| Role | Primary responsibility |
|---|---|
| CUSTOMER | Reserve and manage parking sessions, vehicles, payments and reviews. |
| OPERATOR | Manage assigned parking facilities, slots, prices and operational bookings. |
| ADMIN | Manage platform users/operators/facilities, analytics, moderation and audit logs. |

### 3.2 Permission matrix
| Capability | Customer | Operator | Admin |
|---|---|---|---|
| View public parking | Yes | Yes | Yes |
| Create reservation | Yes | No | Optional support |
| Manage own profile/vehicles | Yes | Yes | Yes |
| Manage facility | No | Assigned only | All |
| Manage slots | No | Assigned only | All |
| View facility revenue | No | Assigned only | All |
| Manage users | No | No | Yes |
| Approve/suspend operators | No | No | Yes |
| View audit logs | No | No | Yes |
| View system analytics | Personal | Facility | Platform |
| Write review | Eligible customers | Optional | Optional |
| Change global settings | No | No | Yes |

### 3.3 Authorization rule
All privileged operations must pass backend authorization middleware. React can hide unavailable actions for UX, but the Express API must reject unauthorized requests even when a user calls the endpoint directly.

---

## 4. Complete Feature Catalog

### 4.1 Public experience
- Landing page with strong value proposition.
- Find parking entry point.
- How it works.
- Facility discovery/search.
- Facility details.
- Login/Register navigation.
- Responsive footer and support/contact section.

### 4.2 Authentication & account
- Registration form with validation.
- Email OTP generation, expiry, attempt limit and resend cooldown.
- OTP verification and account activation.
- Login with clear error states.
- Logout and protected route behavior.
- Forgot password + verification flow.
- Reset/change password.
- Profile edit.
- Account status and email verification state.

### 4.3 Customer
- Dashboard overview.
- Find parking.
- Parking facility details.
- Slot selection.
- Vehicle CRUD.
- Reservation creation.
- Reservation history.
- Active parking session.
- Cancellation.
- Payment history.
- Receipts.
- Notifications.
- Reviews/ratings.
- Profile/security settings.

### 4.4 Operator
- Operator dashboard.
- Facility CRUD for assigned facilities.
- Slot configuration/status management.
- Pricing management.
- Reservation list and filters.
- Check-in/check-out operations.
- Occupancy snapshot.
- Revenue analytics.
- Facility performance analytics.

### 4.5 Admin
- System dashboard.
- User management.
- Operator management and approval.
- Facility oversight.
- Reservation monitoring.
- Payment monitoring.
- Review moderation.
- Audit log explorer.
- Global analytics.
- Settings/configuration.

### 4.6 Cross-cutting UX
- Responsive design.
- Navigation bars/sidebars by role.
- Toasts and inline validation.
- Loading/skeleton states.
- Empty states.
- Error states with retry.
- Confirmation dialogs for destructive actions.
- Consistent typography, spacing, icons and status badges.
- Accessibility basics: semantic HTML, keyboard focus, labels, contrast and error messaging.

---

## 5. Functional Requirements

### FR-01 Authentication
- Register a new customer.
- Generate a cryptographically random OTP.
- Persist only a protected representation where practical; never log OTPs in production logs.
- Expire OTP automatically.
- Limit attempts and resend frequency.
- Verify account before allowing normal sign-in.
- Issue authenticated session/token on login.
- Provide logout behavior and protected route handling.

### FR-02 Parking discovery
- Search by city/location/facility.
- Filter by price, availability, EV, covered parking, operating hours and vehicle type.
- Sort by price, availability and optional distance field.
- Paginate results on the server.

### FR-03 Reservation
- Validate facility, slot, vehicle and requested time interval.
- Reject overlapping reservations for the same slot.
- Create reservation and linked payment state.
- Return a stable booking code.
- Support cancellation and expiry.
- Maintain an auditable status history where useful.

### FR-04 Check-in/out
- Allow check-in only for eligible confirmed reservations.
- Store actual entry time.
- Allow check-out for active reservations.
- Compute final duration and amount from authoritative timestamps.
- Release slot back to AVAILABLE when parking session is completed.

### FR-05 Notifications
- OTP email.
- Booking confirmation email.
- Reminder email.
- Cancellation email.
- Payment/checkout receipt email.
- In-app notification records with read/unread state.

### FR-06 Analytics
- Occupancy by period.
- Bookings by day/week/month.
- Revenue by period.
- Peak usage windows.
- Popular facilities/slots.
- Cancellation rate and operational KPIs.

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | Passwords hashed; secrets in environment variables; authorization enforced server-side; common web attack mitigations configured. |
| Reliability | Critical operations fail predictably; no silent data corruption; clear rollback/error paths where applicable. |
| Performance | Server-side filtering/pagination; appropriate indexes; avoid N+1 queries and oversized payloads. |
| Maintainability | Controllers stay thin; business logic in services; schemas/models separated; reusable frontend components. |
| Testability | Critical business logic can run without a browser or production database. |
| Usability | Responsive, clear navigation, consistent feedback and accessible forms. |
| Observability | Structured server logs for errors and important operational events; audit logs for privileged actions. |
| Portability | New developer can set up using documented steps and environment examples. |

---

## 7. System Architecture

The chosen architecture is a **modular monolith**: one backend deployment with clear domain modules. This gives strong separation of concerns without operational overhead from microservices.

> **RULE:** Adding a new technology requires a concrete requirement, measurable benefit, and a documentation update. "Because it is popular" is not a valid reason.

### Architecture diagram (textual)
```
React Frontend (Routing • Redux • UI Components)
        │
        ▼
Express REST API (Routes • Controllers • Middleware)   ◄┄┄ Automated Tests (Unit • Integration • UI)
        │
        ▼
Domain Services (Auth • Parking • Booking • Payment • Analytics)
        │
        ├──► Mongoose Models (Schemas • Validation • Indexes) ──► MongoDB Atlas (Users • Facilities • Slots • Reservations • Payments)
        ├──► Nodemailer + Gmail SMTP (OTP • Receipts • Alerts)
        └──► Scheduled Jobs (OTP expiry • Reservation expiry • Reminders)
```

### 7.1 Request path
Browser → React Router → Redux/API layer → Express route → auth/validation middleware → controller → service → Mongoose model → MongoDB → response → UI state update

### 7.2 Backend layering
- **Routes:** map HTTP methods/paths to controllers.
- **Middleware:** authentication, authorization, validation, rate limiting, error context.
- **Controllers:** translate HTTP input/output; keep business logic thin.
- **Services:** own business rules such as booking, pricing, OTP and analytics.
- **Models:** Mongoose schemas, indexes and persistence behavior.
- **Utilities:** email, token helpers, date helpers, consistent response helpers.

---

## 8. Repository & GitHub Blueprint

### 8.1 Repository name
`parksphere`

### 8.2 Repository structure
```
parksphere/
├── client/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── assets/
│       ├── components/
│       ├── features/
│       ├── layouts/
│       ├── pages/
│       │   ├── public/
│       │   ├── customer/
│       │   ├── operator/
│       │   └── admin/
│       ├── services/
│       ├── store/
│       ├── hooks/
│       ├── utils/
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── vehicles/
│   │   │   ├── parking/
│   │   │   ├── slots/
│   │   │   ├── reservations/
│   │   │   ├── payments/
│   │   │   ├── notifications/
│   │   │   ├── reviews/
│   │   │   ├── analytics/
│   │   │   ├── admin/
│   │   │   └── auditLogs/
│   │   ├── jobs/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── tests/
│
├── docs/
│   ├── PROJECT_BIBLE.md
│   ├── architecture/
│   ├── api/
│   ├── database/
│   └── decisions/
│
├── postman/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── .gitignore
├── README.md
└── LICENSE
```

### 8.3 GitHub repository settings
- Repository should be public only after secrets and environment files are excluded.
- Protect the main branch. Require pull requests for merges once the project is stable.
- Use Issues for work tracking.
- Use labels such as: auth, booking, database, frontend, backend, security, testing, docs, bug, enhancement.
- Use GitHub Projects (optional) with columns: Backlog, Ready, In Progress, Review, Done.
- Add a pull request template requiring: what changed, why, tests, screenshots (if UI), risks.

### 8.4 Commit convention
```
feat: add reservation conflict validation
fix: prevent expired OTP reuse
refactor: extract booking service
test: add reservation integration tests
docs: document authentication flow
chore: update client dependencies
```

---

## 9. Frontend Architecture

### 9.1 Design system
- Use one design system: consistent spacing scale, border radii, button hierarchy, form patterns and status colors.
- Primary UX tone: modern, calm, trustworthy, transportation/operations oriented.
- Use cards for summary, tables for administration, badges for state, charts for trends.
- Prefer meaningful skeletons rather than a full-screen spinner when the layout is known.

### 9.2 Global route model
```
/
/login
/register
/verify-email
/forgot-password
/reset-password
/parking
/parking/:id
/customer/dashboard
/customer/bookings
/customer/bookings/:id
/customer/vehicles
/customer/payments
/customer/notifications
/customer/profile
/operator/dashboard
/operator/facilities
/operator/facilities/:id
/operator/slots
/operator/reservations
/operator/analytics
/admin/dashboard
/admin/users
/admin/operators
/admin/facilities
/admin/reservations
/admin/payments
/admin/audit-logs
/admin/settings
```

### 9.3 State management
- Keep authentication/session state centralized.
- Keep server-backed domain state in feature slices/services rather than arbitrary global state.
- Do not duplicate the same server entity across multiple local states unless there is a clear cache strategy.
- Handle optimistic updates only when rollback is simple and safe.

### 9.4 Required UI states
| State | Example behavior |
|---|---|
| Loading | Skeleton/loader while parking results or dashboard data load. |
| Success | Toast/banner and refreshed state after mutation. |
| Empty | Explain why there is no data and provide next action. |
| Error | Human-readable error + retry where appropriate. |
| Unauthorized | Redirect to login and preserve safe return path. |
| Forbidden | Show access-denied state; do not expose privileged data. |

---

## 10. Backend Architecture

### 10.1 Module standard
```
modules/<domain>/
├── <domain>.model.js
├── <domain>.controller.js
├── <domain>.service.js
├── <domain>.routes.js
├── <domain>.validation.js
└── <domain>.test.js
```

### 10.2 Domain modules
| Module | Core responsibility |
|---|---|
| auth | Registration, OTP, login, password flows, session/token behavior |
| users | Profiles, account status and user administration boundaries |
| vehicles | Customer vehicles and compatibility attributes |
| parking | Facility lifecycle and facility search |
| slots | Slot lifecycle, availability and maintenance state |
| reservations | Conflict detection, booking lifecycle, check-in/out |
| payments | Payment records and state transitions |
| notifications | In-app notifications and email triggers |
| reviews | Ratings/reviews and moderation |
| analytics | Aggregation queries and KPI calculations |
| admin | Platform-wide administrative operations |
| auditLogs | Immutable/append-focused records of critical actions |

### 10.3 Error handling
Use one centralized error middleware. Controllers/services should throw or return typed application errors that map to deliberate HTTP statuses. Responses should never leak stack traces or internal credentials.

```json
{
  "success": false,
  "code": "SLOT_UNAVAILABLE",
  "message": "The selected parking slot is no longer available.",
  "details": null
}
```

---

## 11. Database Design

MongoDB is the primary data store. Model the business domain deliberately. Avoid one giant document and avoid over-normalization that makes every read need five joins in application code.

### Entity relationships
- User **acts** → AuditLog
- User **owns** → Vehicle
- User **receives** → Notification
- User **writes** → Review
- User **creates** → Reservation
- ParkingFacility **receives** → Review
- ParkingFacility **hosts** → Reservation
- ParkingFacility **contains** → ParkingSlot
- Reservation **uses** → Vehicle
- Reservation **has** → Payment
- Reservation **reserves** → ParkingSlot

### 11.1 Collections
| Collection | Key fields | Notes |
|---|---|---|
| users | name, email, passwordHash, role, isEmailVerified, isActive | Unique email; account state. |
| vehicles | userId, registrationNumber, vehicleType, isEV | Unique registration number as appropriate. |
| parkingFacilities | operatorId, name, address, city, pricing, operatingHours | Facility-level configuration. |
| parkingSlots | facilityId, slotNumber, slotType, isEV, status | Slot belongs to exactly one facility. |
| reservations | userId, facilityId, slotId, vehicleId, startTime, endTime, status, amounts | Core transactional domain. |
| payments | reservationId, userId, amount, method, status, reference | Payment record; do not trust client amount. |
| notifications | userId, title, message, type, isRead | User notification center. |
| reviews | userId, facilityId, reservationId, rating, comment | Eligible completed booking can review. |
| auditLogs | actorId, action, entityType, entityId, metadata, timestamp | Admin/operator traceability. |

### 11.2 Core indexes
- `users.email` unique index.
- `vehicles.registrationNumber` index; add uniqueness according to product rules.
- `parkingFacilities.city + isActive` index for discovery.
- `parkingSlots.facilityId + status` index for availability.
- `reservations.slotId + startTime + endTime + status` query support.
- `reservations.userId + createdAt` for customer history.
- `payments.reservationId` index.
- `notifications.userId + isRead + createdAt` index.
- `auditLogs.actorId + timestamp` and `entityId + timestamp` indexes where useful.

### 11.3 Aggregation use cases
- Revenue by day/month.
- Occupancy counts by hour.
- Top facilities by booking count.
- Average session duration.
- Cancellation percentage.
- Operator-level facility utilization.

---

## 12. API Contract Blueprint

Use versioning from the beginning, e.g. `/api/v1/...`. Keep request and response shapes stable and document them in `docs/api/` and Postman.

### 12.1 Authentication
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/v1/auth/register | Create account and initiate OTP verification |
| POST | /api/v1/auth/verify-otp | Verify email OTP |
| POST | /api/v1/auth/resend-otp | Issue new OTP subject to cooldown/attempt rules |
| POST | /api/v1/auth/login | Authenticate user |
| POST | /api/v1/auth/logout | Invalidate client auth state/session as designed |
| POST | /api/v1/auth/forgot-password | Start password recovery |
| POST | /api/v1/auth/reset-password | Set new password |
| GET | /api/v1/auth/me | Return current authenticated user |

### 12.2 Parking
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/v1/parking | Search/filter/paginate facilities |
| GET | /api/v1/parking/:id | Facility details |
| GET | /api/v1/parking/:id/slots | Slot list |
| GET | /api/v1/parking/:id/availability | Availability for requested interval |
| POST | /api/v1/operator/facilities | Create facility |
| PATCH | /api/v1/operator/facilities/:id | Update assigned facility |
| POST | /api/v1/operator/facilities/:id/slots | Create/configure slots |

### 12.3 Reservations
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/v1/reservations | Create reservation |
| GET | /api/v1/reservations/my | Current user reservations |
| GET | /api/v1/reservations/:id | Reservation details |
| PATCH | /api/v1/reservations/:id/cancel | Cancel eligible reservation |
| POST | /api/v1/reservations/:id/check-in | Check in |
| POST | /api/v1/reservations/:id/check-out | Check out and finalize session |

### 12.4 Response conventions
```
Success:
{ "success": true, "data": { ... }, "message": "..." }

Error:
{ "success": false, "code": "BUSINESS_CODE", "message": "...", "details": null }
```

---

## 13. Critical Workflows & State Machines

### 13.1 Booking lifecycle
```
PENDING   --payment/confirm--> CONFIRMED
PENDING   --cancel-----------> CANCELLED
PENDING   --timeout----------> EXPIRED
CONFIRMED --check-in---------> ACTIVE
CONFIRMED --cancel-----------> CANCELLED
CONFIRMED --timeout----------> EXPIRED
ACTIVE    --check-out--------> COMPLETED
```
Only valid transitions should be accepted. For example, a COMPLETED reservation cannot be cancelled, and a CANCELLED reservation cannot become ACTIVE.

### 13.2 Reservation conflict algorithm - conceptual contract
```
Input: facilityId, slotId, requestedStart, requestedEnd

1. Validate date ordering and booking policy.
2. Validate slot belongs to facility and is bookable.
3. Find reservations for the same slot whose intervals overlap the request.
4. Consider only statuses that block the slot.
5. If any conflict exists, reject.
6. Otherwise create the reservation inside the chosen consistency strategy.
7. Return reservation + stable booking code.

Overlap rule: existing.start < requestedEnd AND existing.end > requestedStart
```

### 13.3 Booking blocking statuses
- PENDING only blocks if the product reserves inventory during payment/confirmation and has an expiry window.
- CONFIRMED blocks.
- ACTIVE blocks.
- COMPLETED/CANCELLED/EXPIRED do not block future intervals.

### 13.4 Check-in
- Reservation must be CONFIRMED.
- Current time must be within the allowed check-in window.
- Slot must still be operational.
- Set actualEntryTime and status ACTIVE.
- Audit the action.

### 13.5 Check-out
- Reservation must be ACTIVE.
- Set actualExitTime once.
- Calculate authoritative final amount on the server.
- Create/update payment result.
- Set COMPLETED.
- Release slot availability according to the slot state model.
- Send receipt email and create in-app notification.

---

## 14. Security Blueprint

### 14.1 Authentication security
- Hash passwords with bcrypt or another approved password-hashing mechanism; never store plaintext passwords.
- JWT secrets/keys live in environment variables.
- Use short-lived access tokens and a carefully chosen session/refresh strategy if implemented.
- OTP must expire, have attempt limits, and be invalidated after success.
- Do not print passwords, raw tokens or OTPs in logs.

### 14.2 API security
- Validate and sanitize request bodies, query parameters and path parameters.
- Rate-limit authentication and OTP endpoints.
- Use security headers middleware.
- Configure CORS to trusted origins.
- Reject unauthorized/forbidden access consistently.
- Do not allow client-provided userId/role to override authenticated identity.
- Use server-calculated payment amounts.

### 14.3 Data security
- Do not commit `.env` files or credentials.
- Use `.env.example` with placeholders.
- Do not expose MongoDB connection strings to the React app.
- Minimize sensitive data returned by APIs.
- Keep audit logs free of unnecessary secrets.

### 14.4 Security checklist before deployment
| Check | Pass condition |
|---|---|
| Secrets | No credential in repository history or current tracked files. |
| Auth | Protected endpoints reject missing/invalid authentication. |
| RBAC | Cross-role access attempts fail with 403 where appropriate. |
| Validation | Malformed input fails safely. |
| Rate limiting | Brute-force-sensitive endpoints have limits. |
| Errors | Production responses do not leak stack traces or secrets. |
| CORS | Only intended origins are allowed. |

---

## 15. Smart Layer (No Forced AI)

The system is "smart" because it makes operationally useful decisions from domain rules and data. AI/ML is optional and must remain isolated from the critical reservation path.

### 15.1 Rule-based slot recommendation
```
Candidate slots
→ filter compatible vehicle type
→ filter EV requirement
→ filter AVAILABLE for requested interval
→ score by user preference (distance/entrance/price)
→ return top N

Example score = availability weight + compatibility weight + price preference + proximity preference
```

### 15.2 Demand score
```
Historical bookings / occupancy
→ group by facility + weekday + hour
→ normalize against historical capacity
→ classify: LOW / MEDIUM / HIGH / VERY_HIGH
```

### 15.3 Optional forecasting
Only after sufficient historical data exists, a small forecasting component can be evaluated. It should consume exported historical aggregates and return a prediction to a non-critical analytics endpoint. The booking path must remain fully functional without the model.

> **RULE:** Do not claim "AI-powered" on the resume unless an actual model is implemented, evaluated, and meaningfully used.

---

## 16. Testing & Quality Strategy

### 16.1 Test pyramid
- Many fast tests → unit/business logic
- Fewer integration tests → API + database interactions
- Fewest end-to-end → critical user journeys

### 16.2 Mandatory backend tests
- OTP expiry and invalid OTP.
- Resend cooldown/attempt limit.
- Password hashing/authentication success/failure.
- Role authorization.
- Reservation overlap detection.
- Double booking/concurrent booking behavior.
- Cancellation eligibility.
- Check-in/check-out state transitions.
- Pricing calculation and edge cases.
- Analytics aggregation correctness for seed fixtures.

### 16.3 Frontend tests
- Login/register forms.
- Protected route behavior.
- Booking form validation.
- Slot selection state.
- Dashboard rendering with loading/empty/error states.
- Role-specific navigation.

### 16.4 Integration journey
Register → Verify OTP → Login → Create vehicle → Find facility → Book slot → Confirm → Check-in → Check-out → Payment success → Receipt/notification

### 16.5 Quality gate
- No critical feature is merged with failing tests.
- Every production bug should gain a regression test where practical.
- Manual QA checklist is stored in `docs/qa/` or project issues.

---

## 17. Observability, Reliability & Performance

### 17.1 Logging
- Log request method/path/status/duration in a privacy-safe way.
- Log unexpected errors with correlation/request IDs where practical.
- Log important lifecycle events without secrets.
- Use audit logs for business actions requiring traceability.

### 17.2 Performance rules
- Paginate large lists.
- Index fields used in frequent filters/sorts.
- Return only required fields for list views.
- Avoid repeated per-row database queries where aggregation or batching is appropriate.
- Avoid loading the entire slot history into the browser when only current availability is needed.

### 17.3 Reliability rules
- Every mutation should be idempotent where the business operation benefits from it.
- A retry must not accidentally create duplicate bookings/payments.
- Do not update related records in a partially inconsistent way; use database transactions/atomic operations where justified.
- Expired temporary states must have a clear cleanup mechanism.

---

## 18. Deployment & Environment Management

### 18.1 Target topology
```
User Browser
 │
 ├── React app → Vercel (or equivalent static/frontend host)
 │
 └── REST API → Render/Railway (or equivalent Node host)
        │
        └── MongoDB Atlas

Email → Gmail SMTP via Nodemailer
```

### 18.2 Environment files
- Development: `.env` in server only; client gets only explicitly safe public configuration.
- Production: configure secrets in deployment platform secret/environment settings.
- Commit `.env.example` with names but no secrets.

### 18.3 Deployment checklist
- Build succeeds from a clean checkout.
- MongoDB Atlas connection works from backend host.
- CORS production origin configured.
- SMTP works with production sender configuration.
- Health endpoint works, e.g. `/health`.
- Database indexes exist.
- No debug stack traces exposed.
- Frontend points to production API base URL.
- Critical user journey verified after deployment.

---

## 19. Development Roadmap & Milestones

### Phase 0 - Foundation
- Create GitHub repository `parksphere`.
- Initialize client/server.
- Add lint/format rules.
- Add `.gitignore` and `.env.example`.
- Connect MongoDB.
- Create health endpoint.
- Create base UI shell and route system.

### Phase 1 - Authentication
- User model.
- Register.
- OTP generation + SMTP.
- Verify email.
- Login.
- Logout behavior.
- JWT/protected routes.
- RBAC.
- Forgot/reset/change password.

### Phase 2 - Domain foundation
- Vehicle model and UI.
- Facility model and operator CRUD.
- Slot model and management.
- Search/filter/pagination.
- Seed realistic parking data.

### Phase 3 - Reservation engine
- Availability query.
- Conflict detection.
- Reservation creation.
- Double-booking prevention.
- Status lifecycle.
- Cancellation/expiry.
- Customer booking UI.

### Phase 4 - Operations
- Check-in.
- Check-out.
- Pricing calculation.
- Operator operational dashboard.
- Slot state management.

### Phase 5 - Payments & notifications
- Payment records.
- Payment state model.
- Confirmation email.
- Receipt email.
- Reminder job.
- In-app notification center.

### Phase 6 - Administration & analytics
- Admin dashboard.
- Users/operators/facilities management.
- Audit logs.
- Revenue/occupancy aggregations.
- Reviews/moderation.

### Phase 7 - Smart layer & polish
- Smart slot recommendation.
- Demand scoring.
- UI polish/responsive pass.
- Accessibility pass.
- Error/loading/empty states.

### Phase 8 - Quality & release
- Unit/integration/UI tests.
- Security hardening.
- Performance/index review.
- Production deployment.
- README/docs/API collection.
- Demo video and screenshots.
- Resume bullets and interview notes.

---

## 20. Definition of Done & Acceptance Gates

A feature is not "done" because the happy path works locally. Use this gate for every significant module.

| Gate | Question |
|---|---|
| Functional | Does the intended user journey work end-to-end? |
| Validation | Do invalid inputs fail with useful feedback? |
| Authorization | Can the wrong role/user access it directly through the API? |
| Error handling | Do server/database/email failures produce controlled outcomes? |
| UI quality | Are loading, empty, error and success states implemented? |
| Tests | Are critical rules covered? |
| Security | Are secrets and sensitive fields handled correctly? |
| Database | Are schema relationships and indexes deliberate? |
| Docs | Is API/schema/decision information documented? |
| Deployment | Will it work in the target production environment? |

### Release gate
- No open critical security issue.
- No known data-corruption issue in bookings/payments.
- Critical end-to-end journey passes.
- Build/deployment succeeds.
- README setup works from clean checkout.
- Demo dataset is stable and reproducible.
- Resume claims match implemented reality.

---

## 21. Git/GitHub Working Model

### 21.1 Branches
```
main      → stable/releasable
develop   → optional integration branch
feature/* → focused changes
fix/*     → bug fixes
```

### 21.2 PR discipline
- One logical change per pull request when possible.
- PR must explain problem, implementation, tests and screenshots if UI changed.
- Never merge broken tests.
- Squash noisy commits before merge if using that repository policy.
- Tag release milestones, e.g. `v0.1.0-auth`, `v0.2.0-booking`, `v1.0.0`.

### 21.3 Issue template fields
```
Title
Context
Expected behavior
Acceptance criteria
Dependencies
Screenshots / references
Test notes
```

---

## 22. Resume, Demo & FAANG/MAANG Positioning

### 22.1 What to emphasize
- Full-stack ownership across React, Node.js, Express and MongoDB.
- Secure authentication and role-based authorization.
- Concurrency-aware booking/conflict prevention.
- Database indexing/aggregation and analytical dashboards.
- Automated test coverage on critical business logic.
- Deployment and production-style error handling.

### 22.2 Resume bullet template
**PARKSPHERE — Smart Parking Management & Reservation Platform | MERN**
- Built a full-stack multi-role parking platform with React, Node.js, Express and MongoDB supporting customer, operator and admin workflows.
- Engineered a conflict-aware reservation service with server-side validation and concurrency-safe booking logic to prevent double booking.
- Implemented JWT authentication, SMTP email OTP verification, password recovery, RBAC, notifications, audit logs and responsive role-specific dashboards.
- Optimized parking discovery and analytics using indexed MongoDB queries and aggregation pipelines for availability, occupancy and revenue insights.

> **RULE:** Replace generic claims with measured numbers once you have them. Example metrics: test count, API latency under a defined fixture, number of seeded facilities/slots, or percentage of critical services covered by tests.

### 22.3 Demo storyline
1. Start on landing page.
2. Register a customer and show OTP email verification.
3. Log in and demonstrate role-based navigation.
4. Find a facility and show availability/slot layout.
5. Reserve a slot.
6. Explain what prevents double booking.
7. Show confirmation email/in-app notification.
8. Check in and check out.
9. Show generated payment/receipt.
10. Switch to operator dashboard and show occupancy/revenue.
11. Switch to admin dashboard and show audit logs.
12. Briefly show architecture and tests.

---

## 23. Interview Preparation Checklist

### 23.1 Must be able to explain
| Topic | Question you should answer |
|---|---|
| Architecture | Why modular monolith instead of microservices? |
| Authentication | How does JWT-based auth work end-to-end? |
| OTP | How do you expire and rate-limit OTP verification? |
| Authorization | Why is frontend route protection alone insufficient? |
| Booking | How do you prevent double booking? |
| Concurrency | What happens when two requests arrive at the same time? |
| Database | Why these collections? Where are the indexes? |
| MongoDB | Where are aggregation pipelines useful? |
| API | How are controllers separated from business services? |
| Reliability | How do retries avoid duplicate bookings? |
| Security | How are passwords, secrets and CORS handled? |
| Testing | What is unit vs integration testing in your system? |
| Scaling | What would you change at 10x traffic? |
| Trade-offs | Why did you deliberately avoid AI/microservices/Kafka? |

### 23.2 Scaling discussion - future thought process
- Add caching only for demonstrated hot reads.
- Consider a dedicated search/indexing solution only when query complexity warrants it.
- Introduce queues for non-critical email/notification work if volume requires it.
- Split services only when domain boundaries and team/traffic needs justify operational complexity.
- Use observability data to drive optimization rather than adding infrastructure preemptively.

---

## 24. Future Extensions & Decision Log

### 24.1 Potential extensions
- Real payment gateway integration.
- Real-time availability updates with WebSockets.
- Reservation QR code.
- Operator kiosk mode.
- EV charging reservation support.
- Demand forecasting model as a separate analytics service.
- Mobile application consuming the same REST API.
- Multi-city / multi-tenant operator support.

### 24.2 Decision log
| Decision | Chosen approach | Reason |
|---|---|---|
| Architecture | Modular monolith | Strong separation without unnecessary ops complexity. |
| Core stack | MERN | Matches learned skills and keeps project coherent. |
| AI/ML | Optional | Only useful if measurable business value exists. |
| Auth email | Nodemailer + Gmail SMTP | Demonstrates real email workflow without adding a large vendor surface. |
| Payments | Record/state model first | Keeps core project manageable; real gateway can be added later. |
| Smartness | Rules + historical analytics | Transparent, explainable, useful. |
| Primary engineering focus | Reservation correctness | Most important business-critical backend logic. |

---

## Appendix A. Seed Data

### A.1 Recommended demo seed
- 3 cities.
- 6 parking facilities.
- 50–100 slots per facility.
- 20 customer accounts.
- 3 operators.
- 1 admin.
- 100+ historical reservations for meaningful analytics demos.
- Vehicles covering sedan/SUV/two-wheeler/EV-compatible examples.

### A.2 Seed roles
```
ADMIN    → platform administration
OPERATOR → manages assigned facilities
CUSTOMER → booking/customer journey
```

## Appendix B. Suggested Environment Variables
```
NODE_ENV=development
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
CLIENT_URL=http://localhost:5173
```
> **RULE:** Use an app-specific password or an approved SMTP credential mechanism for Gmail; do not store the raw mailbox password in the repository.

## Appendix C. First 30 Tasks
1. Create the GitHub repository `parksphere`.
2. Add README and project Bible under `docs/`.
3. Initialize React client.
4. Initialize Express server.
5. Add ESLint/formatting conventions.
6. Add environment files and `.env.example`.
7. Connect MongoDB Atlas/development MongoDB.
8. Create `/health` endpoint.
9. Create base React route structure.
10. Build responsive navbar/footer shell.
11. Create User schema.
12. Implement register validation.
13. Implement OTP generation/expiry.
14. Configure Nodemailer Gmail SMTP.
15. Build OTP verification UI/API.
16. Implement password hashing.
17. Implement login/JWT.
18. Implement logout behavior.
19. Implement protected routes.
20. Implement RBAC middleware.
21. Create Vehicle schema/API/UI.
22. Create ParkingFacility schema/API.
23. Create ParkingSlot schema/API/UI.
24. Create parking search/filter API.
25. Create availability query.
26. Create Reservation schema.
27. Implement overlap detection.
28. Implement reservation creation with concurrency-safe strategy.
29. Add reservation integration tests.
30. Build customer booking UI and verify the full happy path.

---

## Final Operating Rule
Build the product in order. Do not skip the booking engine, security, testing or deployment in order to add flashy technology. When a new idea appears, place it in the decision log first. It becomes part of the product only when it survives the same scope, engineering and acceptance standards as every other feature.
