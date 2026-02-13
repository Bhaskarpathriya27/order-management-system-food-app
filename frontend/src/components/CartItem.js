'use client';

import { useCart } from '../context/CartContext';
import styles from './CartItem.module.css';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className={styles.item}>
      <img 
        src={item.image} 
        alt={item.name}
        className={styles.image}
      />
      
      <div className={styles.details}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.price}>${item.price.toFixed(2)} each</p>
      </div>
      
      <div className={styles.actions}>
        <div className={styles.quantity}>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className={styles.quantityBtn}
            aria-label="Decrease quantity"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className={styles.quantityValue}>{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className={styles.quantityBtn}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        
        <p className={styles.total}>
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        
        <button 
          onClick={() => removeItem(item.id)}
          className={styles.removeBtn}
          aria-label="Remove item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}