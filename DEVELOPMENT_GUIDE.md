# 🛠️ Development Guide

## Overview

This guide provides detailed information for developers working on the Order Management System. It covers the refactored architecture, development practices, and how to extend the system.

## 🏗️ Architecture Overview

### Backend Architecture

```
┌─────────────────────────────────────┐
│         Express.js Server           │
│  - Middleware Stack                 │
│  - Route Handlers                   │
│  - Error Handling                   │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│         Services Layer              │
│  - Business Logic                   │
│  - Validation Rules                 │
│  - Data Processing                  │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│         Repository Layer            │
│  - Data Access                      │
│  - Database Queries                 │
│  - Data Mapping                     │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│         Database Layer              │
│  - SQLite Database                  │
│  - Schema Management                │
│  - Connection Handling              │
└─────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────┐
│         React Components            │
│  - UI Components                    │
│  - Form Handling                    │
│  - State Management                 │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│         Custom Hooks                │
│  - API Operations                   │
│  - State Management                 │
│  - Error Handling                   │
└─────────────────────────────────────┘
                    │
┌─────────────────────────────────────┐
│         API Client                  │
│  - HTTP Requests                    │
│  - Response Handling                │
│  - Error Management                 │
└─────────────────────────────────────┘
```

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Environment Setup

1. **Clone and Install:**

   ```bash
   git clone <repository-url>
   cd order-management-system
   npm run install:all
   ```

2. **Environment Configuration:**

   ```bash
   # Backend environment
   cp backend/.env.example backend/.env

   # Frontend environment
   cp frontend/.env.example frontend/.env
   ```

3. **Initialize Database:**

   ```bash
   npm run db:init
   ```

4. **Start Development:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── config/              # Configuration management
│   │   └── index.ts         # Centralized config
│   ├── middleware/          # Express middleware
│   │   ├── validation.ts    # Input validation
│   │   ├── errorHandler.ts  # Error handling
│   │   └── logger.ts        # Logging utilities
│   ├── routes/              # API routes
│   │   ├── orders.ts        # Order endpoints
│   │   └── masters.ts       # Master endpoints
│   ├── lib/                 # Business logic
│   │   ├── services/        # Service layer
│   │   └── repositories/    # Data access layer
│   ├── database.ts          # Database setup
│   ├── types.ts             # TypeScript types
│   └── server.ts            # Express server
├── __tests__/               # Unit tests
├── scripts/                 # Database scripts
└── .env                     # Environment variables
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── OrderForm.tsx    # Order creation form
│   │   ├── MastersList.tsx  # Masters display
│   │   ├── OrdersTable.tsx  # Orders table
│   │   ├── OrderDetails.tsx # Order details view
│   │   └── Alert.tsx        # Alert component
│   ├── hooks/               # Custom hooks
│   │   └── useApi.ts        # API operations hooks
│   ├── services/            # API client
│   │   └── api.ts           # HTTP client
│   ├── App.tsx              # Main app component
│   ├── types.ts             # TypeScript types
│   └── index.css            # Global styles
└── .env                     # Environment variables
```

## 🎯 Development Patterns

### Backend Patterns

#### 1. **Middleware Pattern**

```typescript
// Validation middleware
export function validateCreateOrder(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Validation logic
  if (errors.length > 0) {
    res.status(400).json({ error: "Validation failed", details: errors });
    return;
  }
  next();
}

// Usage in routes
router.post(
  "/",
  validateCreateOrder,
  asyncHandler(async (req, res) => {
    // Route handler
  })
);
```

#### 2. **Service Layer Pattern**

```typescript
export class OrderService {
  createOrder(data: CreateOrderRequest): Order {
    // Business logic
    return orderRepository.create(data);
  }
}
```

#### 3. **Repository Pattern**

```typescript
export class OrderRepository {
  create(data: CreateOrderRequest): Order {
    // Database operations
    const result = db.prepare(/* SQL */).run(/* params */);
    return this.findById(result.lastInsertRowid as number)!;
  }
}
```

### Frontend Patterns

#### 1. **Custom Hooks Pattern**

```typescript
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiClient.getOrders();
      setOrders(result);
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, loading, loadOrders };
}
```

#### 2. **Component Composition Pattern**

```typescript
// Parent component
function App() {
  return (
    <div>
      <OrderForm onSubmit={handleCreateOrder} />
      <OrdersTable orders={orders} onViewOrder={handleViewOrder} />
    </div>
  );
}

