import React from "react";
import { motion } from "framer-motion";
import { useClientAuth } from "../../context/ClientAuthContext";

const ProductCard = ({ product, onClick }) => {
  const { isClientLoggedIn } = useClientAuth();

  const discountPrice = Math.round(product.price * 0.85);

  const handleBuyNow = (e) => {
    e.stopPropagation();
    onClick(product); // Open the modal popup
  };

  return (
   <motion.div
  key={product._id}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  whileHover={{ y: -6 }}
  className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative ${
    !product.isActive ? "opacity-60" : ""
  }`}
>
  {/* Discount Calculation */}
  {product.oldPrice && (
    <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
      {Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      )}
      % OFF
    </div>
  )}

  {/* Badges */}
  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
    {product.tag && (
      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium uppercase">
        {product.tag}
      </span>
    )}

    {product.isBestseller && (
      <span className="bg-[#C9A24D] text-white text-xs px-2 py-1 rounded font-semibold">
        Bestseller
      </span>
    )}
  </div>

  {/* Image */}
  <div className="h-52 overflow-hidden bg-gray-100 relative">
    <img
      src={product.image}
      alt={product.name}
      onError={(e) => (e.target.src = "/placeholder.png")}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
  </div>

  {/* Content */}
  <div className="p-4">
    {/* Category */}
    <div className="text-xs text-[#C9A24D] font-semibold uppercase tracking-wider mb-1">
      {product.category?.name}
    </div>

    {/* Name */}
    <h3 className="font-playfair text-lg font-bold text-[#0F0F0F] mb-1 line-clamp-1">
      {product.name}
    </h3>

    {/* Description */}
    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
      {product.description}
    </p>

    {/* Price Section */}
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xl font-bold text-[#0F0F0F]">
        ₹{Number(product.price).toLocaleString()}
      </span>

      {product.oldPrice && (
        <span className="text-gray-400 line-through text-sm">
          ₹{Number(product.oldPrice).toLocaleString()}
        </span>
      )}
    </div>

    {/* Popularity */}
    <div className="text-xs text-gray-400">
      Popularity: {product.popularity || 0}%
    </div>
  </div>
</motion.div>
  );
};

export default ProductCard;
