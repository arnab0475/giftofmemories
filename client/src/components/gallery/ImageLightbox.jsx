import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

const ImageLightbox = ({
  selectedImage,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
    };

    if (selectedImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!selectedImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-charcoal-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-warm-ivory/60 hover:text-gold-accent transition-colors p-2"
        >
          <X size={32} />
        </button>

        <div
          className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {hasPrev && (
            <button
              onClick={onPrev}
              className="absolute left-4 z-10 p-3 rounded-full bg-charcoal-black/50 text-warm-ivory/60 hover:text-gold-accent hover:bg-charcoal-black transition-all"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {selectedImage.type === "video" ? (
            <motion.video
              key={selectedImage.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={selectedImage.src}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          ) : (
            <motion.img
              key={selectedImage.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={selectedImage.src}
              alt="Gallery Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          )}

          {selectedImage.caption && (
            <div className="absolute bottom-[-40px] left-0 w-full text-center">
              <p className="font-inter text-muted-beige/80 text-sm tracking-wide">
                {selectedImage.caption}
              </p>
            </div>
          )}

          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-4 z-10 p-3 rounded-full bg-charcoal-black/50 text-warm-ivory/60 hover:text-gold-accent hover:bg-charcoal-black transition-all"
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox;
