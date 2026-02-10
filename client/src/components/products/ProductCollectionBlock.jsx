import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";

const ProductCollectionBlock = ({ collection, onProductClick }) => {
  const [startIndex, setStartIndex] = useState(0);
  const scrollRef = useRef(null);

  if (!collection || collection.products.length === 0) {
    return null;
  }

  const { displayStyle, products, name, description } = collection;

  // Determine grid columns based on product count
  const getGridCols = (count) => {
    if (count === 1) return "grid-cols-1 max-w-sm";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2 max-w-2xl";
    if (count === 3)
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl";
  };

  // Grid display - Golden Light Theme
  if (displayStyle === "grid") {
    return (
      <section className="py-16 px-4 md:px-8">
        <div className="mx-auto">
          {/* Decorative Container */}
          <div className="bg-gradient-to-br from-[#FDF9F3] via-[#FBF6EE] to-[#F9F3E8] rounded-3xl p-8 md:p-12 border border-gold-accent/20 shadow-[0_4px_40px_rgba(201,162,77,0.1)]">
            {/* Header with Gold Accent */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gold-accent/10 rounded-full border border-gold-accent/30">
                <Sparkles size={16} className="text-gold-accent" />
                <span className="text-gold-accent text-xs font-semibold uppercase tracking-widest">
                  Curated Collection
                </span>
              </div>
              <h2 className="font-playfair text-3xl md:text-4xl text-charcoal-black mb-3">
                {name}
              </h2>
              {description && (
                <p className="text-slate-gray font-inter max-w-2xl mx-auto">
                  {description}
                </p>
              )}
              {/* Gold line accent */}
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto mt-6" />
            </div>

            {/* Products Grid - Width based on product count */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className={`grid ${getGridCols(products.length)} gap-6 mx-auto`}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} onClick={onProductClick} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Carousel display - Golden Light Theme
  if (displayStyle === "carousel") {
    const visibleCount = 4;
    const canScrollLeft = startIndex > 0;
    const canScrollRight = startIndex < products.length - visibleCount;

    const scrollLeft = () => {
      setStartIndex((prev) => Math.max(0, prev - 1));
    };

    const scrollRight = () => {
      setStartIndex((prev) =>
        Math.min(products.length - visibleCount, prev + 1),
      );
    };

    return (
      <section className="py-16 px-4 md:px-8">
        <div className="mx-auto">
          {/* Decorative Container */}
          <div className="bg-gradient-to-r from-[#FDF9F3] via-white to-[#FDF9F3] rounded-3xl p-8 md:p-12 border border-gold-accent/20 shadow-[0_4px_40px_rgba(201,162,77,0.1)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 bg-gold-accent/10 rounded-full border border-gold-accent/30">
                  <Star
                    size={14}
                    className="text-gold-accent"
                    fill="currentColor"
                  />
                  <span className="text-gold-accent text-xs font-semibold uppercase tracking-wider">
                    Popular Picks
                  </span>
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl text-charcoal-black mb-2">
                  {name}
                </h2>
                {description && (
                  <p className="text-slate-gray font-inter">{description}</p>
                )}
              </div>
              <div className="hidden md:flex gap-2">
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={`p-3 rounded-full border-2 transition-all ${
                    canScrollLeft
                      ? "border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-white shadow-lg shadow-gold-accent/20"
                      : "border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className={`p-3 rounded-full border-2 transition-all ${
                    canScrollRight
                      ? "border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-white shadow-lg shadow-gold-accent/20"
                      : "border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden" ref={scrollRef}>
              <motion.div
                className="flex gap-6"
                animate={{ x: -startIndex * (280 + 24) }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {products.map((product, index) => (
                  <div key={product._id} className="w-[280px] flex-shrink-0">
                    <ProductCard product={product} onClick={onProductClick} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Mobile scroll hint */}
            <div className="flex justify-center gap-2 mt-6 md:hidden">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStartIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === startIndex
                      ? "bg-gold-accent w-8"
                      : "bg-gold-accent/30 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Featured display - Premium Golden Theme
  if (displayStyle === "featured") {
    return (
      <section className="py-16 px-4 md:px-8">
        <div className="mx-auto">
          {/* Premium Container with Gold Border */}
          <div className="relative bg-gradient-to-br from-[#FFFCF5] via-[#FFF9ED] to-[#FDF5E6] rounded-3xl p-8 md:p-12 border-2 border-gold-accent/40 shadow-[0_8px_60px_rgba(201,162,77,0.15)]">
            {/* Corner Gold Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-gold-accent rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-gold-accent rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-gold-accent rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-gold-accent rounded-br-3xl" />

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 rounded-3xl overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #C9A24D 1px, transparent 0)`,
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-4 px-6 py-2.5 bg-gold-accent text-white rounded-full shadow-lg shadow-gold-accent/30">
                  <Star size={18} fill="currentColor" />
                  <span className="text-sm font-bold uppercase tracking-widest">
                    Featured Collection
                  </span>
                  <Star size={18} fill="currentColor" />
                </div>
                <h2 className="font-playfair text-3xl md:text-5xl text-charcoal-black mb-4">
                  {name}
                </h2>
                {description && (
                  <p className="text-slate-gray font-inter max-w-2xl mx-auto">
                    {description}
                  </p>
                )}
                {/* Decorative gold lines */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-gold-accent" />
                  <Sparkles size={20} className="text-gold-accent" />
                  <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-gold-accent" />
                </div>
              </div>

              {/* Products Grid - Width based on product count */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className={`grid ${getGridCols(products.length)} gap-6 mx-auto`}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} onClick={onProductClick} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default ProductCollectionBlock;
