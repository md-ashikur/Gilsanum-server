const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const productsPath = path.join(__dirname, '../data/products.json');
const customersPath = path.join(__dirname, '../data/customers.json');
const ordersPath = path.join(__dirname, '../data/orders.json');

// Helper functions to read data
const readData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return null;
  }
};

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [productsData, customersData, ordersData] = await Promise.all([
      readData(productsPath),
      readData(customersPath),
      readData(ordersPath)
    ]);

    if (!productsData || !customersData || !ordersData) {
      throw new Error('Failed to load data');
    }

    const { products } = productsData;
    const { customers } = customersData;
    const { orders } = ordersData;

    // Calculate statistics
    const totalProducts = products.length;
    const totalCustomers = customers.length;
    const totalOrders = orders.length;
    
    // Calculate total revenue
    const totalRevenue = orders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);

    // Calculate this month's stats
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const thisMonthRevenue = thisMonthOrders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + order.total, 0);

    const thisMonthCustomers = customers.filter(customer => {
      const joinDate = new Date(customer.joinDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;

    // Calculate growth percentages (mock data for demonstration)
    const previousMonthRevenue = thisMonthRevenue * 0.85; // Simulate 15% growth
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((thisMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;

    const stats = {
      totalRevenue: {
        value: totalRevenue,
        growth: revenueGrowth,
        formatted: `$${totalRevenue.toLocaleString()}`
      },
      totalOrders: {
        value: totalOrders,
        growth: 12.5, // Mock growth
        thisMonth: thisMonthOrders.length
      },
      totalCustomers: {
        value: totalCustomers,
        growth: 8.2, // Mock growth
        thisMonth: thisMonthCustomers
      },
      totalProducts: {
        value: totalProducts,
        lowStock: products.filter(p => p.stock < 20).length
      },
      ordersByStatus: {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
      message: error.message
    });
  }
});

// GET /api/dashboard/chart-data - Get chart data for analytics
router.get('/chart-data', async (req, res) => {
  try {
    const ordersData = await readData(ordersPath);
    if (!ordersData) {
      throw new Error('Failed to load orders data');
    }

    const { orders } = ordersData;

    // Generate revenue chart data for last 7 days
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.toDateString() === date.toDateString() && 
               order.paymentStatus === 'paid';
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
        orders: dayOrders.length,
        label: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }

    // Generate monthly data for last 6 months including current month
    const monthlyData = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    
    // Calculate the last 6 months
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthIndex = targetDate.getMonth();
      const year = targetDate.getFullYear();
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === monthIndex && 
               orderDate.getFullYear() === year &&
               order.paymentStatus === 'paid';
      });

      const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
      
      monthlyData.push({
        month: monthNames[monthIndex],
        revenue: monthRevenue,
        orders: monthOrders.length
      });
    }

    res.json({
      success: true,
      data: {
        daily: last7Days,
        monthly: monthlyData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chart data',
      message: error.message
    });
  }
});

// GET /api/dashboard/recent-orders - Get recent orders
router.get('/recent-orders', async (req, res) => {
  try {
    const ordersData = await readData(ordersPath);
    if (!ordersData) {
      throw new Error('Failed to load orders data');
    }

    const { orders } = ordersData;
    const limit = parseInt(req.query.limit) || 5;

    // Get recent orders sorted by date
    const recentOrders = orders
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, limit)
      .map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        total: order.total,
        status: order.status,
        orderDate: order.orderDate,
        items: order.items.length
      }));

    res.json({
      success: true,
      data: recentOrders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent orders',
      message: error.message
    });
  }
});

// GET /api/dashboard/popular-products - Get popular products
router.get('/popular-products', async (req, res) => {
  try {
    const productsData = await readData(productsPath);
    if (!productsData) {
      throw new Error('Failed to load products data');
    }

    const { products } = productsData;
    const limit = parseInt(req.query.limit) || 6;

    // Sort products by orders and get top ones
    const popularProducts = products
      .sort((a, b) => b.orders - a.orders)
      .slice(0, limit)
      .map(product => ({
        id: product.id,
        name: product.name,
        image: product.image,
        orders: product.orders,
        rank: product.rank,
        price: product.price,
        rating: product.rating
      }));

    res.json({
      success: true,
      data: popularProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular products',
      message: error.message
    });
  }
});

module.exports = router;
