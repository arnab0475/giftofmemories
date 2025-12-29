import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ServiceHero from "../components/services/ServiceHero";
import ServiceFilter from "../components/services/ServiceFilter";
import ServicesGrid from "../components/services/ServicesGrid";
import FeaturedServices from "../components/services/FeaturedServices";
import CustomPackageCTA from "../components/services/CustomPackageCTA";
import ServiceTrustStrip from "../components/services/ServiceTrustStrip";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState({
    category: "All Services",
    priceRange: [0, 100000],
    location: "All",
    duration: "All",
    sortBy: "Recommended",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("VITE_NODE_URL/api/services/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

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
      <ServicesGrid activeFilter={activeFilter} services={services} />
      <FeaturedServices />
      <CustomPackageCTA />
      <ServiceTrustStrip />
    </motion.div>
  );
};

export default ServicesPage;
