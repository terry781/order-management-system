import db from '../../database';
import { ADLMedia, AttachADLRequest } from '../types';

export class ADLRepository {
  create(orderId: number, data: AttachADLRequest): ADLMedia {
    const result = db.prepare(`
      INSERT INTO adl_media (orderId, type, url, gpsLat, gpsLng, capturedAt, meta)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      data.type,
      data.url,
      data.gps.lat,
      data.gps.lng,
      data.capturedAt,
      JSON.stringify(data.meta || {})
    );

    return this.findById(result.lastInsertRowid as number)!;
  }

  findById(id: number): ADLMedia | null {
    const row = db.prepare(`
      SELECT id, orderId, type, url, gpsLat, gpsLng, capturedAt, meta
      FROM adl_media
      WHERE id = ?
    `).get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      orderId: row.orderId,
      type: row.type,
      url: row.url,
      gps: { lat: row.gpsLat, lng: row.gpsLng },
      capturedAt: row.capturedAt,
      meta: JSON.parse(row.meta || '{}')
    };
  }

  findByOrderId(orderId: number): ADLMedia[] {
    const rows = db.prepare(`
      SELECT id, orderId, type, url, gpsLat, gpsLng, capturedAt, meta
      FROM adl_media
      WHERE orderId = ?
    `).all(orderId) as any[];

    return rows.map(row => ({
      id: row.id,
      orderId: row.orderId,
      type: row.type,
      url: row.url,
      gps: { lat: row.gpsLat, lng: row.gpsLng },
      capturedAt: row.capturedAt,
      meta: JSON.parse(row.meta || '{}')
    }));
  }

  hasValidADL(orderId: number): boolean {
    const row = db.prepare(`
      SELECT COUNT(*) as count
      FROM adl_media
      WHERE orderId = ? 
        AND type = 'photo'
        AND gpsLat IS NOT NULL 
        AND gpsLng IS NOT NULL 
        AND capturedAt IS NOT NULL
    `).get(orderId) as { count: number };

    return row.count > 0;
  }
}

export const adlRepository = new ADLRepository();

