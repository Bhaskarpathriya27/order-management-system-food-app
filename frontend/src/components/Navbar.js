'use client';

import Link from 'next/link';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          🍔 FoodDelivery
        </Link>
        
        <div className={styles.links}>
          <Link href="/" className={styles.link}>
            Menu
          </Link>
          <Link href="/cart" className={styles.cartLink}>
            <span className={styles.cartIcon}>🛒</span>
            {itemCount > 0 && (
              <span className={styles.badge}>{itemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}