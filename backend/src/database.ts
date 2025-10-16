import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Configuration
const DB_PATH = path.join(__dirname, "..", "data", "orders.db");
const DATA_DIR = path.join(__dirname, "..", "data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Create database connection
const db = new Database(DB_PATH);

// Enable foreign keys and optimize settings
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");

// Database schema definitions
const SCHEMAS = {
  masters: `
    CREATE TABLE IF NOT EXISTS masters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rating REAL NOT NULL CHECK(rating >= 0 AND rating <= 5),
      isAvailable INTEGER NOT NULL DEFAULT 1,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
  orders: `
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('new', 'assigned', 'inprogress', 'completed', 'rejected')),
      customerName TEXT,
      customerPhone TEXT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      assignedMasterId INTEGER,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assignedMasterId) REFERENCES masters(id)
    )
  `,
  adl_media: `
    CREATE TABLE IF NOT EXISTS adl_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('photo', 'video')),
      url TEXT NOT NULL,
      gpsLat REAL NOT NULL,
      gpsLng REAL NOT NULL,
      capturedAt TEXT NOT NULL,
      meta TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
    )
  `
};

// Sample data for seeding
const SAMPLE_MASTERS = [
  { name: "John Smith", rating: 4.8, isAvailable: 1, lat: 40.7128, lng: -74.006 },
  { name: "Maria Garcia", rating: 4.9, isAvailable: 1, lat: 40.758, lng: -73.9855 },
  { name: "Ahmed Hassan", rating: 4.5, isAvailable: 1, lat: 40.7489, lng: -73.968 },
  { name: "Li Wei", rating: 4.7, isAvailable: 1, lat: 40.7061, lng: -74.0087 },
  { name: "Sarah Johnson", rating: 5.0, isAvailable: 1, lat: 40.7589, lng: -73.9851 },
];

/**
 * Initialize database schema
 */
export function initDatabase(): void {
  try {
    // Create tables
    Object.values(SCHEMAS).forEach(schema => {
      db.exec(schema);
    });

    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize database schema:", error);
    throw error;
  }
}

/**
 * Seed database with sample data
 */
export function seedDatabase(): void {
  try {
    const masterCount = db
      .prepare("SELECT COUNT(*) as count FROM masters")
      .get() as { count: number };

    if (masterCount.count === 0) {
      const insertMaster = db.prepare(`
        INSERT INTO masters (name, rating, isAvailable, lat, lng)
        VALUES (?, ?, ?, ?, ?)
      `);

      const insertMany = db.transaction((masters: typeof SAMPLE_MASTERS) => {
        for (const master of masters) {
          insertMaster.run(master.name, master.rating, master.isAvailable, master.lat, master.lng);
        }
      });

      insertMany(SAMPLE_MASTERS);
      console.log(`✅ Database seeded with ${SAMPLE_MASTERS.length} sample masters`);
    }
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
    throw error;
  }
}

/**
 * Get database connection
 */
export function getDatabase(): Database.Database {
  return db;
}

/**
 * Close database connection
 */
export function closeDatabase(): void {
  try {
    db.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Failed to close database:", error);
  }
}

// Initialize database on module load
if (process.env.NODE_ENV !== "test") {
  initDatabase();
  seedDatabase();
}

export default db;

