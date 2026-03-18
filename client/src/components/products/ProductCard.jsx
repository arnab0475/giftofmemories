// import React from "react";
// import { motion } from "framer-motion";
// import { Star, Zap, ChevronRight } from "lucide-react";
// import { IconBrandWhatsapp } from "@tabler/icons-react"; // <-- NEW: WhatsApp Icon
// import { useClientAuth } from "../../context/ClientAuthContext";
// import { useNavigate } from "react-router-dom";
// const WHATSAPP_NUMBER = "918335934679"; // Your business number

// const ProductCard = ({ product, onClick }) => {
//   const { isClientLoggedIn } = useClientAuth();
//   const navigate = useNavigate();

//   // Consistent 15% Member Discount Logic
//   const memberPrice = Math.round(product.price * 0.85);
//   const displayPrice = isClientLoggedIn ? memberPrice : product.price;

//   const handleQuickView = (e) => {
//     e.stopPropagation();
//     onClick(product); 
//   };

//   const handleWhatsAppBuy = (e) => {
//     e.stopPropagation();
//     const message = encodeURIComponent(
//       `Hi! I'm interested in purchasing the Samogri item: *${product.name}* (Price: ₹${displayPrice.toLocaleString("en-IN")}). Could you help me with the order?`
//     );
//     window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
//   };
//   const handleCardClick = () => {
//   navigate(`/product/${product._id}`);
// };
//   return (
//     <motion.div
//     onClick={handleCardClick}
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-20px" }}
//       className={`group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-charcoal-black/5 h-full flex flex-col ${
//         !product.isActive ? "opacity-60 grayscale pointer-events-none" : ""
//       }`}
//     >
//       {/* ---------------- 1. IMAGE & BADGES ---------------- */}
//       <div className="h-40 sm:h-52 md:h-64 overflow-hidden bg-warm-ivory relative shrink-0">
//         <img
//           src={product.image || "/placeholder.png"}
//           alt={product.name}
//           className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
//           loading="lazy"
//         />

//         <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex flex-col gap-1 md:gap-2">
//           {product.isBestseller && (
//             <div className="flex items-center gap-1 bg-charcoal-black text-gold-accent text-[7px] md:text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest shadow-lg">
//               <Star size={8} fill="currentColor" className="md:w-2.5 md:h-2.5" />
//               Best
//             </div>
//           )}
//           {product.tag && (
//             <div className="bg-white/90 backdrop-blur-md text-charcoal-black border border-charcoal-black/10 text-[7px] md:text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest">
//               {product.tag}
//             </div>
//           )}
//         </div>

//         {product.oldPrice && (
//           <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 bg-gold-accent text-charcoal-black text-[8px] md:text-[10px] px-2 py-1 rounded-md font-black shadow-lg">
//             -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
//           </div>
//         )}

//         <div className="hidden md:flex absolute inset-0 bg-charcoal-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 items-center justify-center">
//           <button 
//             onClick={handleQuickView}
//             className="bg-white text-charcoal-black px-5 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-gold-accent"
//           >
//             Quick View
//           </button>
//         </div>
//       </div>

//       {/* ---------------- 2. PRODUCT DETAILS ---------------- */}
//       <div className="p-3 md:p-6 flex flex-col flex-1">
//         <div className="flex justify-between items-start mb-1 md:mb-2">
//           <span className="text-[7px] md:text-[10px] text-gold-accent font-bold uppercase tracking-[0.2em] truncate">
//             {product.category?.name || "Premium"}
//           </span>
//           {product.popularity > 80 && (
//             <span className="hidden sm:flex items-center gap-1 text-[9px] text-emerald-600 font-bold uppercase">
//               <Zap size={10} fill="currentColor" /> Hot
//             </span>
//           )}
//         </div>

//         <h3 className="font-playfair text-sm md:text-xl font-bold text-charcoal-black mb-1 md:mb-2 group-hover:text-gold-accent transition-colors line-clamp-1 md:line-clamp-2">
//           {product.name}
//         </h3>

//         <p className="hidden md:block text-slate-gray text-xs mb-6 line-clamp-2 leading-relaxed">
//           {product.description}
//         </p>

