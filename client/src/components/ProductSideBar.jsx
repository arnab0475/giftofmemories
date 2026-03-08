import React from "react";
import { Check } from "lucide-react";

const SidebarFilter = ({
  categories = [],
  selectedCategories = [],
  onToggleCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  clearFilters,
}) => {
  // Check if any filters are active so we know whether to show the "Clear All" button
  const hasActiveFilters = selectedCategories.length > 0 || minPrice || maxPrice;

  return (
    // FIX 1: Added 'sticky' so the sidebar travels down the screen with the user
    // Changed top-28 to top-32 to ensure it clears your fixed Navbar completely
    <aside className="hidden lg:block w-[280px] shrink-0 sticky top-32 h-fit z-10">
      
      {/* Container Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-charcoal-black/5 p-6 space-y-6">
        
        {/* Header Area */}
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-2xl font-playfair font-semibold text-charcoal-black">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-inter font-medium text-charcoal-black/50 hover:text-gold-accent transition-colors underline underline-offset-2"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Category Section */}
        {/* Removed <details> because on desktop, users usually want to see all filters at a glance */}
        <div className="border-t border-charcoal-black/10 pt-6">
          <h4 className="font-inter text-sm font-bold uppercase tracking-widest text-charcoal-black mb-4">
            Categories
          </h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat.name);
              return (
                <label
                  key={cat._id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleCategory(cat.name)}
                      className="peer sr-only" // Hide native HTML checkbox
                    />
                    {/* Custom Checkbox UI */}
                    <div
                      className={`w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center ${
                        isSelected
                          ? "bg-gold-accent border-gold-accent"
                          : "border-charcoal-black/20 bg-gray-50 group-hover:border-gold-accent"
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                  <span
                    className={`font-inter text-sm transition-colors ${
                      isSelected
                        ? "text-charcoal-black font-medium"
                        : "text-charcoal-black/70 group-hover:text-charcoal-black"
                    }`}
                  >
                    {cat.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Section */}
        <div className="border-t border-charcoal-black/10 pt-6">
          <h4 className="font-inter text-sm font-bold uppercase tracking-widest text-charcoal-black mb-4">
            Price Range
          </h4>
          <div className="flex items-center gap-3">
            
            {/* Min Input */}
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-black/40 text-sm font-inter">
                ₹
              </span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-charcoal-black/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-inter focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all bg-gray-50 hover:bg-white"
              />
            </div>
            
            <span className="text-charcoal-black/40">-</span>
            
            {/* Max Input */}
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-black/40 text-sm font-inter">
                ₹
              </span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-charcoal-black/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-inter focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all bg-gray-50 hover:bg-white"
              />
            </div>

          </div>
        </div>

      </div>
    </aside>
  );
};

export default SidebarFilter;