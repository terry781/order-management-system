# 🚀 START HERE

## Welcome to the Order Management System!

This is a complete, production-quality order management system with intelligent master assignment and ADL enforcement. Built with **Express.js backend** and **React frontend**.

## ⚡ Quick Start (3 Minutes)

### 1️⃣ Install Dependencies

```bash
npm run install:all
```

### 2️⃣ Initialize Database

```bash
npm run db:init
```

### 3️⃣ Create Sample Data (Optional)

To see the dashboard with realistic data:

```bash
npm run db:sample
```

### 4️⃣ Start the Application

```bash
npm run dev
```

This starts both:
- **Backend API**: http://localhost:3001
- **Frontend UI**: http://localhost:3000
- **API Documentation**: http://localhost:3001/api-docs

### 4️⃣ Open Your Browser

Navigate to: **http://localhost:3000**

That's it! You're ready to use the system.

## 🎯 Try the Complete Flow

### Using the Web UI (Easiest)

1. **Create Order**
   - Fill the form on the left
   - Use coordinates: `40.7580, -73.9855`
   - Click "Create Order"

2. **Assign Master**
   - Click "Assign" on your order
   - System auto-selects the best master

3. **View Details**
   - Click "View" to see order info

4. **Attach Evidence**
   - Add a photo with GPS + timestamp
   - URL: `https://example.com/photo.jpg`

5. **Complete**
   - Click "Complete" button
   - Order status → "completed" ✅

### Using API/cURL

```bash
# 1. Create order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test order","geo":{"lat":40.7,"lng":-74}}'

# 2. Assign master
curl -X POST http://localhost:3001/api/orders/1/assign

# 3. Attach ADL
curl -X POST http://localhost:3001/api/orders/1/adl \
  -H "Content-Type: application/json" \
  -d '{"type":"photo","url":"https://example.com/photo.jpg","gps":{"lat":40.7,"lng":-74},"capturedAt":"2025-10-16T10:30:00Z"}'

# 4. Complete
curl -X POST http://localhost:3001/api/orders/1/complete
```

## ✨ Key Features

### 🎯 Intelligent Master Assignment

System automatically assigns the best master using:

1. **Distance** (nearest first - Haversine formula)
2. **Rating** (higher is better - tie-breaker)
3. **Workload** (fewer active orders - final tie-breaker)

### 🔒 ADL Enforcement

Orders **cannot** be completed without:

- ✅ At least 1 photo
- ✅ GPS coordinates (lat, lng)
- ✅ ISO timestamp (capturedAt)

### 🌐 Complete API

- `POST /api/orders` - Create order
- `POST /api/orders/:id/assign` - Assign master
- `POST /api/orders/:id/adl` - Attach evidence
- `POST /api/orders/:id/complete` - Complete order
- `GET /api/orders/:id` - Get order details
- `GET /api/masters` - List masters

## 🏗️ Architecture at a Glance

```
React Frontend (port 3000)
    ↓
Express.js API (port 3001)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
SQLite Database
```

**Technologies:**
- Backend: Express.js with TypeScript
- Frontend: React with Vite
- Database: SQLite
- Testing: Jest

## 📁 Project Structure

```
order-management-system/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── lib/               # Business logic
│   │   └── server.ts          # Express server
│   ├── __tests__/             # Unit tests
│   └── package.json
├── frontend/                   # React app
│   ├── src/
│   │   ├── App.tsx            # Main component
│   │   └── types.ts           # Frontend types
│   └── package.json
├── package.json               # Root scripts
├── README.md                  # Full documentation
└── QUICKSTART.md              # This file
```

## 🧪 Test the System

### Run Unit Tests

```bash
npm test
```

### Test ADL Enforcement

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

## 🎓 What This Demonstrates

✅ **Algorithm Implementation** - Multi-criteria sorting with Haversine distance  
✅ **Business Rules** - Strict ADL enforcement before completion  
✅ **Clean Architecture** - Layered design with clear separation  
✅ **Type Safety** - Full TypeScript with proper types  
✅ **Testing** - Unit tests for critical components  
✅ **Documentation** - Comprehensive guides and examples  
✅ **Developer Experience** - Multiple ways to test and explore

## 🐛 Troubleshooting

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

**Need fresh start?**

```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
npm run db:init
```

## 📝 Before Submitting

**Important:** Update your name in `README.md`:

```markdown
**Developer:** [Your Full Name Here] ← Change this!
```

## 🔍 Code Highlights

Want to see the interesting parts?

1. **Assignment Algorithm**  
   → `backend/src/lib/services/assignmentService.ts`

2. **ADL Validation**  
   → `backend/src/lib/services/adlService.ts`

3. **Haversine Distance**  
   → `backend/src/lib/services/distanceService.ts`

4. **API Routes**  
   → `backend/src/routes/orders.ts`

5. **React UI**  
   → `frontend/src/App.tsx`

## 🚀 Next Steps

1. ✅ Run `npm run install:all && npm run db:init && npm run dev`
2. ✅ Test the complete flow via UI or cURL
3. ✅ Explore the code and tests
4. ✅ Read the README for full details
5. ✅ Update your name in README.md

## 💡 Need Help?

- **Setup Issues** → [QUICKSTART.md](QUICKSTART.md)
- **How it works** → [README.md](README.md)
- **Project overview** → This file

---

**Ready?** Run the 3 commands above and start exploring! 🎉

## 🎉 Project Complete!

This is a **complete, production-ready** order management system with:

- ✅ **Express.js backend** with TypeScript
- ✅ **React frontend** with Vite
- ✅ **SQLite database** with proper schema
- ✅ **Intelligent assignment algorithm** (Haversine + rating + load)
- ✅ **ADL enforcement** (blocks completion without evidence)
- ✅ **Unit tests** for critical components
- ✅ **Comprehensive documentation**
- ✅ **Easy setup** with npm scripts

**Built with** ❤️ **using Express.js, React, TypeScript, and SQLite**
