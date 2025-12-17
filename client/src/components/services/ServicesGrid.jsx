import { motion, AnimatePresence } from "framer-motion";
import ServiceCard from "./ServiceCard";
import { servicesData } from "../../data/servicesData";
import { Link } from "react-router-dom";

const ServicesGrid = ({ activeFilter }) => {
  const filteredServices =
    activeFilter === "All Services"
      ? servicesData
      : servicesData.filter((service) => service.category === activeFilter);

  return (
    <section className="py-20 bg-warm-ivory min-h-screen">
      <div className="container mx-auto px-6">
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredServices.map((service) => (
              <Link to={`/services/${service.id}`} key={service.id}>
                <ServiceCard service={service} />
              </Link>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <h3 className="font-playfair text-2xl text-charcoal-black">
              No services found in this category.
            </h3>
            <p className="font-inter text-slate-gray mt-2">
              Please try selecting a different category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesGrid;
