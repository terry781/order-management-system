import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Application configuration
 */
export const config = {
  app: {
    name: "Order Management System",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
  server: {
    port: parseInt(process.env.PORT || "3001", 10),
    host: process.env.HOST || "localhost",
  },
  database: {
    path: process.env.DATABASE_PATH || "./data/orders.db",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
  logging: {
    enabled: process.env.LOGGING_ENABLED !== "false",
    level: process.env.LOG_LEVEL || "info",
  },
  security: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10), // limit each IP to 100 requests per windowMs
    },
  },
} as const;

/**
 * Validate configuration
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // Validate port
  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push("PORT must be between 1 and 65535");
  }

  // Validate environment
  if (!["development", "production", "test"].includes(config.app.environment)) {
    errors.push("NODE_ENV must be one of: development, production, test");
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join("\n")}`);
  }
}

// Validate configuration on module load
validateConfig();
