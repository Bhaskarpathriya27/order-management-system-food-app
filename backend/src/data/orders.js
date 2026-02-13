let orders = [];

const getOrders = () => orders;

const addOrder = (order) => {
  orders.push(order);
  return order;
};

const getOrderById = (id) => {
  return orders.find(order => order.id === id);
};

const updateOrder = (id, updates) => {
  const index = orders.findIndex(order => order.id === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates };
    return orders[index];
  }
  return null;
};

const deleteOrder = (id) => {
  const index = orders.findIndex(order => order.id === id);
  if (index !== -1) {
    orders.splice(index, 1);
    return true;
  }
  return false;
};

// For testing purposes
const clearOrders = () => {
  orders = [];
};

module.exports = {
  getOrders,
  addOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  clearOrders
};