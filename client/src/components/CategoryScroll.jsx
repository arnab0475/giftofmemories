import React from "react";
import { motion } from "framer-motion";

const CategoryScrollSection = ({ categories = [], selectedCategories = [], onToggle }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full bg-warm-ivory py-10 md:py-16 border-b border-charcoal-black/5">
      <div className="max-w-[1240px] mx-auto">
        
        <h2 className="text-2xl md:text-3xl font-playfair font-semibold mb-6 px-4 md:px-8 text-charcoal-black">
          Shop By Category
        </h2>

        {/* FIX 1: Moved padding (px-4 md:px-8) INSIDE the scroll track. 
            This allows images to slide completely off the screen edge naturally! */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 px-4 md:px-8">
          {categories.map((cat) => {
            const active = selectedCategories.includes(cat.name);

            return (
              <motion.div
                key={cat._id}
                // FIX 2: Removed the index delay. Added a simple scale effect so they pop in instantly when scrolled into view.
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true, margin: "-20px" }}
                className="snap-start shrink-0"
              >
                <button
                  onClick={() => onToggle(cat.name)}
                  className="flex flex-col items-center w-[120px] sm:w-[140px] md:w-[180px] cursor-pointer group focus:outline-none"
                >
                  {/* FIX 3: Premium Selection Ring. 
                      Added ring-offset and tied it directly to the image container for perfect curves. */}
                  <div
                    className={`w-full aspect-[4/5] md:h-[180px] rounded-2xl overflow-hidden shadow-md transition-all duration-300 ${
                      active
                        ? "ring-4 ring-gold-accent ring-offset-4 ring-offset-warm-ivory scale-105 shadow-xl"
                        : "ring-1 ring-charcoal-black/10 hover:shadow-lg hover:ring-gold-accent/50"
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      // Added draggable={false} so mobile users don't accidentally "drag" the image instead of swiping the carousel
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Polished Text: Turns gold and bold when active */}
                  <p
                    className={`text-center mt-4 md:mt-5 text-xs md:text-sm font-inter uppercase tracking-wider transition-colors duration-300 ${
                      active
                        ? "text-gold-accent font-bold"
                        : "text-charcoal-black/70 group-hover:text-charcoal-black font-medium"
                    }`}
                  >
                    {cat.name}
                  </p>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryScrollSection;