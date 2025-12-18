import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search - you can navigate to a search results page or filter content
      console.log("Searching for:", searchQuery);
      // Example: navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
        {/* Logo and Search Bar */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            to="/"
            className={`font-playfair text-2xl md:text-3xl font-bold tracking-tighter transition-colors duration-300 ${
              isHome && !isScrolled ? "text-warm-ivory" : "text-charcoal-black"
            }`}
          >
            Gift of Memories<span className="text-gold-accent">.</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className={`hidden md:flex items-center rounded-full overflow-hidden transition-all duration-300 ${
              isHome && !isScrolled
                ? "bg-warm-ivory/20 border border-warm-ivory/40 focus-within:bg-warm-ivory/30 focus-within:border-warm-ivory/60"
                : "bg-charcoal-black/5 border border-charcoal-black/10 focus-within:bg-charcoal-black/10 focus-within:border-gold-accent/50"
            }`}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-32 lg:w-44 px-4 py-2 bg-transparent text-sm font-inter outline-none placeholder:opacity-60 transition-all duration-300 focus:w-48 lg:focus:w-56 ${
                isHome && !isScrolled
                  ? "text-warm-ivory placeholder:text-warm-ivory/60"
                  : "text-charcoal-black placeholder:text-charcoal-black/50"
              }`}
              style={isHome && !isScrolled ? { textShadow: "none" } : {}}
            />
            <button
              type="submit"
              className={`px-3 py-2 transition-colors duration-300 ${
                isHome && !isScrolled
                  ? "text-warm-ivory/80 hover:text-gold-accent"
                  : "text-charcoal-black/60 hover:text-gold-accent"
              }`}
            >
              <Search size={18} />
            </button>
          </form>
        </div>

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
            {/* Mobile Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center rounded-full overflow-hidden bg-charcoal-black/5 border border-charcoal-black/10 focus-within:border-gold-accent/50 w-4/5 max-w-xs"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-3 bg-transparent text-base font-inter text-charcoal-black placeholder:text-charcoal-black/50 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-3 text-charcoal-black/60 hover:text-gold-accent transition-colors"
              >
                <Search size={20} />
              </button>
            </form>

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
