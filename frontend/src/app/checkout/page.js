'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import CheckoutForm from '../../components/CheckoutForm';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/api';
import styles from './page.module.css';

export default function Checkout() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className={styles.empty}>
          <h2>Your cart is empty</h2>
          <p>Add some items before checking out.</p>
        </div>
      </>
    );
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderData);
      
      // Clear cart and redirect to order tracking
      clearCart();
      router.push(`/order/${response.data.orderId}`);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Checkout</h1>
          
          <div className={styles.content}>
            <div className={styles.formSection}>
              {error && (
                <div className={styles.error}>
                  {error}
                </div>
              )}
              <CheckoutForm 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
            
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              <div className={styles.items}>
                {items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQty}>x{item.quantity}</span>
                    </div>
                    <span className={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className={styles.divider}></div>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>Free</span>
              </div>
              
              <div className={styles.divider}></div>
              
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}