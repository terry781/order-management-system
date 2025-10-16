import { Order, MasterWithLoad, OrderWithDetails, CreateOrderRequest, AttachADLRequest } from "../types";

/**
 * API client for order management system
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  // Orders API
  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>("/orders");
  }

  async getOrder(id: number): Promise<OrderWithDetails> {
    return this.request<OrderWithDetails>(`/orders/${id}`);
  }

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return this.request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async assignMaster(orderId: number): Promise<{ message: string; master: any }> {
    return this.request<{ message: string; master: any }>(`/orders/${orderId}/assign`, {
      method: "POST",
    });
  }

  async attachADL(orderId: number, adlData: AttachADLRequest): Promise<any> {
    return this.request<any>(`/orders/${orderId}/adl`, {
      method: "POST",
      body: JSON.stringify(adlData),
    });
  }

  async completeOrder(orderId: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/orders/${orderId}/complete`, {
      method: "POST",
    });
  }

  // Masters API
  async getMasters(): Promise<MasterWithLoad[]> {
    return this.request<MasterWithLoad[]>("/masters");
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>("/health");
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
