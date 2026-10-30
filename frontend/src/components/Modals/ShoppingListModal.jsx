import React, { useState, useEffect } from 'react';
import { 
  X, 
  ListPlus, 
  Mic, 
  Send, 
  ShoppingBag, 
  Check, 
  Volume2,
  Trash2
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useCart } from '../../context/CartContext';

export default function ShoppingListModal({
  isOpen,
  onClose,
  initialText = '',
  onSpeakText
}) {
  const [inputText, setInputText] = useState(initialText || 'milk, basmati rice, potatoes, apples');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const { announce, playCue } = useAccessibility();
  const { addToCart } = useCart();

  const handleParseList = async (textToParse) => {
    if (!textToParse.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/shopping-list/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToParse })
      });
      if (res.ok) {
        const data = await res.json();
        setParsedData(data);
        if (onSpeakText) {
          onSpeakText(data.spoken_summary);
        } else {
          announce(data.spoken_summary, 'assertive');
        }
      }
    } catch (err) {
      console.warn("Shopping list parse failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialText) {
        setInputText(initialText);
        handleParseList(initialText);
      } else {
        handleParseList(inputText);
      }
    }
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  const handleAddAllToCart = () => {
    if (!parsedData || !parsedData.matched_items) return;
    parsedData.matched_items.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    playCue('success');
    const msg = `Added ${parsedData.matched_items.length} items from your shopping list to your cart!`;
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
      aria-labelledby="shopping-list-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
              <ListPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 id="shopping-list-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Voice Shopping List
              </h2>
              <p className="text-xs text-slate-500">
                Dictate groceries to find and bundle them instantly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            aria-label="Close shopping list"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Input box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleParseList(inputText);
          }}
          className="space-y-2"
        >
          <label htmlFor="list-input" className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Dictated or Typed Groceries (comma or 'and' separated)
          </label>
          <div className="relative">
            <input
              id="list-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., milk, rice, potatoes, apples, bread"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium pr-24"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
            >
              Find Items
            </button>
          </div>
        </form>

        {/* Spoken Summary */}
        {parsedData && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
            <p className="font-semibold">{parsedData.spoken_summary}</p>
          </div>
        )}

        {/* Matched Grocery Items */}
        <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <p className="text-center py-6 text-sm text-slate-500">Matching grocery items in catalog...</p>
          ) : parsedData && parsedData.matched_items && parsedData.matched_items.length > 0 ? (
            parsedData.matched_items.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <img src={item.product.image_url} alt="" className="w-10 h-10 object-contain rounded" />
                  <div>
                    <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                      Matched for "{item.query}"
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white">{item.product.name}</p>
                    <p className="text-xs text-slate-500">{item.product.unit}</p>
                  </div>
                </div>
                <span className="font-black text-slate-900 dark:text-white">
                  ₹{Math.round(item.product.price)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-slate-400 py-4">No matching items yet. Type grocery names above.</p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            disabled={!parsedData || !parsedData.matched_items || parsedData.matched_items.length === 0}
            onClick={handleAddAllToCart}
            className="w-full flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-black text-base py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 focus:ring-4 focus:ring-green-400"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Add All Matched to Cart (₹{parsedData ? Math.round(parsedData.estimated_total) : 0})</span>
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
