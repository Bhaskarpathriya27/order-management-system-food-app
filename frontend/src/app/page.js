'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MenuItem from '../components/MenuItem';
import { getMenu } from '../services/api';
import styles from './page.module.css';

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getMenu();
        setMenuItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading menu...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className={styles.error}>
          <h2>Error Loading Menu</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Our Menu</h1>
            <p className={styles.subtitle}>
              Delicious food delivered to your door
            </p>
          </header>

          <div className={styles.grid}>
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}