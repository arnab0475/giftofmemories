import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GalleryHero from "../components/gallery/GalleryHero";
import GalleryFilter from "../components/gallery/GalleryFilter";
import MainGalleryGrid from "../components/gallery/MainGalleryGrid";
import VideoGallery from "../components/gallery/VideoGallery";
import FeaturedServices from "../components/services/FeaturedServices";
import ExplorationTags from "../components/gallery/ExplorationTags";
import GalleryCTA from "../components/gallery/GalleryCTA";
import ImmersiveGallery from "../components/gallery/ImmersiveGallery";

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState("masonry");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode]);

   if (viewMode === "grid") {
    return (
      <ImmersiveGallery
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-warm-ivory min-h-screen"
    >
      {viewMode === "masonry" && (
        <>
          <GalleryHero />

          <GalleryFilter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          <MainGalleryGrid activeFilter={activeFilter} viewMode={viewMode} />
          <div className="relative z-10 bg-warm-ivory">
            <VideoGallery />
            <FeaturedServices />
            <main className="container mx-auto px-6 py-12">
              <h3 className="font-playfair text-3xl text-center mb-8 text-charcoal-black">
                Explore More Moments
              </h3>
              <ExplorationTags />
            </main>
            <GalleryCTA />
          </div>
        </>
      )}

      {/* {viewMode === "grid" && (
        <ImmersiveGallery viewMode={viewMode} setViewMode={setViewMode} />
      )} */}
    </motion.div>
  );
};

export default GalleryPage;
