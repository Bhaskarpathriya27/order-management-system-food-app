'use client';

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import CartItem from '../../components/CartItem';
import { useCart } from '../../context/CartContext';
import styles from './page.module.css';

export default function Cart() {
  const { items, getTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Your cart is empty</h2>
          <p className={styles.emptyText}>
            Looks like you haven&apos;t added any items yet.
          </p>
          <Link href="/" className={styles.browseButton}>
            Browse Menu
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Shopping Cart</h1>
          
          <div className={styles.content}>
            <div className={styles.items}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              
              <button 
                onClick={clearCart}
                className={styles.clearButton}
              >
                Clear Cart
              </button>
            </div>
            
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>$0.00</span>
              </div>
              
              <div className={styles.divider}></div>
              
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              
              <Link href="/checkout" className={styles.checkoutButton}>
                Proceed to Checkout
              </Link>
              
              <Link href="/" className={styles.continueLink}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}