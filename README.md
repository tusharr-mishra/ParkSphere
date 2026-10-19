# ParkSphere 🅿️
**Smart Parking Management & Reservation Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-v20%2B-brightgreen.svg)]()
[![React](https://img.shields.io/badge/React-18-blue.svg)]()
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)]()

ParkSphere is a production-style full-stack smart parking management and reservation platform built on the MERN stack (MongoDB, Express, React, Node.js). It supports multi-role workflows across **Customers**, **Facility Operators**, and **Platform Administrators**.

---

## 🏛️ System Architecture

ParkSphere is structured as a **modular monolith** with clean layer boundaries:

- **Client (`client/`):** React 18, Vite, Redux Toolkit, React Router 6, Vanilla CSS design system.
- **Server (`server/`):** Node.js, Express, Mongoose ODM, JWT authentication, Nodemailer (Gmail SMTP).
- **Database:** MongoDB with deliberate indexing, compound uniqueness guards, and aggregation pipelines.
- **Docs (`docs/`):** Complete specifications including the Project Bible, architecture diagrams, API contracts, database schemas, and decision records.

---

## 🚀 Quickstart

### Prerequisites
- Node.js (v20+ recommended)
- npm (v10+ recommended)
- MongoDB instance (MongoDB Atlas or local community edition)

### 1. Clone & Setup Repository
```bash
git clone https://github.com/your-username/parksphere.git
cd parksphere
```

### 2. Configure Environment Variables
Copy example environment templates to actual `.env` files:

```bash
# Server configuration
cp server/.env.example server/.env

# Client configuration
cp client/.env.example client/.env
```

Ensure MongoDB URI and JWT secrets are properly set in `server/.env`.

### 3. Install Dependencies & Run

#### Server:
```bash
cd server
npm install
npm run dev
```
Server starts on port `5000` (by default) with health check at `http://localhost:5000/health`.

#### Client:
```bash
cd client
npm install
npm run dev
```
Client launches with Vite at `http://localhost:5173`.

---

## 🧪 Testing

```bash
# Run server test suite
cd server
npm test

# Run client test suite
cd client
npm test
```

---

## 📂 Documentation

- [Project Bible](docs/PROJECT_BIBLE.md)
- [Architecture Blueprint](docs/architecture/)
- [API Contracts](docs/api/)
- [Database Schema & Indexes](docs/database/)
- [Architecture Decision Records (ADR)](docs/decisions/)
