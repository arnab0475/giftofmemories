import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import ContactForm from "./contact/ContactForm";

const HomeCTA = () => {
  return (
    <section className="py-24 bg-warm-ivory text-charcoal-black relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <span className="text-gold-accent font-inter text-sm uppercase tracking-widest mb-4 block">
              Start Your Journey
            </span>
            <h2 className="font-playfair text-5xl md:text-6xl mb-6 leading-tight text-charcoal-black">
              Ready to frame your{" "}
              <span className="italic text-gold-accent">moments?</span>
            </h2>
            <p className="font-inter text-charcoal-black/70 text-lg mb-8 font-light max-w-xl">
              From the first consultation to the final delivery, we ensure your
              experience is as beautiful as the memories we capture. Let's
              discuss your vision.
            </p>
            <div className="flex gap-8 text-sm font-inter text-charcoal-black/60">
              <div>
                <h3 className="text-charcoal-black uppercase tracking-widest mb-1 font-bold">
                  Email
                </h3>
                <p>hello@giftofmemories.com</p>
              </div>
              <div>
                <h3 className="text-charcoal-black uppercase tracking-widest mb-1 font-bold">
                  Phone
                </h3>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </motion.div>

          {/* Right Contact Form */}
          {/* Right Contact Form */}
          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
