import { useEffect, useState, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Check } from "lucide-react";
import axios from "axios";

// Default fallback images
const defaultScrollImages = [
  "/nowimg1.jpg",
  "/nowimg2.jpg",
  "/nowimg3.jpg",
  "/img1.jpeg",
  "/img2.jpeg",
  "/img4.jpg",
  "/preimg1.jpeg",
  "/preimg2.jpeg",
  "/preimg5.jpeg",
];

const skills = [
  { name: "Photography", level: 92 },
  { name: "Cinematography", level: 78 },
  { name: "Film Making", level: 86 },
];

const features = [
  "Printed Photograph provided",
  "High Resolution Camera",
  "Experienced Photographer",
  "Premium Photo Albums",
  "Drone Videography",
  "Same Day Edits",
];

const stats = [
  { value: 100, suffix: "%", label: "Customer Satisfaction" },
  { value: 350, suffix: "+", label: "Sessions Completed" },
  { value: 50, suffix: "+", label: "Expert Photographers" },
  { value: 250, suffix: "+", label: "Events Covered" },
];

const ProgressBar = ({ name, level }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const progress = useMotionValue(0);
  const percentage = useTransform(progress, (v) => Math.round(v));
  const width = useTransform(progress, (v) => `${v}%`);

  useEffect(() => {
    if (isInView) {
      progress.set(0);
      animate(progress, level, {
        duration: 1.6,
        ease: "easeOut",
      });
    }
  }, [isInView, level, progress]);

  return (
    <div ref={ref} className="mb-6 md:mb-8">
      <div className="flex justify-between items-end mb-2 font-inter">
        <span className="text-sm md:text-base font-bold text-charcoal-black">{name}</span>
        <div className="flex items-baseline gap-0.5 text-gold-accent">
          <motion.span className="text-xs md:text-sm font-bold">{percentage}</motion.span>
          <span className="text-xs md:text-sm font-bold">%</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-charcoal-black/5 rounded-full overflow-hidden">
        <motion.div
          style={{ width }}
          className="h-full bg-gradient-to-r from-gold-accent/50 to-gold-accent rounded-full"
        />
      </div>
    </div>
  );
};

