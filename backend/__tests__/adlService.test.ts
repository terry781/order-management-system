import { ADLService } from '../src/lib/services/adlService';
import { AttachADLRequest } from '../src/types';

const adlService = new ADLService();

describe('ADLService', () => {
  describe('validateADLData', () => {
    test('should validate correct ADL data', () => {
      const validADL: AttachADLRequest = {
        type: 'photo',
        url: 'https://example.com/photo.jpg',
        gps: { lat: 40.7128, lng: -74.0060 },
        capturedAt: new Date().toISOString()
      };

      const result = adlService.validateADLData(validADL);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should reject ADL without GPS coordinates', () => {
      const invalidADL: any = {
        type: 'photo',
        url: 'https://example.com/photo.jpg',
        gps: {},
        capturedAt: new Date().toISOString()
      };

      const result = adlService.validateADLData(invalidADL);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('GPS coordinates');
    });

    test('should reject ADL without timestamp', () => {
      const invalidADL: any = {
        type: 'photo',
        url: 'https://example.com/photo.jpg',
        gps: { lat: 40.7128, lng: -74.0060 },
        capturedAt: ''
      };

      const result = adlService.validateADLData(invalidADL);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('timestamp');
    });

    test('should reject ADL with invalid timestamp format', () => {
      const invalidADL: AttachADLRequest = {
        type: 'photo',
        url: 'https://example.com/photo.jpg',
        gps: { lat: 40.7128, lng: -74.0060 },
        capturedAt: 'not-a-date'
      };

      const result = adlService.validateADLData(invalidADL);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('ISO timestamp');
    });

    test('should reject ADL with invalid type', () => {
      const invalidADL: any = {
        type: 'invalid-type',
        url: 'https://example.com/photo.jpg',
        gps: { lat: 40.7128, lng: -74.0060 },
        capturedAt: new Date().toISOString()
      };

      const result = adlService.validateADLData(invalidADL);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('type must be');
    });

    test('should reject ADL without URL', () => {
      const invalidADL: any = {
        type: 'photo',
        url: '',
        gps: { lat: 40.7128, lng: -74.0060 },
        capturedAt: new Date().toISOString()
      };

      const result = adlService.validateADLData(invalidADL);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('url');
    });
  });
});

