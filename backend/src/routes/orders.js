const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getAllOrders, 
  getOrder, 
  getOrderStatus, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { validateOrder, validateStatusUpdate } = require('../middleware/validation');

router.post('/', validateOrder, createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.get('/:id/status', getOrderStatus);
router.patch('/:id/status', validateStatusUpdate, updateOrderStatus);

module.exports = router;