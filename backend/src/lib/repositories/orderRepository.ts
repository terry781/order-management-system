import db from '../../database';
import { Order, CreateOrderRequest, OrderStatus } from '../types';

export class OrderRepository {
  create(data: CreateOrderRequest): Order {
    const now = new Date().toISOString();
    const result = db.prepare(`
      INSERT INTO orders (title, description, status, customerName, customerPhone, lat, lng, assignedMasterId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.title,
      data.description,
      'new',
      data.customerName || null,
      data.customerPhone || null,
      data.geo.lat,
      data.geo.lng,
      null,
      now,
      now
    );

    return this.findById(result.lastInsertRowid as number)!;
  }

  findById(id: number): Order | null {
    const row = db.prepare(`
      SELECT id, title, description, status, customerName, customerPhone, 
             lat, lng, assignedMasterId, createdAt, updatedAt
      FROM orders
      WHERE id = ?
    `).get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      geo: { lat: row.lat, lng: row.lng },
      assignedMasterId: row.assignedMasterId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  findAll(): Order[] {
    const rows = db.prepare(`
      SELECT id, title, description, status, customerName, customerPhone, 
             lat, lng, assignedMasterId, createdAt, updatedAt
      FROM orders
      ORDER BY createdAt DESC
    `).all() as any[];

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      customerName: row.customerName,
      customerPhone: row.customerPhone,
      geo: { lat: row.lat, lng: row.lng },
      assignedMasterId: row.assignedMasterId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  }

  updateStatus(id: number, status: OrderStatus): boolean {
    const now = new Date().toISOString();
    const result = db.prepare(`
      UPDATE orders
      SET status = ?, updatedAt = ?
      WHERE id = ?
    `).run(status, now, id);

    return result.changes > 0;
  }

  assignMaster(orderId: number, masterId: number): boolean {
    const now = new Date().toISOString();
    const result = db.prepare(`
      UPDATE orders
      SET assignedMasterId = ?, status = 'assigned', updatedAt = ?
      WHERE id = ?
    `).run(masterId, now, orderId);

    return result.changes > 0;
  }
}

export const orderRepository = new OrderRepository();

