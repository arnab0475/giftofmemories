import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-playfair text-2xl font-bold text-charcoal-black mb-6">
          Contact Information
        </h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-muted-beige/50 flex items-center justify-center flex-shrink-0 text-charcoal-black">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold text-charcoal-black mb-1">
                Our Studio
              </h4>
              <p className="font-inter text-charcoal-black/70 text-sm leading-relaxed">
                12/4 Park Avenue, Jubilee Hills,
                <br />
                Hyderabad, Telangana 500033
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-muted-beige/50 flex items-center justify-center flex-shrink-0 text-charcoal-black">
              <Phone size={20} />
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold text-charcoal-black mb-1">
                Phone
              </h4>
              <p className="font-inter text-charcoal-black/70 text-sm leading-relaxed">
                +91 98765 43210
                <br />
                +91 40 1234 5678
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-muted-beige/50 flex items-center justify-center flex-shrink-0 text-charcoal-black">
              <Mail size={20} />
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold text-charcoal-black mb-1">
                Email
              </h4>
              <p className="font-inter text-charcoal-black/70 text-sm leading-relaxed">
                hello@pixonova.com
                <br />
                bookings@pixonova.com
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-charcoal-black p-8 rounded-[14px] text-warm-ivory shadow-lg">
        <h3 className="font-playfair text-xl text-gold-accent font-semibold mb-6">
          Studio Hours
        </h3>
        <div className="space-y-3 font-inter text-sm">
          <div className="flex justify-between border-b border-stone-800 pb-2">
            <span className="text-stone-300">Monday - Friday</span>
            <span>10:00 AM - 7:00 PM</span>
          </div>
          <div className="flex justify-between border-b border-stone-800 pb-2">
            <span className="text-stone-300">Saturday</span>
            <span>11:00 AM - 5:00 PM</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-stone-300">Sunday</span>
            <span>By Appointment Only</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
