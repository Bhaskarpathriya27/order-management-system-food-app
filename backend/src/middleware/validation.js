const validateOrder = (req, res, next) => {
  const { customerName, address, phone, items } = req.body;
  const errors = [];

  // Validate customerName
  if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
    errors.push({
      field: 'customerName',
      message: 'Customer name is required and must be at least 2 characters'
    });
  }

  // Validate address
  if (!address || typeof address !== 'string' || address.trim().length < 10) {
    errors.push({
      field: 'address',
      message: 'Address is required and must be at least 10 characters'
    });
  }

  // Validate phone
  if (!phone || typeof phone !== 'string') {
    errors.push({
      field: 'phone',
      message: 'Phone number is required'
    });
  } else {
    // Basic phone validation (allows various formats)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      errors.push({
        field: 'phone',
        message: 'Please enter a valid phone number'
      });
    }
  }

  // Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push({
      field: 'items',
      message: 'At least one item is required'
    });
  } else {
    // Validate each item
    items.forEach((item, index) => {
      if (!item.menuItemId || typeof item.menuItemId !== 'string') {
        errors.push({
          field: `items[${index}].menuItemId`,
          message: 'Menu item ID is required'
        });
      }
      
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
        errors.push({
          field: `items[${index}].quantity`,
          message: 'Quantity must be a positive integer'
        });
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: errors
      }
    });
  }

  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['received', 'preparing', 'out_for_delivery', 'delivered'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      }
    });
  }

  next();
};

module.exports = {
  validateOrder,
  validateStatusUpdate
};