import { motion } from "framer-motion";
import { Camera, Video } from "lucide-react";

const GallerySectionDivider = () => {
  return (
    <section className="relative py-16 bg-gradient-to-b from-charcoal-black via-charcoal-black to-charcoal-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C9A24D 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-6 md:gap-12">
          {/* Photos Label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gold-accent/20 border border-gold-accent/30">
              <Camera className="w-5 h-5 text-gold-accent" />
            </div>
            <span className="font-playfair text-lg md:text-xl text-warm-ivory/60 uppercase tracking-wider">
              Photos
            </span>
          </motion.div>

          {/* Center Divider Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex flex-col items-center"
          >
            {/* Top Line */}
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gold-accent/50 to-gold-accent" />

            {/* Center Box */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
              {/* Rotating Border */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-lg border border-gold-accent/30"
                style={{
                  background: `conic-gradient(from 0deg, transparent, rgba(201, 162, 77, 0.3), transparent)`,
                }}
              />

              {/* Inner Box */}
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg bg-charcoal-black border border-gold-accent/50 flex items-center justify-center shadow-[0_0_30px_rgba(201,162,77,0.2)]">
                <span className="font-playfair text-gold-accent text-xl md:text-2xl font-bold">
                  &
                </span>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="w-px h-8 bg-gradient-to-b from-gold-accent to-gold-accent/50 via-transparent" />
          </motion.div>

          {/* Videos Label */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <span className="font-playfair text-lg md:text-xl text-warm-ivory/60 uppercase tracking-wider">
              Videos
            </span>
            <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gold-accent/20 border border-gold-accent/30">
              <Video className="w-5 h-5 text-gold-accent" />
            </div>
          </motion.div>
        </div>

        {/* Horizontal Lines */}
        <div className="flex items-center justify-center mt-8">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px w-24 md:w-48 bg-gradient-to-r from-transparent to-gold-accent/40"
          />
          <div className="w-2 h-2 rounded-full bg-gold-accent/60 mx-4" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px w-24 md:w-48 bg-gradient-to-l from-transparent to-gold-accent/40"
          />
        </div>
      </div>
    </section>
  );
};

export default GallerySectionDivider;
