import express from "express";
import { orderService } from "../lib/services/orderService";
import { adlService } from "../lib/services/adlService";
import { validateCreateOrder, validateAttachADL, validateIdParam } from "../middleware/validation";
import { asyncHandler, AppError } from "../middleware/errorHandler";
import { Logger } from "../middleware/logger";

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of all orders in the system
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", asyncHandler(async (req: any, res: any) => {
  Logger.debug("Fetching all orders");
  const orders = orderService.getAllOrders();
  res.json(orders);
}));

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Create a new order with customer and delivery information
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/", validateCreateOrder, asyncHandler(async (req: any, res: any) => {
  Logger.debug("Creating new order", req.body);
  const order = orderService.createOrder(req.body);
  Logger.info(`Order created with ID: ${order.id}`);
  res.status(201).json(order);
}));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details
 *     description: Retrieve detailed information about a specific order including assigned master and ADL media
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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
 * @swagger
 * /orders/{id}/assign:
 *   post:
 *     summary: Assign master to order
 *     description: Automatically assign an available master to an order based on location and current load
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Master assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Master assigned successfully
 *                 master:
 *                   $ref: '#/components/schemas/Master'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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
 * @swagger
 * /orders/{id}/adl:
 *   post:
 *     summary: Attach ADL media to order
 *     description: Attach After Delivery Live (ADL) media to an order for delivery confirmation
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttachADLRequest'
 *     responses:
 *       201:
 *         description: ADL media attached successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ADL'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/:id/adl", validateIdParam, validateAttachADL, asyncHandler(async (req: any, res: any) => {
  const orderId = parseInt(req.params.id);
  Logger.debug(`Attaching ADL to order ID: ${orderId}`, req.body);
  
  const adl = adlService.attachADL(orderId, req.body);
  Logger.info(`ADL attached to order ${orderId} with ID: ${adl.id}`);
  res.status(201).json(adl);
}));

/**
 * @swagger
 * /orders/{id}/complete:
 *   post:
 *     summary: Complete order
 *     description: Mark an order as completed. Requires ADL media to be attached first.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Order completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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

