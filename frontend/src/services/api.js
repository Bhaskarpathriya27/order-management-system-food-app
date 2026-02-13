const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Something went wrong');
  }
  
  return data;
};

export const getMenu = async () => {
  const response = await fetch(`${API_URL}/api/menu`);
  return handleResponse(response);
};

export const getMenuItem = async (id) => {
  const response = await fetch(`${API_URL}/api/menu/${id}`);
  return handleResponse(response);
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

export const getOrder = async (orderId) => {
  const response = await fetch(`${API_URL}/api/orders/${orderId}`);
  return handleResponse(response);
};

export const getOrderStatus = async (orderId) => {
  const response = await fetch(`${API_URL}/api/orders/${orderId}/status`);
  return handleResponse(response);
};