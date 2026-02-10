import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesRes = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/services/services`,
        );
        setServices(servicesRes.data || []);

        // Fetch products
        const productsRes = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/shop/get-products`,
        );
        setProducts(productsRes.data || []);

        // Fetch packages
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

  const getPackageId = (service) => {
    if (!service?.package) return null;
    if (typeof service.package === "string") return service.package;
    return (
      service.package?._id?.toString() || service.package?.toString() || null
    );
  };

  // Group services by package
  const groupedServices = packages.map((pkg) => ({
    packageTitle: pkg.title,
    packageId: pkg._id,
    services: services.filter((s) => {
      const pkgId = getPackageId(s);
      return pkgId && pkgId.toString() === pkg._id.toString();
    }),
  }));

  // Unassigned services
  const unassignedServices = services.filter((s) => !getPackageId(s));

  // Debug log
  console.log("Packages:", packages);
  console.log("Services:", services);
  console.log("Grouped:", groupedServices);

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
      className="relative z-[100] w-full max-w-5xl mx-auto"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Search Bar Trigger */}
      <motion.div
        className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all duration-300 ${
          isOpen
            ? "bg-gold-accent text-charcoal-black rounded-t-xl shadow-lg"
            : "bg-white/90 backdrop-blur-md text-charcoal-black rounded-xl shadow-lg hover:shadow-xl"
        }`}
      >
        <div className="flex items-center gap-3">
          {isOpen ? null : <Search className="w-5 h-5 text-gray-500" />}
          <span
            className={`font-inter font-medium text-lg ${
              isOpen ? "text-charcoal-black" : "text-gray-700"
            }`}
          >
            {isOpen
              ? "Find Services & Products"
              : "Search for services or products..."}
          </span>
        </div>

        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-charcoal-black" />
        ) : (
          <div className="flex items-center gap-2">
            <ChevronDown className="w-5 h-5 text-gray-400" />
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
            className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-xl overflow-hidden border-t border-gold-accent/20 z-[100]"
          >
            <div className="p-6 flex flex-col gap-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
              {/* Services grouped by packages - each package is a row */}
              {groupedServices
                .filter((group) => group.services.length > 0)
                .map((group) => (
                  <div key={group.packageId} className="flex flex-col gap-2">
                    <h3 className="font-playfair text-sm font-bold text-gold-accent uppercase tracking-wide">
                      {group.packageTitle}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.services.map((service) => (
                        <button
                          key={service._id}
                          onClick={() => handleServiceClick(service._id)}
                          className="font-inter text-sm text-charcoal-black bg-gray-50 hover:bg-gold-accent hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-200 hover:border-gold-accent"
                        >
                          {service.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Unassigned services */}
              {unassignedServices.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-playfair text-sm font-bold text-gold-accent uppercase tracking-wide">
                    Other Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {unassignedServices.map((service) => (
                      <button
                        key={service._id}
                        onClick={() => handleServiceClick(service._id)}
                        className="font-inter text-sm text-charcoal-black bg-gray-50 hover:bg-gold-accent hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-200 hover:border-gold-accent"
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Section */}
              {products.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="font-playfair text-sm font-bold text-gold-accent uppercase tracking-wide">
                    Products
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {products.map((product) => (
                      <button
                        key={product._id}
                        onClick={handleProductClick}
                        className="font-inter text-sm text-charcoal-black bg-gray-50 hover:bg-gold-accent hover:text-white px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-200 hover:border-gold-accent"
                      >
                        {product.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
              <button
                onClick={() => navigate("/services")}
                className="text-sm text-gold-accent hover:text-gold-accent/80 font-medium"
              >
                View All Services →
              </button>
              <button
                onClick={handleProductClick}
                className="text-sm text-gold-accent hover:text-gold-accent/80 font-medium"
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
