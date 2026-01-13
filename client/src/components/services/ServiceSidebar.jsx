import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const ServiceSidebar = ({ currentServiceId, packageId, packageTitle }) => {
  const location = useLocation();
  const [relatedServices, setRelatedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedServices = async () => {
      if (!packageId) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/services/services`
        );
        const allServices = response.data || [];
        // Filter services that belong to the same package
        const filtered = allServices.filter((s) => {
          const svcPkgId =
            typeof s.package === "string" ? s.package : s.package?._id;
          return svcPkgId === packageId;
        });
        setRelatedServices(filtered);
      } catch (error) {
        console.error("Error fetching related services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRelatedServices();
  }, [packageId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 py-6 h-fit sticky top-24 border border-gold-accent/20 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (relatedServices.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 py-6 h-fit sticky top-24 border border-gold-accent/20 shadow-sm">
      <h3 className="font-playfair text-xl text-charcoal-black mb-6 border-b border-gold-accent/20 pb-4">
        {packageTitle ? `${packageTitle} Services` : "Our Services"}
      </h3>
      <ul className="space-y-2">
        {relatedServices.map((service) => {
          const isActive = service._id === currentServiceId;
          return (
            <li key={service._id}>
              <Link
                to={`/services/${service._id}`}
                className={`flex items-center gap-3 p-3 rounded-md transition-all duration-300 group ${
                  isActive
                    ? "bg-gold-accent text-white font-semibold shadow-md"
                    : "text-charcoal-black/70 hover:bg-gold-accent/10 hover:text-gold-accent"
                }`}
              >
                {service.logo ? (
                  <img
                    src={service.logo}
                    alt={service.title}
                    className={`w-7 h-7 object-contain rounded-md p-0.5 shrink-0 ${
                      isActive ? "bg-white/20" : "bg-white shadow-sm"
                    }`}
                  />
                ) : (
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                      isActive ? "bg-white/20" : "bg-gold-accent/10"
                    }`}
                  >
                    <span
                      className={`text-xs font-bold ${
                        isActive ? "text-white" : "text-gold-accent"
                      }`}
                    >
                      {service.title.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="font-inter text-sm tracking-wide flex-1">
                  {service.title}
                </span>
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-300 shrink-0 ${
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

      <div className="mt-8 p-4 bg-gradient-to-br from-gray-600 to-charcoal-black rounded-lg text-center text-white">
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
