'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import OrderStatus from '../../../components/OrderStatus';
import { getOrder, getOrderStatus } from '../../../services/api';
import styles from './page.module.css';

export default function OrderTracking() {
  const params = useParams();
  const orderId = params.id;
  
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrder(orderId);
        setOrder(response.data);
        setStatus(response.data.status);
        setLastUpdated(response.data.updatedAt);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Poll for status updates
  useEffect(() => {
    if (!orderId || status === 'delivered') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await getOrderStatus(orderId);
        const newStatus = response.data.status;
        
        if (newStatus !== status) {
          setStatus(newStatus);
          setLastUpdated(response.data.updatedAt);
        }
      } catch (err) {
        console.error('Error polling status:', err);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [orderId, status]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading order details...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className={styles.error}>
          <h2>Order Not Found</h2>
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Order Details</h1>
          
          <div className={styles.content}>
            <OrderStatus status={status} lastUpdated={lastUpdated} />
            
            <div className={styles.details}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Order Information</h2>
                <div className={styles.infoGrid}>
                  <div>
                    <span className={styles.label}>Order ID</span>
                    <p className={styles.value}>{order.id}</p>
                  </div>
                  <div>
                    <span className={styles.label}>Order Date</span>
                    <p className={styles.value}>
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Delivery Details</h2>
                <div className={styles.infoGrid}>
                  <div>
                    <span className={styles.label}>Customer</span>
                    <p className={styles.value}>{order.customerName}</p>
                  </div>
                  <div>
                    <span className={styles.label}>Phone</span>
                    <p className={styles.value}>{order.phone}</p>
                  </div>
                  <div className={styles.fullWidth}>
                    <span className={styles.label}>Address</span>
                    <p className={styles.value}>{order.address}</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Order Items</h2>
                <div className={styles.items}>
                  {order.items.map((item, index) => (
                    <div key={index} className={styles.item}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQty}>Qty: {item.quantity}</span>
                      </div>
                      <span className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className={styles.divider}></div>
                
                <div className={styles.total}>
                  <span>Total Amount</span>
                  <span className={styles.totalAmount}>
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}