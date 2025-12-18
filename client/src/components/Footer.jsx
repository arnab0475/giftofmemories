import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

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
                  <a
                    href="#"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#portfolio"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-inter text-sm font-bold uppercase tracking-widest mb-6 opacity-80">
                Contact
              </h4>
              <ul className="space-y-4 font-inter text-sm text-charcoal-black/70">
                <li>
                  <a
                    href="#"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Inquiries
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-warm-ivory transition-colors"
                  >
                    FAQ
                  </a>
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
                href="#"
                className="text-charcoal-black/70 hover:text-warm-ivory transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-charcoal-black/70 hover:text-warm-ivory transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-charcoal-black/70 hover:text-warm-ivory transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
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
            <a href="#" className="hover:text-warm-ivory transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-warm-ivory transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
