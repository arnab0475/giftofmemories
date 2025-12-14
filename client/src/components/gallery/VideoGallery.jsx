import { motion } from "framer-motion";
import { Play } from "lucide-react";

// Using filters for thumbnails temporarily to simulate video thumbnails
import galleryEvent1 from "../../assets/images/gallery-event-1.png";
import galleryWedding1 from "../../assets/images/gallery-wedding-1.png";

const videoData = [
  {
    id: 1,
    title: "The Royal Jaipur Wedding",
    thumbnail: galleryWedding1,
    duration: "4:32",
  },
  {
    id: 2,
    title: "Global Tech Summit Highlights",
    thumbnail: galleryEvent1,
    duration: "2:15",
  },
];

const VideoGallery = () => {
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
          {videoData.map((video) => (
            <motion.div
              key={video.id}
              whileHover={{ y: -10 }}
              className="group relative aspect-video bg-stone-900 rounded-xl overflow-hidden cursor-pointer shadow-lg border border-stone-800"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity duration-500"
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold-accent/90 flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(201,162,77,0.4)] group-hover:scale-110 transition-transform duration-300">
                  <Play fill="black" stroke="none" size={28} />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                <h3 className="font-playfair text-xl font-semibold mb-1">
                  {video.title}
                </h3>
                <span className="font-inter text-xs bg-black/60 px-2 py-1 rounded text-stone-300">
                  {video.duration}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Placeholder for more videos */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="group relative aspect-video bg-stone-900/50 rounded-xl overflow-hidden border border-stone-800 flex flex-col items-center justify-center text-center p-6 border-dashed"
          >
            <div className="w-12 h-12 rounded-full border border-stone-700 flex items-center justify-center mb-4 group-hover:border-gold-accent group-hover:text-gold-accent transition-colors">
              <Play size={20} />
            </div>
            <p className="font-playfair text-lg text-stone-400 group-hover:text-gold-accent transition-colors">
              View All Films on YouTube
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoGallery;
