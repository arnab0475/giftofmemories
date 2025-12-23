import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GripHorizontal, LayoutGrid } from "lucide-react";

const ImmersiveGallery = ({ viewMode, setViewMode, items = [] }) => {
 
  const displayItems =
    items.length > 0
      ? items.map((item, index) => ({
          id: item._id,
          image: item.url,
          title: item.tags?.[0] || "Gallery Moment",
          location: "Featured Collection",
          year: "2025",
          type: item.type,
        }))
      : []; 

  if (displayItems.length === 0) {
    return (
      <div className="min-h-screen bg-charcoal-black flex items-center justify-center text-warm-ivory">
        <p>No gallery items found.</p>
      </div>
    );
  }

  return (
    <div className="bg-charcoal-black">
      {displayItems.map((item, index) => (
        <Card
          key={item.id}
          item={item}
          index={index}
          total={displayItems.length}
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
      <div className="fixed bottom-7 right-28 z-50 md:flex items-center space-x-2 bg-muted-beige/30 p-1 rounded-lg">
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
        {item.type === "video" ? (
          <video
            src={item.image}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />{" "}
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
