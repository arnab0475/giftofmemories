import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gallery1 from "../../assets/images/gallery-1.png";
import gallery2 from "../../assets/images/gallery-2.png";
import gallery3 from "../../assets/images/gallery-3.png";
import serviceHero from "../../assets/images/service-hero.png";
import contactHero from "../../assets/images/contact-hero.png";
import aboutHero from "../../assets/images/about-hero.png";
import { GripHorizontal, LayoutGrid } from "lucide-react";

const galleryItems = [
  {
    id: 1,
    image: gallery1,
    title: "Eternal Moments",
    location: "Kolkata, India",
    year: "2024",
  },
  {
    id: 2,
    image: serviceHero,
    title: "Cinematic Love",
    location: "Udaipur, Rajasthan",
    year: "2023",
  },
  {
    id: 3,
    image: gallery2,
    title: "Traditional Elegance",
    location: "Varanasi, India",
    year: "2024",
  },
  {
    id: 4,
    image: gallery3,
    title: "Candid Joy",
    location: "Goa, India",
    year: "2023",
  },
  {
    id: 5,
    image: aboutHero,
    title: "Studio Portraits",
    location: "Mumbai, India",
    year: "2024",
  },
  {
    id: 6,
    image: contactHero,
    title: "Pre-Wedding Bliss",
    location: "Jaipur, Rajasthan",
    year: "2024",
  },
];

const ImmersiveGallery = ({viewMode, setViewMode}) => {
  return (
    <div className="bg-charcoal-black">
      {galleryItems.map((item, index) => (
        <Card
          key={item.id}
          item={item}
          index={index}
          total={galleryItems.length}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      ))}
    </div>
  );
};

const Card = ({ item, index, total, viewMode, setViewMode }) => {
  return (
    <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-charcoal-black">
      <div className="fixed bottom-6 right-6 z-50 md:flex items-center space-x-2 bg-muted-beige/30 p-1 rounded-lg">
        <button
          onClick={() => setViewMode("masonry")}
          className={`p-2 rounded-md transition-all ${
            viewMode === "masonry"
              ? "bg-warm-ivory shadow text-charcoal-black"
              : "text-slate-gray hover:text-charcoal-black"
          }`}
          title="Masonry View"
        >
          <LayoutGrid size={20} />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded-md transition-all ${
            viewMode === "grid"
              ? "bg-warm-ivory shadow text-charcoal-black"
              : "text-slate-gray hover:text-charcoal-black"
          }`}
          title="Grid View"
        >
          <GripHorizontal size={20} />
        </button>
      </div>
      <div className="relative w-full h-full">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />{" "}
        {/* Subtle overlay for text readability */}
        <div className="absolute bottom-12 left-6 md:left-12 text-warm-ivory z-10">
          <p className="font-inter text-xs uppercase tracking-[0.2em] mb-2">
            {item.location} — {item.year}
          </p>
          <h2 className="font-playfair text-5xl md:text-7xl font-bold">
            {item.title}
          </h2>
        </div>
        <div className="absolute top-1/2 right-6 md:right-12 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-warm-ivory/50 font-inter text-xs">
            0{index + 1}
          </span>
          <div className="w-[1px] h-12 bg-warm-ivory/30"></div>
          <span className="text-warm-ivory/50 font-inter text-xs">
            0{total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveGallery;
