import React from 'react';
import { 
  Apple, 
  Carrot, 
  Milk, 
  Wheat, 
  Boxes, 
  Cookie, 
  Coffee, 
  Croissant, 
  Sparkles, 
  Home,
  LayoutGrid
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const CATEGORY_ICONS = {
  'fruits': Apple,
  'vegetables': Carrot,
  'dairy-eggs': Milk,
  'rice-grains': Wheat,
  'pulses-lentils': Boxes,
  'snacks': Cookie,
  'beverages': Coffee,
  'bakery': Croissant,
  'personal-care': Sparkles,
  'household': Home
};

export default function CategoryNav({
  categories = [],
  activeCategory,
  onSelectCategory
}) {
  const { announce } = useAccessibility();

  const handleCategoryClick = (catId, catName) => {
    onSelectCategory(catId);
    if (catId === 'all') {
      announce("Showing all grocery categories", 'polite');
    } else {
      announce(`Showing ${catName} category`, 'polite');
    }
  };

  return (
    <nav 
      aria-label="Grocery Categories" 
      className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 shadow-sm"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Explore 10 Grocery Categories
          </h2>
          <span className="text-xs text-slate-500">
            Say e.g. "Show vegetables" or "Show dairy"
          </span>
        </div>

        {/* Categories scrollable flex or grid */}
        <div 
          role="tablist"
          className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300"
        >
          {/* All button */}
          <button
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => handleCategoryClick('all', 'All Products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-green-600 ${
              activeCategory === 'all'
                ? 'bg-green-700 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>All Groceries</span>
          </button>

          {categories.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.id] || LayoutGrid;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleCategoryClick(cat.id, cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-green-600 ${
                  isSelected
                    ? 'bg-green-700 text-white font-bold shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
                aria-label={`Category ${cat.name}, ${cat.product_count || 0} products available`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-green-700 dark:text-green-400'}`} />
                <span>{cat.name}</span>
                {cat.product_count !== undefined && (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-green-800 text-green-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {cat.product_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
