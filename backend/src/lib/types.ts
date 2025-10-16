// Type definitions for the application

export interface Geo {
  lat: number;
  lng: number;
}

export type OrderStatus = 'new' | 'assigned' | 'inprogress' | 'completed' | 'rejected';
export type ADLMediaType = 'photo' | 'video';

export interface Master {
  id: number;
  name: string;
  rating: number; // 0-5
  isAvailable: boolean;
  geo: Geo;
}

export interface Order {
  id: number;
  title: string;
  description: string;
  status: OrderStatus;
  customerName?: string;
  customerPhone?: string;
  geo: Geo;
  assignedMasterId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ADLMedia {
  id: number;
  orderId: number;
  type: ADLMediaType;
  url: string;
  gps: Geo;
  capturedAt: string; // ISO timestamp
  meta: Record<string, any>;
}

// DTOs for API requests
export interface CreateOrderRequest {
  title: string;
  description: string;
  customerName?: string;
  customerPhone?: string;
  geo: Geo;
}

export interface AttachADLRequest {
  type: ADLMediaType;
  url: string;
  gps: Geo;
  capturedAt: string;
  meta?: Record<string, any>;
}

// Response types
export interface OrderWithDetails extends Order {
  master?: Master;
  adlMedia: ADLMedia[];
}

export interface MasterWithLoad extends Master {
  activeOrders: number;
}

