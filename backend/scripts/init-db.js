// Script to initialize and seed the database
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "..", "data", "orders.db");
const dataDir = path.join(__dirname, "..", "data");

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Remove existing database
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("Removed existing database");
}

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

console.log("Initializing database...");

// Create tables
db.exec(`
  CREATE TABLE masters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rating REAL NOT NULL CHECK(rating >= 0 AND rating <= 5),
    isAvailable INTEGER NOT NULL DEFAULT 1,
    lat REAL NOT NULL,
    lng REAL NOT NULL
  )
`);

db.exec(`
  CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('new', 'assigned', 'inprogress', 'completed', 'rejected')),
    customerName TEXT,
    customerPhone TEXT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    assignedMasterId INTEGER,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (assignedMasterId) REFERENCES masters(id)
  )
`);

db.exec(`
  CREATE TABLE adl_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('photo', 'video')),
    url TEXT NOT NULL,
    gpsLat REAL NOT NULL,
    gpsLng REAL NOT NULL,
    capturedAt TEXT NOT NULL,
    meta TEXT,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
  )
`);

console.log("Tables created successfully");

// Seed masters
const insertMaster = db.prepare(`
  INSERT INTO masters (name, rating, isAvailable, lat, lng)
  VALUES (?, ?, ?, ?, ?)
`);

const masters = [
  {
    name: "John Smith",
    rating: 4.8,
    isAvailable: 1,
    lat: 40.7128,
    lng: -74.006,
  }, // NYC
  {
    name: "Maria Garcia",
    rating: 4.9,
    isAvailable: 1,
    lat: 40.758,
    lng: -73.9855,
  }, // Times Square
  {
    name: "Ahmed Hassan",
    rating: 4.5,
    isAvailable: 1,
    lat: 40.7489,
    lng: -73.968,
  }, // Queens
  { name: "Li Wei", rating: 4.7, isAvailable: 1, lat: 40.7061, lng: -74.0087 }, // Wall Street
  {
    name: "Sarah Johnson",
    rating: 5.0,
    isAvailable: 1,
    lat: 40.7589,
    lng: -73.9851,
  }, // Midtown
];

const insertMany = db.transaction((masters) => {
  for (const master of masters) {
    insertMaster.run(
      master.name,
      master.rating,
      master.isAvailable,
      master.lat,
      master.lng
    );
  }
});

insertMany(masters);
console.log(`Seeded ${masters.length} masters`);

// Create a sample order
const now = new Date().toISOString();
db.prepare(
  `
  INSERT INTO orders (title, description, status, customerName, customerPhone, lat, lng, assignedMasterId, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`
).run(
  "Fix plumbing issue",
  "Kitchen sink is leaking, needs urgent repair",
  "new",
  "Jane Doe",
  "+1-555-0123",
  40.758,
  -73.9855,
  null,
  now,
  now
);

console.log("Seeded 1 sample order");

db.close();
console.log("Database initialized successfully!");
