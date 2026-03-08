import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [servicesResponse, packagesResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_NODE_URL}/api/services/services`),
          axios.get(`${import.meta.env.VITE_NODE_URL}/api/services/packages-with-services`),
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

  // Memoize filtered packages to prevent unnecessary recalculations
  const filteredPackages = useMemo(() => {
    return packages
      .map((pkg) => {
        let filteredServices = pkg.services || [];

        // Apply price range filter
        if (activeFilter.priceRange) {
          filteredServices = filteredServices.filter((service) => {
            // FIX: Ensure price is treated as a string to prevent regex crashes
            const priceString = String(service.price || "0");
            const priceMatch = priceString.match(/[\d,]+/);
            
            if (!priceMatch) return true; // If no number found, keep it by default
            
            const price = parseInt(priceMatch[0].replace(/,/g, ""), 10);
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
        // Filter by specific package ID if not "all"
        if (activeFilter.packageId === "all") return true;
        return pkg._id === activeFilter.packageId;
      })
      // Only return packages that still have services after price filtering
      .filter((pkg) => pkg.services.length > 0); 
  }, [packages, activeFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      // STRICT OVERFLOW CONTROL: Fixes mobile layout breaks
      className="bg-warm-ivory/30 min-h-[100dvh] font-inter overflow-x-hidden flex flex-col"
    >
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <ServiceHero />

      {/* ---------------- 2. EXPLORATION SECTIONS ---------------- */}
      <div className="relative z-10 w-full flex flex-col">
        <MostBookedPackages />
        
        {/* Subtle separator between packages and video */}
        <div className="w-full bg-charcoal-black/5 h-px" />
        
        <PageVideoSection
          pageType="services"
          title="How It Works"
          subtitle="Watch Our Service Guides"
        />
      </div>

      {/* ---------------- 3. MAIN CATALOG SECTION ---------------- */}
      <main className="flex-1 w-full bg-white border-t border-charcoal-black/5 relative z-20">
        
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-warm-ivory/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          
          {/* Catalog Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="text-gold-accent font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3 block">
              Complete Catalog
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-black mb-4">
              Curated Service Menus
            </h2>
            <p className="font-inter text-slate-gray max-w-2xl mx-auto text-sm md:text-base">
              Use the filters below to find the perfect photography or cinematography package for your special occasion.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mb-12 md:mb-16">
            <ServiceFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              packages={packages}
            />
          </div>

          {/* Service Grid with Fade Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilter.packageId}-${activeFilter.priceRange.join("-")}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="min-h-[40vh]" // Prevents layout collapse while loading
            >
              <ServiceCategoryGrid
                packages={filteredPackages}
                isLoading={isLoading}
              />
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* ---------------- 4. LOWER FUNNEL & CTA ---------------- */}
      <div className="relative z-10 bg-warm-ivory/50 border-t border-charcoal-black/5">
        <CustomPackageCTA />
        <ServiceTrustStrip />
      </div>

    </motion.div>
  );
};

export default ServicesPage;