import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const defaultTestimonials = [
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
  {
    id: 4,
    text: "Simply the best. Professional, creative, and a joy to work with. Our family photos are treasures we will cherish forever.",
    author: "The Thompson Family",
    role: "Family Session",
  },
];

const STAR_COUNT = 5;

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_NODE_URL}/api/testimonial/testimonials`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((t) => ({
              id: t._id,
              text: t.feedback,
              author: t.name,
              role: t.title || "",
              image: t.image,
            }));
            setTestimonials(mapped);
          }
        }
      } catch (e) {
        console.warn("Failed to load testimonials", e);
      }
    };
    fetchTestimonials();
  }, []);

  // Duplicate testimonials to ensure seamless loop
  const seamlessTestimonials = [
    ...testimonials,
    ...testimonials,
    ...testimonials,
  ];

  return (
    <section className="py-24 bg-charcoal-black text-warm-ivory relative overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-6 text-center mb-16 relative z-10">
        <div className="flex justify-center items-center gap-2 mb-4">
          <div className="flex text-gold-accent">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" className="mr-0.5" />
            ))}
          </div>
          <span className="text-xs font-inter tracking-widest text-muted-beige uppercase">
            Rated 4.9 Stars on Google
          </span>
        </div>

        <h2 className="font-playfair text-4xl md:text-5xl text-warm-ivory mb-6 leading-tight">
          Your feedback is what makes us{" "}
          <span className="italic text-gold-accent">better</span>
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden mask-linear-gradient">
        <motion.div
          className="flex gap-8 w-max"
          animate={{ x: "-33.33%" }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {seamlessTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="w-[350px] md:w-[450px] p-8 shrink-0 select-none"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6 text-gold-accent">
                {[...Array(STAR_COUNT)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              {/* Quote */}
              <p className="font-inter text-lg leading-relaxed text-gray-300 font-light italic mb-8">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div>
                <h4 className="font-playfair text-xl text-warm-ivory mb-1">
                  - {testimonial.author}
                </h4>
                {testimonial.role && (
                  <span className="font-inter text-xs tracking-wider text-gray-500 uppercase">
                    {testimonial.role}
                  </span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
