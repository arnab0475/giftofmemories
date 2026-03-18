import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Sparkles, Clock, MapPin } from "lucide-react";
import axios from "axios";
import Loader from "../components/Loader";
import RevealOnScroll from "../components/RevealOnScroll";

const ServicesPage = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to optimize Cloudinary delivery and reduce cookie/header overhead
  const optimizeUrl = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    if (url.includes("f_auto,q_auto")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/services/packages-with-services`
        );
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <main className="bg-warm-ivory min-h-screen overflow-x-hidden selection:bg-gold-accent selection:text-white">
      
      {/* --- PREMIUM SUB-HERO --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-charcoal-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-accent/20 via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-accent font-inter text-xs uppercase tracking-[0.5em] font-black mb-4 block"
          >
            Our Expertise
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-playfair text-5xl md:text-8xl text-warm-ivory font-bold mb-8 tracking-tighter"
          >
            Photography <span className="italic text-gold-accent">Experiences</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-inter text-warm-ivory/60 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            From the grandest celebrations to the quietest intimate moments, we provide a bespoke approach to capturing your legacy with artistic precision.
          </motion.p>
        </div>
      </section>

      {/* --- EDITORIAL SERVICE SECTIONS --- */}
      <section className="py-12 md:py-24">
        {packages.map((pkg, index) => (
          <RevealOnScroll key={pkg._id}>
            <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10 md:gap-20 mb-24 md:mb-40 container mx-auto px-6`}>
              
              <div className="w-full md:w-1/2 relative group">
                <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl shadow-2xl bg-black flex items-center justify-center border border-charcoal-black/5">
                  <img 
                    src={optimizeUrl(pkg.imageUrl) || "/img1.jpeg"} 
                    alt="" 
                    role="presentation"
                    className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-110"
                  />
                  <img 
                    src={optimizeUrl(pkg.imageUrl) || "/img1.jpeg"} 
                    alt={`Gift of Memories - ${pkg.title} Photography Service`} 
                    className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className={`absolute -bottom-6 ${index % 2 === 0 ? "-right-6" : "-left-6"} hidden lg:block w-32 h-32 border-2 border-gold-accent/20 rounded-full -z-10`} />
              </div>

              <div className="w-full md:w-1/2 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-gold-accent" />
                  <span className="text-gold-accent font-inter text-[10px] uppercase tracking-widest font-black">
                    Experience {index + 1}
                  </span>
                </div>
                
                <h2 className="font-playfair text-4xl md:text-6xl text-charcoal-black mb-6 leading-tight font-bold">
                  {pkg.title}
                </h2>
                
                <p className="font-inter text-slate-gray text-base md:text-lg mb-8 font-light leading-relaxed">
                  {pkg.description || "Tailored photography sessions designed to capture the unique essence of your celebration with timeless elegance."}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="flex items-start gap-3">
                    <Camera className="text-gold-accent w-5 h-5 mt-1" />
                    <div>
                      <h4 className="text-[10px] uppercase font-black tracking-wider text-charcoal-black">Deliverables</h4>
                      <p className="text-xs text-slate-gray">High-Res Digital Gallery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-gold-accent w-5 h-5 mt-1" />
                    <div>
                      <h4 className="text-[10px] uppercase font-black tracking-wider text-charcoal-black">Style</h4>
                      <p className="text-xs text-slate-gray">Cinematic & Candid</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = `/contact?service=${encodeURIComponent(pkg.title)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-charcoal-black text-warm-ivory font-inter text-xs font-black uppercase tracking-widest hover:bg-gold-accent transition-all duration-300 rounded-sm shadow-xl"
                >
                  Inquire for Details
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </section>

      {/* --- THE PROCESS (SEO & Trust Builder) --- */}
      <section className="bg-white py-20 border-t border-charcoal-black/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-playfair text-3xl md:text-5xl text-charcoal-black mb-16">The Journey <span className="italic text-gold-accent">with us</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Clock />, title: "Consultation", desc: "We meet to discuss your vision, timeline, and the specific rituals that matter most to you." },
              { icon: <Camera />, title: "The Session", desc: "Our team captures your moments with a blend of invisible candidness and artistic direction." },
              { icon: <MapPin />, title: "Final Gallery", desc: "Your memories are curated into a premium digital archive and handcrafted heirloom albums." }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gold-accent/10 flex items-center justify-center text-gold-accent mb-6">
                  {step.icon}
                </div>
                <h3 className="font-playfair text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-gray text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;