import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FilterSortBar = ({
  filters,
  activeFilter,
  onFilterChange,
  sortOptions,
  activeSort,
  onSortChange,
}) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full z-40 transition-all duration-300 ${
        isSticky
          ? "fixed top-[70px] shadow-lg bg-warm-ivory py-4"
          : "relative py-8 bg-warm-ivory"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Filters - Horizontal Scroll on Mobile */}
        <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-2 md:pb-0">
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${
                  activeFilter === filter
                    ? "bg-gold-accent text-charcoal-black border-gold-accent"
                    : "bg-transparent text-slate-gray border-slate-gray/30 hover:border-gold-accent hover:text-charcoal-black"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Sort - Desktop: Right aligned, Mobile: Full width/Dropdown feel */}
        <div className="flex items-center gap-2 text-sm text-slate-gray w-full md:w-auto justify-end">
          <span className="hidden md:inline">Sort by:</span>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent border border-slate-gray/30 rounded-lg px-3 py-2 focus:outline-none focus:border-gold-accent text-charcoal-black cursor-pointer font-inter"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSortBar;
