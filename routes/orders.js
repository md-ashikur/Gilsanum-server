const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/orders.json');

// Helper function to read orders data
const readOrdersData = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders data:', error);
    return { orders: [] };
  }
};

// Helper function to write orders data
const writeOrdersData = async (data) => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing orders data:', error);
    return false;
  }
};

// GET /api/orders - Get all orders with optional filtering
router.get('/', async (req, res) => {
  try {
    const data = await readOrdersData();
    let { orders } = data;
    
    // Apply filters
    const { status, customerId, search, sort, limit } = req.query;
    
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    
    if (customerId) {
      orders = orders.filter(o => o.customerId === customerId);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      orders = orders.filter(o => 
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.customerName.toLowerCase().includes(searchLower) ||
        o.customerEmail.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'date_desc':
          orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
          break;
        case 'date_asc':
          orders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
          break;
        case 'total_desc':
          orders.sort((a, b) => b.total - a.total);
          break;
        case 'total_asc':
          orders.sort((a, b) => a.total - b.total);
          break;
      }
    } else {
      // Default sort by date descending
      orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    }
    
    // Apply limit
    if (limit) {
      orders = orders.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      data: orders,
      total: orders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await readOrdersData();
    const order = data.orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message
    });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const data = await readOrdersData();
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(data.orders.length + 1).padStart(3, '0')}`;
    
    const newOrder = {
      id: uuidv4(),
      orderNumber,
      ...req.body,
      orderDate: new Date().toISOString(),
      status: req.body.status || 'pending',
      paymentStatus: req.body.paymentStatus || 'pending'
    };
    
    data.orders.push(newOrder);
    
    const success = await writeOrdersData(data);
    if (!success) {
      throw new Error('Failed to save order');
    }
    
    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// PUT /api/orders/:id - Update order
router.put('/:id', async (req, res) => {
  try {
    const data = await readOrdersData();
    const orderIndex = data.orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Handle status changes with timestamps
    const updatedOrder = { ...data.orders[orderIndex], ...req.body };
    
    if (req.body.status) {
      switch (req.body.status) {
        case 'shipped':
          if (!updatedOrder.shippedDate) {
            updatedOrder.shippedDate = new Date().toISOString();
          }
          break;
        case 'delivered':
          if (!updatedOrder.deliveredDate) {
            updatedOrder.deliveredDate = new Date().toISOString();
          }
          break;
      }
    }
    
    data.orders[orderIndex] = updatedOrder;
    
    const success = await writeOrdersData(data);
    if (!success) {
      throw new Error('Failed to update order');
    }
    
    res.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update order',
      message: error.message
    });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req, res) => {
  try {
    const data = await readOrdersData();
    const orderIndex = data.orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    const deletedOrder = data.orders.splice(orderIndex, 1)[0];
    
    const success = await writeOrdersData(data);
    if (!success) {
      throw new Error('Failed to delete order');
    }
    
    res.json({
      success: true,
      data: deletedOrder,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete order',
      message: error.message
    });
  }
});

module.exports = router;
