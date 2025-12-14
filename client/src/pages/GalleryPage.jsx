import { useState } from "react";
import { motion } from "framer-motion";
import GalleryHero from "../components/gallery/GalleryHero";
import GalleryFilter from "../components/gallery/GalleryFilter";
import MainGalleryGrid from "../components/gallery/MainGalleryGrid";
import VideoGallery from "../components/gallery/VideoGallery";
import ExplorationTags from "../components/gallery/ExplorationTags";
import GalleryCTA from "../components/gallery/GalleryCTA";

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState("masonry");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-warm-ivory min-h-screen pt-20"
    >
      <GalleryHero />
      <GalleryFilter
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <MainGalleryGrid activeFilter={activeFilter} viewMode={viewMode} />
      <VideoGallery />
      <main className="container mx-auto px-6 py-4">
        <ExplorationTags />
      </main>
      <GalleryCTA />
    </motion.div>
  );
};

export default GalleryPage;
