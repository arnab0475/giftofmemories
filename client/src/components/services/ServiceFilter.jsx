import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const filters = [
  "All Services",
  "Weddings",
  "Events",
  "Portraits",
  "Commercial",
  "Custom Packages",
];

const ServiceFilter = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="sticky top-[80px] z-40 bg-warm-ivory border-b border-muted-beige/30 py-4 shadow-sm">
      <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
        <div className="flex space-x-4 min-w-max md:justify-center">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-sm font-inter font-semibold transition-all duration-300 border ${
                activeFilter === filter
                  ? "bg-gradient-to-r from-gold-accent to-[#D4AF5F] text-charcoal-black border-transparent shadow-md transform scale-105"
                  : "bg-transparent text-slate-gray border-slate-gray/20 hover:border-gold-accent hover:text-gold-accent"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceFilter;
