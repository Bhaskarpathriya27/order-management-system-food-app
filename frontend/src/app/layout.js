import { CartProvider } from '../context/CartContext';
import './globals.css';

export const metadata = {
  title: 'Food Delivery - Order Management',
  description: 'Order delicious food online',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}