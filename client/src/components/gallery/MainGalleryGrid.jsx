import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Maximize2, Play } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

const MainGalleryGrid = ({ activeFilter, viewMode, items = [] }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Map DB items to component format
  const mappedImages = items
    // Gallery grid should show only images
    .filter((item) => item?.type === "image")
    .map((item) => ({
      id: item._id,
      src: item.url,
      // Keep tags for filtering, but don't display them as alt/caption
      category: item.tags?.[0] || "Uncategorized",
      caption: "Gallery image",
      type: item.type,
      tags: item.tags || [],
    }));

  const filteredImages =
    activeFilter === "All"
      ? mappedImages
      : mappedImages.filter(
          (img) =>
            img.tags.includes(activeFilter) || img.category === activeFilter
        );

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + filteredImages.length) % filteredImages.length
    );
  };

  return (
    <section className="py-12 bg-warm-ivory min-h-screen">
      <div className="container mx-auto px-6">
        {/* Gallery Grid */}
        <div
          className={
            viewMode === "masonry"
              ? "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          }
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group break-inside-avoid overflow-hidden rounded-[14px] cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              {image.type === "video" ? (
                <div className="relative">
                  <video
                    src={image.src}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    onMouseOver={(e) => e.target.play()}
                    onMouseOut={(e) => e.target.pause()}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/30 p-3 rounded-full backdrop-blur-sm group-hover:opacity-0 transition-opacity">
                      <Play className="text-white" size={24} fill="white" />
                    </div>
                  </div>
                </div>
              ) : (
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                <div className="p-3 bg-warm-ivory/10 backdrop-blur-sm rounded-full text-warm-ivory border border-warm-ivory/20 hover:bg-gold-accent hover:text-charcoal-black hover:border-gold-accent transition-all">
                  <Eye size={20} />
                </div>
                <div className="p-3 bg-warm-ivory/10 backdrop-blur-sm rounded-full text-warm-ivory border border-warm-ivory/20 hover:bg-gold-accent hover:text-charcoal-black hover:border-gold-accent transition-all">
                  <Maximize2 size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20">
            <p className="font-playfair text-xl text-slate-gray">
              No images found for this category.
            </p>
          </div>
        )}

        <ImageLightbox
          selectedImage={
            selectedImageIndex !== null
              ? filteredImages[selectedImageIndex]
              : null
          }
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
          hasNext={selectedImageIndex !== null && filteredImages.length > 1}
          hasPrev={selectedImageIndex !== null && filteredImages.length > 1}
        />
      </div>
    </section>
  );
};

export default MainGalleryGrid;
