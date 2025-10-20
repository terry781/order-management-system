# Order Management System

**Developer:** [Your Full Name Here]

A complete order management system with intelligent master assignment and ADL (Audit Documentation & Location) enforcement. Built with Express.js backend and React frontend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## Features

✅ **Order Management**: Create, assign, and complete orders with full lifecycle tracking

✅ **Intelligent Master Assignment**: Automatically assigns orders to the best available master using:

- Nearest distance (Haversine formula)
- Higher rating (tie-breaker)
- Lower active workload (final tie-breaker)

✅ **ADL Enforcement**: Blocks order completion without valid evidence:

- At least 1 photo with GPS coordinates
- Timestamp in ISO format
- Clear validation errors

✅ **Modern UI**: React frontend with real-time updates

✅ **RESTful API**: Complete JSON API with validation and error handling

## Tech Stack

- **Backend**: Express.js with TypeScript
- **Frontend**: React with Vite
- **Database**: SQLite with better-sqlite3
- **Language**: TypeScript
- **Testing**: Jest
- **Architecture**: Layered architecture with middleware
- **Validation**: Comprehensive input validation
- **Logging**: Structured logging with request tracking

## Architecture

```
┌─────────────────────────────────────┐
│         React Frontend              │
│    (Components + Hooks + API)       │
├─────────────────────────────────────┤
│         Express.js API              │
│    (Routes + Middleware + Config)   │
├─────────────────────────────────────┤
│      Services Layer                 │
│  - Order Service                    │
│  - Assignment Service (Haversine)   │
│  - ADL Service (Validation)         │
├─────────────────────────────────────┤
│      Repository Layer               │
│  - Order Repository                 │
│  - Master Repository                │
│  - ADL Repository                   │
├─────────────────────────────────────┤
│      Database (SQLite)              │
│    (Optimized + WAL Mode)           │
└─────────────────────────────────────┘
```

### Key Improvements

- **Middleware System**: Validation, error handling, logging
- **Configuration Management**: Environment-based settings
- **Modular Frontend**: Reusable components and hooks
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Consistent error responses
- **Logging**: Structured logging with request tracking

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm package manager

### Quick Setup (Automated)

For Windows:
```bash
setup.bat
```

For Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

This will automatically:
- Create `.env` file from template
- Install all dependencies
- Initialize database
- Show next steps

### Manual Setup (Step by Step)

### 1. Setup Environment (Optional)

The system works with default settings, but you can customize configuration:

```bash
# Copy environment template (optional)
cp .env.example .env

# Edit .env file to customize settings
# Contains 11 essential configuration options
# Default values work for development
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Initialize Database

```bash
npm run db:init
```

### 4. Create Sample Data (Optional)

To populate the dashboard with realistic test data:

```bash
npm run db:sample
```

This creates 8 sample orders with various statuses, customer information, and ADL evidence.

### 5. Start Development Servers

```bash
npm run dev
```

This will start:

- Backend API: http://localhost:3001
- Frontend UI: http://localhost:3000

### 6. Open the Application

Navigate to: **http://localhost:3000**

## Usage Guide

### Complete Order Flow

1. **Create Order**

   - Fill the form with title, description, customer info
   - Enter GPS coordinates (e.g., `40.7580, -73.9855`)
   - Click "Create Order"

2. **Assign Master**

   - Click "Assign" on your order
   - System auto-selects the best master

3. **Attach ADL Evidence**

   - Click "View" on your order
   - Add photo with GPS + timestamp
   - Click "Attach ADL"

4. **Complete Order**
   - Click "Complete" button
   - Order status → "completed" ✅

## API Documentation

### Base URL

```
http://localhost:3001/api
```

### Endpoints

#### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/assign` - Assign master
- `POST /api/orders/:id/adl` - Attach ADL
- `POST /api/orders/:id/complete` - Complete order

#### Masters

- `GET /api/masters` - List masters

### Interactive API Documentation

**Swagger UI**: http://localhost:3001/api-docs  
**OpenAPI JSON**: http://localhost:3001/api-docs/openapi.json

### Example API Usage

