// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import ProductsHero from "../components/products/ProductsHero";
// import FilterSortBar from "../components/products/FilterSortBar";
// import ProductCard from "../components/products/ProductCard";
// import ProductModal from "../components/products/ProductModal";
// import TrustStrip from "../components/products/TrustStrip";
// import CTASection from "../components/products/CTASection";
// import Loader from "../components/Loader";
// import PageVideoSection from "../components/PageVideoSection";
// import ProductCollectionBlock from "../components/products/ProductCollectionBlock";

// const ProductsPage = () => {
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [activeSort, setActiveSort] = useState("Popular");
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [collections, setCollections] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const sortOptions = [
//     "Popular",
//     "Price: Low to High",
//     "Price: High to Low",
//     "Newest",
//   ];

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_NODE_URL}/api/product-categories/get-categories`,
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);
//   useEffect(()=>{    console.log("hello");  }, [] );

//   // Fetch collections
//   useEffect(() => {
//     const fetchCollections = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_NODE_URL}/api/product-collections/get-collections`,
//         );
//         setCollections(response.data);
//       } catch (error) {
//         console.error("Error fetching collections:", error);
//       }
//     };
//     fetchCollections();
//   }, []);

//   // Build filters array from categories
//   const filters = ["All", ...categories.map((cat) => cat.name)];

//   // Fetch products from API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(
//           `${import.meta.env.VITE_NODE_URL}/api/shop/get-products`,
//         );
//         setProducts(response.data);
//         setFilteredProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Handle Filter and Sort
//   useEffect(() => {
//     let result = [...products];

//     // Filter by category
//     if (activeFilter !== "All") {
//       result = result.filter((product) => {
//         const categoryName = product.category?.name || "";
//         return categoryName === activeFilter;
//       });
//     }

//     // Sort
//     switch (activeSort) {
//       case "Price: Low to High":
//         result.sort((a, b) => a.price - b.price);
//         break;
//       case "Price: High to Low":
//         result.sort((a, b) => b.price - a.price);
//         break;
//       case "Newest":
//         result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//       case "Popular":
//       default:
//         result.sort((a, b) => b.popularity - a.popularity);
//         break;
//     }

//     setFilteredProducts(result);
//   }, [activeFilter, activeSort, products]);

//   const handleProductClick = (product) => {
//     setSelectedProduct(product);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
//   };

//   return (
//     <div className="bg-warm-ivory min-h-screen">
//       {/* 1. Hero Section */}
//       <ProductsHero />

//       {/* Video Guides */}
//       <PageVideoSection
//         pageType="shop"
//         title="Shopping Guide"
//         subtitle="Learn How to Buy"
//       />

//       {/* 2. Product Collections - Show featured collections at top Featured Products */}
//       {collections.length > 0 && (
//         <div className="space-y-4 relative z-0">
//           {collections.map((collection) => (
//             <ProductCollectionBlock
//               key={collection._id}
//               collection={collection}
//               onProductClick={handleProductClick}
//             />
//           ))}
//         </div>
//       )}

//       {/* 3. All Products Section Header */}
//       <div className="bg-gradient-to-b from-warm-ivory to-white py-12">
//         <div className="max-w-[1240px] mx-auto px-4 md:px-8 text-center">
//           <h2 className="font-playfair text-3xl md:text-4xl text-charcoal-black mb-3">
//             All Products
//           </h2>
//           <p className="text-slate-gray font-inter max-w-2xl mx-auto">
//             Browse our complete collection of premium products
//           </p>
//         </div>
//       </div>

//       {/* 4. Filter & Sort Bar */}
//       <div className="relative z-50">
//         <FilterSortBar
//           filters={filters}
//           activeFilter={activeFilter}
//           onFilterChange={setActiveFilter}
//           sortOptions={sortOptions}
//           activeSort={activeSort}
//           onSortChange={setActiveSort}
//         />
//       </div>

//       {/* 5. Products Grid */}
//       <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-12 md:py-20 min-h-[60vh] relative z-10">
//         {isLoading ? (
//           <div className="flex justify-center py-20">
//             <Loader color="#C9A24D" />
//           </div>
//         ) : (
//           <motion.div
//             layout
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
//           >
//             <AnimatePresence>
//               {filteredProducts.map((product) => (
//                 <motion.div
//                   layout
//                   key={product._id}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.9 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <ProductCard product={product} onClick={handleProductClick} />
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </motion.div>
//         )}

//         {!isLoading && filteredProducts.length === 0 && (
//           <div className="text-center py-20 text-slate-gray">
//             <p className="text-xl">No products found for this category.</p>
//             <button
//               onClick={() => setActiveFilter("All")}
//               className="mt-4 text-gold-accent underline"
//             >
//               View All Products
//             </button>
//           </div>
//         )}
//       </div>

//       {/* 6. CTA Section */}
//       <CTASection />
//       {/* 7. Trust Assurance */}
//       <TrustStrip />

//       {/* Product Modal */}
//       <ProductModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         product={selectedProduct}
//       />
//     </div>
//   );
// };

// export default ProductsPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
      setIsLoading(true);
      const productsRes = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/shop/get-products`
      );
      const categoriesRes = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/product-categories/get-categories`
      );

      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setIsLoading(false);
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
    <div className="bg-warm-ivory min-h-screen">
      <ProductsHero />

      <CategoryScrollSection
        categories={categories}
        selectedCategories={selectedCategories}
        onToggle={toggleCategory}
      />

      <div className="max-w-[1240px] mx-auto px-4 md:px-8 pb-12 md:pb-20">
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            Open Filters
          </button>
        </div>

        <div className="flex gap-10">
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

          <div className="flex-1">
            {isLoading ? (
              <Loader />
            ) : (
              <motion.div
  layout
  className="
    grid 
    grid-cols-2 
    lg:grid-cols-3 
    gap-4 
    md:gap-6
  "
>
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <CTASection />
      <TrustStrip />

      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
      />
    </div>
  );
};

export default ProductsPage;