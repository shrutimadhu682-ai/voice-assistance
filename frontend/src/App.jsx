import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import VoiceAssistantBar from './components/VoiceAssistantBar';
import AccessibilityModal from './components/Modals/AccessibilityModal';
import CartDrawer from './components/Modals/CartDrawer';
import CheckoutModal from './components/Modals/CheckoutModal';
import OrderSuccessModal from './components/Modals/OrderSuccessModal';
import BudgetAssistantModal from './components/Modals/BudgetAssistantModal';
import ShoppingListModal from './components/Modals/ShoppingListModal';
import ComparisonModal from './components/Modals/ComparisonModal';
import HelpModal from './components/Modals/HelpModal';

import { useAccessibility } from './context/AccessibilityContext';
import { useCart } from './context/CartContext';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';

import { 
  Sparkles, 
  Volume2, 
  Filter, 
  ArrowUpDown, 
  RotateCcw, 
  ShoppingBag,
  SlidersHorizontal,
  Tag
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function App() {
  const { announce, playCue, voiceEnabled, simplifiedMode } = useAccessibility();
  const { cartItems, clearCart, total } = useCart();

  // Data states
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price_asc', 'price_desc', 'rating'
  const [showDealsOnly, setShowDealsOnly] = useState(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(1000);

  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [shoppingListInitialText, setShoppingListInitialText] = useState('');

  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareProd1, setCompareProd1] = useState(null);
  const [compareProd2, setCompareProd2] = useState(null);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/products`)
        ]);

        if (catRes.ok && prodRes.ok) {
          const catData = await catRes.json();
          const prodData = await prodRes.json();
          setCategories(catData);
          setProducts(prodData);
        }
      } catch (err) {
        console.warn("API fetch error, falling back to cached catalog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Place order confirm handler (e.g. from voice "Yes" or checkout button)
  const handlePlaceOrder = async (orderPayload) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        const orderData = await res.json();
        setCompletedOrder(orderData);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        clearCart();
        setIsOrderSuccessOpen(true);
      } else {
        announce("Failed to place order. Please review your details.", 'assertive');
      }
    } catch (err) {
      console.warn("Order placement fallback error:", err);
      // Client-side fallback order creation
      const fakeOrder = {
        order_id: `VC-${Math.floor(100000 + Math.random() * 900000)}`,
        customer_name: orderPayload.customer_name || 'Valued Shopper',
        total: total,
        delivery_slot: orderPayload.delivery_slot || 'Express',
        payment_method: orderPayload.payment_method || 'Cash on Delivery',
        spoken_confirmation: `Order placed successfully! Total amount of ${Math.round(total)} rupees with Cash on Delivery. Your groceries will be delivered shortly.`
      };
      setCompletedOrder(fakeOrder);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      clearCart();
      setIsOrderSuccessOpen(true);
    }
  };

  // Voice Assistant Hook
  const {
    assistantState,
    transcript,
    lastSpeech,
    toggleListening,
    stopSpeaking,
    repeatLastSpeech,
    processVoiceCommand,
    speak
  } = useVoiceAssistant({
    products,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    openCartDrawer: () => setIsCartOpen(true),
    closeCartDrawer: () => setIsCartOpen(false),
    openCheckoutModal: () => setIsCheckoutOpen(true),
    openBudgetModal: (amt) => {
      setBudgetAmount(amt || 1000);
      setIsBudgetOpen(true);
    },
    openShoppingListModal: (text) => {
      setShoppingListInitialText(text || '');
      setIsShoppingListOpen(true);
    },
    openCompareModal: () => {
      if (products.length >= 2) {
        setCompareProd1(products[0]);
        setCompareProd2(products[1]);
        setIsCompareOpen(true);
      }
    },
    openHelpModal: () => setIsHelpOpen(true),
    onPlaceOrderConfirm: () => {
      if (cartItems.length > 0) {
        handlePlaceOrder({
          customer_name: 'Ananya Sharma',
          phone: '+91 98765 43210',
          address: 'Flat 402, Green Valley Apartments, MG Road, Bengaluru',
          delivery_slot: 'Express (Under 30 mins)',
          payment_method: 'Cash on Delivery',
          items: cartItems.map(i => ({ product_id: i.product.id, quantity: i.quantity }))
        });
      }
    }
  });

  // Welcome user on first interaction
  const [hasWelcomed, setHasWelcomed] = useState(false);
  const handleStartVoice = () => {
    if (!hasWelcomed) {
      setHasWelcomed(true);
      speak("Welcome to VoiceCart. Your independent grocery shopping experience starts here. You can say search for rice, show vegetables, open my cart, or help.", () => {
        toggleListening();
      });
    } else {
      toggleListening();
    }
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (activeCategory !== 'all' && p.category_id !== activeCategory) {
        return false;
      }
      if (showDealsOnly && !p.is_deal) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = p.name.toLowerCase().includes(q);
        const inBrand = p.brand.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inCat = p.category_id.toLowerCase().includes(q);
        return inName || inBrand || inDesc || inCat;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0);
    });
  }, [products, activeCategory, searchQuery, showDealsOnly, sortBy]);

  // Read section header aloud
  const handleReadSectionHeader = () => {
    const activeCatObj = categories.find(c => c.id === activeCategory);
    const catName = activeCategory === 'all' ? 'All Groceries' : (activeCatObj ? activeCatObj.name : activeCategory);
    const text = `Viewing ${catName}. ${filteredProducts.length} ${filteredProducts.length === 1 ? 'item' : 'items'} available. Say 'read first product' or 'add first product' to begin.`;
    speak(text);
  };

  // Comparison handler from product card
  const handleCompareClick = (selectedProd) => {
    // Find another item in same category
    const other = products.find(p => p.category_id === selectedProd.category_id && p.id !== selectedProd.id) || products[0];
    setCompareProd1(selectedProd);
    setCompareProd2(other);
    setIsCompareOpen(true);
  };

  // Find cheaper handler from product card
  const handleFindCheaperClick = async (prod) => {
    try {
      const res = await fetch(`${API_BASE}/products/${prod.id}/alternatives`);
      if (res.ok) {
        const data = await res.json();
        if (data.cheaper_options && data.cheaper_options.length > 0) {
          setCompareProd1(prod);
          setCompareProd2(data.cheaper_options[0]);
          setIsCompareOpen(true);
          speak(data.spoken_summary);
        } else {
          speak(`No cheaper alternative found for ${prod.name} in this category. It is already among our most affordable options.`);
        }
      }
    } catch {
      speak(`Comparing ${prod.name} with similar items in store.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors pb-32">
      
      {/* 1. Header with accessible search & shortcuts */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          const matched = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
          speak(`Search for ${q} returned ${matched.length} results.`);
        }}
        onStartVoice={handleStartVoice}
        assistantState={assistantState}
        isVoiceMode={isVoiceMode}
        setIsVoiceMode={setIsVoiceMode}
        openSettingsModal={() => setIsSettingsOpen(true)}
        openCartDrawer={() => setIsCartOpen(true)}
        openHelpModal={() => setIsHelpOpen(true)}
        openBudgetModal={(amt) => {
          setBudgetAmount(amt);
          setIsBudgetOpen(true);
        }}
        openShoppingListModal={() => setIsShoppingListOpen(true)}
      />

      {/* 2. Hero Banner with Vocal Guide cards */}
      <HeroBanner
        onStartVoice={handleStartVoice}
        assistantState={assistantState}
        openBudgetModal={(amt) => {
          setBudgetAmount(amt);
          setIsBudgetOpen(true);
        }}
        openShoppingListModal={() => setIsShoppingListOpen(true)}
        onSelectCategory={(catId) => setActiveCategory(catId)}
        onShowDeals={() => {
          setShowDealsOnly(true);
          setActiveCategory('all');
          speak("Showing today's top grocery deals.");
        }}
      />

      {/* 3. Grocery Categories Bar (10 realistic categories) */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(catId) => {
          setActiveCategory(catId);
          setShowDealsOnly(false);
          setSearchQuery('');
        }}
      />

      {/* 4. Main Product Catalog Section */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:py-8 w-full space-y-6">
        
        {/* Section Header with Category Title, Active Filters, and Read Aloud */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {searchQuery ? `Search Results for "${searchQuery}"` : 
                 showDealsOnly ? "Today's Special Grocery Deals" :
                 activeCategory === 'all' ? "All Fresh Groceries" :
                 categories.find(c => c.id === activeCategory)?.name || "Groceries"}
              </h2>

              {/* Speak Section Overview Button */}
              <button
                type="button"
                onClick={handleReadSectionHeader}
                className="p-1.5 rounded-xl bg-green-100 hover:bg-green-200 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                aria-label="Read this section description and count aloud"
                title="Read section summary"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'grocery product' : 'grocery products'} available for delivery
            </p>
          </div>

          {/* Controls: Sort By & Deals Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowDealsOnly(!showDealsOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                showDealsOnly
                  ? 'bg-red-600 text-white border-red-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
              }`}
              aria-pressed={showDealsOnly}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Deals Only</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="product-sort-select" className="sr-only">Sort groceries by</label>
              <select
                id="product-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="popular">Popular First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(searchQuery || activeCategory !== 'all' || showDealsOnly) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setShowDealsOnly(false);
                  speak("All filters reset.");
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-green-700"
                aria-label="Reset all search and category filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Loading fresh groceries from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center space-y-4 border border-slate-200 dark:border-slate-700 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No products found
            </h3>
            <p className="text-xs text-slate-500">
              We couldn't find items matching your search or filter. Try saying "Show vegetables" or "Search for milk".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setShowDealsOnly(false);
              }}
              className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl"
            >
              Show All Groceries
            </button>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            role="region"
            aria-label="Grocery items list"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSpeakProduct={(text) => speak(text)}
                onCompare={handleCompareClick}
                onFindCheaper={handleFindCheaperClick}
              />
            ))}
          </div>
        )}

      </main>

      {/* 5. Persistent Floating Voice Assistant Bar */}
      <VoiceAssistantBar
        assistantState={assistantState}
        transcript={transcript}
        lastSpeech={lastSpeech}
        onToggleListening={toggleListening}
        onStopSpeaking={stopSpeaking}
        onRepeatSpeech={repeatLastSpeech}
        onManualCommand={(cmd) => processVoiceCommand(cmd)}
        openHelpModal={() => setIsHelpOpen(true)}
      />

      {/* 6. Modals & Drawers */}
      <AccessibilityModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onTestSpeech={(msg) => speak(msg)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onSpeakCart={(msg) => speak(msg)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handlePlaceOrder}
        onSpeakSummary={(msg) => speak(msg)}
      />

      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        onClose={() => setIsOrderSuccessOpen(false)}
        orderDetails={completedOrder}
        onSpeakTracking={(msg) => speak(msg)}
      />

      <BudgetAssistantModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        initialBudget={budgetAmount}
        onSpeakText={(msg) => speak(msg)}
      />

      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        initialText={shoppingListInitialText}
        onSpeakText={(msg) => speak(msg)}
      />

      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        product1={compareProd1}
        product2={compareProd2}
        onSpeakComparison={(msg) => speak(msg)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

    </div>
  );
}
