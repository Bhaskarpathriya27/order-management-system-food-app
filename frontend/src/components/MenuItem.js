'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import styles from './MenuItem.module.css';

export default function MenuItem({ item }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(item, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(1);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={item.image} 
          alt={item.name}
          className={styles.image}
          loading="lazy"
        />
        <span className={styles.category}>{item.category}</span>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
          
          <div className={styles.actions}>
            <div className={styles.quantity}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={styles.quantityBtn}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className={styles.quantityBtn}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className={`${styles.addButton} ${added ? styles.added : ''}`}
            >
              {added ? '✓ Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}