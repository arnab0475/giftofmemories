import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, TrendingUp, Star } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MostBookedPackages = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMostBookedPackages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/services/most-booked-packages`
        );
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching most booked packages:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMostBookedPackages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A24D]"></div>
      </div>
    );
  }

  if (!packages.length) {
    return null; // Don't show section if no most booked packages
  }

  return (
    <section className="py-16 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full border border-amber-500/30 mb-4">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">
              Client Favorites
            </span>
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Most Booked Packages
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our most popular photography packages, loved and chosen by
            hundreds of happy couples
          </p>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => (
            <PackageCard key={pkg._id} category={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PackageCard = ({ category, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 transition-all duration-300 group"
    >
      {/* Popular Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
          <Star className="w-3 h-3 text-white fill-white" />
          <span className="text-xs font-bold text-white">Popular</span>
        </div>
      </div>

      {/* Package Image */}
      <div className="relative h-48 overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center">
            <span className="text-amber-500 text-5xl font-playfair">
              {category.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-playfair text-xl text-white font-bold mb-1">
            {category.title}
          </h3>
          {category.startingPrice && (
            <p className="text-amber-400 font-semibold text-sm">
              Starting from ₹{category.startingPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Description & Toggle */}
      <div className="p-5">
        {category.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {category.description}
          </p>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white group"
        >
          <span className="text-sm font-medium">
            View Services ({category.services?.length || 0})
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-amber-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-amber-400 transition-colors" />
          )}
        </button>

        {/* Expanded Services */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-2">
                {category.services?.map((service) => (
                  <button
                    key={service._id}
                    onClick={() => navigate(`/services/${service._id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-transparent hover:border-amber-500/30 transition-all duration-200 text-left group/service"
                  >
                    {service.logo ? (
                      <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-white/10 p-1">
                        <img
                          src={service.logo}
                          alt={service.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <span className="text-amber-400 text-lg font-playfair font-bold">
                          {service.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-white text-sm font-medium group-hover/service:text-amber-400 transition-colors block truncate">
                        {service.title}
                      </span>
                      {service.price && (
                        <span className="text-gray-500 text-xs">
                          ₹{service.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MostBookedPackages;
