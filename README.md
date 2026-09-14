# YNR Happy Homes

A full-stack Enterprise-grade business platform designed for infrastructure equipment rental, real estate services, and construction project management.Built specifically for **YNR Happy Homes** (Established 2025, headquarters in Mangalagiri, Andhra Pradesh, India).

---

## Short Description

YNR Happy Homes is an integrated commercial web platform that unifies heavy construction equipment rental (INFRA), real estate brokerage (REAL ESTATE), and large-scale building project management (CONSTRUCTION). It combines a responsive React single-page application (SPA) with a robust Express REST API backend, typed database access via Prisma ORM, PostgreSQL data persistence, containerized Docker builds, and automated Render cloud infrastructure.

---

## Live Demo

🔗 **Live Application**: [https://ynr-happy-homes-frontend.onrender.com](https://ynr-happy-homes-frontend.onrender.com)
🔗 **API Health Endpoint**: [https://ynr-happy-homes-backend.onrender.com/api/v1/health](https://ynr-happy-homes-backend.onrender.com/api/v1/health)

---

## Key Features

🏗️ **Triple-Division Business Hub**: Seamless navigation across Heavy Machinery Rentals, Property Brokerage, and Building Construction.
🚜 **Infrastructure Rental Engine**: Complete equipment catalog with technical specifications, availability statuses, operator-inclusive terms, and location-aware rental request workflows.
🏡 **Dynamic Real Estate Brokerage**: Searchable and filterable property catalog for lands, plots/sites, apartments, individual houses, and commercial properties with image galleries and status tags.
🏢 **Construction Project Management**: Interactive project portfolio with construction progress metrics, hierarchical project blocks (`ProjectBlock`), and real-time flat/unit availability matrices (`ProjectUnit`).
📩 **Centralized Customer Enquiry Workflow**: Unified lead capture for equipment rental, property inspection, unit booking, and general business enquiries with direct WhatsApp connect.
🔐 **Secure Role-Based Access Control (RBAC)**: Protected Admin Portal for authenticated staff to perform full CRUD operations on listings, projects, unit matrices, media, and customer lead pipelines.
📁 **Media & Document Management**: Dedicated API endpoints and storage handling for uploading and linking property images, project galleries, and floor plans.
⚡ **Production-Ready Deployment**: Multi-stage Docker containerization and Render Infrastructure-as-Code blueprint (`render.yaml`).

---

## Business Modules

### 1. Infrastructure (Equipment Rental)
**Catalog**: Heavy machinery listings including excavators , backhoe loaders , tippers, and mobile cranes.
**Specifications & Terms**: Detailed machine specs, rental basis options (hourly, daily, monthly), operator inclusion flags, and regional service coverage (Mangalagiri, Vijayawada, Guntur, Amaravati) and across south india.
**Rental Request Workflow**: Interactive enquiry form capturing work location, required start date, duration, and operator requirements.

### 2. Real Estate (Property Brokerage)
**Categories**: Land, Sites/Plots, Apartments, Individual Houses, Commercial Land, and Commercial Properties.
**Filtering & Search**: Dynamic client-side and server-side filtering by property category, location, price range, and availability status.
**Status Lifecycle**: Clear listing status transitions (`AVAILABLE`, `UNDER_OFFER`, `SOLD`, `ARCHIVED`).

### 3. Construction (Building Projects & Unit Matrix)
**Portfolio**: Residential apartments, individual housing layouts, and commercial complexes.
**Progress Tracking**: Real-time project completion percentages and stage tracking (Planning, Under Construction, Completed).
**Block & Flat Availability Matrix**: Hierarchical structure dividing projects into blocks (`ProjectBlock`) and individual units (`ProjectUnit`) with dynamic availability badges (`AVAILABLE`, `BOOKED`, `SOLD`).

---

## Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 | Declarative UI components & views |
| | Vite 5 | Fast development server & optimized build tool |
| | TypeScript 5 | Strict static typing across components & services |
| | Tailwind CSS 3 | Utility-first responsive styling & glassmorphism UI |
| | Lucide React | Modern iconography system |
| **Backend** | Node.js 20 | Asynchronous JavaScript runtime |
| | Express 4 | Modular RESTful API framework |
| | TypeScript 5 | End-to-end typed server logic & route handlers |
| | Multer | File upload middleware for media management |
| | bcryptjs & JWT | Password hashing & JSON Web Token authentication |
| **Database** | PostgreSQL 15 | Relational SQL database storage |
| | Prisma ORM 5 | Type-safe database client, migrations, & schema modeling |
| **DevOps & Cloud** | Docker | Multi-stage production container build |
| | Docker Compose | Local multi-container orchestration (PostgreSQL + Backend) |
| | Render | Cloud deployment platform for Static SPA, Web API, & PostgreSQL |

---

## System Architecture

```
User (Browser)
      ↓
React + Vite SPA (TypeScript / Tailwind CSS)
      ↓
REST API Requests (HTTP / JSON)
      ↓
Express + TypeScript Server (/api/v1/*)
      ↓
Controller & Middleware Layer (Auth, Validation, Error Handling)
      ↓
Service & Repository Layer (Business Logic)
      ↓
Prisma ORM (Data Access Layer)
      ↓
PostgreSQL Database ('ynr_happy_homes')
```

---

## Architecture Diagram

```mermaid
flowchart TD
    User([User / Web Browser])

    subgraph RenderCloud ["Render Cloud Infrastructure"]
        subgraph FrontendHost ["Static Hosting Service"]
            Frontend["React + Vite SPA\n(TypeScript + Tailwind CSS)\nhttps://ynr-happy-homes-frontend.onrender.com"]
        end

        subgraph BackendHost ["Web Service Container (Docker Node 20)"]
            API["REST API Routing Layer\n(/api/v1/*)"]
            Backend["Express + TypeScript Backend\n(Middlewares, Controllers, Auth)"]
            ServiceRepo["Service / Repository Layer"]
            Prisma["Prisma ORM"]

            API --> Backend
            Backend --> ServiceRepo
            ServiceRepo --> Prisma
        end

        subgraph DatabaseHost ["Managed PostgreSQL Service"]
            PostgreSQL[(PostgreSQL 15 Database\n'ynr_happy_homes')]
        end

        Prisma --> PostgreSQL
    end

    User -->|HTTP / HTTPS| Frontend
    Frontend -->|REST API Requests| API
```

---

## Project Structure

```
ynr-happy-homes/
├── src/                        # React Frontend Source
│   ├── components/             # UI Views & Components
│   │   ├── admin/              # Protected Admin Portal Views & Dashboards
│   │   ├── common/             # Shared UI Components (Modals, Headers)
│   │   ├── customer/           # Customer Portal & Auth Modals
│   │   └── public/             # Public Division Views (Infra, Real Estate, Construction)
│   ├── hooks/                  # Custom React Hooks
│   ├── repositories/           # Frontend Data Repository Abstraction Layer
│   ├── services/               # Frontend API Services
│   ├── types/                  # Frontend Data Models & Interfaces
│   ├── App.tsx                 # Main Application Layout & Routing State
│   ├── main.tsx                # React Application Entry Point
│   └── index.css               # Global Tailwind CSS Styles
│
├── backend/                    # Express + TypeScript REST API
│   ├── src/
│   │   ├── config/             # Environment & Server Configuration
│   │   ├── controllers/        # Route Handlers for Auth, Listings, & Enquiries
│   │   ├── middleware/         # CORS, JWT Auth, Input Validation, Rate Limiter
│   │   ├── repositories/       # Prisma Repository Abstractions
│   │   ├── routes/             # Express Router Definitions (/api/v1/*)
│   │   ├── services/           # Backend Business Services
│   │   ├── utils/              # API Response Formatters & Prisma Instance
│   │   ├── app.ts              # Express App Configuration
│   │   └── server.ts           # HTTP Server Initialization (Port 8000)
│   ├── uploads/                # Local Uploaded Media Directory
│   ├── package.json            # Backend Node Dependencies & Scripts
│   └── tsconfig.json           # Backend TypeScript Config
│
├── prisma/                     # Database Schema & Data Seeding
│   ├── schema.prisma           # Prisma Data Models (Company, User, Equipment, Property, etc.)
│   └── seed.ts                 # Database Seeding Script
│
├── shared/                     # Shared Types across Stack
│   └── types/                  # Shared TypeScript Interfaces
│
├── Dockerfile                  # Multi-Stage Production Docker Build
├── docker-compose.yml          # Local PostgreSQL & Backend Compose Setup
├── render.yaml                 # Render Blueprint Infrastructure-as-Code
├── package.json                # Root Frontend Package & Script Definitions
├── .env.example                # Frontend Environment Variables Template
├── test-full-system.ps1        # Master Automated Release Verification Suite
├── test-security-suite.ps1     # Security & RBAC Audit Suite
├── test-media-upload.ps1       # Media Management Test Suite
├── test-enquiry-workflow.ps1   # Enquiry Lifecycle Verification Suite
└── test-e2e-integration.ps1   # Full End-to-End Integration Suite
```

---

## Frontend Setup

### Prerequisites
**Node.js**: v18.x or v20.x
**npm**: v9.x or later

### Installation & Execution
```bash
# 1. Install frontend dependencies from project root
npm install

# 2. Start the Vite development server (default port 5173 / 3000)
npm run dev

# 3. Build for production (TypeScript compile + Vite bundle)
npm run build

# 4. Preview local production build
npm run preview
```

---

## Backend Setup

### Prerequisites
**Node.js**: v18.x or v20.x
**PostgreSQL**: v15.x running locally or via Docker

### Installation & Execution
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install backend dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Run database migrations & seed initial data (see Database section)
npm run prisma:generate
npm run prisma:deploy
npm run db:seed

# 5. Start backend development server (Port 8000)
npm run dev

# 6. Build backend TypeScript to JavaScript
npm run build

# 7. Start production server from dist
npm start
```

---

## Environment Variables

### Frontend (`.env`)
| Variable | Description | Example / Placeholder |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for the Express REST API | `http://localhost:8000/api/v1` |

### Backend (`backend/.env`)
| Variable | Description | Example / Placeholder |
| :--- | :--- | :--- |
| `PORT` | HTTP server port | `8000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public` |
| `FRONTEND_URL` | Allowed origin for frontend application | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowed origins | `http://localhost:5173,http://localhost:3000` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your-512-bit-secret-key-placeholder` |
| `JWT_EXPIRES_IN` | Token expiration duration | `24h` |

---

## Database Setup

The platform uses **PostgreSQL** managed through **Prisma ORM**.

```bash
# Ensure PostgreSQL service is running on your host machine or via Docker:
docker-compose up -d postgres
```

---

## Prisma Migrations and Seeding

To generate Prisma clients, run migrations, and populate the initial database seed:

```bash
# From the root directory or inside backend/

# 1. Generate Prisma Client
npm run prisma:generate

# 2. Run Database Migrations (Development)
npx prisma migrate dev --name init

# 3. Apply Migrations (Production Environment)
npm run prisma:deploy

# 4. Seed Database with Initial Business Data
npm run db:seed
```

The seed script creates the company profile for **YNR Happy Homes**, initial machinery items (such as the Hyundai Smart Plus 210 Excavator), property listings, construction projects with blocks & units, and standard administrative users.

---

## Docker Setup

### Multi-Stage Dockerfile Overview
The root `Dockerfile` uses a two-stage build pipeline:
1. **Builder Stage (`node:20-slim`)**: Installs build tools, OpenSSL, root/backend dependencies, generates Prisma clients, and compiles TypeScript into `dist/`.
2. **Runner Stage (`node:20-slim`)**: Prepares lightweight production runtime container, copies compiled assets and Prisma artifacts, creates `uploads/` storage, exposes port 8000, and executes `node backend/dist/server.js`.

### Local Containerized Setup with Docker Compose
You can launch both PostgreSQL and the Express backend using Docker Compose:

```bash
# Build and launch all services in detached mode
docker-compose up --build -d

# View logs for the running containers
docker-compose logs -f

# Stop and remove containers
docker-compose down
```

---

## API Health Check

The API includes a dedicated public health-check endpoint to verify database connectivity, server uptime, and system diagnostics.

**Endpoint**: `GET /api/v1/health`
**Access**: Public
**Behavior**: Executes a live database query (`SELECT 1`) against PostgreSQL to confirm real-time connectivity.

### Example Request
```bash
curl -X GET http://localhost:8000/api/v1/health
```

### Example Response
```json
{
  "success": true,
  "message": "YNR Happy Homes API Health Status",
  "data": {
    "status": "UP",
    "environment": "production",
    "uptimeSeconds": 1420,
    "timestamp": "2026-08-23T13:00:00.000Z",
    "database": {
      "status": "CONNECTED",
      "latencyMs": 4
    },
    "system": {
      "nodeVersion": "v20.18.0",
      "platform": "linux",
      "memoryRssMb": 58
    }
  }
}
```

---

## Deployment

The application is configured for deployment using **Render Infrastructure-as-Code Blueprint** (`render.yaml`).

### Deployment Architecture on Render
1. **Database (`ynr-happy-homes-db`)**: Managed PostgreSQL 15 database instance.
2. **Backend Web Service (`ynr-happy-homes-backend`)**:
   - **Environment**: Node.js
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run prisma:deploy && npm run db:seed && node dist/server.js`
   - **Health Check Path**: `/api/v1/health`
3. **Frontend Static Site (`ynr-happy-homes-frontend`)**:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `./dist`
   - **Rewrite Rule**: Routes all requests (`/*`) to `/index.html` for single-page app client routing.

---

## Security Considerations

🛡️ **CORS Protection**: Restricted origin policies enforced in Express via configurable `ALLOWED_ORIGINS`.
🔑 **Authentication & Authorization**: Admin routes protected by JWT verification middleware (`authMiddleware.ts`). Passwords hashed securely using `bcryptjs`.
🧪 **Input Validation**: Strict request body validation middleware for enquiries, equipment, properties, projects, and user operations.
🛑 **Rate Limiting**: Custom rate limiting middleware (`rateLimiter.ts`) applied to prevent API abuse on public routes.
🔒 **Secrets Isolation**: Zero hardcoded production credentials; environment configuration managed cleanly through `.env` templates.

---

## Testing

The codebase includes comprehensive automated PowerShell verification scripts in the repository root for testing release builds and live endpoints.

### Executable Test Suites
```powershell
# Run the Master Release Verification Suite (Executes all sub-suites sequentially)
.\test-full-system.ps1

# Run individual verification suites:
.\test-security-suite.ps1     # Tests Auth, RBAC, and protected route access
.\test-media-upload.ps1       # Tests media uploads and asset tracking
.\test-enquiry-workflow.ps1   # Tests customer lead submission and status updates
.\test-e2e-integration.ps1   # Tests end-to-end multi-division integration
```

### Static Type Checks & Build Verification
```bash
# Verify Frontend TypeScript Compilation & Build
npm run build

# Verify Backend TypeScript Compilation
cd backend && npm run typecheck
```

---

## Future Improvements

🔔 **Automated Notifications**: Integration with SMS/Email gateways (e.g., Twilio / SendGrid) for immediate enquiry lead notifications to management.
☁️ **Cloud Media Storage**: Migration of local upload directory to Amazon S3 or Google Cloud Storage bucket for scalable high-resolution media hosting.
📊 **Advanced Analytics Dashboard**: Enhanced visual reports tracking lead conversion rates across Infrastructure, Real Estate, and Construction divisions.
📱 **Mobile Application**: Native mobile app for field staff to update unit construction progress and machine availability on site.

---

## Contributing

Internal development contributions follow a structured workflow:
1. Create a feature branch off main (`git checkout -b feature/your-feature-name`).
2. Ensure strict TypeScript types and clear commit messages.
3. Verify all automated PowerShell test suites pass (`.\test-full-system.ps1`).
4. Submit a Pull Request for review.

---

## License

Copyright © 2025–2026 **YNR Happy Homes**. All rights reserved.
*This software and associated documentation files are proprietary. Unauthorized copying, distribution, or modification of this project is strictly prohibited.*

---

## Project Status

🟢 **Deployed & Functional**
