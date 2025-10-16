import { calculateDistance } from '../src/lib/services/distanceService';

describe('DistanceService', () => {
  test('should calculate distance between two points', () => {
    // NYC to Times Square (approximately 5.5 km)
    const point1 = { lat: 40.7128, lng: -74.0060 };
    const point2 = { lat: 40.7580, lng: -73.9855 };

    const distance = calculateDistance(point1, point2);

    // Should be approximately 5.5 km
    expect(distance).toBeGreaterThan(5);
    expect(distance).toBeLessThan(6);
  });

  test('should return 0 for same point', () => {
    const point = { lat: 40.7128, lng: -74.0060 };

    const distance = calculateDistance(point, point);

    expect(distance).toBe(0);
  });

  test('should handle long distances correctly', () => {
    // NYC to London (approximately 5570 km)
    const nyc = { lat: 40.7128, lng: -74.0060 };
    const london = { lat: 51.5074, lng: -0.1278 };

    const distance = calculateDistance(nyc, london);

    // Should be approximately 5570 km
    expect(distance).toBeGreaterThan(5500);
    expect(distance).toBeLessThan(5600);
  });
});

