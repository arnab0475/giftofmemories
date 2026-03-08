import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MegaSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  
  // FIX 1: Ref for detecting clicks outside the dropdown
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/services/services`,
        );
        setServices(servicesRes.data || []);

        const productsRes = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/shop/get-products`,
        );
        setProducts(productsRes.data || []);

        const packagesRes = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/services/packages`,
        );
        setPackages(packagesRes.data || []);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };

    fetchData();
  }, []);

  // FIX 2: Close menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Listen for both mouse clicks and mobile touches
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const getPackageId = (service) => {
    if (!service?.package) return null;
    if (typeof service.package === "string") return service.package;
    return (
      service.package?._id?.toString() || service.package?.toString() || null
    );
  };

  const groupedServices = packages.map((pkg) => ({
    packageTitle: pkg.title,
    packageId: pkg._id,
    services: services.filter((s) => {
      const pkgId = getPackageId(s);
      return pkgId && pkgId.toString() === pkg._id.toString();
    }),
  }));

  const unassignedServices = services.filter((s) => !getPackageId(s));

  const handleServiceClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
    setIsOpen(false);
  };

  const handleProductClick = () => {
    navigate(`/shop`);
    setIsOpen(false);
  };

  return (
    <div
      ref={menuRef}
      className="relative z-[100] w-full max-w-5xl mx-auto"
      // Hover works great for desktop
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Search Bar Trigger */}
      <motion.div
        // Click toggles it manually for mobile users
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-4 md:px-6 py-3 md:py-4 cursor-pointer transition-all duration-300 ${
          isOpen
            ? "bg-gold-accent text-charcoal-black rounded-t-xl shadow-lg"
            : "bg-white/90 backdrop-blur-md text-charcoal-black rounded-xl shadow-lg hover:shadow-xl"
        }`}
      >
        <div className="flex items-center gap-2 md:gap-3">
          {isOpen ? null : <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-500 shrink-0" />}
          <span
            className={`font-inter font-medium text-sm sm:text-base md:text-lg truncate ${
              isOpen ? "text-charcoal-black" : "text-gray-700"
            }`}
          >
            {isOpen
              ? "Find Services & Products"
              : "Search for services or products..."}
          </span>
        </div>

        {isOpen ? (
          <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-charcoal-black shrink-0" />
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          </div>
        )}
      </motion.div>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* FIX 3: Added overscroll-contain so the homepage doesn't scroll when you reach the bottom of this menu on mobile */}
            <div className="p-4 md:p-6 flex flex-col gap-6 max-h-[50vh] md:max-h-[60vh] overflow-y-auto overscroll-contain custom-scrollbar">
              
              {/* Services grouped by packages */}
              {groupedServices
                .filter((group) => group.services.length > 0)
                .map((group) => (
                  <div key={group.packageId} className="flex flex-col gap-2 md:gap-3">
                    <h3 className="font-playfair text-xs md:text-sm font-bold text-gold-accent uppercase tracking-wide">
                      {group.packageTitle}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.services.map((service) => (
                        <button
                          key={service._id}
                          onClick={() => handleServiceClick(service._id)}
                          className="font-inter text-xs sm:text-sm text-charcoal-black bg-gray-50 hover:bg-gold-accent hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-200 hover:border-gold-accent text-left"
                        >
                          {service.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Unassigned services */}
              {unassignedServices.length > 0 && (
                <div className="flex flex-col gap-2 md:gap-3">
                  <h3 className="font-playfair text-xs md:text-sm font-bold text-gold-accent uppercase tracking-wide">
                    Other Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {unassignedServices.map((service) => (
                      <button
                        key={service._id}
                        onClick={() => handleServiceClick(service._id)}
                        className="font-inter text-xs sm:text-sm text-charcoal-black bg-gray-50 hover:bg-gold-accent hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-200 hover:border-gold-accent text-left"
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {products.length > 0 && (
                <div className="flex flex-col gap-2 md:gap-3">
                  <h3 className="font-playfair text-xs md:text-sm font-bold text-gold-accent uppercase tracking-wide border-t border-gray-100 pt-4 mt-2">
                    Products
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {products.map((product) => (
                      <button
                        key={product._id}
                        onClick={handleProductClick}
                        className="font-inter text-xs sm:text-sm text-charcoal-black bg-gray-50 hover:bg-gold-accent hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-200 hover:border-gold-accent text-left"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation Links */}
            <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate("/services");
                  setIsOpen(false);
                }}
                className="text-sm text-gold-accent hover:text-gold-accent/80 font-medium transition-colors w-full sm:w-auto text-center py-2 sm:py-0"
              >
                View All Services →
              </button>
              <button
                onClick={handleProductClick}
                className="text-sm text-gold-accent hover:text-gold-accent/80 font-medium transition-colors w-full sm:w-auto text-center py-2 sm:py-0"
              >
                View All Products →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaSearch;