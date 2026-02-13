const menuItems = require('../data/menu');

const getAllMenu = (req, res) => {
  try {
    res.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve menu items'
      }
    });
  }
};

const getMenuItemById = (req, res) => {
  try {
    const { id } = req.params;
    const item = menuItems.find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Menu item not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve menu item'
      }
    });
  }
};

module.exports = {
  getAllMenu,
  getMenuItemById
};