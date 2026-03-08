import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Zap, ChevronRight } from "lucide-react";
import { useClientAuth } from "../../context/ClientAuthContext";

const ProductCard = ({ product, onClick }) => {
  const { isClientLoggedIn } = useClientAuth();

  // Consistent 15% Member Discount Logic
  const memberPrice = Math.round(product.price * 0.85);

  const handleAction = (e) => {
    e.stopPropagation();
    onClick(product); 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className={`group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-charcoal-black/5 h-full flex flex-col ${
        !product.isActive ? "opacity-60 grayscale pointer-events-none" : ""
      }`}
    >
      {/* ---------------- 1. IMAGE & BADGES ---------------- */}
      {/* h-40 on mobile, h-64 on desktop to maintain perfect proportions in 2-col grid */}
      <div className="h-40 sm:h-52 md:h-64 overflow-hidden bg-warm-ivory relative shrink-0">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />

        {/* Dynamic Badges - Scaled for mobile */}
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1 md:gap-2">
          {product.isBestseller && (
            <div className="flex items-center gap-1 bg-charcoal-black text-gold-accent text-[7px] md:text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest shadow-lg">
              <Star size={8} fill="currentColor" className="md:w-2.5 md:h-2.5" />
              Best
            </div>
          )}
          {product.tag && (
            <div className="bg-white/90 backdrop-blur-md text-charcoal-black border border-charcoal-black/10 text-[7px] md:text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest">
              {product.tag}
            </div>
          )}
        </div>

        {/* Discount Badge - Gold style */}
        {product.oldPrice && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 bg-gold-accent text-charcoal-black text-[8px] md:text-[10px] px-2 py-1 rounded-md font-black shadow-lg">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </div>
        )}

        {/* Desktop Hover Overlay (Hidden on mobile for better UX) */}
        <div className="hidden md:flex absolute inset-0 bg-charcoal-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 items-center justify-center">
          <button 
            onClick={handleAction}
            className="bg-white text-charcoal-black px-5 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-gold-accent"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* ---------------- 2. PRODUCT DETAILS ---------------- */}
      {/* Reduced padding on mobile (p-3) vs desktop (p-6) */}
      <div className="p-3 md:p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1 md:mb-2">
          <span className="text-[7px] md:text-[10px] text-gold-accent font-bold uppercase tracking-[0.2em] truncate">
            {product.category?.name || "Premium"}
          </span>
          {product.popularity > 80 && (
            <span className="hidden sm:flex items-center gap-1 text-[9px] text-emerald-600 font-bold uppercase">
              <Zap size={10} fill="currentColor" /> Hot
            </span>
          )}
        </div>

        {/* Title: Line-clamp-1 on mobile to prevent layout breaking */}
        <h3 className="font-playfair text-sm md:text-xl font-bold text-charcoal-black mb-1 md:mb-2 group-hover:text-gold-accent transition-colors line-clamp-1 md:line-clamp-2">
          {product.name}
        </h3>

        {/* Description: Hidden on mobile to keep cards small and clean */}
        <p className="hidden md:block text-slate-gray text-xs mb-6 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* ---------------- 3. PRICING & ACTION ---------------- */}
        <div className="mt-auto pt-3 border-t border-charcoal-black/5 flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-[7px] md:text-[10px] text-slate-gray/60 uppercase font-bold tracking-tighter">
              {isClientLoggedIn ? "VIP Rate" : "Price"}
            </span>
            <div className="flex items-center gap-1.5 md:gap-2 overflow-hidden">
              <span className="text-sm md:text-xl font-bold text-charcoal-black truncate">
                ₹{(isClientLoggedIn ? memberPrice : product.price).toLocaleString("en-IN")}
              </span>
              {/* Old price scaled down for mobile */}
              {(product.oldPrice || isClientLoggedIn) && (
                <span className="text-[8px] md:text-xs text-gray-400 line-through font-medium truncate">
                  ₹{Number(isClientLoggedIn ? product.price : product.oldPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
          
          {/* Action Button: Becomes smaller on mobile */}
          <button 
            onClick={handleAction}
            className="p-2 md:p-3 bg-warm-ivory text-charcoal-black rounded-lg md:rounded-xl hover:bg-gold-accent transition-colors shrink-0 ml-2"
          >
            <ShoppingBag size={14} className="md:w-[18px] md:h-[18px]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;