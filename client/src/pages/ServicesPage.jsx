import { useState } from "react";
import { motion } from "framer-motion";
import ServiceHero from "../components/services/ServiceHero";
import ServiceFilter, {
  priceRanges,
} from "../components/services/ServiceFilter";
import ServicesGrid from "../components/services/ServicesGrid";
import FeaturedServices from "../components/services/FeaturedServices";
import CustomPackageCTA from "../components/services/CustomPackageCTA";
import ServiceTrustStrip from "../components/services/ServiceTrustStrip";

const ServicesPage = () => {
  const [activeFilter, setActiveFilter] = useState("All Services");
  const [activePriceFilter, setActivePriceFilter] = useState(priceRanges[0]); // "All Prices"
  const [sortBy, setSortBy] = useState("default");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-warm-ivory min-h-screen pt-20"
    >
      <ServiceHero />
      <ServiceFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activePriceFilter={activePriceFilter}
        setActivePriceFilter={setActivePriceFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <ServicesGrid
        activeFilter={activeFilter}
        activePriceFilter={activePriceFilter}
        sortBy={sortBy}
      />
      <FeaturedServices />
      <CustomPackageCTA />
      <ServiceTrustStrip />
    </motion.div>
  );
};

export default ServicesPage;
