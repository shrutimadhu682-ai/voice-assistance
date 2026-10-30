import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Volume2, 
  Plus, 
  ShoppingBag, 
  Check, 
  IndianRupee,
  Coins
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useCart } from '../../context/CartContext';

export default function BudgetAssistantModal({
  isOpen,
  onClose,
  initialBudget = 1000,
  onSpeakText
}) {
  const [budget, setBudget] = useState(initialBudget);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { announce, playCue } = useAccessibility();
  const { addToCart } = useCart();

  useEffect(() => {
    if (initialBudget) {
      setBudget(initialBudget);
    }
  }, [initialBudget]);

  const fetchBudgetBasket = async (amount) => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/budget-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: amount })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        if (onSpeakText) {
          onSpeakText(data.spoken_summary);
        } else {
          announce(data.spoken_summary, 'assertive');
        }
      }
    } catch (err) {
      console.warn("Budget assistant API fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBudgetBasket(budget);
    }
  }, [isOpen, budget]);

  if (!isOpen) return null;

  const handleAddAllToCart = () => {
    if (!result || !result.items) return;
    result.items.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    playCue('success');
    const msg = `Added ${result.items.length} budget-optimized items to your cart!`;
    if (onSpeakText) {
      onSpeakText(msg);
    } else {
      announce(msg, 'assertive');
    }
    onClose();
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="budget-assistant-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 id="budget-assistant-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Smart Budget Assistant
              </h2>
              <p className="text-xs text-slate-500">
                Balanced grocery essentials tailored to your spending limit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            aria-label="Close budget assistant"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Budget Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Select Your Target Budget
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[300, 500, 1000, 1500].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setBudget(amt)}
                className={`py-2 px-3 rounded-xl border-2 font-black text-sm text-center ${
                  budget === amt
                    ? 'border-green-600 bg-green-50 dark:bg-green-950/60 text-green-900 dark:text-green-100 ring-2 ring-green-600/30'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Spoken Summary Pill */}
        {result && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
              <span>Optimized Basket ({result.items.length} items)</span>
              <span className="text-green-700 dark:text-green-400">
                ₹{Math.round(result.total_cost)} (₹{Math.round(result.remaining_balance)} balance left)
              </span>
            </div>
            <p className="text-slate-500 text-xs">
              {result.spoken_summary}
            </p>
          </div>
        )}

        {/* Selected Items List */}
        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <p className="text-center py-6 text-sm text-slate-500">Calculating optimal grocery basket...</p>
          ) : result && result.items ? (
            result.items.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2">
                  <img src={item.product.image_url} alt="" className="w-9 h-9 object-contain rounded" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.product.name}</p>
                    <p className="text-xs text-slate-500">{item.product.unit}</p>
                  </div>
                </div>
                <span className="font-black text-slate-900 dark:text-white">
                  ₹{Math.round(item.product.price)}
                </span>
              </div>
            ))
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleAddAllToCart}
            className="w-full flex-1 bg-green-700 hover:bg-green-800 text-white font-black text-base py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 focus:ring-4 focus:ring-green-400"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add Basket to Cart (₹{result ? Math.round(result.total_cost) : 0})</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border text-slate-600 font-bold"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
