const Database = require('better-sqlite3');
const path = require('path');

// Initialize database
const dbPath = path.join(__dirname, '..', 'data', 'orders.db');
const db = new Database(dbPath);

console.log('🎯 Creating sample test orders for dashboard...\n');

// Sample orders data
const sampleOrders = [
  {
    title: "Kitchen Sink Repair",
    description: "Kitchen sink is leaking under the cabinet. Water pooling on floor.",
    customerName: "Sarah Johnson",
    customerPhone: "+1-555-0101",
    geo: { lat: 40.7589, lng: -73.9851 },
    status: "completed"
  },
  {
    title: "Bathroom Faucet Replacement",
    description: "Old faucet needs replacement. Customer wants modern touchless model.",
    customerName: "Mike Chen",
    customerPhone: "+1-555-0102",
    geo: { lat: 40.7614, lng: -73.9776 },
    status: "inprogress"
  },
  {
    title: "Toilet Installation",
    description: "New toilet installation in master bathroom. Customer purchased toilet already.",
    customerName: "Emily Rodriguez",
    customerPhone: "+1-555-0103",
    geo: { lat: 40.7505, lng: -73.9934 },
    status: "assigned"
  },
  {
    title: "Pipe Burst Emergency",
    description: "Water pipe burst in basement. Urgent repair needed.",
    customerName: "David Thompson",
    customerPhone: "+1-555-0104",
    geo: { lat: 40.7282, lng: -73.7949 },
    status: "new"
  },
  {
    title: "Garbage Disposal Fix",
    description: "Garbage disposal not working. Makes grinding noise but doesn't process food.",
    customerName: "Lisa Wang",
    customerPhone: "+1-555-0105",
    geo: { lat: 40.7831, lng: -73.9712 },
    status: "completed"
  },
  {
    title: "Shower Head Replacement",
    description: "Replace old shower head with new rainfall style. Customer has the new head.",
    customerName: "Robert Brown",
    customerPhone: "+1-555-0106",
    geo: { lat: 40.6892, lng: -73.9442 },
    status: "assigned"
  },
  {
    title: "Water Heater Maintenance",
    description: "Annual water heater maintenance and inspection.",
    customerName: "Jennifer Davis",
    customerPhone: "+1-555-0107",
    geo: { lat: 40.6782, lng: -73.9442 },
    status: "new"
  },
  {
    title: "Drain Cleaning",
    description: "Kitchen drain is slow. Needs professional cleaning.",
    customerName: "Michael Wilson",
    customerPhone: "+1-555-0108",
    geo: { lat: 40.7580, lng: -73.9855 },
    status: "inprogress"
  }
];

// Sample ADL media data (will be updated with actual order IDs)
const sampleADLMedia = [
  {
    orderIndex: 0, // Kitchen Sink Repair (completed)
    type: "photo",
    url: "https://example.com/kitchen-sink-before.jpg",
    gps: { lat: 40.7589, lng: -73.9851 },
    capturedAt: "2025-10-17T09:30:00.000Z",
    meta: { description: "Before repair - water leak visible" }
  },
  {
    orderIndex: 0, // Kitchen Sink Repair (completed)
    type: "photo",
    url: "https://example.com/kitchen-sink-after.jpg",
    gps: { lat: 40.7589, lng: -73.9851 },
    capturedAt: "2025-10-17T11:45:00.000Z",
    meta: { description: "After repair - leak fixed" }
  },
  {
    orderIndex: 4, // Garbage Disposal Fix (completed)
    type: "photo",
    url: "https://example.com/disposal-before.jpg",
    gps: { lat: 40.7831, lng: -73.9712 },
    capturedAt: "2025-10-17T14:20:00.000Z",
    meta: { description: "Broken disposal unit" }
  },
  {
    orderIndex: 4, // Garbage Disposal Fix (completed)
    type: "photo",
    url: "https://example.com/disposal-after.jpg",
    gps: { lat: 40.7831, lng: -73.9712 },
    capturedAt: "2025-10-17T15:30:00.000Z",
    meta: { description: "New disposal installed and working" }
  }
];

// Master assignments (some orders will be assigned to masters)
const masterAssignments = {
  1: 2, // Sarah's order assigned to Maria Garcia
  2: 1, // Mike's order assigned to John Smith
  3: 2, // Emily's order assigned to Maria Garcia
  5: 1, // Lisa's order assigned to John Smith
  6: 2  // Robert's order assigned to Maria Garcia
};

