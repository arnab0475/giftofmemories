import React from "react";
import { motion } from "framer-motion";
import { useClientAuth } from "../../context/ClientAuthContext";

const ProductCard = ({ product, onClick }) => {
  const { isClientLoggedIn } = useClientAuth();

  const discountPrice = Math.round(product.price * 0.85);

  return (
    <motion.div
      onClick={() => onClick(product)}
      className="bg-white rounded-[14px] overflow-hidden cursor-pointer group shadow-[0px_8px_24px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -8 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {isClientLoggedIn && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm shadow-md">
            15% OFF
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div>
          <h3 className="text-xl font-playfair font-semibold text-charcoal-black mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-slate-gray/80 text-[15px] font-inter line-clamp-2 min-h-[44px]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col items-start leading-none">
            {isClientLoggedIn ? (
              <>
                <span className="text-sm text-slate-400 line-through decoration-slate-400 decoration-1 mb-1 font-inter">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-lg font-bold text-gold-accent font-inter">
                  ₹{discountPrice.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gold-accent font-inter">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <button className="px-5 py-2 rounded-[10px] border border-gold-accent text-gold-accent font-semibold text-[14px] transition-all duration-300 group-hover:bg-gold-accent group-hover:text-charcoal-black">
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
