import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { TextGenerateEffect } from "../Text-Generate-effect";
import Loader from "../Loader";

const StorySection = () => {
  const [storyData, setStoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/about/get-about`
        );
        setStoryData(response.data);
      } catch (error) {
        console.error("Error fetching story data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoryData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-warm-ivory">
        <div className="container mx-auto px-6 flex justify-center">
          <Loader color="#C9A24D" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-warm-ivory">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 aspect-[4/5] bg-muted-beige rounded-2xl shadow-xl overflow-hidden relative"
          >
            <img
              src={storyData?.storyImage || "/about-us.jpg"}
              alt="Our Story"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-warm-ivory via-gold-accent/20 to-muted-beige/100 backdrop-blur-sm rounded-xl shadow-sm" />
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal-black mb-6 relative">
                {storyData?.storyTitle || "Crafting Memories Since 2016"}
              </h2>
              <div className="mb-8 relative">
                <TextGenerateEffect
                  words={storyData?.storyContent || "Default story content..."}
                  className="font-inter leading-relaxed text-lg"
                  duration={0.7}
                  appearingColor="#A67B5B" // Light brown/gold for appearing
                  finalColor="#2C2C2C" // Dark charcoal for final
                  containerClassName="p-6 rounded-xl"
                />
              </div>

              <div className="mt-10 relative">
                <span className="font-playfair text-2xl text-gold-accent italic">
                  {storyData?.storySignature || "- Gift of Memories Team"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
