import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import aboutHeroBg from "../../assets/images/about-hero.png";

const AboutHero = () => {
  const [heroData, setHeroData] = useState({
    title: "The Story Behind The Lens",
    subtitle: "About Us",
    description:
      "We don't just capture images; we preserve the feelings that make life beautiful.",
    breadcrumb: "Gift of memories • About",
    backgroundImage: "",
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/page-hero/about`,
        );
        if (response.data) {
          setHeroData(response.data);
        }
      } catch (error) {
        console.error("Error fetching about hero data:", error);
      }
    };
    fetchHeroData();
  }, []);

  return (
    <motion.section
      initial="initial"
      whileHover="hover"
      className="relative h-[50vh] w-full overflow-hidden bg-charcoal-black flex items-center justify-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          variants={{
            initial: { scale: 1 },
            hover: {
              scale: 1.05,
              transition: { duration: 1.5, ease: "easeOut" },
            },
          }}
          src={heroData.backgroundImage || aboutHeroBg}
          alt="About Us Hero"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/70 via-charcoal-black/30 to-warm-ivory" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-4xl md:text-6xl text-warm-ivory mb-6 font-bold tracking-tight">
            {heroData.title}
          </h1>
          <p className="font-inter text-lg text-warm-ivory/90 font-light max-w-2xl mx-auto leading-relaxed">
            {heroData.description}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutHero;
