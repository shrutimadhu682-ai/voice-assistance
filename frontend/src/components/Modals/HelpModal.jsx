import React from 'react';
import { 
  X, 
  HelpCircle, 
  Mic, 
  Keyboard, 
  Volume2, 
  Check, 
  ShoppingBag, 
  Sparkles,
  Command
} from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const commandGroups = [
    {
      title: "Browsing & Navigation",
      commands: [
        { phrase: "Show vegetables", desc: "Filters grocery items to fresh vegetables" },
        { phrase: "Show dairy", desc: "Opens dairy and eggs category" },
        { phrase: "Show fruits / Show rice / Show snacks", desc: "Browse any of our 10 grocery categories" },
        { phrase: "Go home", desc: "Returns to the main grocery storefront" }
      ]
    },
    {
      title: "Search & Read Aloud",
      commands: [
        { phrase: "Search for basmati rice", desc: "Finds brands like India Gate, Daawat, Fortune" },
        { phrase: "Read product details / Read first product", desc: "Speaks pack size, price in rupees, and description" },
        { phrase: "Tell me about the second product", desc: "Speaks information for the second item in list" },
        { phrase: "Clear search", desc: "Resets search filters" }
      ]
    },
    {
      title: "Cart & Quantity Management",
      commands: [
        { phrase: "Add the first one / Add first product", desc: "Adds the highlighted grocery item to your cart" },
        { phrase: "Add two packets of milk", desc: "Adds specific quantities via natural language" },
        { phrase: "What is in my cart? / Read my cart", desc: "Speaks complete cart inventory, subtotal, and delivery fee" },
        { phrase: "Tell me my total", desc: "Speaks current final order bill" },
        { phrase: "Remove the first item", desc: "Removes an item from cart" }
      ]
    },
    {
      title: "Smart Features & Checkout",
      commands: [
        { phrase: "Budget 1000 rupees", desc: "Builds a balanced essential grocery basket under ₹1000" },
        { phrase: "Add milk, rice and potatoes to my shopping list", desc: "Builds a grocery list and matches catalog items" },
        { phrase: "Search for cheaper alternatives", desc: "Finds lower-priced options in current category" },
        { phrase: "Checkout", desc: "Initiates purchase confirmation and delivery schedule" },
        { phrase: "Repeat that", desc: "Repeats the last spoken message" },
        { phrase: "Stop speaking", desc: "Immediately stops speech output" }
      ]
    }
  ];

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 id="help-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                VoiceCart Voice & Keyboard Guide
              </h2>
              <p className="text-xs text-slate-500">
                Accessible commands designed for 100% eyes-free grocery shopping
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
            aria-label="Close voice command guide"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Global Keyboard Shortcuts Table */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
            <Keyboard className="w-4 h-4 text-green-600" />
            <span>Accessible Keyboard Shortcuts</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border">Alt + V</kbd>
              <p className="text-[11px] text-slate-500 mt-1">Start / Stop Mic</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border">Alt + C</kbd>
              <p className="text-[11px] text-slate-500 mt-1">Open Cart</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border">Escape</kbd>
              <p className="text-[11px] text-slate-500 mt-1">Stop Speech / Close</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border">Tab</kbd>
              <p className="text-[11px] text-slate-500 mt-1">Announce Products</p>
            </div>
          </div>
        </div>

        {/* Command Groups List */}
        <div className="max-h-[45vh] overflow-y-auto space-y-4 pr-1">
          {commandGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-green-800 dark:text-green-400">
                {group.title}
              </h3>
              <div className="space-y-1.5">
                {group.commands.map((cmd, cIdx) => (
                  <div 
                    key={cIdx}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs sm:text-sm"
                  >
                    <span className="font-bold text-green-900 dark:text-green-300">
                      "{cmd.phrase}"
                    </span>
                    <span className="text-xs text-slate-500">
                      {cmd.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl"
          >
            Got it, Let's Shop!
          </button>
        </div>

      </div>
    </div>
  );
}
