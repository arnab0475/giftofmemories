import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { Play, X } from "lucide-react";
import axios from "axios";
import Loader from "../Loader";

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/gallery/get-youtube-videos`
        );
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 bg-charcoal-black flex justify-center items-center">
        <Loader color="#C9A24D" />
      </div>
    );
  }

  if (videos.length === 0) return null;

  return (
    <section className="py-20 bg-charcoal-black text-warm-ivory">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4">
            Featured Films
          </h2>
          <p className="font-inter text-stone-400 max-w-xl">
            Cinematic highlights that bring stories to life. Each film is a 
            unique narrative of emotion and motion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedVideo(video)}
              className="group relative aspect-video bg-stone-900 rounded-2xl overflow-hidden cursor-pointer shadow-2xl border border-white/5"
            >
              {/* Thumbnail with smooth hover zoom */}
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title || "YouTube video"}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 ease-out"
                onError={(e) => {
                  e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                }}
              />

              {/* Play Button Overlay - Refined with glassmorphism */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold-accent text-charcoal-black flex items-center justify-center pl-1 shadow-xl group-hover:scale-110 group-hover:shadow-gold-accent/40 transition-all duration-500">
                  <Play fill="currentColor" stroke="none" size={28} />
                </div>
              </div>

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/40 to-transparent">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  {video.title || "Untitled Film"}
                </h3>
                {video.tags?.length > 0 && (
                  <span className="font-inter text-[10px] uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-gold-accent border border-white/10 font-bold">
                    {video.tags[0]}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal - Wrapped in AnimatePresence for exit animations */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Larger and more accessible */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-14 right-0 md:-right-12 text-white/60 hover:text-gold-accent transition-colors p-2"
                aria-label="Close video"
              >
                <X size={32} strokeWidth={1.5} />
              </button>

              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={selectedVideo.title}
                className="w-full h-full rounded-2xl shadow-2xl border border-white/10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoGallery;