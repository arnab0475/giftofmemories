import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

const HomeVideoSection = ({ videos = [] }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!videos || videos.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <section className="py-20 bg-charcoal-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #C9A24D 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block text-gold-accent font-inter text-xs uppercase tracking-[0.3em] mb-4 font-bold">
                Watch Our Story
              </span>
              <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4">
                Featured Videos
              </h2>
              <p className="font-inter text-white/70 text-lg max-w-2xl mx-auto">
                Experience our work through these captivating videos
              </p>
            </motion.div>

            {/* Videos Display */}
            {videos.length === 1 ? (
              // Single video - Full width
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto"
              >
                <VideoCard
                  video={videos[0]}
                  onClick={() => setSelectedVideo(videos[0])}
                  large
                />
              </motion.div>
            ) : videos.length === 2 ? (
              // Two videos - Side by side
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <VideoCard
                      video={video}
                      onClick={() => setSelectedVideo(video)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : videos.length === 3 ? (
              // Three videos - Grid
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="relative">
                {/* Main Video */}
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-4xl mx-auto"
                >
                  <VideoCard
                    video={videos[currentIndex]}
                    onClick={() => setSelectedVideo(videos[currentIndex])}
                    large
                  />
                </motion.div>

                {/* Navigation Buttons */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gold-accent hover:text-white transition-all z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gold-accent hover:text-white transition-all z-10"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Thumbnail Strip */}
                <div className="flex justify-center gap-3 mt-6 overflow-x-auto pb-2">
                  {videos.map((video, index) => (
                    <button
                      key={video._id}
                      onClick={() => setCurrentIndex(index)}
                      className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all ${
                        index === currentIndex
                          ? "ring-2 ring-gold-accent scale-110"
                          : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      {video.type === "youtube" ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={video.url}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacityi: 0 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-gold-accent transition-colors z-10"
              >
                <X size={32} />
              </button>

              {/* Video Player */}
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                {selectedVideo.type === "youtube" ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={selectedVideo.title || "Video"}
                  />
                ) : (
                  <video
                    src={selectedVideo.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Video Info */}
              {(selectedVideo.title || selectedVideo.description) && (
                <div className="mt-4 text-white">
                  {selectedVideo.title && (
                    <h3 className="font-playfair text-xl font-semibold">
                      {selectedVideo.title}
                    </h3>
                  )}
                  {selectedVideo.description && (
                    <p className="text-gray-400 mt-2">
                      {selectedVideo.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Video Card Component
const VideoCard = ({ video, onClick, large = false }) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer group rounded-2xl overflow-hidden shadow-2xl ${
        large ? "aspect-video" : "aspect-video"
      }`}
    >
      {/* Thumbnail */}
      {video.type === "youtube" ? (
        <img
          src={video.thumbnailUrl}
          alt={video.title || "Video thumbnail"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <video
          src={video.url}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`rounded-full bg-gold-accent flex items-center justify-center shadow-lg group-hover:shadow-gold-accent/50 transition-shadow duration-300 ${
            large ? "w-20 h-20 md:w-24 md:h-24" : "w-14 h-14 md:w-16 md:h-16"
          }`}
        >
          <Play
            size={large ? 36 : 24}
            className="text-white ml-1"
            fill="currentColor"
          />
        </motion.div>
      </div>

      {/* Video Type Badge */}
      <div className="absolute top-3 left-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            video.type === "youtube"
              ? "bg-red-600 text-white"
              : "bg-gold-accent text-white"
          }`}
        >
          {video.type === "youtube" ? "YouTube" : "Video"}
        </span>
      </div>

      {/* Title Overlay */}
      {video.title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white font-semibold text-lg line-clamp-1">
            {video.title}
          </h3>
          {video.description && (
            <p className="text-white/70 text-sm line-clamp-1 mt-1">
              {video.description}
            </p>
          )}
        </div>
      )}

      {/* Border Accent */}
      <div className="absolute inset-0 border-2 border-gold-accent/30 rounded-2xl pointer-events-none group-hover:border-gold-accent/50 transition-colors" />
    </div>
  );
};

export default HomeVideoSection;
