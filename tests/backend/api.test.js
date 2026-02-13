const request = require('supertest');
const app = require('../backend/src/app');
const { clearOrders } = require('../backend/src/data/orders');

describe('Menu API', () => {
  describe('GET /api/menu', () => {
    it('should return all menu items', async () => {
      const response = await request(app)
        .get('/api/menu')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return menu items with correct structure', async () => {
      const response = await request(app)
        .get('/api/menu')
        .expect(200);

      const firstItem = response.body.data[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('name');
      expect(firstItem).toHaveProperty('description');
      expect(firstItem).toHaveProperty('price');
      expect(firstItem).toHaveProperty('image');
      expect(firstItem).toHaveProperty('category');
    });
  });

  describe('GET /api/menu/:id', () => {
    it('should return a single menu item', async () => {
      const response = await request(app)
        .get('/api/menu/menu_001')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('menu_001');
    });

    it('should return 404 for invalid menu item ID', async () => {
      const response = await request(app)
        .get('/api/menu/invalid_id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });
});

describe('Order API', () => {
  beforeEach(() => {
    clearOrders();
  });

  describe('POST /api/orders', () => {
    const validOrder = {
      customerName: 'John Doe',
      address: '123 Main Street, New York, NY 10001',
      phone: '+1234567890',
      items: [
        { menuItemId: 'menu_001', quantity: 2 }
      ]
    };

    it('should create a new order successfully', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrder)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('orderId');
      expect(response.body.data.status).toBe('received');
      expect(response.body.data.totalAmount).toBeGreaterThan(0);
    });

    it('should calculate correct total amount', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrder)
        .expect(201);

      // menu_001 price is 12.99, quantity is 2
      expect(response.body.data.totalAmount).toBe(25.98);
    });

    it('should return 400 for missing customer name', async () => {
      const invalidOrder = { ...validOrder, customerName: '' };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for short customer name', async () => {
      const invalidOrder = { ...validOrder, customerName: 'J' };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing address', async () => {
      const invalidOrder = { ...validOrder, address: '' };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for short address', async () => {
      const invalidOrder = { ...validOrder, address: '123' };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing phone', async () => {
      const invalidOrder = { ...validOrder, phone: '' };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid phone format', async () => {
      const invalidOrder = { ...validOrder, phone: '123' };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for empty items array', async () => {
      const invalidOrder = { ...validOrder, items: [] };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid quantity', async () => {
      const invalidOrder = {
        ...validOrder,
        items: [{ menuItemId: 'menu_001', quantity: 0 }]
      };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for negative quantity', async () => {
      const invalidOrder = {
        ...validOrder,
        items: [{ menuItemId: 'menu_001', quantity: -1 }]
      };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing menuItemId', async () => {
      const invalidOrder = {
        ...validOrder,
        items: [{ quantity: 2 }]
      };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return error for non-existent menu item', async () => {
      const invalidOrder = {
        ...validOrder,
        items: [{ menuItemId: 'non_existent', quantity: 2 }]
      };
      const response = await request(app)
        .post('/api/orders')
        .send(invalidOrder)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      // Create an order first
      await request(app)
        .post('/api/orders')
        .send({
          customerName: 'John Doe',
          address: '123 Main Street, New York, NY 10001',
          phone: '+1234567890',
          items: [{ menuItemId: 'menu_001', quantity: 1 }]
        });

      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order details', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'John Doe',
          address: '123 Main Street, New York, NY 10001',
          phone: '+1234567890',
          items: [{ menuItemId: 'menu_001', quantity: 1 }]
        });

      const orderId = createResponse.body.data.orderId;

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(orderId);
      expect(response.body.data.customerName).toBe('John Doe');
    });

    it('should return 404 for invalid order ID', async () => {
      const response = await request(app)
        .get('/api/orders/invalid-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/orders/:id/status', () => {
    it('should return order status', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'John Doe',
          address: '123 Main Street, New York, NY 10001',
          phone: '+1234567890',
          items: [{ menuItemId: 'menu_001', quantity: 1 }]
        });

      const orderId = createResponse.body.data.orderId;

      const response = await request(app)
        .get(`/api/orders/${orderId}/status`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('received');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    it('should return 404 for invalid order ID', async () => {
      const response = await request(app)
        .get('/api/orders/invalid-id/status')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should update order status', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'John Doe',
          address: '123 Main Street, New York, NY 10001',
          phone: '+1234567890',
          items: [{ menuItemId: 'menu_001', quantity: 1 }]
        });

      const orderId = createResponse.body.data.orderId;

      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'preparing' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('preparing');
    });

    it('should return 400 for invalid status', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send({
          customerName: 'John Doe',
          address: '123 Main Street, New York, NY 10001',
          phone: '+1234567890',
          items: [{ menuItemId: 'menu_001', quantity: 1 }]
        });

      const orderId = createResponse.body.data.orderId;

      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: 'invalid_status' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .patch('/api/orders/non-existent/status')
        .send({ status: 'preparing' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});

describe('Error Handling', () => {
  it('should return 404 for unknown endpoints', async () => {
    const response = await request(app)
      .get('/api/unknown')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});