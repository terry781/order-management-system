# Quick Start Guide

Get the Order Management System up and running in 3 minutes!

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Installation

### 🚀 Automated Setup (Easiest)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

This handles all steps below automatically!

### 📋 Manual Setup

### 1. Install Dependencies (1 minute)

```bash
npm run install:all
```

### 2. Initialize Database (10 seconds)

```bash
npm run db:init
```

This creates the database with 5 sample masters and 1 sample order.

### 3. Create Sample Data (Optional)

```bash
npm run db:sample
```

This creates 8 realistic orders with various statuses and ADL evidence.

### 4. Start the Servers (5 seconds)

```bash
npm run dev
```

This starts both backend (port 3001) and frontend (port 3000).

**API Documentation**: http://localhost:3001/api-docs  
**OpenAPI JSON**: http://localhost:3001/api-docs/openapi.json

### 4. Open the App

Navigate to: **http://localhost:3000**

## Your First Order - Complete Flow

### Using the Web UI (Easiest)

1. **Create Order**
   - Fill in the form on the left
   - Example coordinates: `40.7580, -73.9855` (Times Square, NYC)
   - Click "Create Order"

2. **Assign Master**
   - Find your order in the table
   - Click "Assign" button
   - System automatically finds the best master

3. **View Details**
   - Click any order row to see details
   - See assigned master and order info

4. **Attach ADL Evidence**
   - In order details, scroll to "Attach ADL Evidence"
   - Fill in:
     - URL: `https://example.com/photo.jpg`
     - GPS: Same as order location
     - Timestamp: Auto-filled (or adjust)
   - Click "Attach ADL"

5. **Complete Order**
   - Click "Complete" button
   - Order status changes to "completed" ✅

### Using API/cURL (For Developers)

```bash
# 1. Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix plumbing",
    "description": "Leaking sink",
    "geo": {"lat": 40.7580, "lng": -73.9855}
  }'

# 2. Assign master (use order ID from response above)
curl -X POST http://localhost:3001/api/orders/1/assign

# 3. Attach ADL
curl -X POST http://localhost:3001/api/orders/1/adl \
  -H "Content-Type: application/json" \
  -d '{
    "type": "photo",
    "url": "https://example.com/photo.jpg",
    "gps": {"lat": 40.7580, "lng": -73.9855},
    "capturedAt": "2025-10-16T10:30:00.000Z"
  }'

# 4. Complete order
curl -X POST http://localhost:3001/api/orders/1/complete

# 5. View order details
curl http://localhost:3001/api/orders/1
```

## Test ADL Enforcement

Try to complete an order WITHOUT attaching ADL:

```bash
# Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test order","geo":{"lat":40.7,"lng":-74}}'

# Assign master
curl -X POST http://localhost:3001/api/orders/2/assign

# Try to complete WITHOUT ADL (should fail)
curl -X POST http://localhost:3001/api/orders/2/complete
```

**Expected Error:**
```json
{
  "error": "Cannot complete order: At least one photo with GPS coordinates and timestamp is required"
}
```

## Sample Coordinates (NYC Area)

Use these for testing different locations:

- Times Square: `40.7580, -73.9855`
- Central Park: `40.7829, -73.9654`
- Wall Street: `40.7061, -74.0087`
- Brooklyn Bridge: `40.7061, -73.9969`
- Empire State Building: `40.7484, -73.9857`

## Project Structure

```
order-management-system/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── lib/               # Business logic
│   │   └── server.ts          # Express server
│   ├── __tests__/             # Unit tests
│   ├── public/                # Static files (OpenAPI JSON)
│   └── package.json
├── frontend/                   # React app
│   ├── src/
│   │   ├── App.tsx            # Main component
│   │   └── types.ts           # Frontend types
│   └── package.json
├── .env.example               # Environment configuration template
├── postman-collection.json    # API testing collection
├── package.json               # Root scripts
├── setup.bat                  # Windows setup script
├── setup.sh                   # Linux/Mac setup script
└── README.md                  # Full documentation
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Import `postman-collection.json` for complete API testing
- Run tests: `npm test`
- Explore the code in `backend/src/` and `frontend/src/`

## Troubleshooting

**Port 3000 or 3001 in use?**
```bash
# Backend on different port
cd backend
PORT=3002 npm run dev

# Frontend on different port  
cd frontend
npm run dev -- --port 3003
```

**Database issues?**
```bash
npm run db:init
```

**Need to reset everything?**
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
npm run db:init
npm run dev
```

## Support

Check the full README or explore the well-documented code!

## What This Demonstrates

✅ **Algorithm Implementation** - Multi-criteria sorting with Haversine distance  
✅ **Business Rules** - Strict ADL enforcement before completion  
✅ **Clean Architecture** - Layered design with clear separation  
✅ **Type Safety** - Full TypeScript with proper types  
✅ **Testing** - Unit tests for critical components  
✅ **Documentation** - Comprehensive guides and examples  
✅ **Developer Experience** - Multiple ways to test and explore  
✅ **Professional Polish** - Environment config, API collections, static exports