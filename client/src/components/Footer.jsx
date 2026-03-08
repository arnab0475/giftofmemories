import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // CRITICAL FIX: Changed py-16 to pt-16 pb-32 md:py-16. 
    // The pb-32 on mobile gives the floating dock space to sit without covering the links!
    <footer className="bg-gold-accent text-charcoal-black pt-16 pb-32 md:py-16 border-t border-charcoal-black/10 relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Adjusted gap-12 to gap-10 on mobile for better flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-12 md:mb-16">
          
          {/* Brand */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold tracking-tighter">
              Gift of Memories<span className="text-charcoal-black">.</span>
            </h2>
            <p className="font-inter text-charcoal-black/70 text-sm leading-relaxed max-w-xs">
              Professional photography studio capturing life's most beautiful
              moments with elegance and style.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-inter text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 opacity-80">
                Explore
              </h4>
              <ul className="space-y-3 md:space-y-4 font-inter text-sm text-charcoal-black/70">
                <li>
                  <Link to="/" className="hover:text-warm-ivory transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="hover:text-warm-ivory transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-warm-ivory transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-warm-ivory transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-inter text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 opacity-80">
                Contact
              </h4>
              <ul className="space-y-3 md:space-y-4 font-inter text-sm text-charcoal-black/70">
                <li>
                  <Link to="/contact" className="hover:text-warm-ivory transition-colors">
                    Inquiries
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-warm-ivory transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-warm-ivory transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-inter text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 opacity-80">
              Follow Us
            </h4>
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com/gift.of.memories_/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal-black/70 hover:text-warm-ivory transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal-black/70 hover:text-warm-ivory transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal-black/70 hover:text-warm-ivory transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:info@giftofmemories.com"
                className="text-charcoal-black/70 hover:text-warm-ivory transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal Section */}
        <div className="pt-6 md:pt-8 border-t border-charcoal-black/10 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0 text-xs font-inter text-charcoal-black/60">
          <p>&copy; {new Date().getFullYear()} Gift of Memories Photography. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="hover:text-warm-ivory transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-warm-ivory transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;