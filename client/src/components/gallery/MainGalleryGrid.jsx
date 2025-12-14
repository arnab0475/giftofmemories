import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Maximize2 } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

import gallery1 from "../../assets/images/gallery-1.png";
import gallery2 from "../../assets/images/gallery-2.png";
import gallery3 from "../../assets/images/gallery-3.png";
import hero1 from "../../assets/images/hero-1.png";
import hero2 from "../../assets/images/hero-2.png";
import galleryHero from "../../assets/images/gallery-hero.png";

const initialImages = [
  { id: 1, src: gallery1, category: "Weddings", caption: "Sunset Vows" },
  {
    id: 2,
    src: gallery2,
    category: "Portraits",
    caption: "Golden Hour Portrait",
  },
  { id: 3, src: gallery3, category: "Events", caption: "Gala Night" },
  { id: 4, src: hero1, category: "Commercial", caption: "Luxury Product" },
  { id: 5, src: hero2, category: "Weddings", caption: "The First Dance" },
  { id: 6, src: galleryHero, category: "Portraits", caption: "Studio Session" },
  // Duplicating for masonry effect demo until more images generated
  { id: 7, src: gallery2, category: "Weddings", caption: "Candid Laughter" },
  { id: 8, src: gallery1, category: "Events", caption: "Corporate Summit" },
];

const MainGalleryGrid = ({ activeFilter, viewMode }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const filteredImages =
    activeFilter === "All"
      ? initialImages
      : initialImages.filter((img) => img.category === activeFilter);

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
              <img
                src={image.src}
                alt={image.caption}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />

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
