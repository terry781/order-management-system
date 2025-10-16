import { ADLMedia, AttachADLRequest } from '../types';
import { adlRepository } from '../repositories/adlRepository';

export class ADLService {
  /**
   * Validates that ADL data has required fields for GPS and timestamp
   */
  validateADLData(data: AttachADLRequest): { valid: boolean; error?: string } {
    if (!data.gps || typeof data.gps.lat !== 'number' || typeof data.gps.lng !== 'number') {
      return { valid: false, error: 'GPS coordinates (lat, lng) are required' };
    }

    if (!data.capturedAt) {
      return { valid: false, error: 'Captured timestamp (capturedAt) is required' };
    }

    // Validate ISO format
    try {
      const date = new Date(data.capturedAt);
      if (isNaN(date.getTime())) {
        return { valid: false, error: 'capturedAt must be a valid ISO timestamp' };
      }
    } catch (e) {
      return { valid: false, error: 'capturedAt must be a valid ISO timestamp' };
    }

    if (!['photo', 'video'].includes(data.type)) {
      return { valid: false, error: 'type must be either "photo" or "video"' };
    }

    if (!data.url || typeof data.url !== 'string') {
      return { valid: false, error: 'url is required' };
    }

    return { valid: true };
  }

  /**
   * Attach ADL media to an order
   */
  attachADL(orderId: number, data: AttachADLRequest): ADLMedia {
    return adlRepository.create(orderId, data);
  }

  /**
   * Check if an order has valid ADL (at least one photo with GPS + timestamp)
   */
  hasValidADL(orderId: number): boolean {
    return adlRepository.hasValidADL(orderId);
  }

  /**
   * Get all ADL media for an order
   */
  getOrderADL(orderId: number): ADLMedia[] {
    return adlRepository.findByOrderId(orderId);
  }
}

export const adlService = new ADLService();

