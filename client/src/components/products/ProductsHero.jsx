import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const ProductsHero = () => {
  const [heroData, setHeroData] = useState({
    title: "Our Products",
    description: "Curated photography products crafted to preserve your memories forever.",
    backgroundImage: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/page-hero/get/shop`
        );
        if (response.data) setHeroData(response.data);
      } catch (error) {
        console.error("Error fetching shop hero:", error);
      }
    };
    fetchHeroData();
  }, []);

  return (
    <section className="relative h-[45vh] min-h-[450px] w-full overflow-hidden bg-charcoal-black flex items-center justify-center">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: isLoaded ? 0.6 : 0 // Lower opacity for better text contrast
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroData.backgroundImage || "/shop-bg.jpg"}
          alt=""
          onLoad={() => setIsLoaded(true)}
          className="h-full w-full object-cover"
        />
        
        {/* FIX 1: Sophisticated multi-layer gradient for guaranteed text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/80 via-transparent to-charcoal-black/90" />
        <div className="absolute inset-0 bg-charcoal-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle line decoration */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "50px" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-[2px] bg-gold-accent mx-auto mb-6"
          />

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-warm-ivory mb-6 tracking-tight drop-shadow-lg">
            {heroData.title}
          </h1>
          
          <p className="text-warm-ivory/85 text-base md:text-xl font-inter max-w-2xl mx-auto leading-relaxed font-light px-4">
            {heroData.description}
          </p>
        </motion.div>
      </div>

      {/* FIX 2: Bottom decorative fade to blend with the product grid below */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-warm-ivory to-transparent z-10" />
    </section>
  );
};

export default ProductsHero;