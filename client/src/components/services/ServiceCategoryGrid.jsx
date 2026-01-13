import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ServiceCategoryGrid = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/services/packages-with-services`
        );
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching service packages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A24D]"></div>
      </div>
    );
  }

  if (!packages.length) {
    return (
      <div className="text-center py-12 text-slate-gray">
        No service packages available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-start">
      {packages.map((pkg) => (
        <ServiceCard key={pkg._id} category={pkg} />
      ))}
    </div>
  );
};

const ServiceCard = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Determine grid columns based on service count
  const serviceCount = category.services?.length || 0;
  const getGridCols = () => {
    if (serviceCount <= 2) return "grid-cols-1";
    if (serviceCount <= 4) return "grid-cols-1 sm:grid-cols-2";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  // Determine if this package needs full width (many services)
  const needsFullWidth = serviceCount > 3;

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-warm-ivory shadow-md border border-gold-accent/20 transition-all duration-300 hover:shadow-xl ${
        isOpen && needsFullWidth ? "md:col-span-2" : ""
      }`}
    >
      {/* Header Row - Package Title + Image */}
      <div
        className="flex justify-between items-stretch cursor-pointer min-h-[140px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Left Content - Title */}
        <div className="flex-1 p-6 flex flex-col justify-center z-10">
          <div className="flex items-center gap-2">
            <h3 className="font-playfair text-2xl text-charcoal-black font-semibold">
              {category.title}
            </h3>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gold-accent" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Right Image with Semi-Circle Mask */}
        <div className="relative w-[30%] min-w-[120px]">
          <div className="absolute inset-0 h-full w-full">
            {category.image ? (
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#C9A24D]/20 to-[#C9A24D]/5 flex items-center justify-center">
                <span className="text-[#C9A24D] text-4xl font-playfair">
                  {category.title.charAt(0)}
                </span>
              </div>
            )}
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

      {/* Expanded Content - Services Grid (Below Header) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gold-accent/10"
          >
            <div
              className={`p-6 grid ${getGridCols()} gap-4 w-full bg-warm-ivory/50`}
            >
              {category.services?.map((service) => (
                <button
                  key={service._id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/services/${service._id}`);
                  }}
                  className="group flex items-center gap-4 w-full p-4 rounded-xl bg-white border border-gold-accent/10 hover:border-gold-accent/40 hover:shadow-lg transition-all duration-300"
                >
                  {service.logo ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gold-accent/5 to-gold-accent/10 p-2 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                      <img
                        src={service.logo}
                        alt={service.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-gradient-to-br from-gold-accent/10 to-gold-accent/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                      <span className="text-gold-accent text-2xl sm:text-3xl font-playfair font-bold">
                        {service.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="font-inter font-semibold text-sm sm:text-base text-charcoal-black group-hover:text-gold-accent transition-colors text-left flex-1">
                    {service.title}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceCategoryGrid;
