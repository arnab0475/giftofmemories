import { motion } from "framer-motion";
import logo from "../assets/images/logo-negative-gom.png";

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{
        y: "-100%",
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-[100] bg-[#efe6d5] flex items-center justify-center flex-col"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8 }}
        className="text-center flex flex-col items-center"
      >
        <img
          src={logo}
          alt="Gift of Memories"
          className="h-24 md:h-72 w-auto object-contain mb-8"
        />

        {/* Loading Dots */}
        <div className="flex gap-3 justify-center items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-charcoal-black rounded-full"
              animate={{
                y: ["0%", "-100%", "0%"],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
