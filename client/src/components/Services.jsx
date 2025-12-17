import { motion } from "framer-motion";

const services = [
  {
    title: "Weddings",
    description:
      "Capturing the magic of your special day with cinematic storytelling.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Portraits",
    description: "Professional portraits that reveal your unique personality.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Fashion",
    description: "High-end editorial shoots for brands and models.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Maternity",
    description: "Celebrating the journey of motherhood with elegance.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Pre-Wedding",
    description: "Romantic and fun couple shoots before the big day.",
    image:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Events",
    description: "Documenting corporate and private events with precision.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-warm-ivory">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-gold-accent font-inter text-sm uppercase tracking-widest">
            What We Do
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-charcoal-black mt-4">
            Our Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[400px] overflow-hidden cursor-pointer rounded-lg shadow-lg"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black/90 via-charcoal-black/20 to-transparent opacity-80 transition-opacity duration-300" />

              <div className="absolute inset-0 flex flex-col justify-end p-8 text-warm-ivory">
                <h3 className="font-playfair text-2xl mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {service.title}
                </h3>
                <p className="font-inter text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-gray-200">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="/services"
            className="px-8 py-3 border border-charcoal-black text-charcoal-black font-inter uppercase tracking-widest text-sm hover:bg-charcoal-black hover:text-white transition-all duration-300"
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
