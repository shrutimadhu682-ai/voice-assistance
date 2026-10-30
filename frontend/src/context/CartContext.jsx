import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAccessibility } from './AccessibilityContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { announce, playCue } = useAccessibility();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vc_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState(() => {
    return localStorage.getItem('vc_cart_coupon') || '';
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vc_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('vc_cart_coupon', couponCode);
  }, [couponCode]);

  // Derived financials
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cartItems]);

  const itemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (couponCode.toUpperCase() === 'FREESHIP') return 0;
    return subtotal >= 499 ? 0 : 30;
  }, [subtotal, couponCode]);

  const discount = useMemo(() => {
    if (subtotal === 0) return 0;
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME50') {
      return Math.min(50, subtotal);
    }
    if (code === 'FRESH10') {
      return Math.round(subtotal * 0.10);
    }
    return 0;
  }, [subtotal, couponCode]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + deliveryFee - discount);
  }, [subtotal, deliveryFee, discount]);

  // Actions
  const addToCart = (product, quantity = 1, silent = false) => {
    if (!product) return;
    const qty = Math.max(1, quantity);

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      } else {
        return [...prev, { product, quantity: qty }];
      }
    });

    playCue('success');

    const msg = `${product.name}, ${qty} ${qty > 1 ? 'units' : 'unit'} added to your cart. Cart total is ${Math.round(total + (product.price * qty))} rupees.`;
    announce(msg, 'assertive');
    return msg;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });

    const item = cartItems.find(i => i.product.id === productId);
    if (item) {
      announce(`Updated ${item.product.name} quantity to ${newQuantity}.`, 'polite');
    }
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find(i => i.product.id === productId);
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
    playCue('error');
    if (item) {
      announce(`${item.product.name} removed from your cart.`, 'assertive');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
    announce("Cart has been cleared.", 'assertive');
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (['WELCOME50', 'FRESH10', 'FREESHIP'].includes(cleanCode)) {
      setCouponCode(cleanCode);
      playCue('success');
      let msg = `Coupon ${cleanCode} applied!`;
      if (cleanCode === 'WELCOME50') msg += ' You received 50 rupees discount.';
      if (cleanCode === 'FRESH10') msg += ' You received 10 percent discount.';
      if (cleanCode === 'FREESHIP') msg += ' Free delivery applied!';
      announce(msg, 'assertive');
      return { success: true, message: msg };
    } else {
      playCue('error');
      const err = `Invalid coupon code. Try WELCOME50 or FRESH10.`;
      announce(err, 'assertive');
      return { success: false, message: err };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    announce("Coupon removed.", 'polite');
  };

  const getCartSpokenSummary = () => {
    if (cartItems.length === 0) {
      return "Your shopping cart is currently empty. You can say browse vegetables or search for basmati rice to find products.";
    }

    const itemsSummary = cartItems.map(
      item => `${item.quantity} ${item.product.name} at ${Math.round(item.product.price)} rupees each`
    ).join(', ');

    let summary = `Your cart contains ${itemCount} ${itemCount > 1 ? 'items' : 'item'}: ${itemsSummary}. `;
    summary += `Subtotal is ${Math.round(subtotal)} rupees. `;
    if (deliveryFee === 0) {
      summary += `Delivery is free. `;
    } else {
      summary += `Delivery charge is ${deliveryFee} rupees. Add items worth ${Math.round(499 - subtotal)} more for free delivery. `;
    }
    if (discount > 0) {
      summary += `Discount of ${Math.round(discount)} rupees applied with code ${couponCode}. `;
    }
    summary += `Your final total is ${Math.round(total)} rupees. Say checkout to place your order.`;

    return summary;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        deliveryFee,
        discount,
        total,
        couponCode,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        getCartSpokenSummary
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
