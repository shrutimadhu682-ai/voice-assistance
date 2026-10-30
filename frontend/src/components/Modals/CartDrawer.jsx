import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Volume2, 
  ArrowRight, 
  Tag, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAccessibility } from '../../context/AccessibilityContext';

export default function CartDrawer({
  isOpen,
  onClose,
  onProceedToCheckout,
  onSpeakCart
}) {
  const {
    cartItems,
    itemCount,
    subtotal,
    deliveryFee,
    discount,
    total,
    couponCode,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartSpokenSummary
  } = useCart();

  const { announce } = useAccessibility();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    setCouponMessage(res);
    setCouponInput('');
  };

  const handleReadCartAloud = () => {
    const text = getCartSpokenSummary();
    if (onSpeakCart) {
      onSpeakCart(text);
    } else {
      announce(text, 'assertive');
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l-2 border-slate-200 dark:border-slate-800">
        
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 id="cart-drawer-title" className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                My Shopping Cart
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your basket
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReadCartAloud}
              className="p-2 rounded-xl bg-green-50 dark:bg-green-950 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600"
              aria-label="Read complete cart contents and total aloud"
              title="Read cart aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              aria-label="Close shopping cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-lg text-slate-800 dark:text-slate-200">
                  Your cart is empty
                </p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Say "Show vegetables" or "Search for basmati rice" to start adding fresh groceries.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 text-sm font-bold text-green-700 dark:text-green-400 underline"
              >
                Start Browsing Groceries
              </button>
            </div>
          ) : (
            <ul role="list" className="space-y-3" aria-label="Cart items list">
              {cartItems.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 flex items-center justify-between gap-3"
                  aria-label={`${quantity} units of ${product.name}, price ${Math.round(product.price * quantity)} rupees`}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-14 h-14 object-contain rounded-lg bg-white p-1"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      ₹{Math.round(product.price)} / {product.unit}
                    </p>
                    <p className="text-xs font-bold text-green-700 dark:text-green-400 mt-0.5">
                      Subtotal: ₹{Math.round(product.price * quantity)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2 py-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-bold text-xs min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2 py-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart Bottom Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-4">
            
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Promo Code: WELCOME50 or FRESH10"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 uppercase"
                aria-label="Enter promotional discount code"
              />
              <button
                type="submit"
                className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl"
              >
                Apply
              </button>
            </form>

            {/* Active Coupon notification */}
            {couponCode && (
              <div className="flex items-center justify-between text-xs bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 p-2 rounded-lg">
                <span className="font-semibold">Coupon '{couponCode}' Active</span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-red-600 underline font-bold"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Bill Details */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{Math.round(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 dark:text-green-400 font-semibold">
                  <span>Discount</span>
                  <span>-₹{Math.round(discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-base font-black text-slate-900 dark:text-white">
                <span>Final Bill</span>
                <span className="text-green-700 dark:text-green-400">₹{Math.round(total)}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold text-base py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-green-400"
              aria-label={`Proceed to Checkout. Final total is ${Math.round(total)} rupees`}
            >
              <span>Proceed to Checkout (₹{Math.round(total)})</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Clear Cart link */}
            <div className="text-center">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline"
              >
                Empty Entire Cart
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
