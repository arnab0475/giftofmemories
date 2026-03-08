import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Maximize2 } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

const MainGalleryGrid = ({ activeFilter, viewMode, items = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // FIX 1: Performance Optimization. Memoize the mapping and filtering 
  // so it doesn't re-run on every hover/re-render.
  const filteredImages = useMemo(() => {
    const mapped = items
      .filter((item) => item?.type === "image") // Strictly images for this grid
      .map((item) => ({
        id: item._id,
        src: item.url,
        category: item.tags?.[0] || "Uncategorized",
        caption: item.title || "Gallery image",
        type: item.type,
        tags: item.tags || [],
      }));

    return activeFilter === "All"
      ? mapped
      : mapped.filter(
          (img) => img.tags.includes(activeFilter) || img.category === activeFilter
        );
  }, [items, activeFilter]);

  const handleImageClick = (index) => setSelectedImageIndex(index);
  const closeLightbox = () => setSelectedImageIndex(null);
  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % filteredImages.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);

  return (
    <section className="py-12 md:py-20 bg-warm-ivory min-h-screen">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* FIX 2: Layout Animation. Added 'layout' and 'AnimatePresence' 
            to ensure cards slide into position when filtered. */}
        <motion.div
          layout
          className={
            viewMode === "masonry"
              ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                layout
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`relative group break-inside-avoid overflow-hidden rounded-2xl cursor-pointer bg-white shadow-sm hover:shadow-2xl transition-shadow duration-500 ${
                  viewMode === "grid" ? "aspect-[4/5]" : "h-auto"
                }`}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  // FIX 3: Object-cover ensures clean grids, scale-110 adds luxury feel
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Refined Luxury Hover Overlay */}
                <div className="absolute inset-0 bg-charcoal-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-[2px]">
                   <div className="flex space-x-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-gold-accent hover:text-charcoal-black transition-colors">
                        <Eye size={20} strokeWidth={1.5} />
                      </div>
                      <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-gold-accent hover:text-charcoal-black transition-colors">
                        <Maximize2 size={20} strokeWidth={1.5} />
                      </div>
                   </div>
                   {/* Optional: Show Category on Hover */}
                   <span className="mt-4 text-[10px] text-warm-ivory/80 uppercase tracking-[0.2em] font-bold opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                     {image.category}
                   </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white/30 rounded-3xl border border-dashed border-charcoal-black/10"
          >
            <p className="font-playfair italic text-2xl text-slate-gray">
              This collection is currently being curated.
            </p>
            <p className="text-sm font-inter text-slate-gray/60 mt-2">Please check back soon or try another category.</p>
          </motion.div>
        )}

        {/* Lightbox Component */}
        <ImageLightbox
          selectedImage={selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
          hasNext={filteredImages.length > 1}
          hasPrev={filteredImages.length > 1}
        />
      </div>
    </section>
  );
};

export default MainGalleryGrid;