import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import serviceHeroBg from "../../assets/images/service-hero.png";

const ServiceHero = () => {
  const [heroData, setHeroData] = useState({
    title: "Our Photography Services",
    description:
      "Crafted experiences for weddings, events, portraits and brands. We turn moments into timeless memories.",
    breadcrumb: "Gift of memories • Services",
    backgroundImage: "",
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/page-hero/get/services`,
        );
        setHeroData(response.data);
      } catch (error) {
        console.error("Error fetching service hero:", error);
      }
    };
    fetchHeroData();
  }, []);

  const breadcrumbParts = heroData.breadcrumb?.split("•") || [
    "Gift of memories",
    "Services",
  ];

  return (
    <motion.section
      initial="initial"
      whileHover="hover"
      className="relative h-[55vh] w-full overflow-hidden bg-charcoal-black flex items-center justify-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          variants={{
            initial: { scale: 1, opacity: 0.5, x: 0 },
            hover: {
              scale: 1.02,
              opacity: 1,
              x: [0, 10, 0, -10, -5, 0],
              transition: {
                opacity: { duration: 0.5, ease: "easeInOut" },
                x: { duration: 0.5, ease: "easeInOut" },
              },
            },
          }}
          src={heroData.backgroundImage || serviceHeroBg}
          alt="Photography Services"
          className="w-full h-full object-cover "
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/60 to-charcoal-black/80" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-warm-ivory mb-4 font-bold tracking-tight">
            {heroData.title}
          </h1>
          <p className="font-inter text-lg text-muted-beige mb-6 font-light">
            {heroData.description}
          </p>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-sm font-inter uppercase tracking-widest text-warm-ivory/60">
            <Link to="/" className="hover:text-gold-accent transition-colors">
              {breadcrumbParts[0]?.trim()}
            </Link>
            <span className="text-gold-accent">•</span>
            <span className="text-warm-ivory">
              {breadcrumbParts[1]?.trim()}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServiceHero;