try {
  // Clear existing data
  console.log('🧹 Clearing existing sample data...');
  
  // Get sample order IDs first
  const sampleOrderIds = db.prepare(`
    SELECT id FROM orders 
    WHERE customerPhone LIKE ? OR customerName IN (?, ?, ?, ?, ?, ?, ?, ?)
  `).all('+1-555-01%', 'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Thompson', 
         'Lisa Wang', 'Robert Brown', 'Jennifer Davis', 'Michael Wilson');
  
  if (sampleOrderIds.length > 0) {
    const orderIds = sampleOrderIds.map(row => row.id);
    const placeholders = orderIds.map(() => '?').join(',');
    
    // Delete ADL media first
    db.prepare(`DELETE FROM adl_media WHERE orderId IN (${placeholders})`).run(...orderIds);
    
    // Delete orders
    db.prepare(`DELETE FROM orders WHERE id IN (${placeholders})`).run(...orderIds);
    
    console.log(`  🗑️  Cleared ${orderIds.length} existing sample orders`);
  }

  // Insert sample orders
  console.log('📝 Creating sample orders...');
  const insertOrder = db.prepare(`
    INSERT INTO orders (title, description, status, customerName, customerPhone, lat, lng, assignedMasterId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  const createdOrderIds = [];
  
  for (let i = 0; i < sampleOrders.length; i++) {
    const order = sampleOrders[i];
    const assignedMasterId = masterAssignments[i + 1] || null;
    
    // Create timestamps with some variation
    const createdAt = new Date(Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString();
    const updatedAt = order.status === 'new' ? createdAt : new Date(Date.now() - (Math.random() * 2 * 24 * 60 * 60 * 1000)).toISOString();
    
    const result = insertOrder.run(
      order.title,
      order.description,
      order.status,
      order.customerName,
      order.customerPhone,
      order.geo.lat,
      order.geo.lng,
      assignedMasterId,
      createdAt,
      updatedAt
    );
    
    createdOrderIds.push(result.lastInsertRowid);
    console.log(`  ✅ Created order: "${order.title}" (${order.status}) - ID: ${result.lastInsertRowid}`);
  }

  // Insert sample ADL media
  console.log('\n📸 Creating sample ADL media...');
  const insertADL = db.prepare(`
    INSERT INTO adl_media (orderId, type, url, gpsLat, gpsLng, capturedAt, meta)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const adl of sampleADLMedia) {
    const actualOrderId = createdOrderIds[adl.orderIndex];
    insertADL.run(
      actualOrderId,
      adl.type,
      adl.url,
      adl.gps.lat,
      adl.gps.lng,
      adl.capturedAt,
      JSON.stringify(adl.meta)
    );
    
    console.log(`  ✅ Created ADL media for order ${actualOrderId}: ${adl.meta.description}`);
  }

  // Note: Master load counts are calculated dynamically in the API
  console.log('\n👷 Master load counts are calculated dynamically in the API');

  // Display summary
  console.log('\n📊 Sample Data Summary:');
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get();
  const completedCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('completed');
  const inProgressCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('inprogress');
  const assignedCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('assigned');
  const newCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = ?').get('new');
  const adlCount = db.prepare('SELECT COUNT(*) as count FROM adl_media').get();

  console.log(`  📋 Total Orders: ${orderCount.count}`);
  console.log(`  ✅ Completed: ${completedCount.count}`);
  console.log(`  🔄 In Progress: ${inProgressCount.count}`);
  console.log(`  👷 Assigned: ${assignedCount.count}`);
  console.log(`  🆕 New: ${newCount.count}`);
  console.log(`  📸 ADL Media: ${adlCount.count}`);

  console.log('\n🎉 Sample data created successfully!');
  console.log('\n💡 Dashboard will now show:');
  console.log('  • 8 realistic plumbing service orders');
  console.log('  • Various order statuses (new, assigned, in-progress, completed)');
  console.log('  • Customer information and GPS locations');
  console.log('  • ADL evidence for completed orders');
  console.log('  • Master assignments and load balancing');
  console.log('\n🚀 Refresh your dashboard to see the sample data!');

} catch (error) {
  console.error('❌ Error creating sample data:', error);
  process.exit(1);
} finally {
  db.close();
}
