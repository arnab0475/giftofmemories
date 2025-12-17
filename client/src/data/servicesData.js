import serviceHero from "../assets/images/service-hero.png";
import gallery1 from "../assets/images/gallery-1.png";
import gallery2 from "../assets/images/gallery-2.png";
import gallery3 from "../assets/images/gallery-3.png";

export const servicesData = [
  {
    id: "wedding-photography",
    title: "Wedding Photography",
    category: "Weddings",
    shortDescription: "Capturing emotions, rituals and unforgettable moments.",
    description:
      "Our wedding photography service is dedicated to capturing the essence of your special day. From the intimate moments of preparation to the grandeur of the ceremony and the joy of the reception, we are there to document it all. We blend candid storytelling with artistic composition to create a timeless visual narrative of your love story.",
    price: "₹45,000",
    image: gallery2,
    details: {
      duration: "Full Day Coverage",
      deliverables: "300+ Edited Photos, Online Gallery",
      location: "Kolkata & Outstation",
    },
  },
  {
    id: "event-coverage",
    title: "Event Coverage",
    category: "Events",
    shortDescription:
      "Professional documentation for corporate events and parties.",
    description:
      "We provide comprehensive coverage for corporate events, parties, concerts, and stage performances. Our team understands the importance of capturing branding, key speakers, and audience engagement. We deliver high-quality images that perfectly represent the energy and professionalism of your event.",
    price: "₹20,000",
    image: serviceHero,
    details: {
      duration: "4-8 Hours",
      deliverables: "100+ High-Res Images",
      location: "On-site",
    },
  },
  {
    id: "portrait-sessions",
    title: "Portrait Sessions",
    category: "Portraits",
    shortDescription: "Artistic solo, couple, or family portraits.",
    description:
      "Whether it's a solo session, a couple shoot, or a family gathering, our portrait sessions are designed to reveal the unique personality and connection of our subjects. We work in studio or on location, using professional lighting and styling to create stunning, magazine-quality portraits.",
    price: "₹10,000",
    image: gallery3,
    details: {
      duration: "2-3 Hours",
      deliverables: "20 Retouched Portraits",
      location: "Studio or Outdoor",
    },
  },
  {
    id: "commercial-brand",
    title: "Commercial & Brand",
    category: "Commercial",
    shortDescription: "High-quality visuals to elevate your business.",
    description:
      " elevate your brand with our commercial photography services. We specialize in product photography, lifestyle shots, and brand storytelling visuals. Our goal is to create compelling imagery that resonates with your target audience and strengthens your brand identity.",
    price: "₹35,000",
    image: gallery1,
    details: {
      duration: "project based",
      deliverables: "High-Res Digital Assets",
      location: "Studio or On-site",
    },
  },
  {
    id: "cinematic-films",
    title: "Cinematic Films",
    category: "Weddings",
    shortDescription: "Story-driven videography for weddings and ads.",
    description:
      "Our cinematic films go beyond traditional videography. We create story-driven films that capture the emotions, sounds, and movement of your event. Using high-end cinema cameras and creative editing, we produce a movie-like experience that you'll cherish forever.",
    price: "₹50,000",
    image: gallery2,
    details: {
      duration: "Full Day Coverage",
      deliverables: "3-5 Min Highlight Film + Full Doc",
      location: "Kolkata & Outstation",
    },
  },
  {
    id: "pre-wedding-shoots",
    title: "Pre-Wedding Shoots",
    category: "Weddings",
    shortDescription: "Dreamy, cinematic outdoor shoots before the big day.",
    description:
      "Celebrate your love story before the big day with our pre-wedding shoots. We take you to scenic locations to create dreamy, cinematic images that capture your chemistry and excitement. It's a great way to get comfortable in front of the camera before the wedding.",
    price: "₹30,000",
    image: gallery3,
    details: {
      duration: "4-6 Hours",
      deliverables: "50+ Edited Images + Teaser Reel",
      location: "Multiple Locations",
    },
  },
];
