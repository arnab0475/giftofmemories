import { useState } from "react";
import { motion } from "framer-motion";
import ServiceHero from "../components/services/ServiceHero";
import ServiceFilter from "../components/services/ServiceFilter";
import ServicesGrid from "../components/services/ServicesGrid";
import FeaturedServices from "../components/services/FeaturedServices";
import CustomPackageCTA from "../components/services/CustomPackageCTA";
import ServiceTrustStrip from "../components/services/ServiceTrustStrip";

const ServicesPage = () => {
  const [activeFilter, setActiveFilter] = useState({
    category: "All Services",
    priceRange: [0, 100000],
    location: "All",
    duration: "All",
    sortBy: "Recommended",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-warm-ivory min-h-screen"
    >
      <ServiceHero />
      <ServiceFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      <ServicesGrid activeFilter={activeFilter} />
      <FeaturedServices />
      <CustomPackageCTA />
      <ServiceTrustStrip />
    </motion.div>
  );
};

export default ServicesPage;
