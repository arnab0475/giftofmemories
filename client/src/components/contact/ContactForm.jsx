import { motion } from "framer-motion";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventType: "Wedding Photography",
    eventDate: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Prevent selecting a date before today
    if (form.eventDate < today) {
      setError("Event date cannot be in the past.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/enquiry/post-enquiry`,
        {
          name: form.firstName + " " + form.lastName,
          email: form.email,
          phone: form.phone,
          eventType: form.eventType,
          eventDate: form.eventDate,
          message: form.message,
        }
      );
      toast.success("Your enquiry has been submitted!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        eventType: "Wedding Photography",
        eventDate: "",
        message: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white p-8 md:p-10 rounded-[14px] shadow-sm border border-muted-beige/20"
    >
      <h2 className="font-playfair text-3xl font-bold text-charcoal-black mb-8">
        Send us a Message
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Jane"
              value={form.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Event Type
            </label>
            <select
              name="eventType"
              value={form.eventType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black appearance-none"
              required
            >
              <option>Wedding Photography</option>
              <option>Event Coverage</option>
              <option>Portrait Session</option>
              <option>Commercial Shoot</option>
              <option>Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-inter text-sm font-semibold text-charcoal-black block">
              Event Date
            </label>
            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              min={today}
              className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black uppercase text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-inter text-sm font-semibold text-charcoal-black block">
            Tell us about your plans
          </label>
          <textarea
            rows="4"
            name="message"
            placeholder="Describe your vision, venue, and any specific requirements..."
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-warm-ivory/30 border border-muted-beige/50 rounded-lg focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-charcoal-black"
            required
          ></textarea>
        </div>

        {error && (
          <div className="text-red-600 font-inter text-sm">{error}</div>
        )}
        {success && (
          <div className="text-green-600 font-inter text-sm">{success}</div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-gold-accent text-charcoal-black font-inter text-sm uppercase tracking-widest font-bold rounded-[10px] shadow-md hover:bg-charcoal-black hover:text-gold-accent transition-all duration-300 transform hover:scale-[1.01]"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </motion.div>
  );
};

export default ContactForm;
