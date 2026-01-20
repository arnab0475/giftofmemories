import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      <div className="py-20 bg-charcoal-black text-warm-ivory">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <Loader color="#C9A24D" />
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-charcoal-black text-warm-ivory">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
            Featured Films
          </h2>
          <p className="font-inter text-stone-400">
            Cinematic highlights that bring stories to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <motion.div
              key={video._id}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedVideo(video)}
              className="group relative aspect-video bg-stone-900 rounded-xl overflow-hidden cursor-pointer shadow-lg border border-stone-800"
            >
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title || "YouTube video"}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500"
                onError={(e) => {
                  e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                }}
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold-accent/90 flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(201,162,77,0.4)] group-hover:scale-110 transition-transform duration-300">
                  <Play fill="black" stroke="none" size={28} />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                <h3 className="font-playfair text-xl font-semibold mb-1">
                  {video.title || "Wedding Film"}
                </h3>
                {video.tags?.length > 0 && (
                  <span className="font-inter text-xs bg-black/60 px-2 py-1 rounded text-stone-300">
                    {video.tags[0]}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gold-accent transition-colors"
            >
              <X size={32} />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
              title={selectedVideo.title || "YouTube video"}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default VideoGallery;
