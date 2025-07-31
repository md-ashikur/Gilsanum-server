const fs = require('fs').promises;
const path = require('path');

// Sample data for initial setup
const sampleProducts = {
  products: [
    {
      "id": "1",
      "name": "Premium Laptop",
      "title": "Premium Laptop",
      "price": 1240,
      "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      "category": "Electronics",
      "featured": true,
      "location": {
        "lat": 40.7128,
        "lng": -74.0060,
        "address": "New York, NY"
      },
      "rating": 4.5,
      "reviews": 128,
      "orders": 1250,
      "rank": 1,
      "stock": 45,
      "description": "High-performance laptop for professionals",
      "sku": "LAP-001",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-07-31T10:30:00Z"
    },
    {
      "id": "2",
      "name": "Designer Handbag",
      "title": "Designer Handbag",
      "price": 899,
      "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop",
      "category": "Fashion",
      "featured": true,
      "location": {
        "lat": 40.7589,
        "lng": -73.9851,
        "address": "Manhattan, NY"
      },
      "rating": 4.8,
      "reviews": 89,
      "orders": 980,
      "rank": 2,
      "stock": 23,
      "description": "Luxury designer handbag made from premium materials",
      "sku": "BAG-002",
      "createdAt": "2024-02-10T14:20:00Z",
      "updatedAt": "2024-07-31T14:20:00Z"
    },
    {
      "id": "3",
      "name": "Wireless Headphones",
      "title": "Wireless Headphones",
      "price": 299,
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      "category": "Electronics",
      "featured": false,
      "location": {
        "lat": 40.7282,
        "lng": -73.7949,
        "address": "Queens, NY"
      },
      "rating": 4.2,
      "reviews": 98,
      "orders": 312,
      "rank": 6,
      "stock": 89,
      "description": "Premium wireless headphones with noise cancellation",
      "sku": "HDP-006",
      "createdAt": "2024-06-22T08:20:00Z",
      "updatedAt": "2024-07-31T08:20:00Z"
    }
  ]
};

// Ensure data directory and files exist
const initializeData = async () => {
  const dataDir = path.join(__dirname, '../data');
  
  try {
    // Create data directory if it doesn't exist
    await fs.access(dataDir).catch(() => fs.mkdir(dataDir, { recursive: true }));
    
    // Initialize data files
    const files = [
      { name: 'products.json', data: sampleProducts },
      { name: 'customers.json', data: { customers: [] } },
      { name: 'orders.json', data: { orders: [] } }
    ];
    
    for (const file of files) {
      const filePath = path.join(dataDir, file.name);
      try {
        await fs.access(filePath);
        console.log(`✅ ${file.name} exists`);
      } catch {
        await fs.writeFile(filePath, JSON.stringify(file.data, null, 2));
        console.log(`✅ Created ${file.name} with sample data`);
      }
    }
    
    console.log('🚀 Data initialization complete');
  } catch (error) {
    console.error('❌ Error initializing data:', error);
  }
};

module.exports = { initializeData };
