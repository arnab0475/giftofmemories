import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { X } from "lucide-react";
import axios from "axios";

const defaultGalleryImages = [
  {
    id: 1,
    src: "/img1.jpeg",
    alt: "Shubho Bibaho Ceremony",
    category: "Wedding",
  },
  {
    id: 2,
    src: "/img2.jpeg",
    alt: "Haldi Celebration",
    category: "Pre-Wedding",
  },
  { id: 3, src: "/img3.jpeg", alt: "Sindoor Daan Moment", category: "Wedding" },
  { id: 4, src: "/img4.jpg", alt: "Saat Paak Ritual", category: "Wedding" },
  { id: 5, src: "/img5.jpg", alt: "Bridal Portraits", category: "Portrait" },
  { id: 6, src: "/img7.jpg", alt: "Reception Elegance", category: "Reception" },
];

// Spring config for smooth, natural motion
const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

// Single card component with its own scroll-driven animation
const GalleryCard = ({ image, index, totalImages, containerRef, onClick }) => {
  // Track scroll progress for this specific card
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate the scroll range for this card
  // Each card has its own segment of the total scroll
  const segmentSize = 1 / totalImages;
  const start = index * segmentSize;
  const end = start + segmentSize;

  // Raw transforms based on scroll position
  const xRaw = useTransform(
    scrollYProgress,
    [start, start + segmentSize * 0.1, end - segmentSize * 0.1, end],
    [0, 0, -100, -120], // Stay put, then smoothly slide out
  );

  const opacityRaw = useTransform(
    scrollYProgress,
    [start, end - segmentSize * 0.2, end],
    [1, 1, 0],
  );

  const scaleRaw = useTransform(
    scrollYProgress,
    [start, end - segmentSize * 0.15, end],
    [1, 1, 0.95],
  );

  // Subtle rotation for a more dynamic feel
  const rotateRaw = useTransform(
    scrollYProgress,
    [start, end],
    [0, -3], // Slight tilt as it slides out
  );

  // Apply spring physics for buttery smooth motion
  const x = useSpring(xRaw, springConfig);
  const opacity = useSpring(opacityRaw, springConfig);
  const scale = useSpring(scaleRaw, springConfig);
  const rotate = useSpring(rotateRaw, springConfig);

  // Z-index: cards at the bottom of the stack have lower z-index
  // As we scroll, earlier cards slide away revealing cards beneath
  const zIndex = totalImages - index;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full cursor-pointer group origin-center"
      style={{
        x: useTransform(x, (v) => `${v}%`),
        opacity,
        scale,
        rotate,
        zIndex,
      }}
      onClick={() => onClick(image)}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover rounded-2xl shadow-2xl"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-12 rounded-2xl">
        <p className="text-warm-ivory font-playfair text-2xl tracking-wide drop-shadow-lg">
          {image.alt}
        </p>
      </div>
    </motion.div>
  );
};

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);

  // Ref for the scroll container
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/homepage-gallery/section/stacked`,
        );
        if (response.data && response.data.length > 0) {
          setGalleryImages(
            response.data.map((img, index) => ({
              id: img._id || index + 1,
              src: img.imageUrl,
              alt: img.alt || "Gallery Image",
              category: img.category || "",
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching stacked gallery images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    // Outer container: tall enough for vertical scrolling (each image gets ~100vh of scroll)
    <section
      id="portfolio"
      ref={containerRef}
      className="relative bg-warm-ivory"
      style={{ height: `${galleryImages.length * 100}vh` }}
    >
      {/* Sticky wrapper: stays pinned while scrolling through the stack */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center py-20">
        {/* Section header */}
        <div className="text-center mb-8">
          <span className="text-gold-accent font-inter text-sm uppercase tracking-widest">
            Portfolio
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-charcoal-black mt-4">
            Featured Works
          </h2>
        </div>

        {/* Stacked gallery: 80% width, centered, images stacked on top of each other */}
        <div className="w-[80%] mx-auto relative" style={{ height: "90vh" }}>
          {galleryImages.map((image, index) => (
            <GalleryCard
              key={image.id}
              image={image}
              index={index}
              totalImages={galleryImages.length}
              containerRef={containerRef}
              onClick={setSelectedImage}
            />
          ))}
        </div>

        {/* Scroll indicator */}
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
