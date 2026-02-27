import React from "react";
import { motion } from "framer-motion";

const CategoryScrollSection = ({ categories, selectedCategories, onToggle }) => {
  return (
    <section className="w-full bg-white p-5">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-playfair mb-8">
          Shop By Category
        </h2>

        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
          {categories.map((cat, index) => {
            const active = selectedCategories.includes(cat.name);

            return (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="snap-start shrink-0"
              >
                <div
                  onClick={() => onToggle(cat.name)}
                  className={`w-[140px] md:w-[180px] cursor-pointer group ${
                    active ? "ring-2 ring-gold-accent rounded-2xl" : ""
                  }`}
                >
                  <div className="rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-[140px] md:h-[180px] object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <p className="text-center mt-3 text-sm md:text-base font-medium">
                    {cat.name}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryScrollSection;