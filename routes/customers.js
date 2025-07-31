const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/customers.json');

// Helper function to read customers data
const readCustomersData = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading customers data:', error);
    return { customers: [] };
  }
};

// Helper function to write customers data
const writeCustomersData = async (data) => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing customers data:', error);
    return false;
  }
};

// GET /api/customers - Get all customers with optional filtering
router.get('/', async (req, res) => {
  try {
    const data = await readCustomersData();
    let { customers } = data;
    
    // Apply filters
    const { status, search, sort } = req.query;
    
    if (status) {
      customers = customers.filter(c => c.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      customers = customers.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(search)
      );
    }
    
    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'name_asc':
          customers.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name_desc':
          customers.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'orders_desc':
          customers.sort((a, b) => b.totalOrders - a.totalOrders);
          break;
        case 'spent_desc':
          customers.sort((a, b) => b.totalSpent - a.totalSpent);
          break;
        case 'newest':
          customers.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
          break;
      }
    }
    
    res.json({
      success: true,
      data: customers,
      total: customers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customers',
      message: error.message
    });
  }
});

// GET /api/customers/:id - Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await readCustomersData();
    const customer = data.customers.find(c => c.id === req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer',
      message: error.message
    });
  }
});

// POST /api/customers - Create new customer
router.post('/', async (req, res) => {
  try {
    const data = await readCustomersData();
    const newCustomer = {
      id: uuidv4(),
      ...req.body,
      totalOrders: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString(),
      status: 'active'
    };
    
    data.customers.push(newCustomer);
    
    const success = await writeCustomersData(data);
    if (!success) {
      throw new Error('Failed to save customer');
    }
    
    res.status(201).json({
      success: true,
      data: newCustomer,
      message: 'Customer created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create customer',
      message: error.message
    });
  }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', async (req, res) => {
  try {
    const data = await readCustomersData();
    const customerIndex = data.customers.findIndex(c => c.id === req.params.id);
    
    if (customerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    data.customers[customerIndex] = {
      ...data.customers[customerIndex],
      ...req.body
    };
    
    const success = await writeCustomersData(data);
    if (!success) {
      throw new Error('Failed to update customer');
    }
    
    res.json({
      success: true,
      data: data.customers[customerIndex],
      message: 'Customer updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update customer',
      message: error.message
    });
  }
});

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const data = await readCustomersData();
    const customerIndex = data.customers.findIndex(c => c.id === req.params.id);
    
    if (customerIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }
    
    const deletedCustomer = data.customers.splice(customerIndex, 1)[0];
    
    const success = await writeCustomersData(data);
    if (!success) {
      throw new Error('Failed to delete customer');
    }
    
    res.json({
      success: true,
      data: deletedCustomer,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete customer',
      message: error.message
    });
  }
});

module.exports = router;
