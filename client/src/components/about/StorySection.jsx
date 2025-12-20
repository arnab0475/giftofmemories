import { motion } from "framer-motion";
import storyImage from "../../assets/images/about-hero.png";
import { TextGenerateEffect } from "../Text-Generate-effect";

const StorySection = () => {
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
              src={storyImage}
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
              Crafting Memories Since 2016
            </h2>
            <div className="mb-8 relative">
              
              <TextGenerateEffect
                words="It started with a simple belief: that the most beautiful moments in life are fleeting. Our mission from day one has been to freeze time, not just visually, but emotionally, ensuring that every laugh, tear, and quiet glance is tangible heritage. Over the years, we have grown from a small studio into a collective of passionate visual storytellers. Whether it's the grandeur of a wedding or the raw intimacy of a portrait, our approach remains the same—observe with empathy, shoot with precision, and edit with love. Our work is not just about perfect lighting or composition; it's about the connection we build with you. We strive to be invisible observers, letting your story unfold naturally while ensuring no detail is missed."
                className="font-inter leading-relaxed text-lg"
                duration={0.7}
                appearingColor="#A67B5B" // Light brown/gold for appearing
                finalColor="#2C2C2C" // Dark charcoal for final
                containerClassName="p-6 rounded-xl"
              />
            </div>

            <div className="mt-10 relative">
              <span className="font-playfair text-2xl text-gold-accent italic">
                - Gift of Memories Team
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
