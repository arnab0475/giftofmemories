import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const MobileFilterDrawer = ({
  isOpen,
  onClose,
  categories,
  selectedCategories,
  onToggleCategory,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-playfair">Filters</h3>
            <button onClick={onClose}>✕</button>
          </div>

          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)}
                onChange={() => onToggleCategory(cat.name)}
              />
              {cat.name}
            </label>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterDrawer;