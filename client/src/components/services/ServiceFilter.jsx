import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  ChevronDown,
  Check,
  ArrowUpDown,
  X,
} from "lucide-react";

const categoryFilters = [
  "All Services",
  "Weddings",
  "Events",
  "Portraits",
  "Commercial",
  "Custom Packages",
];

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹15,000", min: 0, max: 15000 },
  { label: "₹15,000 - ₹30,000", min: 15000, max: 30000 },
  { label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
  { label: "Above ₹50,000", min: 50000, max: Infinity },
];

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
];

const ServiceFilter = ({
  activeFilter,
  setActiveFilter,
  activePriceFilter,
  setActivePriceFilter,
  sortBy,
  setSortBy,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Count active filters
  const activeFiltersCount =
    (activePriceFilter.label !== "All Prices" ? 1 : 0) +
    (sortBy !== "default" ? 1 : 0);

  // Clear all filters
  const clearFilters = () => {
    setActivePriceFilter(priceRanges[0]);
    setSortBy("default");
  };

  return (
    <div className="sticky top-20 z-50 bg-warm-ivory border-b border-muted-beige/30 py-4 shadow-md">
      {" "}
      {/* Adjusted top class */}
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Category Filters */}
          <div className="overflow-x-auto no-scrollbar flex-1">
            <div className="flex space-x-3 min-w-max">
              {categoryFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-inter font-medium transition-all duration-300 border ${
                    activeFilter === filter
                      ? "bg-linear-to-r from-gold-accent to-[#D4AF5F] text-charcoal-black border-transparent shadow-md"
                      : "bg-transparent text-slate-gray border-slate-gray/20 hover:border-gold-accent hover:text-gold-accent"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-inter font-medium transition-all duration-300 border ${
                isFilterOpen || activeFiltersCount > 0
                  ? "bg-charcoal-black text-warm-ivory border-charcoal-black"
                  : "bg-transparent text-slate-gray border-slate-gray/20 hover:border-charcoal-black hover:text-charcoal-black"
              }`}
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-accent text-charcoal-black text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Filter Dropdown Panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-muted-beige/30 overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-muted-beige/30">
                    <h3 className="font-playfair text-lg font-semibold text-charcoal-black">
                      Filters & Sort
                    </h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs font-inter text-gold-accent hover:text-charcoal-black transition-colors flex items-center gap-1"
                      >
                        <X size={12} />
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Price Range Section */}
                  <div className="px-5 py-4 border-b border-muted-beige/20">
                    <h4 className="font-inter text-sm font-semibold text-charcoal-black mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-accent"></span>
                      Price Range
                    </h4>
                    <div className="space-y-1">
                      {priceRanges.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => setActivePriceFilter(range)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-inter transition-all duration-200 ${
                            activePriceFilter.label === range.label
                              ? "bg-gold-accent/10 text-charcoal-black"
                              : "text-slate-gray hover:bg-muted-beige/20 hover:text-charcoal-black"
                          }`}
                        >
                          <span>{range.label}</span>
                          {activePriceFilter.label === range.label && (
                            <Check size={16} className="text-gold-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Section */}
                  <div className="px-5 py-4">
                    <h4 className="font-inter text-sm font-semibold text-charcoal-black mb-3 flex items-center gap-2">
                      <ArrowUpDown size={14} className="text-gold-accent" />
                      Sort By
                    </h4>
                    <div className="space-y-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-inter transition-all duration-200 ${
                            sortBy === option.value
                              ? "bg-gold-accent/10 text-charcoal-black"
                              : "text-slate-gray hover:bg-muted-beige/20 hover:text-charcoal-black"
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && (
                            <Check size={16} className="text-gold-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="px-5 py-1 bg-muted-beige/10">
                    {" "}
                    {/* Reduced padding further and positioned closer to options */}
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full py-1.5 rounded-full bg-charcoal-black text-warm-ivory font-inter text-sm font-semibold hover:bg-gold-accent hover:text-charcoal-black transition-all duration-300"
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center gap-2 mt-4 pt-4 border-t border-muted-beige/20"
          >
            <span className="text-xs font-inter text-slate-gray">Active:</span>
            {activePriceFilter.label !== "All Prices" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-accent/10 text-charcoal-black text-xs font-inter">
                {activePriceFilter.label}
                <button
                  onClick={() => setActivePriceFilter(priceRanges[0])}
                  className="hover:text-gold-accent transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {sortBy !== "default" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-accent/10 text-charcoal-black text-xs font-inter">
                {sortOptions.find((o) => o.value === sortBy)?.label}
                <button
                  onClick={() => setSortBy("default")}
                  className="hover:text-gold-accent transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export { priceRanges, sortOptions };
export default ServiceFilter;
