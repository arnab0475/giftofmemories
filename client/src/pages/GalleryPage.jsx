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

import axios from "axios";

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/gallery/get-gallery`
        );
        setGalleryItems(response.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-warm-ivory min-h-screen"
    >
      {viewMode === "grid" ? (
        <ImmersiveGallery
          viewMode={viewMode}
          setViewMode={setViewMode}
          items={galleryItems}
        />
      ) : (
        <>
          <GalleryHero />

          <GalleryFilter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <MainGalleryGrid
            activeFilter={activeFilter}
            viewMode={viewMode}
            items={galleryItems}
          />
        </>
      )}

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
    </motion.div>
  );
};

export default GalleryPage;
