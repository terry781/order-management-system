import { useState, useCallback } from "react";
import { apiClient } from "../services/api";
import { Order, MasterWithLoad, OrderWithDetails } from "../types";

/**
 * Custom hook for API operations with loading states
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    execute,
    clearError: () => setError(null),
  };
}

/**
 * Custom hook for orders management
 */
export function useOrders() {
  const { loading, error, execute, clearError } = useApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);

  const loadOrders = useCallback(async () => {
    const result = await execute(() => apiClient.getOrders());
    if (result) {
      setOrders(result);
    }
    return result;
  }, [execute]);

  const loadOrderDetails = useCallback(async (orderId: number) => {
    const result = await execute(() => apiClient.getOrder(orderId));
    if (result) {
      setSelectedOrder(result);
    }
    return result;
  }, [execute]);

  const createOrder = useCallback(async (orderData: any) => {
    const result = await execute(() => apiClient.createOrder(orderData));
    if (result) {
      await loadOrders(); // Refresh orders list
    }
    return result;
  }, [execute, loadOrders]);

  const assignMaster = useCallback(async (orderId: number) => {
    const result = await execute(() => apiClient.assignMaster(orderId));
    if (result) {
      await loadOrders(); // Refresh orders list
      if (selectedOrder?.id === orderId) {
        await loadOrderDetails(orderId); // Refresh selected order
      }
    }
    return result;
  }, [execute, loadOrders, loadOrderDetails, selectedOrder]);

  const attachADL = useCallback(async (orderId: number, adlData: any) => {
    const result = await execute(() => apiClient.attachADL(orderId, adlData));
    if (result && selectedOrder?.id === orderId) {
      await loadOrderDetails(orderId); // Refresh selected order
    }
    return result;
  }, [execute, loadOrderDetails, selectedOrder]);

  const completeOrder = useCallback(async (orderId: number) => {
    const result = await execute(() => apiClient.completeOrder(orderId));
    if (result) {
      await loadOrders(); // Refresh orders list
      if (selectedOrder?.id === orderId) {
        await loadOrderDetails(orderId); // Refresh selected order
      }
    }
    return result;
  }, [execute, loadOrders, loadOrderDetails, selectedOrder]);

  return {
    orders,
    selectedOrder,
    loading,
    error,
    loadOrders,
    loadOrderDetails,
    createOrder,
    assignMaster,
    attachADL,
    completeOrder,
    clearError,
  };
}

/**
 * Custom hook for masters management
 */
export function useMasters() {
  const { loading, error, execute, clearError } = useApi();
  const [masters, setMasters] = useState<MasterWithLoad[]>([]);

  const loadMasters = useCallback(async () => {
    const result = await execute(() => apiClient.getMasters());
    if (result) {
      setMasters(result);
    }
    return result;
  }, [execute]);

  return {
    masters,
    loading,
    error,
    loadMasters,
    clearError,
  };
}
