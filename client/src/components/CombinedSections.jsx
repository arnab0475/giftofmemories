import { useEffect, useState, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Check } from "lucide-react";

// Mix of nowimg, img, and preimg for variety
const nowimg1 = "/nowimg1.jpg";
const nowimg2 = "/nowimg2.jpg";
const nowimg3 = "/nowimg3.jpg";
const img1 = "/img1.jpeg";
const img2 = "/img2.jpeg";
const img4 = "/img4.jpg";
const preimg1 = "/preimg1.jpeg";
const preimg2 = "/preimg2.jpeg";
const preimg5 = "/preimg5.jpeg";

const skills = [
  { name: "Photography", level: 92 },
  { name: "Cinematography", level: 78 },
  { name: "Film Making", level: 86 },
];

const features = [
  "Printed Photograph provided",
  "Printed Photograph provided",
  "High Resolution Camera",
  "High Resolution Camera",
  "Experienced Photographer",
  "Experienced Photographer",
];

const stats = [
  { value: 100, suffix: "%", label: "Customer Satisfaction" },
  { value: 350, suffix: "+", label: "Sessions Completed" },
  { value: 50, suffix: "%", label: "Experienced Photographers" },
  { value: 250, suffix: "+", label: "Events Covered" },
];

const ProgressBar = ({ name, level }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

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
    <div ref={ref} className="mb-8">
      <div className="flex justify-between items-end mb-2 font-inter">
        <span className="text-lg font-bold">{name}</span>

        <div className="flex items-baseline gap-0.5">
          <motion.span className="text-sm font-bold opacity-80">
            {percentage}
          </motion.span>
          <span className="text-sm font-bold opacity-80">%</span>
        </div>
      </div>

      <div className="h-[2px] w-full bg-charcoal-black/10 rounded-full overflow-hidden">
        <motion.div
          style={{ width }}
          className="h-full bg-gradient-to-r from-warm-ivory/30 to-gold-accent"
        />
      </div>
    </div>
  );
};

const AnimatedNumber = ({ value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const number = useMotionValue(0);
  const display = useTransform(number, (v) => Math.floor(v));

  useEffect(() => {
    if (isInView) {
      number.set(0);

      animate(number, value * 1.25, {
        duration: 1,
        ease: "easeIn",
      }).then(() => {
        // Snap back to final value
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-warm-ivory text-charcoal-black relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-warm-ivory z-0 hidden lg:block border-l border-gold-accent/10" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gold-accent/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        {/* LEFT COLUMN: Content Stack */}
        <div className="flex flex-col gap-32">
          {/* 1. About Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 rounded-full bg-gold-accent/40 border border-white/10 mb-8 backdrop-blur-sm">
              <span className="text-charcoal-black text-xs font-inter uppercase tracking-widest">
                About Gift of Memories Studio
              </span>
            </div>
            <h2 className="font-playfair text-5xl md:text-6xl font-bold leading-tight mb-8">
              Leading Wedding <br /> Photography in Kolkata
            </h2>
            <p className="font-inter text-charcoal-black/70 text-lg leading-relaxed mb-12 max-w-xl">
              Gift of Memories specializes in candid and cinematic wedding
              photography in Kolkata, capturing timeless moments with creativity
              and elegance for couples across West Bengal.
            </p>
            <div className="max-w-lg">
              {skills.map((skill, index) => (
                <ProgressBar
                  key={index}
                  name={skill.name}
                  level={skill.level}
                />
              ))}
            </div>
          </motion.div>

          {/* 2. Why Choose Us Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-charcoal-black font-inter text-sm font-bold uppercase tracking-widest block mb-6 px-4 border-l-2 border-charcoal-black">
              Why Choose Us
            </span>
            <p className="font-inter text-charcoal-black/60 text-lg leading-relaxed mb-12 max-w-xl">
              Gift of Memories delivers candid and cinematic wedding photography
              in Patna with creativity, professionalism, and a personalized
              touch to make your memories timeless.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gold-accent/20 flex items-center justify-center flex-shrink-0 text-gold-accent">
                    <Check size={14} strokeWidth={4} />
                  </div>
                  <span className="font-inter font-bold text-sm tracking-wide text-charcoal-black">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3. Team Stats Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-charcoal-black font-inter text-sm font-bold uppercase tracking-widest block mb-6 px-4 border-l-2 border-charcoal-black">
              Gift of Memories Team
            </span>
            <p className="font-inter text-charcoal-black/60 text-lg leading-relaxed mb-16 max-w-xl">
              At Gift of Memories, our team of passionate wedding photographers
              and cinematographers in Patna work together to capture every
              emotion, smile, and detail with creativity and perfection.
            </p>
            <div className="grid grid-cols-2 gap-x-12 gap-y-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="border-b border-charcoal-black/10 pb-8"
                >
                  <h3 className="font-playfair text-5xl text-charcoal-black mb-2">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-charcoal-black/70 mb-4">
                    {stat.label}
                  </p>
                  <div className="w-8 h-1 bg-gold-accent rounded-full" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Continuous Image Flow */}
        <div className="hidden lg:block relative h-full">
          <div className="sticky top-24 grid grid-cols-2 gap-4 h-screen">
            {/* Column 1 of Images */}
            <motion.div
              style={{ y: y1 }}
              className="space-y-4 flex flex-col pt-12"
            >
              <div className="h-64 rounded-3xl overflow-hidden shrink-0">
                <img
                  src={nowimg1}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
              <div className="h-80 rounded-3xl overflow-hidden shrink-0">
                <img
                  src={img1}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
              <div className="h-64 rounded-3xl overflow-hidden shrink-0">
                <img
                  src={preimg1}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
              <div className="h-96 rounded-3xl overflow-hidden shrink-0">
                <img
                  src={nowimg2}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
              <div className="h-64 rounded-3xl overflow-hidden">
                <img
                  src={img4}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
            </motion.div>

            {/* Column 2 of Images */}
            <motion.div style={{ y: y2 }} className="space-y-4 flex flex-col">
              <div className="h-96 rounded-3xl overflow-hidden shrink-0">
                <img
                  src={preimg2}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
              <div className="h-64 rounded-3xl overflow-hidden shrink-0">
                <img
                  src={nowimg3}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
              <div className="h-80 rounded-3xl overflow-hidden shrink-0">
                <img
                  src={img2}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
              <div className="h-64 rounded-3xl overflow-hidden shrink-0">
                <img
                  src={preimg5}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
              <div className="h-80 rounded-3xl overflow-hidden shrink-1">
                <img
                  src={img1}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  alt="Gallery"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CombinedSections;
