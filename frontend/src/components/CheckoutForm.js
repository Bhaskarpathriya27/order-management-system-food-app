'use client';

import { useState } from 'react';
import styles from './CheckoutForm.module.css';

export default function CheckoutForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }
    
    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        customerName: formData.customerName.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Delivery Information</h2>
      
      <div className={styles.field}>
        <label htmlFor="customerName" className={styles.label}>
          Full Name *
        </label>
        <input
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className={`${styles.input} ${errors.customerName ? styles.error : ''}`}
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />
        {errors.customerName && (
          <span className={styles.errorMessage}>{errors.customerName}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="address" className={styles.label}>
          Delivery Address *
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.address ? styles.error : ''}`}
          placeholder="Enter your complete address"
          rows={3}
          disabled={isSubmitting}
        />
        {errors.address && (
          <span className={styles.errorMessage}>{errors.address}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`${styles.input} ${errors.phone ? styles.error : ''}`}
          placeholder="+1 234 567 8900"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <span className={styles.errorMessage}>{errors.phone}</span>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
}