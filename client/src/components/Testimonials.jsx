import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    text: "Absolutely stunning photos. The way they captured the light and emotion of our wedding day was magical. We couldn't be happier.",
    author: "Sarah & James",
    role: "Wedding Clients",
  },
  {
    id: 2,
    text: "A true artist. The portrait session was professional, relaxed, and the results are some of the best photos I've ever seen of myself.",
    author: "Michael Chen",
    role: "Portrait Client",
  },
  {
    id: 3,
    text: "Gift of Memories's work elevated our brand campaign to a whole new level. The attention to detail and creative direction were impeccable.",
    author: "Elena Rossi",
    role: "Fashion Director",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-charcoal-black text-warm-ivory relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <Quote size={48} className="mx-auto mb-8 text-gold-accent opacity-80" />

        <div className="h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <h3 className="font-playfair text-2xl md:text-4xl leading-relaxed mb-8 italic">
                "{testimonials[currentIndex].text}"
              </h3>
              <div className="font-inter">
                <p className="text-gold-accent font-bold uppercase tracking-widest text-sm mb-2">
                  {testimonials[currentIndex].author}
                </p>
                <p className="text-warm-ivory/60 text-xs tracking-wider">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gold-accent w-6"
                  : "bg-warm-ivory/30 hover:bg-warm-ivory/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
