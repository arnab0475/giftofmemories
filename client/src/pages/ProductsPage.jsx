// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { Filter, PackageX, ShoppingBag } from "lucide-react";

// import ProductsHero from "../components/products/ProductsHero";
// import ProductCard from "../components/products/ProductCard";
// import Loader from "../components/Loader";
// import CTASection from "../components/products/CTASection";
// import TrustStrip from "../components/products/TrustStrip";

// import CategoryScrollSection from "../components/CategoryScroll";
// import SidebarFilter from "../components/ProductSideBar";
// import MobileFilterDrawer from "../components/MoblieFilter";

// const ProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const optimizeUrl = (url) => {
//     if (!url || !url.includes("cloudinary.com")) return url;
//     if (url.includes("f_auto,q_auto")) return url;
//     return url.replace("/upload/", "/upload/f_auto,q_auto/");
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const [productsRes, categoriesRes] = await Promise.all([
//           axios.get(`${import.meta.env.VITE_NODE_URL}/api/shop/get-products`),
//           axios.get(`${import.meta.env.VITE_NODE_URL}/api/product-categories/get-categories`)
//         ]);

//         const optimizedProducts = productsRes.data.map(p => ({
//           ...p,
//           images: p.images?.map(img => optimizeUrl(img))
//         }));

//         setProducts(optimizedProducts);
//         setCategories(categoriesRes.data);
//       } catch (error) {
//         console.error("Error fetching shop data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const toggleCategory = (name) => {
//     setSelectedCategories((prev) =>
//       prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
//     );
//   };

//   const clearFilters = () => {
//     setSelectedCategories([]);
//     setMinPrice("");
//     setMaxPrice("");
//   };

//   const filteredProducts = useMemo(() => {
//     let result = [...products];
//     if (selectedCategories.length > 0) {
//       result = result.filter((p) => selectedCategories.includes(p.category?.name));
//     }
//     if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
//     if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));
//     return result;
//   }, [selectedCategories, minPrice, maxPrice, products]);

//   return (
//     <div className="bg-[#FAF9F6] min-h-[100dvh] font-inter overflow-x-hidden selection:bg-gold-accent selection:text-white">
      
//       <section aria-label="Shop Header">
//         <ProductsHero />
//       </section>

//       {/* STICKY BAR */}
//       <div className="bg-white/70 backdrop-blur-md sticky top-0 z-[40] border-b border-charcoal-black/5">
//         <CategoryScrollSection
//           categories={categories}
//           selectedCategories={selectedCategories}
//           onToggle={toggleCategory}
//         />
//       </div>

//       <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-20 relative">
        
//         {/* EDITORIAL INTRO */}
//         <div className="hidden lg:block mb-16 max-w-2xl relative z-10">
//           <div className="flex items-center gap-3 mb-4">
//              <div className="h-px w-8 bg-gold-accent" />
//              <span className="text-gold-accent font-inter text-[10px] uppercase tracking-[0.4em] font-black">Archive / Samogri</span>
//           </div>
//           <h2 className="font-playfair text-5xl text-charcoal-black font-bold mb-4">
//             The Ritual <span className="italic text-gold-accent">Collection</span>
//           </h2>
//           <p className="text-slate-gray text-sm leading-relaxed font-light">
//             A curated selection of handcrafted ritual essentials, heirloom albums, and fine art prints designed to honor your most cherished celebrations.
//           </p>
//         </div>

//         {/* Mobile Filter Trigger */}
//         <div className="lg:hidden mb-8">
//           <button
//             onClick={() => setIsMobileFilterOpen(true)}
//             className="w-full flex items-center justify-center gap-3 bg-charcoal-black text-gold-accent py-4 rounded-xl shadow-xl font-black text-[10px] uppercase tracking-[0.3em]"
//           >
//             <Filter size={16} />
//             Refine Collection
//           </button>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-10 xl:gap-20 items-start">
          
//           {/* --- SIDEBAR FILTER: CLEANED UP --- */}
//           {/* We removed the extra <div> wrapper here that was causing the "back appearance" */}
//           <aside className="hidden lg:block w-72 shrink-0 sticky top-44 z-[30] self-start">
//               <SidebarFilter
//                 categories={categories}
//                 selectedCategories={selectedCategories}
//                 onToggleCategory={toggleCategory}
//                 minPrice={minPrice}
//                 maxPrice={maxPrice}
//                 setMinPrice={setMinPrice}
//                 setMaxPrice={setMaxPrice}
//                 clearFilters={clearFilters}
//               />
//           </aside>

//           {/* --- PRODUCT GRID AREA --- */}
//           <div className="flex-1 min-w-0 w-full relative z-10">
            
//             <div className="flex items-center justify-between mb-10 pb-4 border-b border-charcoal-black/5">
//               <div className="flex items-center gap-2">
//                 <ShoppingBag size={14} className="text-gold-accent" />
//                 <span className="text-[10px] font-black text-charcoal-black uppercase tracking-widest">
//                   Showing {filteredProducts.length} Heirloom Pieces
//                 </span>
//               </div>
              
//               {(selectedCategories.length > 0 || minPrice || maxPrice) && (
//                 <button 
//                   onClick={clearFilters}
//                   className="text-[10px] font-black text-red-500 hover:text-charcoal-black transition-colors uppercase tracking-widest"
//                 >
//                   Reset All
//                 </button>
//               )}
//             </div>

//             {isLoading ? (
//               <div className="flex justify-center items-center py-40">
//                 <Loader color="#C9A24D" />
//               </div>
//             ) : filteredProducts.length === 0 ? (
//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[3rem] border border-charcoal-black/5 shadow-2xl"
//               >
//                 <div className="w-20 h-20 rounded-full bg-gold-accent/5 flex items-center justify-center mb-6">
//                   <PackageX size={32} className="text-gold-accent" />
//                 </div>
//                 <h3 className="font-playfair text-2xl text-charcoal-black font-bold mb-4">
//                   End of Collection
//                 </h3>
//                 <p className="text-slate-gray text-sm mb-8 max-w-xs font-light">
//                   We couldn't find any ritual items matching your current filters.
//                 </p>
//                 <button 
//                   onClick={clearFilters} 
//                   className="px-10 py-4 bg-charcoal-black text-gold-accent rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gold-accent hover:text-charcoal-black transition-all shadow-lg"
//                 >
//                   Clear all filters
//                 </button>
//               </motion.div>
//             ) : (
//               <motion.div
//                 layout
//                 className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 lg:gap-10"
//               >
//                 <AnimatePresence mode="popLayout">
//                   {filteredProducts.map((product) => (
//                     <motion.div
//                       key={product._id}
//                       layout
//                       initial={{ opacity: 0, scale: 0.95 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.95 }}
//                       transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
//                       className="h-full"
//                     >
//                       <ProductCard product={product} />
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </main>

//       <section className="relative z-[10] bg-white border-t border-charcoal-black/5">
//         <CTASection />
//         <TrustStrip />
//       </section>

//       <MobileFilterDrawer
//         isOpen={isMobileFilterOpen}
//         onClose={() => setIsMobileFilterOpen(false)}
//         categories={categories}
//         selectedCategories={selectedCategories}
//         onToggleCategory={toggleCategory}
//         minPrice={minPrice}
//         maxPrice={maxPrice}
//         setMinPrice={setMinPrice}
//         setMaxPrice={setMaxPrice}
//         clearFilters={clearFilters}
//       />
//     </div>
//   );
// };

// export default ProductsPage;
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, PackageX, ShoppingBag } from "lucide-react";

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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const optimizeUrl = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    if (url.includes("f_auto,q_auto")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_NODE_URL}/api/shop/get-products`),
          axios.get(
            `${import.meta.env.VITE_NODE_URL}/api/product-categories/get-categories`
          ),
        ]);

        const optimizedProducts = productsRes.data.map((p) => ({
          ...p,

          media: p.media?.map((file) => optimizeUrl(file)) || [],

          preview: p.media?.length ? optimizeUrl(p.media[0]) : null,
        }));

        setProducts(optimizedProducts);
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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.includes(p.category?.name)
      );
    }

    if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

    return result;
  }, [selectedCategories, minPrice, maxPrice, products]);

  return (
    <div className="bg-[#FAF9F6] min-h-[100dvh] font-inter overflow-x-hidden selection:bg-gold-accent selection:text-white">

      <section aria-label="Shop Header">
        <ProductsHero />
      </section>

      <div className="bg-white/70 backdrop-blur-md sticky top-0 z-[40] border-b border-charcoal-black/5">
        <CategoryScrollSection
          categories={categories}
          selectedCategories={selectedCategories}
          onToggle={toggleCategory}
        />
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-20 relative">

        <div className="hidden lg:block mb-16 max-w-2xl relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-gold-accent" />
            <span className="text-gold-accent font-inter text-[10px] uppercase tracking-[0.4em] font-black">
              Archive / Samogri
            </span>
          </div>
          <h2 className="font-playfair text-5xl text-charcoal-black font-bold mb-4">
            The Ritual <span className="italic text-gold-accent">Collection</span>
          </h2>
          <p className="text-slate-gray text-sm leading-relaxed font-light">
            A curated selection of handcrafted ritual essentials, heirloom albums, and fine art prints designed to honor your most cherished celebrations.
          </p>
        </div>

        <div className="lg:hidden mb-8">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full flex items-center justify-center gap-3 bg-charcoal-black text-gold-accent py-4 rounded-xl shadow-xl font-black text-[10px] uppercase tracking-[0.3em]"
          >
            <Filter size={16} />
            Refine Collection
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-20 items-start">

          <aside className="hidden lg:block w-72 shrink-0 sticky top-44 z-[30] self-start">
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

          <div className="flex-1 min-w-0 w-full relative z-10">

            <div className="flex items-center justify-between mb-10 pb-4 border-b border-charcoal-black/5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={14} className="text-gold-accent" />
                <span className="text-[10px] font-black text-charcoal-black uppercase tracking-widest">
                  Showing {filteredProducts.length} Heirloom Pieces
                </span>
              </div>

              {(selectedCategories.length > 0 || minPrice || maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-black text-red-500 hover:text-charcoal-black transition-colors uppercase tracking-widest"
                >
                  Reset All
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-40">
                <Loader color="#C9A24D" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[3rem] border border-charcoal-black/5 shadow-2xl"
              >
                <div className="w-20 h-20 rounded-full bg-gold-accent/5 flex items-center justify-center mb-6">
                  <PackageX size={32} className="text-gold-accent" />
                </div>
                <h3 className="font-playfair text-2xl text-charcoal-black font-bold mb-4">
                  End of Collection
                </h3>
                <p className="text-slate-gray text-sm mb-8 max-w-xs font-light">
                  We couldn't find any ritual items matching your current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-10 py-4 bg-charcoal-black text-gold-accent rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gold-accent hover:text-charcoal-black transition-all shadow-lg"
                >
                  Clear all filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 lg:gap-10"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

      <section className="relative z-[10] bg-white border-t border-charcoal-black/5">
        <CTASection />
        <TrustStrip />
      </section>

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