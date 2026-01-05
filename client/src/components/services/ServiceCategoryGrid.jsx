import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { servicesData } from "../../data/servicesData";

const ServiceCategoryGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-start">
      {servicesData.map((category, index) => (
        <ServiceCard key={index} category={category} />
      ))}
    </div>
  );
};

const ServiceCard = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-xl bg-warm-ivory shadow-md border border-gold-accent/20 transition-all duration-300 hover:shadow-xl">
      {/* Main Card Content */}
      <div
        className="flex justify-between items-stretch cursor-pointer min-h-[140px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Left Content */}
        <div className="flex-1 p-6 flex flex-col justify-center z-10">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-playfair text-2xl text-charcoal-black font-semibold">
              {category.title}
            </h3>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gold-accent" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {/* Subtitle / Preview Items */}
          {!isOpen && (
            <p className="font-inter text-sm text-slate-gray line-clamp-2 pr-4">
              {category.items.join(", ")}
            </p>
          )}

          {/* Expanded Content */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid grid-cols-1 gap-y-2">
                  {category.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-sm font-inter text-charcoal-black/80 hover:text-gold-accent transition-colors py-1 border-b border-gray-100 last:border-0"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Image with Semi-Circle Mask */}
        <div className="relative w-[30%] min-w-[120px]">
          <div className="absolute inset-0 h-full w-full">
            <img
              src={category.image}
              alt={category.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute top-0 bottom-0 left-[-1px] w-12 h-full z-20">
            <svg
              viewBox="0 0 40 100"
              preserveAspectRatio="none"
              className="h-full w-full text-warm-ivory fill-current"
            >
              <path
                d="M0,0 L0,100 Q40,50 0,0 Z"
                transform="scale(-1, 1) translate(-40, 0)"
              />
              <path d="M0,0 H40 C10,0 10,100 40,100 H0 Z" fill="currentColor" />

              <path
                d="M0,0  L40,0  Q5,50 40,100 L0,100 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoryGrid;
