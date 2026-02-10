import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight, Video } from "lucide-react";
import axios from "axios";

const PageVideoSection = ({ pageType, title, subtitle }) => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/page-videos/page/${pageType}`,
        );
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching page videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [pageType]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  if (isLoading || videos.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-b from-warm-ivory to-white">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gold-accent/10 text-gold-accent px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <Video size={16} />
              {title || "Video Guides"}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-playfair text-3xl md:text-4xl font-bold text-charcoal-black mb-4"
            >
              {subtitle || "Learn How It Works"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Watch our helpful video tutorials to understand our process better
            </motion.p>
          </div>

          {/* Videos Grid */}
          {videos.length === 1 ? (
            // Single video - Full width
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <VideoCard
                video={videos[0]}
                onClick={() => setSelectedVideo(videos[0])}
              />
            </motion.div>
          ) : videos.length <= 3 ? (
            // 2-3 videos - Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {videos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <VideoCard
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            // More than 3 videos - Carousel
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden">
                <motion.div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {videos.map((video) => (
                    <div key={video._id} className="w-full flex-shrink-0 px-4">
                      <VideoCard
                        video={video}
                        onClick={() => setSelectedVideo(video)}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Carousel Navigation */}
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
              >
                <ChevronLeft size={20} className="text-charcoal-black" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
              >
                <ChevronRight size={20} className="text-charcoal-black" />
              </button>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {videos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-6 bg-gold-accent"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold-accent transition-colors"
              >
                <X size={28} />
              </button>

              {/* Video Player */}
              <div className="aspect-video bg-black rounded-xl overflow-hidden">
                {selectedVideo.videoType === "youtube" ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Video Info */}
              <div className="mt-4 text-white">
                <h3 className="font-playfair text-xl font-semibold">
                  {selectedVideo.title}
                </h3>
                {selectedVideo.description && (
                  <p className="text-gray-400 mt-2">
                    {selectedVideo.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Video Card Component
const VideoCard = ({ video, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100">
        {video.videoType === "youtube" ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <video src={video.videoUrl} className="w-full h-full object-cover" />
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
            <Play
              size={24}
              className="text-gold-accent ml-1"
              fill="currentColor"
            />
          </div>
        </div>

        {/* Type Badge */}
        {video.videoType === "youtube" && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded bg-red-600 text-white text-xs font-medium">
              YouTube
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-charcoal-black group-hover:text-gold-accent transition-colors line-clamp-1">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-gray-500 text-sm mt-1 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageVideoSection;
