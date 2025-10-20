import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { config } from "./config";
import { swaggerSpec } from "./config/swagger";
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

// Serve static files (including OpenAPI JSON)
app.use('/api-docs', express.static(path.join(__dirname, '..', 'public')));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Order Management API Documentation',
}));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
if (config.logging.enabled) {
  app.use(requestLogger);
}

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current status of the API server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Order Management API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2023-12-01T10:00:00Z
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 environment:
 *                   type: string
 *                   example: development
 */
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
  Logger.info(`📚 API Documentation: http://localhost:${config.server.port}/api-docs`);
  Logger.info(`📄 OpenAPI JSON: http://localhost:${config.server.port}/api-docs/openapi.json`);
  Logger.info(`🌍 Environment: ${config.app.environment}`);
});

export default app;

