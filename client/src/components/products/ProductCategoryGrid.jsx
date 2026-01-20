import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Loader from "../Loader";

const ProductCategoryGrid = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/shop/get-products`
        );
        // Get first 6 products for homepage display
        setProducts(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12 text-slate-gray">
        No products available right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/shop");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl bg-white shadow-md border border-gold-accent/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-warm-ivory">
        <img
          src={product.image || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-charcoal-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <ShoppingBag className="w-6 h-6 text-gold-accent" />
          </div>
        </div>

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 left-3 bg-gold-accent text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            {product.category}
          </div>
        )}

        {/* Stock Status */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5">
        <h3 className="font-playfair text-xl text-charcoal-black font-semibold mb-2 line-clamp-1">
          {product.name}
        </h3>

        <p className="font-inter text-slate-gray text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-inter text-2xl font-bold text-charcoal-black">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-sm text-slate-gray line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <motion.div
            className="flex items-center gap-1 text-gold-accent font-inter text-sm font-semibold group-hover:gap-2 transition-all duration-300"
            whileHover={{ x: 5 }}
          >
            View
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCategoryGrid;
