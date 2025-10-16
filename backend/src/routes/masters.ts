import express from "express";
import { masterRepository } from "../lib/repositories/masterRepository";
import { asyncHandler } from "../middleware/errorHandler";
import { Logger } from "../middleware/logger";

const router = express.Router();

/**
 * GET /api/masters - Get all masters with load information
 */
router.get("/", asyncHandler(async (req: any, res: any) => {
  Logger.debug("Fetching all masters with load information");
  const masters = masterRepository.getAllWithLoad();
  res.json(masters);
}));

export default router;

