import React from 'react';
import { 
  Mic, 
  Volume2, 
  Sparkles, 
  ListPlus, 
  Percent, 
  ShieldCheck, 
  Clock, 
  Navigation,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function HeroBanner({
  onStartVoice,
  assistantState,
  openBudgetModal,
  openShoppingListModal,
  onSelectCategory,
  onShowDeals
}) {
  const { simplifiedMode } = useAccessibility();

  if (simplifiedMode) {
    return (
      <section 
        id="main-content" 
        className="bg-green-50 dark:bg-slate-900 border-b border-green-200 dark:border-slate-800 py-6 px-4"
        aria-label="Welcome and Quick Voice Shopping"
      >
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-green-900 dark:text-green-400">
            VoiceCart Simplified Mode
          </h1>
          <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300">
            Press the large microphone button or say voice commands to browse groceries, manage your cart, and checkout.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={onStartVoice}
              className="bg-green-700 hover:bg-green-800 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3 focus:ring-4 focus:ring-green-400"
              aria-label="Activate Voice Assistant. Say what you need."
            >
              <Mic className="w-7 h-7" />
              <span>{assistantState === 'listening' ? 'Listening... Speak Now' : 'Start Shopping with Voice'}</span>
            </button>
            <button
              onClick={() => openBudgetModal(1000)}
              className="bg-white dark:bg-slate-800 text-green-800 dark:text-green-300 border-2 border-green-700 font-bold text-lg px-6 py-4 rounded-2xl focus:ring-4 focus:ring-green-400"
            >
              Budget Assistant (₹1000)
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="main-content"
      className="relative overflow-hidden bg-gradient-to-b from-green-900 via-green-800 to-green-900 text-white py-10 sm:py-16 px-4"
      aria-label="VoiceCart Grocery Experience"
    >
      {/* Background soft subtle circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-700/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Welcoming Header & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-medium text-green-200">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>Voice-Guided Grocery Shopping • WCAG 2.2 AA Certified</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Shop Independently, <br />
              <span className="text-amber-400">Shop Confidently.</span>
            </h1>

            <p className="text-base sm:text-lg text-green-100 max-w-2xl font-normal leading-relaxed">
              Designed specifically for blind and visually impaired shoppers. Browse daily fresh groceries, compare prices, manage your cart, and place orders completely through speech and accessible controls.
            </p>

            {/* Main Interactive CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button
                onClick={onStartVoice}
                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${
                  assistantState === 'listening'
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse focus:ring-red-300'
                    : assistantState === 'speaking'
                    ? 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-300'
                    : 'bg-white hover:bg-green-50 text-green-900 focus:ring-yellow-400'
                }`}
                aria-label={
                  assistantState === 'listening'
                    ? 'Assistant is listening. Speak your request now.'
                    : 'Start Shopping with Voice button'
                }
              >
                <div className={`p-2 rounded-full ${assistantState === 'listening' ? 'bg-red-600 text-white' : 'bg-green-700 text-white'}`}>
                  <Mic className="w-6 h-6" />
                </div>
                <span>
                  {assistantState === 'listening'
                    ? 'Listening... Speak Now'
                    : assistantState === 'speaking'
                    ? 'Speaking Response...'
                    : 'Start Shopping with Voice'}
                </span>
              </button>

              <button
                onClick={() => openShoppingListModal()}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-base bg-green-700/60 hover:bg-green-700 text-white border border-white/20 flex items-center justify-center gap-2 focus:ring-4 focus:ring-white/40"
                aria-label="Create grocery shopping list by voice or text"
              >
                <ListPlus className="w-5 h-5" />
                <span>Voice Grocery List</span>
              </button>
            </div>

            {/* Quick Voice Command Hints */}
            <div className="pt-2">
              <p className="text-xs text-green-200 uppercase tracking-wider font-semibold mb-2">
                Try saying aloud or clicking:
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start text-xs">
                {[
                  "Search for basmati rice",
                  "Show vegetables",
                  "Add milk to cart",
                  "Budget 1000 rupees",
                  "What is in my cart?",
                  "Checkout"
                ].map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onStartVoice();
                    }}
                    className="bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg text-green-100 hover:text-white transition-colors focus:ring-2 focus:ring-white"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Vocal Guide Cards (inspired by Blinkit & Vocal Guide mockups) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Vocal Guide Voice-First */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl space-y-3 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-green-950 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Voice-First Journey</h2>
              <p className="text-xs text-green-100 leading-relaxed">
                Complete your shopping without needing a screen. The assistant speaks every action, product price, and total.
              </p>
            </div>

            {/* Card 2: Smart Budget Assistant */}
            <div 
              onClick={() => openBudgetModal(1000)}
              className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl space-y-3 hover:bg-white/15 transition-colors cursor-pointer group"
              role="button"
              tabIndex={0}
              aria-label="Open Smart Budget Assistant tool"
              onKeyDown={(e) => { if (e.key === 'Enter') openBudgetModal(1000); }}
            >
              <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-amber-300 flex items-center justify-between">
                <span>Budget Assistant</span>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              </h2>
              <p className="text-xs text-green-100 leading-relaxed">
                Say "I have a budget of 1000 rupees" and we'll automatically select an essential balanced grocery basket.
              </p>
            </div>

            {/* Card 3: Rapid Express Delivery */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl space-y-3 hover:bg-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-green-950 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Express Delivery</h2>
              <p className="text-xs text-green-100 leading-relaxed">
                Choose convenient slots: Instant 30 minutes express, evening 6 to 8 PM, or tomorrow morning.
              </p>
            </div>

            {/* Card 4: Verified Fresh Groceries */}
            <div 
              onClick={onShowDeals}
              className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl space-y-3 hover:bg-white/15 transition-colors cursor-pointer group"
              role="button"
              tabIndex={0}
              aria-label="View Today's Grocery Deals"
              onKeyDown={(e) => { if (e.key === 'Enter') onShowDeals(); }}
            >
              <div className="w-10 h-10 rounded-xl bg-red-400 text-green-950 flex items-center justify-center font-bold">
                <Percent className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white group-hover:text-amber-300 flex items-center justify-between">
                <span>Today's Top Deals</span>
                <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100" />
              </h2>
              <p className="text-xs text-green-100 leading-relaxed">
                Exclusive offers on fresh milk, basmati rice, potatoes, and cooking oil. Free delivery above ₹499.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
