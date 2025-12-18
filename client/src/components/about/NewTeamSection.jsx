"use client";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

import team1 from "../../assets/images/team-member-1.png";
import team2 from "../../assets/images/team-member-2.png";
import team3 from "../../assets/images/team-member-3.png";

// Team data matching the old TeamSection
const teamMembers = [
  {
    name: "Aditya Roy",
    designation: "Lead Photographer",
    quote:
      "Every frame tells a story. My passion is finding the beauty in fleeting moments and preserving them forever through my lens.",
    src: team1,
  },
  {
    name: "Sarah Jen",
    designation: "Creative Director",
    quote:
      "I believe in the power of visual storytelling. My role is to bring creative visions to life and ensure every project exceeds expectations.",
    src: team3,
  },
  {
    name: "Rohan Mehta",
    designation: "Senior Videographer",
    quote:
      "Motion brings memories to life. I specialize in capturing the emotion and energy of your special moments in cinematic detail.",
    src: team2,
  },
];

export const AnimatedTestimonials = ({
  testimonials = teamMembers,
  autoplay = false,
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <section className="bg-warm-ivory py-24">
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal-black mb-3">
          Meet The Creators
        </h2>
        <p className="font-inter text-slate-gray">
          The passionate visual storytellers behind the lens.
        </p>
      </div>

      <div className="mx-auto max-w-sm px-4 pb-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
        <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
          <div>
            <div className="relative h-80 w-full md:h-96">
              <AnimatePresence>
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.src}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : randomRotateY(),
                      zIndex: isActive(index)
                        ? 40
                        : testimonials.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: randomRotateY(),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center shadow-xl"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex flex-col justify-between py-4">
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <h3 className="text-2xl font-playfair font-bold text-charcoal-black">
                {testimonials[active].name}
              </h3>
              <p className="text-sm font-inter text-gold-accent uppercase tracking-widest mt-1">
                {testimonials[active].designation}
              </p>
              <motion.p className="mt-8 text-lg font-inter text-slate-gray leading-relaxed">
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>
            <div className="flex gap-4 pt-12 md:pt-0">
              <button
                onClick={handlePrev}
                className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-muted-beige/50 hover:bg-gold-accent transition-colors duration-300"
              >
                <IconArrowLeft className="h-5 w-5 text-charcoal-black transition-transform duration-300 group-hover/button:rotate-12" />
              </button>
              <button
                onClick={handleNext}
                className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-muted-beige/50 hover:bg-gold-accent transition-colors duration-300"
              >
                <IconArrowRight className="h-5 w-5 text-charcoal-black transition-transform duration-300 group-hover/button:-rotate-12" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Default export for easy import in AboutPage
const NewTeamSection = () => {
  return <AnimatedTestimonials testimonials={teamMembers} autoplay={true} />;
};

export default NewTeamSection;
