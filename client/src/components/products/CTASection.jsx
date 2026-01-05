import React from "react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <div className="bg-gold-accent py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal-black mb-4">
          Looking for Something Custom?
        </h2>
        <p className="text-charcoal-black/80 font-inter mb-8 max-w-2xl mx-auto">
          We offer bespoke albums and framing services tailored to your specific
          requirements.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-charcoal-black text-gold-accent font-semibold rounded-[10px] shadow-lg hover:shadow-xl transition-all"
          >
            Request Custom Order
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 border-2 border-charcoal-black text-charcoal-black font-semibold rounded-[10px] hover:bg-charcoal-black hover:text-gold-accent transition-all"
          >
            Chat on WhatsApp
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
