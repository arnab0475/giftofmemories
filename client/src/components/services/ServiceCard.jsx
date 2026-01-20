import { motion } from "framer-motion";
import { useClientAuth } from "../../context/ClientAuthContext";

const ServiceCard = ({ service }) => {
  const { isClientLoggedIn } = useClientAuth();

  // Extract numeric price from string (e.g., "₹25,000+" -> 25000)
  const extractPrice = (priceString) => {
    const match = priceString?.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, "")) : 0;
  };

  const originalPrice = extractPrice(service.price);
  const discountedPrice = Math.round(originalPrice * 0.85);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[14px] overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.06)] border border-muted-beige/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      {/* Image Container */}
      <div className="h-[250px] overflow-hidden relative">
        <img
          src={
            service.images && service.images.length > 0
              ? service.images[0]
              : service.image
          }
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {isClientLoggedIn && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-sm shadow-md">
            15% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className="font-playfair text-2xl font-semibold text-charcoal-black mb-3">
          {service.title}
        </h3>
        <p className="font-inter text-slate-gray mb-6 text-sm leading-relaxed line-clamp-3">
          {service.shortDescription || service.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="font-inter text-xs text-slate-gray uppercase tracking-wider mb-1">
              Starting at
            </p>
            {isClientLoggedIn && originalPrice > 0 ? (
              <div className="flex flex-col items-start leading-none">
                <span className="text-xs text-slate-400 line-through decoration-slate-400 decoration-1 mb-1 font-inter">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-lg font-bold text-gold-accent font-inter">
                  ₹{discountedPrice.toLocaleString("en-IN")}
                </span>
              </div>
            ) : (
              <p className="font-inter text-lg font-bold text-gold-accent">
                {service.price}
              </p>
            )}
          </div>
          <button className="px-6 py-2.5 rounded-[10px] border border-gold-accent text-gold-accent font-inter text-sm font-semibold transition-all duration-300 group-hover:bg-gold-accent group-hover:text-charcoal-black">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
