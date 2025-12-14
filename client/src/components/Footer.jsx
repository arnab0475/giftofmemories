import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal-black text-warm-ivory py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <h2 className="font-playfair text-3xl font-bold tracking-tighter">
              Lumina<span className="text-gold-accent">.</span>
            </h2>
            <p className="font-inter text-warm-ivory/60 text-sm leading-relaxed max-w-xs">
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
              <ul className="space-y-4 font-inter text-sm text-warm-ivory/60">
                <li>
                  <a
                    href="#"
                    className="hover:text-gold-accent transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#portfolio"
                    className="hover:text-gold-accent transition-colors"
                  >
                    Portfolio
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-gold-accent transition-colors"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-gold-accent transition-colors"
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
              <ul className="space-y-4 font-inter text-sm text-warm-ivory/60">
                <li>
                  <a
                    href="#"
                    className="hover:text-gold-accent transition-colors"
                  >
                    Inquiries
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gold-accent transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-gold-accent transition-colors"
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
                className="text-warm-ivory/60 hover:text-gold-accent transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-warm-ivory/60 hover:text-gold-accent transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-warm-ivory/60 hover:text-gold-accent transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-warm-ivory/60 hover:text-gold-accent transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs font-inter text-warm-ivory/40">
          <p>&copy; 2025 Lumina Photography. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
