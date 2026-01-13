import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";
import axios from "axios";
import ServiceSidebar from "../components/services/ServiceSidebar";
import ServiceBookingForm from "../components/services/ServiceBookingForm";
import RevealOnScroll from "../components/RevealOnScroll";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/services/service/${id}`
        );
        setService(response.data);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchService();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-warm-ivory flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A24D]"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-warm-ivory flex flex-col items-center justify-center">
        <h2 className="font-playfair text-3xl mb-4">Service Not Found</h2>
        <Link to="/services" className="text-gold-accent underline">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-warm-ivory min-h-screen pt-24 pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-gold-accent/10 text-charcoal-black py-12 mb-12 border-y border-gold-accent/20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-60 mb-4 font-inter">
            <Link to="/" className="hover:text-gold-accent">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/services" className="hover:text-gold-accent">
              Services
            </Link>
            <ChevronRight size={12} />
            <span className="text-gold-accent font-bold">{service.title}</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold">
            {service.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT SIDEBAR (Navigation) - Spans 3 columns */}
          <div className="hidden lg:block lg:col-span-3">
            <ServiceSidebar
              currentServiceId={id}
              packageId={
                typeof service.package === "string"
                  ? service.package
                  : service.package?._id
              }
              packageTitle={
                typeof service.package === "object"
                  ? service.package?.title
                  : null
              }
            />
          </div>

          {/* MAIN CONTENT AREA - Spans 9 columns */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Left Column of Content: Image + Text */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="rounded-xl overflow-hidden shadow-lg h-[300px] md:h-[400px]"
                >
                  <img
                    src={
                      service.images && service.images.length > 0
                        ? service.images[0]
                        : service.image
                    }
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                <RevealOnScroll>
                  <div>
                    <h2 className="font-playfair text-3xl text-charcoal-black mb-4 font-bold">
                      About This Service
                    </h2>
                    <p className="font-inter text-charcoal-black/80 leading-relaxed text-lg mb-6">
                      {service.description}
                    </p>

                    <div className="bg-white p-6 rounded-lg border border-charcoal-black/5 shadow-sm">
                      <h3 className="font-inter font-bold text-sm uppercase tracking-widest text-gold-accent mb-4">
                        Service Highlights
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                          <span className="text-charcoal-black/70">
                            <strong className="text-charcoal-black font-medium">
                              Starting Price:
                            </strong>{" "}
                            ₹{service.price}
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                          <span className="text-charcoal-black/70">
                            <strong className="text-charcoal-black font-medium">
                              Typical Duration:
                            </strong>{" "}
                            {service.details.duration}
                          </span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                          <span className="text-charcoal-black/70">
                            <strong className="text-charcoal-black font-medium">
                              Deliverables:
                            </strong>{" "}
                            {service.details.deliverables}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Right Column of Content: Sticky Form */}
              <div className="xl:col-span-1">
                <ServiceBookingForm serviceTitle={service.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
