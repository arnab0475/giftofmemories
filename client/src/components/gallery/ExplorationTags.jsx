const tags = [
  "Outdoor",
  "Candid",
  "Traditions",
  "Pre-Wedding",
  "Studio",
  "Night Shoots",
  "Destination",
  "Black & White",
  "Drone Shots",
];

const ExplorationTags = () => {
  return (
    <section className="py-12 bg-muted-beige border-y border-warm-ivory/10">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag) => (
            <button
              key={tag}
              className="px-6 py-2 bg-warm-ivory rounded-full font-inter text-xs md:text-sm font-semibold text-charcoal-black hover:bg-gold-accent hover:text-charcoal-black hover:shadow-md transition-all duration-300"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorationTags;
