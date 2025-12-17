import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gallery1 from "../assets/images/gallery-1.png";
import gallery2 from "../assets/images/gallery-2.png";
import gallery3 from "../assets/images/gallery-3.png";
import hero1 from "../assets/images/hero-1.png";
import hero2 from "../assets/images/hero-2.png";
import hero3 from "../assets/images/hero-3.png";

const images = [
  gallery1,
  gallery2,
  gallery3,
  hero1,
  hero2,
  hero3,
  gallery1,
  gallery2,
  gallery3,
  hero1,
  hero2,
  hero3,
];

const Row = ({ images, direction, speed = 150 }) => {
  const rowRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });

  // Direction: 1 for left-to-right (content moves right), -1 for right-to-left (content moves left)
  // Actually, to simulate scroll *towards* left, x should go negative.
  // To scroll *towards* right, x should go positive.

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"]
  );

  return (
    <div
      ref={rowRef}
      className="flex gap-8 mb-8 overflow-hidden whitespace-nowrap"
    >
      <motion.div style={{ x }} className="flex gap-8 min-w-full">
        {/* Duplicate images to ensure infinite-like scroll feel */}
        {[...images, ...images, ...images].map((src, i) => (
          <div
            key={i}
            className="relative h-[250px] w-[350px] md:h-[300px] md:w-[450px] shrink-0 rounded-xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500"
          >
            <img
              src={src}
              alt="Gallery"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const ParallaxGallery = () => {
  return (
    <section className="py-24 bg-warm-ivory overflow-hidden relative">
      <div className="container mx-auto px-6 mb-16 text-center">
        <span className="text-gold-accent font-inter text-sm uppercase tracking-widest block mb-2">
          Visual Stories
        </span>
        <h2 className="font-playfair text-4xl md:text-6xl text-charcoal-black">
          Capturing Life's Canvas
        </h2>
      </div>

      <div className="flex flex-col">
        {/* Row 1: Left */}
        <Row images={images.slice(0, 5)} direction="left" />

        {/* Row 2: Right */}
        <Row images={images.slice(5, 10)} direction="right" />

        {/* Row 3: Left */}
        <Row images={images.slice(2, 7)} direction="left" />

        <Row images={images.slice(5, 10)} direction="right" />

        <Row images={images.slice(2, 7)} direction="left" />

        <Row images={images.slice(5, 10)} direction="right" />
        
        <Row images={images.slice(2, 7)} direction="left" />
      </div>
    </section>
  );
};

export default ParallaxGallery;
