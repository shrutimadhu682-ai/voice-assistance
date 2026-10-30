import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Volume2, 
  ArrowLeftRight, 
  Star, 
  CheckCircle2, 
  Tag, 
  ShoppingBag,
  TrendingDown
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({
  product,
  onSpeakProduct,
  onCompare,
  onFindCheaper
}) {
  const { autoPageRead, announce } = useAccessibility();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const [isFocused, setIsFocused] = useState(false);

  // Check if item is already in cart
  const cartItem = cartItems.find(i => i.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;

  // Speak this product aloud
  const handleHearDetails = () => {
    const text = `${product.name} by ${product.brand}. Pack size: ${product.unit}. Price: ${Math.round(product.price)} rupees. ${product.in_stock ? 'In stock' : 'Out of stock'}. ${product.description}. Press Add to Cart or say Add to Cart.`;
    if (onSpeakProduct) {
      onSpeakProduct(text);
    } else {
      announce(text, 'assertive');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (autoPageRead) {
      // Brief auditory readout when keyboard user tabs onto the card
      const prompt = `${product.name}, ${product.unit}, ${Math.round(product.price)} rupees. Press Enter or say Add to cart.`;
      if (onSpeakProduct) {
        onSpeakProduct(prompt);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <article
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={`${product.name}, Brand ${product.brand}, Price ${Math.round(product.price)} rupees, Unit ${product.unit}, ${product.in_stock ? 'In stock' : 'Out of stock'}`}
      className={`group relative bg-white dark:bg-slate-800 rounded-2xl border-2 transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
        isFocused 
          ? 'border-green-600 ring-2 ring-green-600/30' 
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Top badges: Stock status, Deals */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        {product.is_deal ? (
          <span className="bg-red-600 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
            Special Deal
          </span>
        ) : (
          <span className="bg-slate-900/80 backdrop-blur-sm text-white font-medium text-[10px] px-2 py-0.5 rounded-full">
            {product.brand}
          </span>
        )}

        {/* In Stock / Out of Stock Indicator */}
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm ${
          product.in_stock ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          <CheckCircle2 className="w-3 h-3" />
          {product.in_stock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative pt-8 pb-3 px-4 bg-slate-50 dark:bg-slate-900 flex items-center justify-center min-h-[170px] overflow-hidden">
        <img
          src={product.image_url}
          alt={`Photo of ${product.name}`}
          className="h-32 sm:h-36 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        
        {/* Quick Hear Details button overlay */}
        <button
          type="button"
          onClick={handleHearDetails}
          className="absolute bottom-2 right-2 bg-green-700 hover:bg-green-800 text-white p-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label={`Listen to details for ${product.name}`}
          title="Listen to product details"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Unit / Pack size */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
              {product.unit}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.rating_count})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
            {product.name}
          </h3>

          {/* Product Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and Action Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-end justify-between gap-2">
          {/* Pricing */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ₹{Math.round(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{Math.round(product.mrp)}
                </span>
              )}
            </div>
            {product.mrp && product.mrp > product.price && (
              <span className="text-[11px] font-bold text-green-700 dark:text-green-400">
                Save ₹{Math.round(product.mrp - product.price)}
              </span>
            )}
          </div>

          {/* Cart Quantity Control or ADD Button */}
          <div>
            {inCartQty > 0 ? (
              <div 
                className="flex items-center border-2 border-green-700 rounded-xl bg-green-50 dark:bg-green-950/60 overflow-hidden"
                role="group"
                aria-label={`Quantity selector for ${product.name}`}
              >
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, inCartQty - 1)}
                  className="px-2.5 py-1.5 text-green-800 dark:text-green-200 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  aria-label={`Decrease quantity of ${product.name}. Current is ${inCartQty}`}
                >
                  <Minus className="w-4 h-4 font-bold" />
                </button>
                <span 
                  className="px-2.5 font-extrabold text-sm text-green-900 dark:text-green-100 min-w-[24px] text-center"
                  aria-live="polite"
                >
                  {inCartQty}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, inCartQty + 1)}
                  className="px-2.5 py-1.5 text-green-800 dark:text-green-200 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                  aria-label={`Increase quantity of ${product.name}. Current is ${inCartQty}`}
                >
                  <Plus className="w-4 h-4 font-bold" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="bg-green-700 hover:bg-green-800 text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-green-600"
                aria-label={`Add ${product.name} to cart for ${Math.round(product.price)} rupees`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Quick Assistance Options */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={() => onFindCheaper(product)}
            className="flex items-center gap-1 hover:text-green-700 dark:hover:text-green-400 focus:ring-2 focus:ring-green-600 rounded px-1"
            aria-label={`Find cheaper alternatives to ${product.name}`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-green-600" />
            <span>Cheaper options</span>
          </button>

          <button
            type="button"
            onClick={() => onCompare(product)}
            className="flex items-center gap-1 hover:text-green-700 dark:hover:text-green-400 focus:ring-2 focus:ring-green-600 rounded px-1"
            aria-label={`Compare ${product.name} with another product`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-600" />
            <span>Compare</span>
          </button>
        </div>

      </div>
    </article>
  );
}
