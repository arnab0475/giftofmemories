import { motion } from "framer-motion";
// Placeholder imports
import gallery2 from "../../assets/images/gallery-2.png";
import gallery3 from "../../assets/images/gallery-3.png";

const featuredData = [
  {
    title: "Royal Wedding Bundle",
    subtitle: "Photography + 2 Films",
    image: gallery2,
  },
  {
    title: "Brand Starter Kit",
    subtitle: "20 Products + 5 Reels",
    image: gallery3,
  },
  {
    title: "Portrait Special",
    subtitle: "2 Hour Studio Session",
    image: gallery2,
  },
  {
    title: "Event Highlights",
    subtitle: "Full coverage + Teaser",
    image: gallery3,
  },
];

const FeaturedServices = () => {
  return (
    <section className="py-16 bg-muted-beige border-y border-warm-ivory/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-playfair text-2xl text-charcoal-black font-semibold">
            Most Booked Packages
          </h3>
          <span className="bg-charcoal-black text-gold-accent px-3 py-1 rounded text-xs uppercase tracking-widest font-bold">
            Trending
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar pb-4">
          <div className="flex space-x-6 w-max">
            {featuredData.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-warm-ivory p-4 rounded-[14px] w-[280px] shadow-sm flex items-center space-x-4 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-playfair text-lg font-medium text-charcoal-black leading-tight mb-1">
                    {item.title}
                  </h4>
                  <p className="font-inter text-xs text-slate-gray">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
