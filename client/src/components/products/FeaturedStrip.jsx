import React from "react";
import ProductCard from "./ProductCard";
import { products } from "../../data/productsData";

const FeaturedStrip = ({ onProductClick }) => {
  const bestsellers = products.filter((p) => p.isBestseller);

  return (
    <div className="bg-muted-beige py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-gold-accent font-semibold tracking-wider text-sm uppercase">
              Curated Favorites
            </span>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-charcoal-black mt-2">
              Most Popular
            </h2>
          </div>
          <button className="text-sm font-semibold border-b border-charcoal-black pb-1 hover:text-gold-accent hover:border-gold-accent transition-colors">
            View All
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 md:-mx-8 md:px-8 pb-8">
          <div className="flex gap-6 w-max">
            {bestsellers.map((product) => (
              <div key={product.id} className="w-[280px] md:w-[320px]">
                <ProductCard product={product} onClick={onProductClick} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedStrip;
