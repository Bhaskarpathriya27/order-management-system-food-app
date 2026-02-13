const { v4: uuidv4 } = require('uuid');
const { addOrder, getOrderById, getOrders, updateOrder } = require('../data/orders');
const menuItems = require('../data/menu');

// Status transition sequence with delays (in milliseconds)
const STATUS_SEQUENCE = [
  { status: 'preparing', delay: 10000 },         // 10 seconds
  { status: 'out_for_delivery', delay: 15000 },  // 15 seconds
  { status: 'delivered', delay: 10000 }          // 10 seconds
];

// Simulate automatic status updates
const scheduleStatusUpdate = (orderId, stepIndex = 0) => {
  if (stepIndex >= STATUS_SEQUENCE.length) return;
  
  const { status, delay } = STATUS_SEQUENCE[stepIndex];
  
  setTimeout(() => {
    const order = getOrderById(orderId);
    if (order && order.status !== 'cancelled') {
      updateOrder(orderId, { 
        status, 
        updatedAt: new Date().toISOString() 
      });
      
      // Schedule next update
      scheduleStatusUpdate(orderId, stepIndex + 1);
    }
  }, delay);
};

const createOrder = (req, res) => {
  try {
    const { customerName, address, phone, items } = req.body;
    
    // Calculate total and enrich items with details
    let totalAmount = 0;
    const enrichedItems = items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      
      return {
        menuItemId: item.menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      };
    });
    
    const order = {
      id: uuidv4(),
      customerName: customerName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      items: enrichedItems,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: 'received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addOrder(order);
    
    // Start automatic status updates
    scheduleStatusUpdate(order.id);
    
    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'ORDER_CREATION_ERROR',
        message: error.message || 'Failed to create order'
      }
    });
  }
};

const getAllOrders = (req, res) => {
  try {
    const orders = getOrders();
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve orders'
      }
    });
  }
};

const getOrder = (req, res) => {
  try {
    const { id } = req.params;
    const order = getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Order not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve order'
      }
    });
  }
};

const getOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const order = getOrderById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Order not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        status: order.status,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve order status'
      }
    });
  }
};

const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = getOrderById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Order not found'
        }
      });
    }
    
    const updatedOrder = updateOrder(id, { 
      status, 
      updatedAt: new Date().toISOString() 
    });
    
    res.json({
      success: true,
      data: {
        orderId: updatedOrder.id,
        status: updatedOrder.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update order status'
      }
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrder,
  getOrderStatus,
  updateOrderStatus,
  scheduleStatusUpdate
};