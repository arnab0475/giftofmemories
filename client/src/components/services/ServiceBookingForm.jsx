import { useState } from "react";
import {
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const ServiceBookingForm = ({ serviceTitle }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: `I'm interested in booking the ${serviceTitle} package.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      toast.success("Booking inquiry sent successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-emerald-600 text-center"
      >
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} strokeWidth={2} />
        </div>
        <h3 className="font-playfair text-2xl text-charcoal-black mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600 font-inter mb-6">
          We've received your booking inquiry for{" "}
          <strong>{serviceTitle}</strong>. Our team will get back to you
          shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-emerald-600 font-bold text-sm uppercase tracking-widest hover:underline"
        >
          Send another inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg border-t-4 border-gold-accent sticky top-24">
      <h3 className="font-playfair text-2xl text-charcoal-black mb-1">
        Book This Service
      </h3>
      <p className="text-gray-500 text-sm mb-6">
        Fill out the form below to check availability and get a quote.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            name="name"
            placeholder="Your Name*"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-warm-ivory/30 border border-gray-200 rounded-md focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-sm"
          />
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address*"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-warm-ivory/30 border border-gray-200 rounded-md focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-sm"
            />
          </div>
          <div className="relative">
            <Phone
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number*"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-warm-ivory/30 border border-gray-200 rounded-md focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-sm"
            />
          </div>
        </div>

        {/* Date */}
        <div className="relative">
          <Calendar
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-warm-ivory/30 border border-gray-200 rounded-md focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-sm text-gray-600"
          />
        </div>

        {/* Message */}
        <div className="relative">
          <MessageSquare
            className="absolute left-3 top-3.5 text-gray-400"
            size={18}
          />
          <textarea
            name="message"
            placeholder="Tell us about your event..."
            rows="4"
            className="w-full pl-10 pr-4 py-3 bg-warm-ivory/30 border border-gray-200 rounded-md focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-sm resize-none"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold-accent text-white font-inter font-bold uppercase tracking-widest py-4 rounded hover:bg-charcoal-black hover:text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {isSubmitting ? "Sending..." : "Check Availability"}
        </button>
      </form>

      <p className="text-xs text-center text-gray-400 mt-4">
        We usually respond within 24 hours.
      </p>
    </div>
  );
};

export default ServiceBookingForm;