//         {/* ---------------- 3. PRICING & WHATSAPP ACTION ---------------- */}
//         <div className="mt-auto pt-3 border-t border-charcoal-black/5 flex items-center justify-between">
//           <div className="flex flex-col min-w-0">
//             <span className="text-[7px] md:text-[10px] text-slate-gray/60 uppercase font-bold tracking-tighter">
//               {isClientLoggedIn ? "VIP Rate" : "Price"}
//             </span>
//             <div className="flex items-center gap-1.5 md:gap-2 overflow-hidden">
//               <span className="text-sm md:text-xl font-bold text-charcoal-black truncate">
//                 ₹{displayPrice.toLocaleString("en-IN")}
//               </span>
//               {(product.oldPrice || isClientLoggedIn) && (
//                 <span className="text-[8px] md:text-xs text-gray-400 line-through font-medium truncate">
//                   ₹{Number(isClientLoggedIn ? product.price : product.oldPrice).toLocaleString("en-IN")}
//                 </span>
//               )}
//             </div>
//           </div>
          
//           {/* NEW: WhatsApp Direct Buy Button */}
//           <button 
//             onClick={handleWhatsAppBuy}
//             className="p-2 md:p-3 bg-[#25D366] text-white rounded-lg md:rounded-xl hover:bg-[#128C7E] transition-colors shrink-0 ml-2 shadow-lg shadow-[#25D366]/20 group/wa"
//             title="Buy via WhatsApp"
//           >
//             <IconBrandWhatsapp className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-hover/wa:scale-110 transition-transform" strokeWidth={2} />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ProductCard;

import React from "react";
import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { useClientAuth } from "../../context/ClientAuthContext";
import { useNavigate } from "react-router-dom";

const WHATSAPP_NUMBER = "918335934679";

const ProductCard = ({ product, onClick }) => {
  const { isClientLoggedIn } = useClientAuth();
  const navigate = useNavigate();

  const memberPrice = Math.round(product.price * 0.85);
  const displayPrice = isClientLoggedIn ? memberPrice : product.price;

  const handleQuickView = (e) => {
    e.stopPropagation();
    onClick(product);
  };

  const handleWhatsAppBuy = (e) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hi! I'm interested in purchasing the Samogri item: *${product.name}* (Price: ₹${displayPrice.toLocaleString(
        "en-IN"
      )}). Could you help me with the order?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  // First media item
  const media = product.preview || product.media?.[0];

  const isVideo =
    media?.includes(".mp4") ||
    media?.includes(".webm") ||
    media?.includes(".mov");

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className={`group relative bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-charcoal-black/5 h-full flex flex-col ${
        !product.isActive ? "opacity-60 grayscale pointer-events-none" : ""
      }`}
    >
      {/* ---------------- 1. MEDIA & BADGES ---------------- */}

      <div className="h-40 sm:h-52 md:h-64 overflow-hidden bg-warm-ivory relative shrink-0">

        {isVideo ? (
          <video
            src={media}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={media || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />
        )}

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

        {product.oldPrice && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 bg-gold-accent text-charcoal-black text-[8px] md:text-[10px] px-2 py-1 rounded-md font-black shadow-lg">
            -{Math.round(
              ((product.oldPrice - product.price) / product.oldPrice) * 100
            )}
            %
          </div>
        )}

        
      </div>

      {/* ---------------- 2. PRODUCT DETAILS ---------------- */}

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

        <h3 className="font-playfair text-sm md:text-xl font-bold text-charcoal-black mb-1 md:mb-2 group-hover:text-gold-accent transition-colors line-clamp-1 md:line-clamp-2">
          {product.name}
        </h3>

        

        {/* ---------------- 3. PRICING ---------------- */}

        <div className="mt-auto pt-3 border-t border-charcoal-black/5 flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <span className="text-[7px] md:text-[10px] text-slate-gray/60 uppercase font-bold tracking-tighter">
              {isClientLoggedIn ? "VIP Rate" : "Price"}
            </span>

            <div className="flex items-center gap-1.5 md:gap-2 overflow-hidden">
              <span className="text-sm md:text-xl font-bold text-charcoal-black truncate">
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>

              {(product.oldPrice || isClientLoggedIn) && (
                <span className="text-[8px] md:text-xs text-gray-400 line-through font-medium truncate">
                  ₹
                  {Number(
                    isClientLoggedIn ? product.price : product.oldPrice
                  ).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleWhatsAppBuy}
            className="p-2 md:p-3 bg-[#25D366] text-white rounded-lg md:rounded-xl hover:bg-[#128C7E] transition-colors shrink-0 ml-2 shadow-lg shadow-[#25D366]/20 group/wa"
            title="Buy via WhatsApp"
          >
            <IconBrandWhatsapp
              className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-hover/wa:scale-110 transition-transform"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;