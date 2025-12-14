import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import gallery1 from "../assets/images/gallery-1.png";
import gallery2 from "../assets/images/gallery-2.png";
import gallery3 from "../assets/images/gallery-3.png";
// Re-using hero images for more content
import hero1 from "../assets/images/hero-1.png";
import hero2 from "../assets/images/hero-2.png";
import hero3 from "../assets/images/hero-3.png";

const galleryImages = [
  { id: 1, src: gallery1, alt: "Avant-Garde Portrait", category: "Fashion" },
  { id: 2, src: gallery2, alt: "Wedding Details", category: "Wedding" },
  { id: 3, src: gallery3, alt: "Moody Landscape", category: "Fine Art" },
  { id: 4, src: hero1, alt: "Editorial Fashion", category: "Fashion" },
  { id: 5, src: hero2, alt: "Sunset Wedding", category: "Wedding" },
  { id: 6, src: hero3, alt: "Black and White Portrait", category: "Portrait" },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="portfolio" className="py-24 bg-warm-ivory">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-gold-accent font-inter text-sm uppercase tracking-widest">
            Portfolio
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-charcoal-black mt-4">
            Featured Works
          </h2>
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-warm-ivory font-playfair text-xl tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  View
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-warm-ivory hover:text-gold-accent transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-0 w-full text-center text-warm-ivory/80 font-inter text-sm tracking-widest uppercase">
              {selectedImage.alt}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
