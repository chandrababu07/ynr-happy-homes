# YNR Happy Homes - Official Business Platform

Production real-estate, construction, and infrastructure equipment rental web platform for **YNR Happy Homes** (Established 2025 | Mangalagiri, Andhra Pradesh).

---

## Business Information

- **Company**: YNR Happy Homes
- **Established**: 2025
- **Headquarters**: IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, Andhra Pradesh – 522510
- **Direct Phone**: 7385293949
- **Business Divisions**:
  1. **INFRA**: Construction Equipment Rental (featuring Hyundai Smart Plus 210 Excavator with operator included)
  2. **REAL ESTATE**: Property Brokerage (Land, Sites/Plots, Apartments, Houses, Commercial Properties)
  3. **CONSTRUCTION**: Building Construction (Apartments, Individual Houses, Commercial Complexes with Project Block & Flat Matrix)

---

## Target System Architecture

```
React Frontend (Vite + TS)
       ↓
REST API (HTTP/JSON)
       ↓
Express + TypeScript Server (Port 8000)
       ↓
Service & Repository Layer
       ↓
Prisma ORM
       ↓
PostgreSQL Database
```

---

## Project Structure

```
ynr-happy-homes/
│
├── src/                    # Approved React Frontend
│   ├── components/         # Public Views, Customer Portal, Protected Admin Panel
│   ├── hooks/              # Custom React Hooks
│   ├── repositories/       # Frontend Repository Abstraction Interfaces & LocalStorage Adaptor
│   ├── services/           # Domain API Services
│   └── types/              # Frontend Data Models
│
├── backend/                # Express + TypeScript REST API Server
│   ├── src/
│   │   ├── config/         # Environment Config
│   │   ├── middleware/     # CORS & Centralized Error Handler
│   │   ├── routes/         # API Routes (Health, Equipment, Property, etc.)
│   │   ├── app.ts          # Express Application Setup
│   │   └── server.ts       # Server Entry Point (Port 8000)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── prisma/                 # PostgreSQL Database Schema & Seeds
│   ├── schema.prisma       # Prisma ORM Data Models (Includes ProjectBlock hierarchy)
│   └── seed.ts             # Confirmed Seed Data (Hyundai Smart Plus 210, images = [])
│
├── shared/                 # Shared Types between Frontend & Backend
│   └── types/
│
└── README.md
```

---

## Getting Started

### 1. Frontend Setup (Port 3000)

```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```

### 2. Backend Setup (Port 8000)

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Copy environment variables template
cp .env.example .env

# Start development server
npm run dev
```

---

## Database Migrations & Seeding (PostgreSQL + Prisma)

Ensure PostgreSQL is running locally or on a cloud instance, update `DATABASE_URL` in `backend/.env`, then run:

```bash
# Run Prisma Database Migrations
npx prisma migrate dev --name init

# Seed Database with Confirmed Business Data
npm run db:seed
```

---

## Health Check API

- **URL**: `http://localhost:8000/api/v1/health`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "message": "YNR Happy Homes API is running"
}
```