const AnimatedNumber = ({ value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const number = useMotionValue(0);
  const display = useTransform(number, (v) => Math.floor(v));

  useEffect(() => {
    if (isInView) {
      number.set(0);
      animate(number, value * 1.1, {
        duration: 1,
        ease: "easeIn",
      }).then(() => {
        animate(number, value, {
          duration: 0.6,
          ease: "easeOut",
        });
      });
    }
  }, [isInView, value, number]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{display}</motion.span>
      <span>{suffix}</span>
    </span>
  );
};

const CombinedSections = () => {
  const containerRef = useRef(null);
  const [scrollImages, setScrollImages] = useState(defaultScrollImages);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile to disable janky vertical parallax on small screens
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smooth Parallax for Desktop
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rawY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const rawY2 = useTransform(scrollYProgress, [0, 1], ["10%", "-25%"]);
  
  const y1 = useSpring(rawY1, { stiffness: 100, damping: 30 });
  const y2 = useSpring(rawY2, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/homepage-gallery/section/scroll`
        );
        if (response.data && response.data.length > 0) {
          setScrollImages(response.data.map((img) => img.imageUrl));
        }
      } catch (error) {
        console.error("Error fetching scroll gallery images:", error);
      }
    };
    fetchImages();
  }, []);

  // Split images into two columns
  const col1Images = scrollImages.filter((_, i) => i % 2 === 0);
  const col2Images = scrollImages.filter((_, i) => i % 2 === 1);

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24 lg:py-32 bg-warm-ivory text-charcoal-black relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-white z-0 hidden lg:block border-l border-charcoal-black/5" />
      <div className="absolute top-1/2 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gold-accent/5 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* ---------------- LEFT COLUMN: CONTENT ---------------- */}
        <div className="flex flex-col gap-16 lg:gap-24 pt-4 lg:pt-12">
          
          {/* 1. About Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} // FIX: Changed from x: -30 to y: 40 (fade UP and IN)
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-gold-accent/10 border border-gold-accent/20 mb-6 md:mb-8">
              <span className="text-gold-accent text-[10px] md:text-xs font-bold uppercase tracking-widest">
                About Gift of Memories Studio
              </span>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 md:mb-8 text-charcoal-black">
              Leading Wedding <br className="hidden sm:block" /> Photography in Kolkata
            </h2>
            <p className="font-inter text-slate-gray text-base md:text-lg leading-relaxed mb-10 md:mb-12 max-w-xl font-light">
              Gift of Memories specializes in candid and cinematic wedding
              photography in Kolkata, capturing timeless moments with creativity
              and elegance for couples across West Bengal.
            </p>
            <div className="max-w-lg">
              {skills.map((skill, index) => (
                <ProgressBar key={index} name={skill.name} level={skill.level} />
              ))}
            </div>
          </motion.div>

          {/* 2. Why Choose Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-charcoal-black font-inter text-xs md:text-sm font-bold uppercase tracking-widest block mb-4 md:mb-6 px-4 border-l-2 border-gold-accent">
              Why Choose Us
            </span>
            <p className="font-inter text-slate-gray text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-xl font-light">
              We deliver candid and cinematic wedding photography
              with creativity, professionalism, and a personalized
              touch to make your memories timeless.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="font-inter font-medium text-sm text-charcoal-black/80">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3. Team Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pb-10 lg:pb-0"
          >
            <span className="text-charcoal-black font-inter text-xs md:text-sm font-bold uppercase tracking-widest block mb-4 md:mb-6 px-4 border-l-2 border-gold-accent">
              Studio Metrics
            </span>
            <p className="font-inter text-slate-gray text-base md:text-lg leading-relaxed mb-10 md:mb-12 max-w-xl font-light">
              Our team of passionate photographers and cinematographers
              work together to capture every emotion, smile, and detail with perfection.
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-x-12 md:gap-y-12">
              {stats.map((stat, index) => (
                <div key={index} className="border-b border-charcoal-black/10 pb-6">
                  <h3 className="font-playfair text-4xl md:text-5xl text-charcoal-black mb-2 font-bold">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </h3>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-gray leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ---------------- RIGHT COLUMN: IMAGE GRID ---------------- */}
        <div className="relative h-full">
          {/* Desktop: Uses sticky + Framer Motion 'y' transform for parallax.
            Mobile: Uses standard grid to prevent images from clipping off-screen.
          */}
          <div className="lg:sticky lg:top-24 grid grid-cols-2 gap-3 sm:gap-4 lg:h-[120vh] pb-10">
            
            {/* Column 1 */}
            <motion.div
              style={{ y: isMobile ? 0 : y1 }}
              className="space-y-3 sm:space-y-4 flex flex-col pt-0 lg:pt-12"
            >
              {col1Images.map((src, index) => (
                <motion.div
                  initial={isMobile ? { opacity: 0, y: 30 } : false}
                  whileInView={isMobile ? { opacity: 1, y: 0 } : false}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={`col1-${index}`}
                  // FIX: Replaced fixed heights with responsive Aspect Ratios
                  className={`${
                    index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-[4/5]" : "aspect-square"
                  } rounded-2xl md:rounded-[2rem] overflow-hidden shrink-0 shadow-lg border border-charcoal-black/5 bg-warm-ivory`}
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    alt="Gallery Memory"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Column 2 */}
            <motion.div 
              style={{ y: isMobile ? 0 : y2 }} 
              className="space-y-3 sm:space-y-4 flex flex-col"
            >
              {col2Images.map((src, index) => (
                <motion.div
                  initial={isMobile ? { opacity: 0, y: 30 } : false}
                  whileInView={isMobile ? { opacity: 1, y: 0 } : false}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  key={`col2-${index}`}
                  // FIX: Off-set aspect ratios to create a staggered masonry look
                  className={`${
                    index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-square" : "aspect-[3/4]"
                  } rounded-2xl md:rounded-[2rem] overflow-hidden shrink-0 shadow-lg border border-charcoal-black/5 bg-warm-ivory`}
                >
                  <img
                    src={src}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    alt="Gallery Memory"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CombinedSections;