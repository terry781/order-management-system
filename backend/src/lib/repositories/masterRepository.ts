import db from '../../database';
import { Master, MasterWithLoad } from '../types';

export class MasterRepository {
  findById(id: number): Master | null {
    const row = db.prepare(`
      SELECT id, name, rating, isAvailable, lat, lng
      FROM masters
      WHERE id = ?
    `).get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      rating: row.rating,
      isAvailable: row.isAvailable === 1,
      geo: { lat: row.lat, lng: row.lng }
    };
  }

  findAllAvailable(): Master[] {
    const rows = db.prepare(`
      SELECT id, name, rating, isAvailable, lat, lng
      FROM masters
      WHERE isAvailable = 1
    `).all() as any[];

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      isAvailable: row.isAvailable === 1,
      geo: { lat: row.lat, lng: row.lng }
    }));
  }

  findAll(): Master[] {
    const rows = db.prepare(`
      SELECT id, name, rating, isAvailable, lat, lng
      FROM masters
    `).all() as any[];

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      isAvailable: row.isAvailable === 1,
      geo: { lat: row.lat, lng: row.lng }
    }));
  }

  getAllWithLoad(): MasterWithLoad[] {
    const rows = db.prepare(`
      SELECT 
        m.id, m.name, m.rating, m.isAvailable, m.lat, m.lng,
        COUNT(o.id) as activeOrders
      FROM masters m
      LEFT JOIN orders o ON m.id = o.assignedMasterId 
        AND o.status IN ('assigned', 'inprogress')
      GROUP BY m.id
    `).all() as any[];

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      isAvailable: row.isAvailable === 1,
      geo: { lat: row.lat, lng: row.lng },
      activeOrders: row.activeOrders
    }));
  }

  getActiveOrderCount(masterId: number): number {
    const result = db.prepare(`
      SELECT COUNT(*) as count
      FROM orders
      WHERE assignedMasterId = ? AND status IN ('assigned', 'inprogress')
    `).get(masterId) as { count: number };

    return result.count;
  }
}

export const masterRepository = new MasterRepository();

