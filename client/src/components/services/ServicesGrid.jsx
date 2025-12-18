import { motion, AnimatePresence } from "framer-motion";
import ServiceCard from "./ServiceCard";
import serviceHero from "../../assets/images/service-hero.png";
import gallery1 from "../../assets/images/gallery-1.png";
import gallery2 from "../../assets/images/gallery-2.png";
import gallery3 from "../../assets/images/gallery-3.png";

const servicesData = [
  {
    id: 1,
    title: "Wedding Photography",
    category: "Weddings",
    description:
      "Capturing emotions, rituals and unforgettable moments. Comprehensive coverage from pre-wedding to reception.",
    price: "₹45,000",
    image: gallery2,
  },
  {
    id: 2,
    title: "Event Coverage",
    category: "Events",
    description:
      "Professional documentation for corporate events, parties, concerts, and stage performances.",
    price: "₹20,000",
    image: serviceHero,
  },
  {
    id: 3,
    title: "Portrait Sessions",
    category: "Portraits",
    description:
      "Artistic solo, couple, or family portraits shot in studio or on location with professional styling.",
    price: "₹10,000",
    image: gallery3,
  },
  {
    id: 4,
    title: "Commercial & Brand",
    category: "Commercial",
    description:
      "High-quality product photography and brand storytelling visuals to elevate your business presence.",
    price: "₹35,000",
    image: gallery1,
  },
  {
    id: 5,
    title: "Cinematic Films",
    category: "Weddings",
    description:
      "Story-driven videography and cinematography for weddings, ads, and music videos.",
    price: "₹50,000",
    image: gallery2,
  },
  {
    id: 6,
    title: "Pre-Wedding Shoots",
    category: "Weddings",
    description:
      "Dreamy, cinematic outdoor shoots to capture your chemistry before the big day arrives.",
    price: "₹30,000",
    image: gallery3,
  },
];

// Helper function to parse price string to number
const parsePrice = (priceStr) => {
  return parseInt(priceStr.replace(/[₹,]/g, ""), 10);
};

const ServicesGrid = ({ activeFilter, activePriceFilter, sortBy }) => {
  // Filter by category
  let filteredServices =
    activeFilter === "All Services"
      ? [...servicesData]
      : servicesData.filter((service) => service.category === activeFilter);

  // Filter by price range
  if (activePriceFilter && activePriceFilter.label !== "All Prices") {
    filteredServices = filteredServices.filter((service) => {
      const price = parsePrice(service.price);
      return price >= activePriceFilter.min && price < activePriceFilter.max;
    });
  }

  // Sort services
  if (sortBy && sortBy !== "default") {
    filteredServices = [...filteredServices].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return parsePrice(a.price) - parsePrice(b.price);
        case "price-desc":
          return parsePrice(b.price) - parsePrice(a.price);
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }

  return (
    <section className="py-20 bg-warm-ivory min-h-screen">
      <div className="container mx-auto px-6">
        {/* Results count */}
        <div className="mb-8 text-center">
          <p className="font-inter text-sm text-slate-gray">
            Showing{" "}
            <span className="font-semibold text-charcoal-black">
              {filteredServices.length}
            </span>{" "}
            {filteredServices.length === 1 ? "service" : "services"}
            {activeFilter !== "All Services" && (
              <span>
                {" "}
                in <span className="text-gold-accent">{activeFilter}</span>
              </span>
            )}
            {activePriceFilter && activePriceFilter.label !== "All Prices" && (
              <span>
                {" "}
                •{" "}
                <span className="text-gold-accent">
                  {activePriceFilter.label}
                </span>
              </span>
            )}
            {sortBy && sortBy !== "default" && (
              <span>
                {" "}
                •{" "}
                <span className="text-gold-accent">
                  Sorted by {sortBy.includes("price") ? "price" : "name"}
                </span>
              </span>
            )}
          </p>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredServices.length === 0 && (
          <div className="text-center py-20">
            <h3 className="font-playfair text-2xl text-charcoal-black">
              No services found matching your criteria.
            </h3>
            <p className="font-inter text-slate-gray mt-2">
              Try adjusting your category or price filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesGrid;
