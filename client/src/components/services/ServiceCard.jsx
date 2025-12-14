import { motion } from "framer-motion";

const ServiceCard = ({ service }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[14px] overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.06)] border border-muted-beige/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      {/* Image Container */}
      <div className="h-[250px] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className="font-playfair text-2xl font-semibold text-charcoal-black mb-3">
          {service.title}
        </h3>
        <p className="font-inter text-slate-gray mb-6 text-sm leading-relaxed line-clamp-3">
          {service.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="font-inter text-xs text-slate-gray uppercase tracking-wider mb-1">
              Starting at
            </p>
            <p className="font-inter text-lg font-bold text-gold-accent">
              {service.price}
            </p>
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
