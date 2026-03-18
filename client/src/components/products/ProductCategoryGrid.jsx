import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Loader from "../Loader";

const ProductCategoryGrid = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/shop/get-products?limit=6`
        );
        setProducts(response.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const visibleProducts = isMobile ? products.slice(0, 4) : products;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader color="#C9A24D" />
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      {visibleProducts.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const isOutOfStock = product.stock === 0;

  const handleClick = () => {
    if (!isOutOfStock) {
      navigate(`/shop/product/${product._id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-xl md:rounded-2xl bg-white border border-charcoal-black/5 transition-all duration-500 shadow-sm flex flex-col h-full ${
        isOutOfStock 
          ? "opacity-60 grayscale cursor-not-allowed" 
          : "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      }`}
    >
      <div className="relative h-36 sm:h-56 md:h-72 overflow-hidden bg-warm-ivory shrink-0">
        <img
          src={product.image || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-1">
          {product.category && (
            <div className="bg-charcoal-black/80 backdrop-blur-md text-gold-accent px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[6px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg">
              {typeof product.category === 'object' ? product.category.name : product.category}
            </div>
          )}
        </div>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-charcoal-black/40 flex items-center justify-center">
            <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-playfair italic">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-2.5 md:p-6 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-playfair text-xs sm:text-sm md:text-xl lg:text-2xl text-charcoal-black font-bold mb-1 md:mb-2 group-hover:text-gold-accent transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <p className="hidden md:block font-inter text-slate-gray text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-charcoal-black/5 pt-2 md:pt-5 mt-auto">
          <div className="flex flex-col">
            <span className="text-[7px] md:text-[10px] uppercase tracking-widest text-slate-gray/50 font-bold leading-none mb-0.5">Price</span>
            <span className="font-inter text-xs md:text-xl font-black text-charcoal-black leading-none">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-0.5 md:gap-1 text-gold-accent font-inter text-[7px] md:text-xs font-black uppercase tracking-widest group-hover:gap-1.5 transition-all">
            View <ChevronRight className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={3} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCategoryGrid;