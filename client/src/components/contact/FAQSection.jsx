import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What are your starting packages?",
    answer:
      "Our wedding packages start from ₹75,000 for single-day coverage. Portrait sessions begin at ₹15,000. Contact us for a detailed price guide tailored to your needs.",
  },
  {
    question: "Do you travel for destination weddings?",
    answer:
      "Absolutely! We love capturing love stories across the globe. Travel and accommodation costs are additional for weddings outside Hyderabad.",
  },
  {
    question: "How long does it take to receive the photos?",
    answer:
      "We deliver a sneak peek of 20-30 highlight images within 3 days. The full edited gallery is delivered within 4-6 weeks after the event.",
  },
  {
    question: "Do you provide cinematic video services?",
    answer:
      "Yes, we have a dedicated team of cinematographers who specialize in creating wedding films, teasers, and event highlights.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-muted-beige/30">
      <div className="container mx-auto px-6 text-center max-w-3xl">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal-black mb-12">
          Common Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-[10px] shadow-sm overflow-hidden text-left"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between focus:outline-none bg-white hover:bg-warm-ivory/50 transition-colors"
              >
                <span className="font-inter font-semibold text-charcoal-black text-sm md:text-base">
                  {faq.question}
                </span>
                <div className="text-gold-accent">
                  {activeIndex === index ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0 text-slate-gray text-sm md:text-base font-inter leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
