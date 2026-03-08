import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, PackageX } from "lucide-react";

import ProductsHero from "../components/products/ProductsHero";
import ProductCard from "../components/products/ProductCard";
import Loader from "../components/Loader";
import CTASection from "../components/products/CTASection";
import TrustStrip from "../components/products/TrustStrip";

import CategoryScrollSection from "../components/CategoryScroll";
import SidebarFilter from "../components/ProductSideBar";
import MobileFilterDrawer from "../components/MoblieFilter";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_NODE_URL}/api/shop/get-products`),
          axios.get(`${import.meta.env.VITE_NODE_URL}/api/product-categories/get-categories`)
        ]);

        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
  };

  useEffect(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.includes(p.category?.name)
      );
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    setFilteredProducts(result);
  }, [selectedCategories, minPrice, maxPrice, products]);

  return (
    <div className="bg-warm-ivory/30 min-h-[100dvh] font-inter overflow-x-hidden">
      <ProductsHero />

      <CategoryScrollSection
        categories={categories}
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
      />

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 md:py-16">
        
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6 px-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-charcoal-black text-gold-accent py-3.5 rounded-xl shadow-lg hover:bg-gold-accent hover:text-charcoal-black transition-colors font-bold text-[10px] md:text-[11px] uppercase tracking-widest"
          >
            <Filter size={14} />
            Filter & Sort
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <SidebarFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              clearFilters={clearFilters}
            />
          </aside>

          {/* Main Product Grid */}
          <div className="flex-1 min-w-0 w-full px-2 sm:px-0">
            
            {/* Results Header */}
            <div className="flex items-end justify-between mb-6 pb-4 border-b border-charcoal-black/5">
              <span className="text-[9px] md:text-xs font-bold text-slate-gray uppercase tracking-widest">
                Showing <strong className="text-charcoal-black">{filteredProducts.length}</strong> Results
              </span>
              
              {(selectedCategories.length > 0 || minPrice || maxPrice) && (
                <button 
                  onClick={clearFilters}
                  className="text-[9px] md:text-xs font-bold text-red-500 hover:underline uppercase tracking-widest transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-32">
                <Loader color="#C9A24D" />
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty State */
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-[2rem] border border-charcoal-black/5 shadow-sm"
              >
                <PackageX size={40} className="text-slate-gray/30 mb-4" />
                <h3 className="font-playfair text-xl md:text-2xl text-charcoal-black font-bold mb-2">
                  No matches found
                </h3>
                <p className="text-slate-gray text-xs md:text-sm mb-6 max-w-xs">
                  Try adjusting your filters or price range to find what you're looking for.
                </p>
                <button 
                  onClick={clearFilters} 
                  className="px-6 py-3 bg-charcoal-black text-gold-accent rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-gold-accent hover:text-charcoal-black transition-all"
                >
                  View All
                </button>
              </motion.div>
            ) : (
              /* Product Grid: 2 columns on mobile, 3 on large desktop */
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <div className="relative z-10 mt-12 bg-white">
        <CTASection />
        <TrustStrip />
      </div>

      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        clearFilters={clearFilters}
      />
    </div>
  );
};

export default ProductsPage;