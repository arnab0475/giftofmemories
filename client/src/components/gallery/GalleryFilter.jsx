import { LayoutGrid, GripHorizontal } from "lucide-react";

const filters = [
  "All",
  "Weddings",
  "Events",
  "Portraits",
  "Commercial",
  "Videos",
];

const GalleryFilter = ({
  activeFilter,
  setActiveFilter,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="sticky top-[80px] z-40 bg-warm-ivory border-b border-muted-beige/30 py-4 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-inter font-semibold transition-all duration-300 border whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-gold-accent text-charcoal-black border-gold-accent shadow-md"
                  : "bg-transparent text-slate-gray border-slate-gray/20 hover:border-gold-accent hover:text-gold-accent"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="hidden md:flex items-center space-x-2 bg-muted-beige/30 p-1 rounded-lg">
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
      </div>
    </div>
  );
};

export default GalleryFilter;
