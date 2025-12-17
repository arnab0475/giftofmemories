import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
      }}
      className="fixed inset-0 z-[100] bg-gold-accent flex items-center justify-center flex-col"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="font-playfair text-4xl md:text-6xl font-bold text-charcoal-black tracking-tighter mb-4">
          Gift of Memories
          <span className="text-white">.</span>
        </h1>
        <div className="w-16 h-1 bg-charcoal-black mx-auto rounded-full" />
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
