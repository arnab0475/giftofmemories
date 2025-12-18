import { motion } from "framer-motion";
import AboutHero from "../components/about/AboutHero";
import StorySection from "../components/about/StorySection";
import ValuesSection from "../components/about/ValuesSection";
import StatsStrip from "../components/about/StatsStrip";
import NewTeamSection from "../components/about/NewTeamSection";
import AboutCTA from "../components/about/AboutCTA";

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-warm-ivory min-h-screen"
    >
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <StatsStrip />
      <NewTeamSection />
      <AboutCTA />
    </motion.div>
  );
};

export default AboutPage;
