import { useEffect } from "react";
import { motion } from "framer-motion";

// Components
import AboutHero from "../components/about/AboutHero";
import StorySection from "../components/about/StorySection";
import ValuesSection from "../components/about/ValuesSection";
import StatsStrip from "../components/about/StatsStrip";
import NewTeamSection from "../components/about/NewTeamSection";
import AboutCTA from "../components/about/AboutCTA";

const AboutPage = () => {
  // FIX 1 & 2: Handle "Scroll to Top" and Dynamic SEO Page Title
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Our Story | Gift of Memories";
  }, []);

  return (
    <motion.main
      // FIX 3: Cinematic Page-Level Routing Transitions
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-warm-ivory min-h-screen w-full overflow-hidden"
    >
      <AboutHero />
      <StorySection />
      
      {/* Optional Narrative Flow Tweak: 
        Sometimes placing StatsStrip before ValuesSection builds authority 
        immediately after reading the story, but this order works beautifully too! 
      */}
      <ValuesSection />
      <StatsStrip />
      
      <NewTeamSection />
      <AboutCTA />
    </motion.main>
  );
};

export default AboutPage;