import express from "express";
import { masterRepository } from "../lib/repositories/masterRepository";
import { asyncHandler } from "../middleware/errorHandler";
import { Logger } from "../middleware/logger";

const router = express.Router();

/**
 * @swagger
 * /masters:
 *   get:
 *     summary: Get all masters with load information
 *     description: Retrieve a list of all masters with their current load and availability status
 *     tags: [Masters]
 *     responses:
 *       200:
 *         description: List of masters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Master'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", asyncHandler(async (req: any, res: any) => {
  Logger.debug("Fetching all masters with load information");
  const masters = masterRepository.getAllWithLoad();
  res.json(masters);
}));

export default router;

