import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Search, MapPin } from "lucide-react";

const categories = [
  {
    title: "Venues",
    items: [
      "Banquet Halls",
      "Marriage Garden / Lawns",
      "Wedding Resorts",
      "Small Function / Party Halls",
      "Destination Wedding Venues",
      "Kalyana Mandapams",
      "4 Star & Above Wedding Hotels",
      "Wedding Farmhouses",
      "View All Venues",
    ],
  },
  {
    title: "Planning & Decor",
    items: ["Wedding Planners", "Decorators"],
  },
  {
    title: "Invites & Gifts",
    items: [
      "Invitations",
      "Favors",
      "Trousseau Packers",
      "Invitation Gifts",
      "Mehndi Favors",
      "View All Invites & Gifts",
    ],
  },
  {
    title: "Bridal Wear",
    items: [
      "Bridal Lehengas",
      "Kanjeevaram / Silk Sarees",
      "Cocktail Gowns",
      "Trousseau Sarees",
      "Bridal Lehenga on Rent",
      "View All Bridal Wear",
    ],
  },
  {
    title: "Photographers",
    items: ["Photographers"],
  },
  {
    title: "Virtual Planning",
    items: ["Virtual planning"],
  },
  {
    title: "Mehndi",
    items: ["Mehendi Artists"],
  },
  {
    title: "Music & Dance",
    items: ["DJs", "Sangeet Choreographer", "Wedding Entertainment"],
  },
  {
    title: "Food",
    items: [
      "Catering Services",
      "Cake",
      "Chaat & Food Stalls",
      "View All Food",
    ],
  },
  {
    title: "Groom Wear",
    items: [
      "Sherwani",
      "Wedding Suits / Tuxes",
      "Sherwani On Rent",
      "View All Groom Wear",
    ],
  },
  {
    title: "Makeup",
    items: ["Bridal Makeup Artists", "Family Makeup"],
  },
  {
    title: "Pre Wedding Shoot",
    items: ["Pre Wedding Photographers"],
  },
];

const MegaSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative z-50 w-full max-w-5xl mx-auto"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Search Bar Trigger */}
      <motion.div
        className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all duration-300 ${
          isOpen
            ? "bg-gold-accent text-charcoal-black rounded-t-xl shadow-lg"
            : "bg-white/90 backdrop-blur-md text-charcoal-black rounded-xl shadow-lg hover:shadow-xl"
        }`}
      >
        <div className="flex items-center gap-3">
          {isOpen ? null : <Search className="w-5 h-5 text-gray-500" />}
          <span
            className={`font-inter font-medium text-lg ${
              isOpen ? "text-charcoal-black" : "text-gray-700"
            }`}
          >
            {isOpen
              ? "Find Vendors"
              : "Search for vendors, services, or venues..."}
          </span>
        </div>

        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-charcoal-black" />
        ) : (
          <div className="flex items-center gap-2">
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </motion.div>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white shadow-2xl rounded-b-xl overflow-hidden border-t border-gold-accent/20"
          >
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6 max-h-[50vh] overflow-y-auto custom-scrollbar">
              {categories.map((category, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <h3 className="font-playfair text-lg font-semibold text-gold-accent border-b border-gray-100 pb-2 mb-1">
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <a
                          href="#"
                          className="font-inter text-sm text-gray-600 hover:text-gold-accent hover:pl-1 transition-all duration-200 block"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 px-6 py-3 text-right">
              <span className="text-xs text-gray-400 font-inter">
                Photo Credits: Shutterdown
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaSearch;
