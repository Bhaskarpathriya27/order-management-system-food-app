'use client';

import styles from './OrderStatus.module.css';

const statusConfig = {
  received: {
    label: 'Order Received',
    color: '#3498db',
    icon: '📋',
  },
  preparing: {
    label: 'Preparing',
    color: '#f39c12',
    icon: '👨‍🍳',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: '#9b59b6',
    icon: '🚚',
  },
  delivered: {
    label: 'Delivered',
    color: '#27ae60',
    icon: '✅',
  },
};

const statusOrder = ['received', 'preparing', 'out_for_delivery', 'delivered'];

export default function OrderStatus({ status, lastUpdated }) {
  const currentStatusIndex = statusOrder.indexOf(status);
  const config = statusConfig[status] || statusConfig.received;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span 
          className={styles.statusBadge}
          style={{ backgroundColor: config.color }}
        >
          <span className={styles.icon}>{config.icon}</span>
          {config.label}
        </span>
        {lastUpdated && (
          <span className={styles.lastUpdated}>
            Updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className={styles.progressBar}>
        {statusOrder.map((s, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrent = s === status;
          
          return (
            <div key={s} className={styles.step}>
              <div 
                className={`${styles.dot} ${isActive ? styles.active : ''} ${isCurrent ? styles.current : ''}`}
                style={{ 
                  backgroundColor: isActive ? config.color : '#dfe6e9',
                  borderColor: isCurrent ? config.color : '#dfe6e9'
                }}
              >
                {isActive && (
                  <span className={styles.stepIcon}>
                    {statusConfig[s].icon}
                  </span>
                )}
              </div>
              <span className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}>
                {statusConfig[s].label}
              </span>
              {index < statusOrder.length - 1 && (
                <div 
                  className={styles.connector}
                  style={{ 
                    backgroundColor: index < currentStatusIndex ? config.color : '#dfe6e9'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <p className={styles.description}>
        {status === 'received' && 'We have received your order and it is being processed.'}
        {status === 'preparing' && 'Our chefs are preparing your delicious meal.'}
        {status === 'out_for_delivery' && 'Your order is on the way to you!'}
        {status === 'delivered' && 'Your order has been delivered. Enjoy your meal!'}
      </p>
    </div>
  );
}