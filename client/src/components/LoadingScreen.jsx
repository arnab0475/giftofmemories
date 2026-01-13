import { useEffect, useState } from "react";
import {
  motion,
  useAnimate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import logo from "../assets/images/logo-negative-gom.png";

const LoadingScreen = () => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [scope, animate] = useAnimate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate the counter from 0 to 100
    const controls = animate(count, 100, { duration: 2.2, ease: "easeInOut" });
    return () => controls.stop();
  }, []);

  // Panel Variants for the Split Effect
  const panelVariants = {
    initial: { scaleX: 1 },
    exit: (direction) => ({
      scaleX: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1], // Cinematic "circIn" feel
        delay: 0.2, // Wait for content to fade slightly
      },
    }),
  };

  // Content Variants
  const contentVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" },
    },
  };

  const logoVariants = {
    initial: { filter: "blur(10px)", scale: 0.9, opacity: 0 },
    animate: {
      filter: "blur(0px)",
      scale: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={scope}
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
      // The root container handles the presence, but visual background is children
    >
      {/* LEFT PANEL */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1/2 bg-warm-ivory origin-left"
        initial="initial"
        exit="exit"
        custom="left"
        variants={{
          initial: { x: "0%" },
          exit: {
            x: "-100%",
            transition: {
              duration: 1.4,
              ease: [0.77, 0, 0.175, 1],
              delay: 0.1,
            },
          },
        }}
      >
        {/* Seam concealer div to prevent subpixel gap */}
        <div className="absolute right-[-1px] top-0 bottom-0 w-[2px] bg-warm-ivory" />
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-1/2 bg-warm-ivory origin-right"
        initial="initial"
        exit="exit"
        custom="right"
        variants={{
          initial: { x: "0%" },
          exit: {
            x: "100%",
            transition: {
              duration: 1.4,
              ease: [0.77, 0, 0.175, 1],
              delay: 0.1,
            },
          },
        }}
      />

      {/* CENTER CONTENT */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Logo */}
        <motion.div variants={logoVariants}>
          <img
            src={logo}
            alt="Gift of Memories"
            className="h-16 md:h-72 w-auto object-contain"
          />
        </motion.div>

        {/* Counter & Micro-copy */}
        <div className="flex flex-col items-center gap-2">
          <motion.div className="flex items-start">
            <span className="font-playfair text-3xl md:text-4xl text-charcoal-black font-light tracking-tight">
              <motion.span>{rounded}</motion.span>
            </span>
            <span className="font-playfair text-lg text-gold-accent ml-1 mt-1">
              %
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-inter uppercase tracking-[0.2em] text-slate-gray"
          >
            Curating Experience
          </motion.p>
        </div>
      </motion.div>

      {/* Ambient Noise Overlay (Stays on top until split starts) */}
      <motion.div
        className="absolute inset-0 bg-noise mix-blend-multiply opacity-[0.03] pointer-events-none"
        exit={{ opacity: 0 }}
      />
    </motion.div>
  );
};

export default LoadingScreen;
