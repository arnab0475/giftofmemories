import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gold-accent text-charcoal-black py-16 border-t border-charcoal-black/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="font-playfair text-3xl font-bold tracking-tighter">
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
              <h4 className="font-inter text-sm font-bold uppercase tracking-widest mb-6 opacity-80">
                Explore
              </h4>
              <ul className="space-y-4 font-inter text-sm text-charcoal-black/70">
                <li>
                  <Link
                    to="/"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-inter text-sm font-bold uppercase tracking-widest mb-6 opacity-80">
                Contact
              </h4>
              <ul className="space-y-4 font-inter text-sm text-charcoal-black/70">
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Inquiries
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-inter text-sm font-bold uppercase tracking-widest mb-6 opacity-80">
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

        <div className="pt-8 border-t border-charcoal-black/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs font-inter text-charcoal-black/60">
          <p>&copy; 2025 Gift of Memories Photography. All rights reserved.</p>
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