// Child component
interface OrderFormProps {
  onSubmit: (data: any) => Promise<void>;
}
export const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  // Component logic
};
```

## 🔍 Code Quality Standards

### TypeScript

- **Strict Mode**: All TypeScript files use strict mode
- **Type Safety**: No `any` types except in specific cases
- **Interface Definitions**: All data structures have interfaces
- **Generic Types**: Use generics for reusable components

### Error Handling

- **Consistent Error Responses**: All errors follow the same format
- **Proper HTTP Status Codes**: Use appropriate status codes
- **Error Logging**: Log all errors with context
- **User-Friendly Messages**: Provide clear error messages

### Code Organization

- **Single Responsibility**: Each function/class has one responsibility
- **Separation of Concerns**: Clear separation between layers
- **DRY Principle**: Don't repeat yourself
- **Consistent Naming**: Use consistent naming conventions

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```typescript
describe("OrderService", () => {
  describe("createOrder", () => {
    it("should create order with valid data", () => {
      // Test implementation
    });

    it("should throw error with invalid data", () => {
      // Test implementation
    });
  });
});
```

## 🚀 Adding New Features

### Backend Feature

1. **Add Types:**

   ```typescript
   // types.ts
   export interface NewFeature {
     id: number;
     name: string;
   }
   ```

2. **Create Repository:**

   ```typescript
   // repositories/newFeatureRepository.ts
   export class NewFeatureRepository {
     create(data: CreateNewFeatureRequest): NewFeature {
       // Implementation
     }
   }
   ```

3. **Create Service:**

   ```typescript
   // services/newFeatureService.ts
   export class NewFeatureService {
     createNewFeature(data: CreateNewFeatureRequest): NewFeature {
       return newFeatureRepository.create(data);
     }
   }
   ```

4. **Add Routes:**
   ```typescript
   // routes/newFeature.ts
   router.post(
     "/",
     validateCreateNewFeature,
     asyncHandler(async (req, res) => {
       const result = newFeatureService.createNewFeature(req.body);
       res.status(201).json(result);
     })
   );
   ```

### Frontend Feature

1. **Add Types:**

   ```typescript
   // types.ts
   export interface NewFeature {
     id: number;
     name: string;
   }
   ```

2. **Update API Client:**

   ```typescript
   // services/api.ts
   async createNewFeature(data: CreateNewFeatureRequest): Promise<NewFeature> {
     return this.request<NewFeature>("/new-features", {
       method: "POST",
       body: JSON.stringify(data),
     });
   }
   ```

3. **Create Hook:**

   ```typescript
   // hooks/useApi.ts
   export function useNewFeatures() {
     const { loading, error, execute } = useApi();
     const [features, setFeatures] = useState<NewFeature[]>([]);

     const createFeature = useCallback(
       async (data: any) => {
         return execute(() => apiClient.createNewFeature(data));
       },
       [execute]
     );

     return { features, loading, error, createFeature };
   }
   ```

4. **Create Component:**

   ```typescript
   // components/NewFeatureForm.tsx
   interface NewFeatureFormProps {
     onSubmit: (data: any) => Promise<void>;
   }

   export const NewFeatureForm: React.FC<NewFeatureFormProps> = ({
     onSubmit,
   }) => {
     // Component implementation
   };
   ```

## 🐛 Debugging

### Backend Debugging

1. **Enable Debug Logging:**

   ```bash
   LOG_LEVEL=debug npm run dev
   ```

2. **Check Logs:**

   - Request/response logs
   - Error logs with stack traces
   - Database query logs

3. **Database Debugging:**

   ```bash
   # Open database
   sqlite3 backend/data/orders.db

   # Check tables
   .tables

   # Check data
   SELECT * FROM orders;
   ```

### Frontend Debugging

1. **Browser DevTools:**

   - Network tab for API calls
   - Console for errors
   - React DevTools for component state

2. **API Debugging:**
   - Check network requests
   - Verify request/response data
   - Check for CORS issues

## 📚 Best Practices

### Backend Best Practices

1. **Always validate input** using middleware
2. **Use proper HTTP status codes**
3. **Log all important operations**
4. **Handle errors gracefully**
5. **Use transactions for database operations**
6. **Keep services pure** (no side effects)

### Frontend Best Practices

1. **Use TypeScript** for type safety
2. **Keep components small** and focused
3. **Use custom hooks** for reusable logic
4. **Handle loading and error states**
5. **Validate forms** before submission
6. **Use proper event handling**

### General Best Practices

1. **Write tests** for new features
2. **Document your code** with comments
3. **Follow consistent naming** conventions
4. **Keep functions small** and focused
5. **Use meaningful variable names**
6. **Review code** before merging

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use:**

   ```bash
   # Change port in .env
   PORT=3002
   ```

2. **Database Locked:**

   ```bash
   # Restart the application
   npm run dev
   ```

3. **CORS Issues:**

   ```bash
   # Check CORS_ORIGIN in backend/.env
   CORS_ORIGIN=http://localhost:3000
   ```

4. **TypeScript Errors:**
   ```bash
   # Check types and rebuild
   npm run build
   ```

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Jest Testing Framework](https://jestjs.io/)

---

**Happy coding! 🚀**
