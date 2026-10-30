import React from 'react';
import { 
  ShoppingBag, 
  Mic, 
  MicOff, 
  Settings, 
  Search, 
  HelpCircle, 
  Volume2, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCart } from '../context/CartContext';

export default function Header({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onStartVoice,
  assistantState,
  isVoiceMode,
  setIsVoiceMode,
  openSettingsModal,
  openCartDrawer,
  openHelpModal,
  openBudgetModal,
  openShoppingListModal
}) {
  const { voiceEnabled, contrastMode, simplifiedMode } = useAccessibility();
  const { itemCount, total } = useCart();

  const isYellowBlack = contrastMode === 'yellow-black';
  const isDarkContrast = contrastMode === 'high-contrast-dark';

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200 transition-colors dark:bg-slate-900">
      {/* Skip links for keyboard/screen reader navigation */}
      <div className="sr-only focus-within:not-sr-only">
        <a 
          href="#main-content" 
          className="absolute top-2 left-2 bg-green-700 text-white font-bold p-3 z-50 rounded shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          Skip to main content
        </a>
        <a 
          href="#voice-assistant-section" 
          className="absolute top-2 left-44 bg-green-700 text-white font-bold p-3 z-50 rounded shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          Skip to Voice Assistant
        </a>
      </div>

      {/* Top Utility Bar */}
      <div className="bg-green-800 text-white text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide">VoiceCart Accessibility:</span>
            <span>Independent grocery shopping for blind and visually impaired users</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="hidden md:inline font-mono bg-green-900 px-2 py-0.5 rounded border border-green-700">
              Voice Shortcut: Alt + V
            </span>
            <span className="hidden md:inline font-mono bg-green-900 px-2 py-0.5 rounded border border-green-700">
              Cart: Alt + C
            </span>
            <button
              onClick={openHelpModal}
              className="flex items-center gap-1 underline hover:text-green-200 focus:ring-2 focus:ring-white rounded p-0.5"
              aria-label="Open Voice and Keyboard Help Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Help & Commands
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <a 
              href="/" 
              className="group flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-green-600 rounded-lg p-1"
              aria-label="VoiceCart Home - Shop Independently, Shop Confidently"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-green-900 dark:text-green-400">
                  Voice<span className="text-amber-600">Cart</span>
                </span>
                <p className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 tracking-tight hidden sm:block">
                  Shop Independently, Shop Confidently
                </p>
              </div>
            </a>
          </div>

          {/* Accessible Search Input */}
          <form 
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit(searchQuery);
            }} 
            className="flex-1 max-w-xl hidden sm:block"
          >
            <div className="relative">
              <label htmlFor="search-groceries-input" className="sr-only">
                Search groceries by name, brand, or category
              </label>
              <input
                id="search-groceries-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 'milk', 'basmati rice', 'atta'..."
                className="w-full pl-11 pr-24 py-2.5 rounded-full border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none text-base"
                aria-label="Search groceries input"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={onStartVoice}
                  className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                  aria-label="Search using voice"
                  title="Search using voice"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Start Shopping with Voice - High Priority Primary CTA */}
            <button
              onClick={onStartVoice}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base shadow-sm transition-all focus:outline-none focus:ring-4 ${
                assistantState === 'listening'
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse focus:ring-red-400'
                  : assistantState === 'speaking'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-400'
                  : 'bg-green-700 hover:bg-green-800 text-white focus:ring-green-300'
              }`}
              aria-label={
                assistantState === 'listening' 
                  ? 'Listening to voice. Press to stop.' 
                  : 'Start shopping with voice assistant'
              }
            >
              <Mic className="w-5 h-5" />
              <span className="hidden sm:inline">
                {assistantState === 'listening' 
                  ? 'Listening...' 
                  : assistantState === 'speaking'
                  ? 'Speaking...'
                  : 'Start Voice'}
              </span>
              <span className="sm:hidden">Voice</span>
            </button>

            {/* Smart Tools Dropdown / Quick triggers */}
            <button
              onClick={() => openBudgetModal(1000)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              aria-label="Open Budget Grocery Assistant"
              title="Budget Assistant"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Budget Assistant
            </button>

            {/* Accessibility Settings Button */}
            <button
              onClick={openSettingsModal}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-green-600 font-medium text-xs sm:text-sm"
              aria-label="Accessibility Settings: Configure voice, speed, contrast and font size"
              title="Accessibility Settings"
            >
              <Settings className="w-5 h-5 text-green-700 dark:text-green-400" />
              <span className="hidden md:inline">Accessibility</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              className="relative flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-600 text-emerald-900 dark:text-emerald-200 px-3 sm:px-4 py-2 rounded-xl hover:bg-emerald-100 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
              aria-label={`Shopping Cart with ${itemCount} items, total ${Math.round(total)} rupees`}
            >
              <ShoppingBag className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
              <div className="flex flex-col text-left text-xs leading-none">
                <span className="font-extrabold text-sm sm:text-base">₹{Math.round(total)}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <form 
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit(searchQuery);
          }} 
          className="mt-3 block sm:hidden"
        >
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries..."
              className="w-full pl-9 pr-20 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 text-sm"
              aria-label="Search groceries on mobile"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
              <button
                type="button"
                onClick={onStartVoice}
                className="p-1 text-green-700 mr-1"
                aria-label="Voice search"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                className="bg-green-700 text-white text-xs px-2.5 py-1 rounded"
              >
                Go
              </button>
            </div>
          </div>
        </form>
      </div>
    </header>
  );
}
