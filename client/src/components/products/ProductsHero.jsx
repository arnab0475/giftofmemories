import React from "react";
import { motion } from "framer-motion";

const ProductsHero = () => {
  return (
    <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=2835&auto=format&fit=crop"
          alt="Photography Products"
          className="h-full w-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0F0F0F] opacity-55"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-playfair font-bold text-warm-ivory mb-4"
        >
          Our Products
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-warm-ivory/90 text-lg font-inter max-w-2xl mx-auto"
        >
          Curated photography products crafted to preserve your memories
          forever.
        </motion.p>
      </div>
    </div>
  );
};

export default ProductsHero;
