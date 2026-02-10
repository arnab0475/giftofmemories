import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ServiceHero from "../components/services/ServiceHero";
import ServiceFilter from "../components/services/ServiceFilter";
import ServiceCategoryGrid from "../components/services/ServiceCategoryGrid";
import CustomPackageCTA from "../components/services/CustomPackageCTA";
import ServiceTrustStrip from "../components/services/ServiceTrustStrip";
import MostBookedPackages from "../components/services/MostBookedPackages";
import PageVideoSection from "../components/PageVideoSection";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState({
    packageId: "all",
    priceRange: [0, 500000],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, packagesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_NODE_URL}/api/services/services`),
          axios.get(
            `${
              import.meta.env.VITE_NODE_URL
            }/api/services/packages-with-services`,
          ),
        ]);
        setServices(servicesResponse.data);
        setPackages(packagesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter packages based on active filters
  const filteredPackages = packages
    .map((pkg) => {
      // Filter services within this package
      let filteredServices = pkg.services || [];

      // Apply price range filter
      if (activeFilter.priceRange) {
        filteredServices = filteredServices.filter((service) => {
          const priceMatch = service.price?.match(/[\d,]+/);
          if (!priceMatch) return true;
          const price = parseInt(priceMatch[0].replace(/,/g, ""));
          return (
            price >= activeFilter.priceRange[0] &&
            price <= activeFilter.priceRange[1]
          );
        });
      }

      return {
        ...pkg,
        services: filteredServices,
      };
    })
    .filter((pkg) => {
      // Only show package if it matches the selected package or "all" is selected
      if (activeFilter.packageId === "all") return true;
      return pkg._id === activeFilter.packageId;
    })
    .filter((pkg) => pkg.services.length > 0); // Only show packages with services

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-warm-ivory min-h-screen"
    >
      <ServiceHero />
      <MostBookedPackages />
      <PageVideoSection
        pageType="services"
        title="How It Works"
        subtitle="Watch Our Service Guides"
      />
      <ServiceFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        packages={packages}
      />
      <div className="py-12">
        <ServiceCategoryGrid
          packages={filteredPackages}
          isLoading={isLoading}
        />
      </div>
      <CustomPackageCTA />
      <ServiceTrustStrip />
    </motion.div>
  );
};

export default ServicesPage;
