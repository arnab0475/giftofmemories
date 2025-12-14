import { motion } from "framer-motion";
import team1 from "../../assets/images/team-member-1.png";
import team2 from "../../assets/images/team-member-2.png";
import team3 from "../../assets/images/team-member-3.png";

const team = [
  {
    name: "Aditya Roy",
    role: "Lead Photographer",
    image: team1,
  },
  {
    name: "Sarah Jen",
    role: "Creative Director",
    image: team3,
  },
  {
    name: "Rohan Mehta",
    role: "Senior Videographer",
    image: team2,
  },
];

const TeamSection = () => {
  return (
    <section className="py-24 bg-warm-ivory">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-16">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal-black mb-3">
            Meet The Creators
          </h2>
          <p className="font-inter text-slate-gray">
            The passionate visual storytellers behind the lens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <div className="rounded-[14px] overflow-hidden mb-6 shadow-md border border-muted-beige/50 aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105"
                />
              </div>
              <h4 className="font-playfair text-xl font-bold text-charcoal-black mb-1">
                {member.name}
              </h4>
              <div className="inline-block bg-muted-beige/30 px-3 py-1 rounded-full text-xs font-inter font-semibold text-gold-accent tracking-wide uppercase">
                {member.role}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
