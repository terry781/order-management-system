import { Master, Order } from '../types';
import { masterRepository } from '../repositories/masterRepository';
import { calculateDistance } from './distanceService';

/**
 * Assignment rule:
 * 1. Nearest available master
 * 2. Tie-break by higher rating
 * 3. Then by lower active load
 */
export class AssignmentService {
  findBestMaster(order: Order): Master | null {
    const availableMasters = masterRepository.findAllAvailable();

    if (availableMasters.length === 0) {
      return null;
    }

    // Calculate distance and load for each master
    const mastersWithMetrics = availableMasters.map(master => ({
      master,
      distance: calculateDistance(order.geo, master.geo),
      activeLoad: masterRepository.getActiveOrderCount(master.id)
    }));

    // Sort by:
    // 1. Distance (ascending)
    // 2. Rating (descending)
    // 3. Active load (ascending)
    mastersWithMetrics.sort((a, b) => {
      // Compare distance first (lower is better)
      const distanceDiff = a.distance - b.distance;
      if (Math.abs(distanceDiff) > 0.001) { // Use small epsilon for float comparison
        return distanceDiff;
      }

      // If distance is similar, compare rating (higher is better)
      const ratingDiff = b.master.rating - a.master.rating;
      if (Math.abs(ratingDiff) > 0.001) {
        return ratingDiff;
      }

      // If rating is similar, compare active load (lower is better)
      return a.activeLoad - b.activeLoad;
    });

    return mastersWithMetrics[0].master;
  }

  assignMasterToOrder(orderId: number, masterId: number): boolean {
    // Import here to avoid circular dependency
    const { orderRepository } = require('../repositories/orderRepository');
    return orderRepository.assignMaster(orderId, masterId);
  }
}

export const assignmentService = new AssignmentService();

