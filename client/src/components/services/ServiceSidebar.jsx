import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { servicesData } from "../../data/servicesData";

const ServiceSidebar = () => {
  const location = useLocation();
  const currentId = location.pathname.split("/").pop();

  return (
    <div className="bg-white rounded-lg p-6 py-6 h-fit sticky top-24 border border-gold-accent/20 shadow-sm">
      <h3 className="font-playfair text-xl text-charcoal-black mb-6 border-b border-gold-accent/20 pb-4">
        Our Services
      </h3>
      <ul className="space-y-2">
        {servicesData.map((service) => {
          const isActive = service.id === currentId;
          return (
            <li key={service.id}>
              <Link
                to={`/services/${service.id}`}
                className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 group ${
                  isActive
                    ? "bg-gold-accent text-white font-semibold shadow-md"
                    : "text-charcoal-black/70 hover:bg-gold-accent/10 hover:text-gold-accent"
                }`}
              >
                <span className="font-inter text-sm tracking-wide">
                  {service.title}
                </span>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 text-gold-accent"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 p-4 bg-gradient-to-br from-gray-600 to-charcoal-black  rounded-lg text-center text-white">
        <p className="text-sm mb-3">Need a custom package?</p>
        <Link
          to="/contact"
          className="text-gold-accent text-xs uppercase tracking-widest font-bold hover:text-white transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default ServiceSidebar;
