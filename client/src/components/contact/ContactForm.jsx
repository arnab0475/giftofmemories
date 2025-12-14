import { motion } from "framer-motion";

const ContactForm = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white p-8 md:p-10 rounded-[14px] shadow-sm border border-muted-beige/20"
    >
      <h2 className="font-playfair text-3xl font-bold text-charcoal-black mb-8">
        Send us a Message
      </h2>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              First Name
            </label>
            <input
              type="text"
              placeholder="Jane"
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
            />
          </div>
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Doe"
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="jane@example.com"
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
            />
          </div>
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Event Type
            </label>
            <select className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black appearance-none">
              <option>Wedding Photography</option>
              <option>Event Coverage</option>
              <option>Portrait Session</option>
              <option>Commercial Shoot</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Event Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black uppercase text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-inter text-sm font-semibold text-charcoal-black block">
            Tell us about your plans
          </label>
          <textarea
            rows="4"
            placeholder="Describe your vision, venue, and any specific requirements..."
            className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
          ></textarea>
        </div>

        <button
          type="button"
          className="w-full py-4 bg-gold-accent text-charcoal-black font-inter text-sm uppercase tracking-widest font-bold rounded-[10px] shadow-md hover:bg-charcoal-black hover:text-gold-accent transition-all duration-300 transform hover:scale-[1.01]"
        >
          Send Message
        </button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
