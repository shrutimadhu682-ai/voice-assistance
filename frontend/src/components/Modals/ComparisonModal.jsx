import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Volume2, 
  Check, 
  Star, 
  TrendingDown, 
  ShoppingBag 
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useCart } from '../../context/CartContext';

export default function ComparisonModal({
  isOpen,
  onClose,
  product1,
  product2,
  onSpeakComparison
}) {
  const { announce } = useAccessibility();
  const { addToCart } = useCart();
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    if (isOpen && product1 && product2) {
      const priceDiff = Math.abs(product1.price - product2.price);
      const cheaper = product1.price <= product2.price ? product1 : product2;
      const speech = `Comparing ${product1.name} at ${Math.round(product1.price)} rupees against ${product2.name} at ${Math.round(product2.price)} rupees. ${cheaper.name} is cheaper by ${Math.round(priceDiff)} rupees. ${product1.name} has rating ${product1.rating} stars, while ${product2.name} has ${product2.rating} stars.`;
      
      setComparisonData({
        p1: product1,
        p2: product2,
        priceDiff,
        cheaperId: cheaper.id,
        spoken: speech
      });

      if (onSpeakComparison) {
        onSpeakComparison(speech);
      } else {
        announce(speech, 'assertive');
      }
    }
  }, [isOpen, product1, product2, onSpeakComparison, announce]);

  if (!isOpen || !product1 || !product2) return null;

  const handleSpeakAloud = () => {
    if (comparisonData && onSpeakComparison) {
      onSpeakComparison(comparisonData.spoken);
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <div>
              <h2 id="compare-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Product Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Spoken comparison of price, pack size, brand, and reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakAloud}
              className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200"
              aria-label="Replay comparison audio"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              aria-label="Close comparison"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Spoken Announcement banner */}
        {comparisonData && (
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 text-xs sm:text-sm text-purple-900 dark:text-purple-200">
            <p className="font-medium">{comparisonData.spoken}</p>
          </div>
        )}

        {/* Side by side product comparison table / cards */}
        <div className="grid grid-cols-2 gap-4">
          {[product1, product2].map((p) => {
            const isCheaper = comparisonData && comparisonData.cheaperId === p.id;
            return (
              <div 
                key={p.id}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between space-y-3 ${
                  isCheaper 
                    ? 'border-green-600 bg-green-50/40 dark:bg-green-950/20' 
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                }`}
              >
                <div className="space-y-2">
                  {isCheaper && (
                    <span className="inline-flex items-center gap-1 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      <TrendingDown className="w-3 h-3" />
                      More Affordable
                    </span>
                  )}
                  <img src={p.image_url} alt="" className="h-28 mx-auto object-contain" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Brand: <strong className="text-slate-800 dark:text-slate-200">{p.brand}</strong></p>
                    <p>Pack size: <strong className="text-slate-800 dark:text-slate-200">{p.unit}</strong></p>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{p.rating} / 5</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{Math.round(p.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(p, 1);
                      onClose();
                    }}
                    className="bg-green-700 hover:bg-green-800 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Choose</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border text-slate-600 font-bold"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
}
