import { Order, OrderWithDetails, CreateOrderRequest, OrderStatus } from '../types';
import { orderRepository } from '../repositories/orderRepository';
import { masterRepository } from '../repositories/masterRepository';
import { adlRepository } from '../repositories/adlRepository';
import { assignmentService } from './assignmentService';
import { adlService } from './adlService';

export class OrderService {
  createOrder(data: CreateOrderRequest): Order {
    return orderRepository.create(data);
  }

  getOrder(id: number): Order | null {
    return orderRepository.findById(id);
  }

  getOrderWithDetails(id: number): OrderWithDetails | null {
    const order = orderRepository.findById(id);
    if (!order) return null;

    const adlMedia = adlRepository.findByOrderId(id);
    const master = order.assignedMasterId 
      ? masterRepository.findById(order.assignedMasterId) 
      : null;

    return {
      ...order,
      master: master || undefined,
      adlMedia
    };
  }

  getAllOrders(): Order[] {
    return orderRepository.findAll();
  }

  assignMaster(orderId: number): { success: boolean; error?: string; master?: any } {
    const order = orderRepository.findById(orderId);
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.status !== 'new') {
      return { success: false, error: 'Order must be in "new" status to assign a master' };
    }

    const master = assignmentService.findBestMaster(order);
    
    if (!master) {
      return { success: false, error: 'No available masters found' };
    }

    const assigned = assignmentService.assignMasterToOrder(orderId, master.id);
    
    if (!assigned) {
      return { success: false, error: 'Failed to assign master' };
    }

    return { success: true, master };
  }

  completeOrder(orderId: number): { success: boolean; error?: string } {
    const order = orderRepository.findById(orderId);
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (!['assigned', 'inprogress'].includes(order.status)) {
      return { success: false, error: 'Order must be assigned or in progress to complete' };
    }

    // Check ADL requirement
    if (!adlService.hasValidADL(orderId)) {
      return { 
        success: false, 
        error: 'Cannot complete order: At least one photo with GPS coordinates and timestamp is required' 
      };
    }

    const updated = orderRepository.updateStatus(orderId, 'completed');
    
    if (!updated) {
      return { success: false, error: 'Failed to update order status' };
    }

    return { success: true };
  }

  updateStatus(orderId: number, status: OrderStatus): { success: boolean; error?: string } {
    const order = orderRepository.findById(orderId);
    
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    const updated = orderRepository.updateStatus(orderId, status);
    
    if (!updated) {
      return { success: false, error: 'Failed to update order status' };
    }

    return { success: true };
  }
}

export const orderService = new OrderService();

