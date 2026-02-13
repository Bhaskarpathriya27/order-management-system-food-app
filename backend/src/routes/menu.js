const express = require('express');
const router = express.Router();
const { getAllMenu, getMenuItemById } = require('../controllers/menuController');

router.get('/', getAllMenu);
router.get('/:id', getMenuItemById);

module.exports = router;