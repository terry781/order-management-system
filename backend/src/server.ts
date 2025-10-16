import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { config } from "./config";
import { requestLogger, Logger } from "./middleware/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import ordersRouter from "./routes/orders";
import mastersRouter from "./routes/masters";

// Load environment variables
dotenv.config();

const app = express();

// Trust proxy for accurate IP addresses
app.set("trust proxy", 1);

// CORS configuration
const corsOptions = {
  origin: config.cors.origin,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
if (config.logging.enabled) {
  app.use(requestLogger);
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Order Management API is running",
    timestamp: new Date().toISOString(),
    version: config.app.version,
    environment: config.app.environment,
  });
});

// API routes
app.use("/api/orders", ordersRouter);
app.use("/api/masters", mastersRouter);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handling middleware
app.use(errorHandler);

// Graceful shutdown handling
process.on("SIGTERM", () => {
  Logger.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  Logger.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

// Start server
const server = app.listen(config.server.port, () => {
  Logger.info(`🚀 Server running on http://localhost:${config.server.port}`);
  Logger.info(`📊 API available at http://localhost:${config.server.port}/api`);
  Logger.info(`🌍 Environment: ${config.app.environment}`);
});

export default app;

