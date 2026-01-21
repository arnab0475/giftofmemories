import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";
import axios from "axios";
import ServiceSidebar from "../components/services/ServiceSidebar";
import ServiceBookingForm from "../components/services/ServiceBookingForm";
import RevealOnScroll from "../components/RevealOnScroll";
import { useClientAuth } from "../context/ClientAuthContext";
import Loader from "../components/Loader";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isClientLoggedIn } = useClientAuth();

  // Extract numeric price from string
  const extractPrice = (priceString) => {
    const match = priceString?.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, "")) : 0;
  };

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
        <Loader />
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
          <div className="flex items-center gap-4">
            {service.logo && (
              <img
                src={service.logo}
                alt={service.title}
                className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-xl bg-white shadow-md p-2"
              />
            )}
            <h1 className="font-playfair text-4xl md:text-5xl font-bold">
              {service.title}
            </h1>
          </div>
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
                  className="rounded-xl overflow-hidden shadow-lg h-[300px] md:h-[400px] relative"
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
                  {isClientLoggedIn && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-sm shadow-md z-10">
                      15% OFF FOR YOU
                    </div>
                  )}
                </motion.div>

                <RevealOnScroll>
                  <div className="space-y-8">
                    {/* About Section */}
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-charcoal-black/5 shadow-sm">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-1 h-8 bg-gold-accent rounded-full"></div>
                        <h2 className="font-playfair text-2xl md:text-3xl text-charcoal-black font-bold">
                          About This Service
                        </h2>
                      </div>
                      <div className="font-inter text-charcoal-black/75 leading-relaxed text-base md:text-lg whitespace-pre-line">
                        {service.description}
                      </div>
                    </div>

                    {/* Service Highlights */}
                    <div className="bg-gradient-to-br from-charcoal-black to-charcoal-black/95 p-6 md:p-8 rounded-xl shadow-lg">
                      <h3 className="font-playfair font-bold text-xl text-gold-accent mb-6 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-gold-accent"></span>
                        Service Highlights
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                          <span className="w-3 h-3 rounded-full bg-gold-accent mt-1 shrink-0"></span>
                          <div>
                            <span className="text-gold-accent/80 text-sm uppercase tracking-wider font-inter">
                              Starting Price{" "}
                              {isClientLoggedIn && "(Your Discounted Price)"}
                            </span>
                            {isClientLoggedIn &&
                            extractPrice(service.price) > 0 ? (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-white/50 line-through text-base">
                                  ₹
                                  {extractPrice(service.price).toLocaleString(
                                    "en-IN"
                                  )}
                                </span>
                                <span className="text-white font-semibold text-lg">
                                  ₹
                                  {Math.round(
                                    extractPrice(service.price) * 0.85
                                  ).toLocaleString("en-IN")}
                                </span>
                              </div>
                            ) : (
                              <p className="text-white font-semibold text-lg mt-1">
                                {service.price}
                              </p>
                            )}
                          </div>
                        </li>
                        <li className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                          <span className="w-3 h-3 rounded-full bg-gold-accent mt-1 shrink-0"></span>
                          <div>
                            <span className="text-gold-accent/80 text-sm uppercase tracking-wider font-inter">
                              Typical Duration
                            </span>
                            <p className="text-white font-semibold text-lg mt-1">
                              {service.details.duration}
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                          <span className="w-3 h-3 rounded-full bg-gold-accent mt-1 shrink-0"></span>
                          <div>
                            <span className="text-gold-accent/80 text-sm uppercase tracking-wider font-inter">
                              Deliverables
                            </span>
                            <p className="text-white font-semibold text-lg mt-1">
                              {service.details.deliverables}
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Right Column of Content: Sticky Form */}
              <div className="xl:col-span-1">
                <ServiceBookingForm
                  serviceTitle={service.title}
                  servicePrice={service.price}
                  isLoggedIn={isClientLoggedIn}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
