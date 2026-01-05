import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductsHero from "../components/products/ProductsHero";
import FilterSortBar from "../components/products/FilterSortBar";
import ProductCard from "../components/products/ProductCard";
import ProductModal from "../components/products/ProductModal";
import FeaturedStrip from "../components/products/FeaturedStrip";
import TrustStrip from "../components/products/TrustStrip";
import CTASection from "../components/products/CTASection";
import { products } from "../data/productsData";

const ProductsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("Popular");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filters = [
    "All",
    "Photo Prints",
    "Albums",
    "Frames",
    "Digital Products",
    "Merchandise",
  ];

  const sortOptions = [
    "Popular",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
  ];

  // Handle Filter and Sort
  useEffect(() => {
    let result = [...products];

    // Filter
    if (activeFilter !== "All") {
      result = result.filter((product) => product.category === activeFilter);
    }

    // Sort
    switch (activeSort) {
      case "Price: Low to High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "Newest":
        result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
      case "Popular":
      default:
        result.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    setFilteredProducts(result);
  }, [activeFilter, activeSort]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };

  return (
    <div className="bg-warm-ivory min-h-screen">
      {/* 1. Hero Section */}
      <ProductsHero />

      {/* 2. Filter & Sort Bar */}
      <FilterSortBar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        sortOptions={sortOptions}
        activeSort={activeSort}
        onSortChange={setActiveSort}
      />

      {/* 3. Products Grid */}
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-12 md:py-20 min-h-[60vh]">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} onClick={handleProductClick} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-slate-gray">
            <p className="text-xl">No products found for this category.</p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 text-gold-accent underline"
            >
              View All Products
            </button>
          </div>
        )}
      </div>

      {/* 4. Featured / Bestsellers */}
      <FeaturedStrip onProductClick={handleProductClick} />

      {/* 5. CTA Section */}
      <CTASection />
      {/* 6. Trust Assurance */}
      <TrustStrip />


      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductsPage;