```bash
# Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix plumbing issue",
    "description": "Kitchen sink is leaking",
    "customerName": "Jane Doe",
    "customerPhone": "+1-555-0123",
    "geo": {"lat": 40.7580, "lng": -73.9855}
  }'

# Assign master
curl -X POST http://localhost:3001/api/orders/1/assign

# Attach ADL
curl -X POST http://localhost:3001/api/orders/1/adl \
  -H "Content-Type: application/json" \
  -d '{
    "type": "photo",
    "url": "https://example.com/evidence.jpg",
    "gps": {"lat": 40.7580, "lng": -73.9855},
    "capturedAt": "2025-10-16T10:30:00.000Z"
  }'

# Complete order
curl -X POST http://localhost:3001/api/orders/1/complete

# Get order details
curl http://localhost:3001/api/orders/1

# List all masters
curl http://localhost:3001/api/masters
```

## Project Structure

```
order-management-system/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── lib/               # Business logic
│   │   │   ├── services/      # Services layer
│   │   │   └── repositories/  # Data access
│   │   ├── types.ts           # TypeScript types
│   │   ├── database.ts        # Database setup
│   │   └── server.ts          # Express server
│   ├── __tests__/             # Unit tests
│   ├── scripts/               # Database scripts
│   ├── public/                # Static files (OpenAPI JSON)
│   └── package.json
├── frontend/                   # React app
│   ├── src/
│   │   ├── App.tsx            # Main component
│   │   ├── types.ts           # Frontend types
│   │   └── index.css          # Styles
│   └── package.json
├── .env.example               # Environment configuration template
├── postman-collection.json    # API testing collection
├── package.json               # Root package.json
└── README.md
```

## Testing

### Run Tests

```bash
npm test
```

### Test Coverage

- Assignment algorithm (distance, rating, load)
- ADL validation (GPS, timestamp, format)
- Distance calculation (Haversine)

## Key Features

### 1. Master Assignment Algorithm

```typescript
// Multi-criteria sorting:
// 1. Distance (nearest) - Haversine formula
// 2. Rating (highest) - tie-breaker
// 3. Workload (lowest) - final tie-breaker
```

### 2. ADL Enforcement

```typescript
// Cannot complete order without:
// - GPS coordinates (lat, lng)
// - ISO timestamp
// - At least 1 photo
```

### 3. Haversine Distance

Accurate geographic distance calculation accounting for Earth's curvature.

## Development

### Backend Only

```bash
cd backend
npm run dev
```

### Frontend Only

```bash
cd frontend
npm run dev
```

### Build for Production

```bash
npm run build
```

## Troubleshooting

### Port Issues

If ports 3000 or 3001 are in use:

```bash
# Backend on different port
cd backend
PORT=3002 npm run dev

# Frontend on different port
cd frontend
npm run dev -- --port 3003
```

### Database Issues

```bash
# Reset database
npm run db:init
```

### Clean Install

```bash
# Remove all node_modules
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

## Production Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the backend:

   ```bash
   npm start
   ```

3. Serve the frontend build files from a web server

## Changelog

### VT2 Polish (v1.1.0) - October 2025

#### 🔧 **Developer Experience**
- ✅ **Environment Configuration**: Added `.env.example` with 11 essential configuration options (cleaned up from 20+ unused variables)
- ✅ **API Testing Collection**: Complete Postman/Thunder collection with full workflow (Create → Assign → ADL → Complete)
- ✅ **Static OpenAPI Export**: Build-time OpenAPI JSON export available at `/api-docs/openapi.json`

#### 🚀 **Technical Enhancements**
- ✅ **Build Process**: Integrated OpenAPI JSON export into build pipeline
- ✅ **Static File Serving**: Added static file serving for OpenAPI documentation

#### 📋 **API Workflow Collection**
The Postman collection includes:
1. **Health Check** - Verify API status
2. **Create Order** - New order with customer details
3. **Assign Master** - Automatic master assignment
4. **Attach ADL Evidence** - Photo evidence with GPS
5. **Complete Order** - Final order completion
6. **Verification** - Confirm completed order

#### 🔗 **New Endpoints**
- `GET /api-docs/openapi.json` - Static OpenAPI specification
- Enhanced Swagger UI with direct JSON access

---

## License

MIT

## Contact

**Developer:** [Your Full Name Here]  
**Email:** [your.email@example.com]  
**GitHub:** [github.com/yourusername]

---

Built with ❤️ using Express.js, React, TypeScript, and SQLite
