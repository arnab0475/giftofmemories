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
  { id: 1, src: "/img1.jpeg", alt: "Shubho Bibaho Ceremony", category: "Wedding" },
  { id: 2, src: "/img2.jpeg", alt: "Haldi Celebration", category: "Pre-Wedding" },
  { id: 3, src: "/img3.jpeg", alt: "Sindoor Daan Moment", category: "Wedding" },
  { id: 4, src: "/img4.jpg", alt: "Saat Paak Ritual", category: "Wedding" },
  { id: 5, src: "/img5.jpg", alt: "Bridal Portraits", category: "Portrait" },
  { id: 6, src: "/img7.jpg", alt: "Reception Elegance", category: "Reception" },
];

const springConfig = { stiffness: 80, damping: 25, restDelta: 0.001 };

const GalleryCard = ({ image, index, totalImages, containerRef, onClick }) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const step = 1 / (totalImages - 1 || 1);
  const start = (index - 1) * step; 
  const end = index * step;         

  const yRaw = useTransform(
    scrollYProgress,
    [start, end],
    [index === 0 ? "0%" : "100%", "0%"]
  );

  const nextStart = end;
  const nextEnd = end + step;
  const scaleRaw = useTransform(scrollYProgress, [nextStart, nextEnd], [1, 0.9]);
  const opacityRaw = useTransform(scrollYProgress, [nextStart, nextEnd], [1, 0.4]);

  const y = useSpring(yRaw, springConfig);
  const scale = useSpring(scaleRaw, springConfig);
  const opacity = useSpring(opacityRaw, springConfig);

  const zIndex = index;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full cursor-pointer group origin-top shadow-[0_-15px_40px_rgba(0,0,0,0.15)] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-charcoal-black border border-white/10"
      style={{ y, scale, opacity, zIndex }}
      onClick={() => onClick(image)}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-105"
      />
      
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/60 to-transparent pt-32 pb-8 px-5 md:pb-12 md:px-8 flex flex-col items-center justify-end text-center pointer-events-none">
        <span className="text-gold-accent text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold block mb-1.5 md:mb-2 drop-shadow-md">
          {image.category || "Featured"}
        </span>
        <p className="text-warm-ivory font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide drop-shadow-lg leading-tight">
          {image.alt}
        </p>
      </div>
    </motion.div>
  );
};

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/homepage-gallery/section/stacked`
        );
        if (response.data && response.data.length > 0) {
          setGalleryImages(
            response.data.map((img, index) => ({
              id: img._id || index + 1,
              src: img.imageUrl,
              alt: img.alt || "Gallery Image",
              category: img.category || "",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching stacked gallery images:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <section
      id="portfolio"
      ref={containerRef}
      className="relative bg-warm-ivory"
      // FIX 1: Reduced height for mobile (40vh) vs desktop (65vh) to remove empty white space faster
      style={{ height: `${galleryImages.length * (window.innerWidth < 768 ? 40 : 65)}vh` }}
    >
      {/* FIX 2: Tightened vertical padding (py-4 md:py-16) to hug the content */}
      <div className="sticky top-20 md:top-28 w-full flex flex-col items-center py-4 md:py-16 z-10">
        
        <div className="text-center mb-6 md:mb-8 px-4 w-full shrink-0">
          <span className="text-gold-accent font-inter text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold block mb-1">
            Portfolio
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl lg:text-6xl text-charcoal-black font-bold leading-tight">
            Featured Works
          </h2>
        </div>

        {/* Card Container - No extra overflow hidden to allow shadows to show */}
        <div className="w-[92%] sm:w-[85%] max-w-5xl mx-auto relative aspect-[3/2] sm:aspect-video md:aspect-[16/9] rounded-[1.5rem] md:rounded-[2.5rem]">
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

      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal-black/95 flex items-center justify-center p-4 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-warm-ivory hover:bg-gold-accent hover:text-charcoal-black transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[85vh] object-contain shadow-2xl relative z-[105] rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-8 left-0 w-full text-center text-warm-ivory font-inter text-xs md:text-sm font-bold tracking-widest uppercase z-[110]">
              {selectedImage.alt}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;