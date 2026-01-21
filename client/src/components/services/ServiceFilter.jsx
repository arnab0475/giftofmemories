import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown } from "lucide-react";

const ServiceFilter = ({ activeFilter, setActiveFilter, packages }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const toggleRef = useRef(null);
  const filterRef = useRef(null);

  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateFilter = (key, value) => {
    setActiveFilter((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="sticky top-[80px] z-40 bg-warm-ivory border-b border-muted-beige/30 py-4 shadow-sm">
      <div className="container mx-auto px-6 py-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Quick Package Filter (Pills) */}
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <div className="flex space-x-3 min-w-max">
              <button
                onClick={() => updateFilter("packageId", "all")}
                className={`px-5 py-2 rounded-full text-sm font-inter font-semibold transition-all duration-300 border whitespace-nowrap ${
                  activeFilter.packageId === "all"
                    ? "bg-gradient-to-r from-gold-accent to-[#D4AF5F] text-charcoal-black border-transparent shadow-md"
                    : "bg-transparent text-slate-gray border-slate-gray/20 hover:border-gold-accent hover:text-gold-accent"
                }`}
              >
                All Packages
              </button>
              {packages.map((pkg) => (
                <button
                  key={pkg._id}
                  onClick={() => updateFilter("packageId", pkg._id)}
                  className={`px-5 py-2 rounded-full text-sm font-inter font-semibold transition-all duration-300 border whitespace-nowrap ${
                    activeFilter.packageId === pkg._id
                      ? "bg-gradient-to-r from-gold-accent to-[#D4AF5F] text-charcoal-black border-transparent shadow-md"
                      : "bg-transparent text-slate-gray border-slate-gray/20 hover:border-gold-accent hover:text-gold-accent"
                  }`}
                >
                  {pkg.title}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filter Toggle */}
          <button
            ref={toggleRef}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-inter font-semibold transition-all duration-300 border ${
              isFilterOpen
                ? "bg-charcoal-black text-white border-charcoal-black"
                : "bg-white text-charcoal-black border-gray-200 hover:border-gold-accent"
            }`}
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Expanded Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div
                ref={filterRef}
                className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Price Range */}
                <div className="space-y-4">
                  <h4 className="font-playfair font-semibold text-charcoal-black">
                    Price Range
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={activeFilter.priceRange[0]}
                        onChange={(e) =>
                          updateFilter("priceRange", [
                            Number(e.target.value),
                            activeFilter.priceRange[1],
                          ])
                        }
                        className="w-full pl-6 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <span className="text-gray-400 font-medium">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={activeFilter.priceRange[1]}
                        onChange={(e) =>
                          updateFilter("priceRange", [
                            activeFilter.priceRange[0],
                            Number(e.target.value),
                          ])
                        }
                        className="w-full pl-6 pr-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold-accent transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                  <div className="px-1 space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="5000"
                      value={activeFilter.priceRange[1]}
                      onChange={(e) =>
                        updateFilter("priceRange", [0, Number(e.target.value)])
                      }
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold-accent hover:accent-[#D4AF5F] transition-all"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>₹0</span>
                      <span>₹5L</span>
                    </div>
                  </div>
                </div>

                {/* Selected Package Info */}
                <div className="space-y-4">
                  <h4 className="font-playfair font-semibold text-charcoal-black">
                    Selected Package
                  </h4>
                  <div className="bg-gradient-to-br from-gold-accent/10 to-gold-accent/5 border border-gold-accent/20 rounded-lg p-4">
                    {activeFilter.packageId === "all" ? (
                      <p className="text-sm text-slate-gray">
                        Showing services from all packages
                      </p>
                    ) : (
                      <div>
                        <p className="font-semibold text-charcoal-black mb-1">
                          {
                            packages.find(
                              (p) => p._id === activeFilter.packageId
                            )?.title
                          }
                        </p>
                        <p className="text-sm text-slate-gray">
                          {packages.find(
                            (p) => p._id === activeFilter.packageId
                          )?.description || "Custom package services"}
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setActiveFilter({
                        packageId: "all",
                        priceRange: [0, 500000],
                      });
                    }}
                    className="w-full px-4 py-2 text-sm font-semibold text-gold-accent border border-gold-accent rounded-lg hover:bg-gold-accent hover:text-white transition-all duration-300"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ServiceFilter;
