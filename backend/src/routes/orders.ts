import express from "express";
import { orderService } from "../lib/services/orderService";
import { adlService } from "../lib/services/adlService";
import { validateCreateOrder, validateAttachADL, validateIdParam } from "../middleware/validation";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { Logger } from "../middleware/logger";

const router = express.Router();

/**
 * GET /api/orders - Get all orders
 */
router.get("/", asyncHandler(async (req: any, res: any) => {
  Logger.debug("Fetching all orders");
  const orders = orderService.getAllOrders();
  res.json(orders);
}));

/**
 * POST /api/orders - Create new order
 */
router.post("/", validateCreateOrder, asyncHandler(async (req: any, res: any) => {
  Logger.debug("Creating new order", req.body);
  const order = orderService.createOrder(req.body);
  Logger.info(`Order created with ID: ${order.id}`);
  res.status(201).json(order);
}));

/**
 * GET /api/orders/:id - Get order details
 */
router.get("/:id", validateIdParam, asyncHandler(async (req: any, res: any) => {
  const orderId = parseInt(req.params.id);
  Logger.debug(`Fetching order details for ID: ${orderId}`);
  
  const order = orderService.getOrderWithDetails(orderId);
  
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  
  res.json(order);
}));

/**
 * POST /api/orders/:id/assign - Assign master to order
 */
router.post("/:id/assign", validateIdParam, asyncHandler(async (req: any, res: any) => {
  const orderId = parseInt(req.params.id);
  Logger.debug(`Assigning master to order ID: ${orderId}`);
  
  const result = orderService.assignMaster(orderId);
  
  if (!result.success) {
    throw new AppError(result.error || "Failed to assign master", 400);
  }
  
  Logger.info(`Master ${result.master?.name} assigned to order ${orderId}`);
  res.json({
    message: "Master assigned successfully",
    master: result.master,
  });
}));

/**
 * POST /api/orders/:id/adl - Attach ADL media to order
 */
router.post("/:id/adl", validateIdParam, validateAttachADL, asyncHandler(async (req: any, res: any) => {
  const orderId = parseInt(req.params.id);
  Logger.debug(`Attaching ADL to order ID: ${orderId}`, req.body);
  
  const adl = adlService.attachADL(orderId, req.body);
  Logger.info(`ADL attached to order ${orderId} with ID: ${adl.id}`);
  res.status(201).json(adl);
}));

/**
 * POST /api/orders/:id/complete - Complete order (requires ADL)
 */
router.post("/:id/complete", validateIdParam, asyncHandler(async (req: any, res: any) => {
  const orderId = parseInt(req.params.id);
  Logger.debug(`Completing order ID: ${orderId}`);
  
  const result = orderService.completeOrder(orderId);
  
  if (!result.success) {
    throw new AppError(result.error || "Failed to complete order", 400);
  }
  
  Logger.info(`Order ${orderId} completed successfully`);
  res.json({ message: "Order completed successfully" });
}));

export default router;

