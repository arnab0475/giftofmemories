import { motion, AnimatePresence } from "framer-motion";
import ServiceCard from "./ServiceCard";
import { Link } from "react-router-dom";

const ServicesGrid = ({ activeFilter, services = [] }) => {
  const parsePrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^\d]/g, ""), 10);
  };

  const filteredServices = services
    .filter((service) => {
      // 1. Category Filter
      if (
        activeFilter.category !== "All Services" &&
        service.category !== activeFilter.category
      ) {
        return false;
      }

      // 2. Price Filter
      const price = parsePrice(service.price);
      if (
        price < activeFilter.priceRange[0] ||
        price > activeFilter.priceRange[1]
      ) {
        return false;
      }

      // 3. Location Filter
      if (
        activeFilter.location !== "All" &&
        service.details.location !== activeFilter.location
      ) {
        // Try partial match if exact match fails
        if (!service.details.location.includes(activeFilter.location)) {
          return false;
        }
      }

      // 4. Duration Filter
      if (
        activeFilter.duration !== "All" &&
        service.details.duration !== activeFilter.duration
      ) {
        // Fuzzy match logic for specific cases if needed
        // e.g. "Full Day" matches "Full Day Coverage"
        if (
          activeFilter.duration === "Full Day" &&
          service.details.duration.includes("Full Day")
        )
          return true;
        if (
          activeFilter.duration === "Project Based" &&
          service.details.duration.toLowerCase().includes("project")
        )
          return true;
        if (
          activeFilter.duration === "Half Day (4-6 Hours)" &&
          service.details.duration.includes("4-6 Hours")
        )
          return true; // Pre-wedding
        if (
          activeFilter.duration === "Half Day (4-6 Hours)" &&
          service.details.duration.includes("4-8 Hours")
        )
          return true; // Event
        if (
          activeFilter.duration === "Short Session (2-3 Hours)" &&
          service.details.duration.includes("2-3 Hours")
        )
          return true;

        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (activeFilter.sortBy === "Price: Low to High") {
        return parsePrice(a.price) - parsePrice(b.price);
      }
      if (activeFilter.sortBy === "Price: High to Low") {
        return parsePrice(b.price) - parsePrice(a.price);
      }
      return 0; // Default / Recommended
    });

  return (
    <section className="py-20 bg-warm-ivory min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredServices.map((service) =>
              service._id ? (
                <Link to={`/services/${service._id}`} key={service._id}>
                  <ServiceCard service={service} />
                </Link>
              ) : null
            )}
          </AnimatePresence>
        </motion.div>

        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <h3 className="font-playfair text-2xl text-charcoal-black">
              No services found in this category.
            </h3>
            <p className="font-inter text-slate-gray mt-2">
              Please try selecting a different category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesGrid;
