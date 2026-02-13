'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: updatedItems };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((menuItem, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.image,
        quantity,
      },
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: itemId,
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity < 1) return;
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: itemId, quantity },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getTotal = useCallback(() => {
    return state.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [state.items]);

  const getItemCount = useCallback(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }, [state.items]);

  const value = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};