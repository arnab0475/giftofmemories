import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-warm-ivory/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
      style={
        isHome && !isScrolled
          ? { textShadow: "0 1px 8px rgba(0,0,0,0.25)" }
          : {}
      }
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={`font-playfair text-2xl md:text-3xl font-bold tracking-tighter transition-colors duration-300 ${
            isHome && !isScrolled ? "text-warm-ivory" : "text-charcoal-black"
          }`}
        >
          Gift of Memories<span className="text-gold-accent">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-inter text-sm uppercase tracking-widest transition-colors duration-300 ${
                location.pathname === link.path
                  ? "text-gold-accent"
                  : isHome && !isScrolled
                  ? "text-warm-ivory/90 hover:text-gold-accent"
                  : "text-charcoal-black/80 hover:text-gold-accent"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            className={`px-6 py-2.5 font-inter text-sm uppercase tracking-widest transition-colors duration-300 ${
              isHome && !isScrolled
                ? "bg-gold-accent text-charcoal-black hover:bg-warm-ivory hover:text-gold-accent border border-warm-ivory"
                : "bg-charcoal-black text-warm-ivory hover:bg-gold-accent hover:text-charcoal-black"
            }`}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-charcoal-black focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-warm-ivory flex flex-col items-center justify-center space-y-8 overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-playfair text-3xl text-charcoal-black hover:text-gold-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-4 px-8 py-3 bg-charcoal-black text-warm-ivory font-inter text-lg uppercase tracking-widest"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
