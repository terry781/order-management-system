import { AssignmentService } from '../src/lib/services/assignmentService';
import { Master, Order } from '../src/types';

// Mock the masterRepository
jest.mock('../src/lib/repositories/masterRepository', () => ({
  masterRepository: {
    findAllAvailable: jest.fn(),
    getActiveOrderCount: jest.fn()
  }
}));

const { masterRepository } = require('../src/lib/repositories/masterRepository');
const assignmentService = new AssignmentService();

describe('AssignmentService', () => {
  const mockOrder: Order = {
    id: 1,
    title: 'Test Order',
    description: 'Test',
    status: 'new',
    geo: { lat: 40.7128, lng: -74.0060 },
    assignedMasterId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should assign nearest master when all else equal', () => {
    const masters: Master[] = [
      { id: 1, name: 'Far Master', rating: 4.5, isAvailable: true, geo: { lat: 41.0, lng: -75.0 } },
      { id: 2, name: 'Near Master', rating: 4.5, isAvailable: true, geo: { lat: 40.7130, lng: -74.0062 } }
    ];

    masterRepository.findAllAvailable.mockReturnValue(masters);
    masterRepository.getActiveOrderCount.mockReturnValue(0);

    const result = assignmentService.findBestMaster(mockOrder);

    expect(result).toBeDefined();
    expect(result?.name).toBe('Near Master');
  });

  test('should tie-break by higher rating when distance is similar', () => {
    const masters: Master[] = [
      { id: 1, name: 'Lower Rating', rating: 4.0, isAvailable: true, geo: { lat: 40.7128, lng: -74.0060 } },
      { id: 2, name: 'Higher Rating', rating: 5.0, isAvailable: true, geo: { lat: 40.7128, lng: -74.0060 } }
    ];

    masterRepository.findAllAvailable.mockReturnValue(masters);
    masterRepository.getActiveOrderCount.mockReturnValue(0);

    const result = assignmentService.findBestMaster(mockOrder);

    expect(result).toBeDefined();
    expect(result?.name).toBe('Higher Rating');
  });

  test('should tie-break by lower active load when distance and rating are similar', () => {
    const masters: Master[] = [
      { id: 1, name: 'Busy Master', rating: 4.5, isAvailable: true, geo: { lat: 40.7128, lng: -74.0060 } },
      { id: 2, name: 'Free Master', rating: 4.5, isAvailable: true, geo: { lat: 40.7128, lng: -74.0060 } }
    ];

    masterRepository.findAllAvailable.mockReturnValue(masters);
    masterRepository.getActiveOrderCount.mockImplementation((id: number) => id === 1 ? 5 : 1);

    const result = assignmentService.findBestMaster(mockOrder);

    expect(result).toBeDefined();
    expect(result?.name).toBe('Free Master');
  });

  test('should return null when no masters available', () => {
    masterRepository.findAllAvailable.mockReturnValue([]);

    const result = assignmentService.findBestMaster(mockOrder);

    expect(result).toBeNull();
  });
});

