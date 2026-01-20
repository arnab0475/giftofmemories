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
import { useClientAuth } from "../../context/ClientAuthContext";

const ServiceBookingForm = ({ serviceTitle, servicePrice, isLoggedIn }) => {
  const { clientUser } = useClientAuth();

  // Extract numeric price
  const extractPrice = (priceString) => {
    const match = priceString?.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, "")) : 0;
  };

  const originalPrice = extractPrice(servicePrice);
  const discountedPrice =
    isLoggedIn && originalPrice > 0
      ? Math.round(originalPrice * 0.85)
      : originalPrice;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: `I'm interested in booking the ${serviceTitle} package.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [dateError, setDateError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear date error when user changes the date
    if (name === "date") {
      setDateError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date);

    if (selectedDate < today) {
      setDateError(
        "Event date cannot be in the past. Please select today or a future date."
      );
      toast.error("Event date cannot be in the past.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/enquiry/post-enquiry`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          eventType: serviceTitle,
          eventDate: formData.date,
          message: formData.message,
          source: "service-page",
          status: "pending",
        }
      );

      setIsSuccess(true);
      toast.success("Booking inquiry sent successfully!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
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
      <p className="text-gray-500 text-sm mb-2">
        Fill out the form below to check availability and get a quote.
      </p>

      {/* Pricing Display */}
      {servicePrice && originalPrice > 0 && (
        <div className="bg-gold-accent/10 border border-gold-accent/30 rounded-lg p-4 mb-6">
          <p className="text-xs text-slate-gray uppercase tracking-wider mb-2">
            {isLoggedIn ? "Your Discounted Price" : "Starting Price"}
          </p>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-400 line-through text-lg">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-2xl font-bold text-gold-accent">
                ₹{discountedPrice.toLocaleString("en-IN")}
              </span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                15% OFF
              </span>
            </div>
          ) : (
            <p className="text-2xl font-bold text-charcoal-black">
              {servicePrice}
            </p>
          )}
          {isLoggedIn && clientUser && (
            <p className="text-xs text-green-600 mt-2 font-semibold">
              ✓ Logged in as {clientUser.name}
            </p>
          )}
        </div>
      )}

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
            min={new Date().toISOString().split("T")[0]}
            value={formData.date}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 bg-warm-ivory/30 border rounded-md focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-sm text-gray-600 ${
              dateError ? "border-red-500" : "border-gray-200"
            }`}
          />
          {dateError && (
            <p className="text-red-500 text-xs mt-1 ml-1">{dateError}</p>
          )}
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
