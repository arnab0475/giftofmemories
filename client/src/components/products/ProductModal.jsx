import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientAuth } from "../../context/ClientAuthContext";

const ProductModal = ({ isOpen, onClose, product }) => {
  const { isClientLoggedIn } = useClientAuth();

  if (!isOpen || !product) return null;

  const discountPrice = Math.round(product.price * 0.85);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F0F0F] bg-opacity-70 z-50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[14px] shadow-2xl pointer-events-auto flex flex-col md:flex-row relative">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-gray hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>

              {/* Image Section (Mock Carousel) */}
              <div className="w-full md:w-1/2 bg-gray-100 aspect-[4/5] md:aspect-auto relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {isClientLoggedIn && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-sm shadow-md z-10">
                    15% OFF DEAL
                  </div>
                )}
                {/* Carousel Indicators (Mock) */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50 shadow-sm"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50 shadow-sm"></div>
                </div>
              </div>

              {/* Info Section */}
              <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
                <span className="text-gold-accent font-semibold text-sm tracking-wider uppercase mb-2">
                  {product.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal-black mb-4">
                  {product.name}
                </h2>
                <div className="text-2xl font-bold font-inter mb-6">
                  {isClientLoggedIn ? (
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 line-through text-xl">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-gold-accent">
                        ₹{discountPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <div className="prose prose-sm text-slate-gray mb-8 font-inter leading-relaxed">
                  <p>{product.description}</p>
                  <p className="mt-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam.
                  </p>
                </div>

                {/* Size/Format Options (Mock) */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-charcoal-black mb-3">
                    Select Option
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["Standard", "Premium (+₹500)", "Deluxe (+₹1500)"].map(
                      (opt, idx) => (
                        <button
                          key={idx}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            idx === 0
                              ? "border-gold-accent bg-gold-accent/10 text-charcoal-black"
                              : "border-slate-200 text-slate-gray hover:border-gold-accent hover:text-charcoal-black"
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Purchase Actions */}
                <div className="mt-auto flex gap-4">
                  <button className="flex-1 bg-gold-accent text-charcoal-black font-bold py-4 rounded-[10px] hover:brightness-105 transition-all text-lg shadow-lg shadow-gold-accent/20">
                    Buy Now
                  </button>
                  <button className="px-6 py-4 rounded-[10px] border border-charcoal-black text-charcoal-black font-semibold hover:bg-gray-50 transition-all">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;
