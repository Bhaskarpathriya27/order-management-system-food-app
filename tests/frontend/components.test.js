import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../frontend/src/context/CartContext';
import MenuItem from '../frontend/src/components/MenuItem';
import CartItem from '../frontend/src/components/CartItem';
import CheckoutForm from '../frontend/src/components/CheckoutForm';
import OrderStatus from '../frontend/src/components/OrderStatus';
import Navbar from '../frontend/src/components/Navbar';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Test data
const mockMenuItem = {
  id: 'menu_001',
  name: 'Test Pizza',
  description: 'A delicious test pizza',
  price: 12.99,
  image: '/test-image.jpg',
  category: 'pizza',
};

const mockCartItem = {
  id: 'menu_001',
  name: 'Test Pizza',
  price: 12.99,
  quantity: 2,
  image: '/test-image.jpg',
};

// Helper to render with CartProvider
const renderWithCart = (component) => {
  return render(<CartProvider>{component}</CartProvider>);
};

describe('MenuItem Component', () => {
  it('renders item name, description, price, and image', () => {
    renderWithCart(<MenuItem item={mockMenuItem} />);
    
    expect(screen.getByText(mockMenuItem.name)).toBeInTheDocument();
    expect(screen.getByText(mockMenuItem.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockMenuItem.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByAltText(mockMenuItem.name)).toBeInTheDocument();
  });

  it('calls addItem when Add to Cart button is clicked', async () => {
    const TestComponent = () => {
      const { items } = useCart();
      return (
        <>
          <div data-testid="cart-count">{items.length}</div>
          <MenuItem item={mockMenuItem} />
        </>
      );
    };

    renderWithCart(<TestComponent />);
    
    const addButton = screen.getByText('Add to Cart');
    await userEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });
  });

  it('updates quantity when quantity buttons are clicked', async () => {
    renderWithCart(<MenuItem item={mockMenuItem} />);
    
    const quantityValue = screen.getByText('1');
    expect(quantityValue).toBeInTheDocument();
    
    const increaseBtn = screen.getByLabelText('Increase quantity');
    await userEvent.click(increaseBtn);
    
    expect(screen.getByText('2')).toBeInTheDocument();
    
    const decreaseBtn = screen.getByLabelText('Decrease quantity');
    await userEvent.click(decreaseBtn);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});

describe('CartItem Component', () => {
  it('displays correct quantity', () => {
    renderWithCart(<CartItem item={mockCartItem} />);
    
    expect(screen.getByText(mockCartItem.name)).toBeInTheDocument();
    expect(screen.getByText(`x${mockCartItem.quantity}`)).toBeInTheDocument();
  });

  it('quantity buttons work correctly', async () => {
    renderWithCart(<CartItem item={mockCartItem} />);
    
    const increaseBtn = screen.getByLabelText('Increase quantity');
    await userEvent.click(increaseBtn);
    
    // Quantity should update
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls removeItem when remove button is clicked', async () => {
    const TestComponent = () => {
      const { items, addItem } = useCart();
      
      // Add item on mount
      React.useEffect(() => {
        addItem(mockMenuItem, 1);
      }, []);
      
      return (
        <>
          <div data-testid="cart-count">{items.length}</div>
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </>
      );
    };

    renderWithCart(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    });
    
    const removeBtn = screen.getByLabelText('Remove item');
    await userEvent.click(removeBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });
  });
});

describe('CheckoutForm Component', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={false} />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={false} />);
    
    const submitBtn = screen.getByRole('button', { name: /place order/i });
    await userEvent.click(submitBtn);
    
    expect(await screen.findByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/address must be at least 10 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={false} />);
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/delivery address/i), '123 Main Street, New York, NY 10001');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    
    const submitBtn = screen.getByRole('button', { name: /place order/i });
    await userEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        customerName: 'John Doe',
        address: '123 Main Street, New York, NY 10001',
        phone: '+1234567890',
      });
    });
  });

  it('disables submit button when isSubmitting is true', () => {
    render(<CheckoutForm onSubmit={mockSubmit} isSubmitting={true} />);
    
    const submitBtn = screen.getByRole('button', { name: /placing order/i });
    expect(submitBtn).toBeDisabled();
  });
});

describe('OrderStatus Component', () => {
  it('displays current status correctly', () => {
    render(<OrderStatus status="received" />);
    
    expect(screen.getByText('Order Received')).toBeInTheDocument();
  });

  it('displays preparing status correctly', () => {
    render(<OrderStatus status="preparing" />);
    
    expect(screen.getByText('Preparing')).toBeInTheDocument();
  });

  it('displays out for delivery status correctly', () => {
    render(<OrderStatus status="out_for_delivery" />);
    
    expect(screen.getByText('Out for Delivery')).toBeInTheDocument();
  });

  it('displays delivered status correctly', () => {
    render(<OrderStatus status="delivered" />);
    
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('displays last updated time when provided', () => {
    const lastUpdated = '2024-01-15T10:30:00Z';
    render(<OrderStatus status="received" lastUpdated={lastUpdated} />);
    
    expect(screen.getByText(/updated:/i)).toBeInTheDocument();
  });
});

describe('Navbar Component', () => {
  it('renders logo and navigation links', () => {
    renderWithCart(<Navbar />);
    
    expect(screen.getByText(/foodelivery/i)).toBeInTheDocument();
    expect(screen.getByText(/menu/i)).toBeInTheDocument();
  });

  it('displays cart item count badge', async () => {
    const TestComponent = () => {
      const { addItem } = useCart();
      
      React.useEffect(() => {
        addItem(mockMenuItem, 2);
      }, []);
      
      return <Navbar />;
    };

    renderWithCart(<TestComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});

describe('Cart Context', () => {
  it('provides cart functionality to children', () => {
    const TestComponent = () => {
      const { items, addItem, getTotal } = useCart();
      
      return (
        <div>
          <div data-testid="item-count">{items.length}</div>
          <div data-testid="total">{getTotal().toFixed(2)}</div>
          <button onClick={() => addItem(mockMenuItem, 1)}>Add</button>
        </div>
      );
    };

    renderWithCart(<TestComponent />);
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0.00');
    
    fireEvent.click(screen.getByText('Add'));
    
    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total')).toHaveTextContent('12.99');
  });

  it('updates quantity correctly', () => {
    const TestComponent = () => {
      const { items, addItem, updateQuantity } = useCart();
      
      return (
        <div>
          <div data-testid="quantity">{items[0]?.quantity || 0}</div>
          <button onClick={() => addItem(mockMenuItem, 1)}>Add</button>
          <button onClick={() => items[0] && updateQuantity(items[0].id, 5)}>Update</button>
        </div>
      );
    };

    renderWithCart(<TestComponent />);
    
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByTestId('quantity')).toHaveTextContent('1');
    
    fireEvent.click(screen.getByText('Update'));
    expect(screen.getByTestId('quantity')).toHaveTextContent('5');
  });
});