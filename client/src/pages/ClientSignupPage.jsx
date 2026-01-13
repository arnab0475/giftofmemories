import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClientAuth } from "../context/ClientAuthContext";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ClientSignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useClientAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    const result = await signup(name, email, password, phone);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(
        result.message || "Account created! Awaiting admin approval."
      );
      navigate("/login");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-gray flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[14px] shadow-2xl w-full max-w-md border border-muted-beige/50"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-playfair font-bold text-charcoal-black mb-2">
            Create Account
          </h1>
          <p className="text-slate-gray text-sm font-inter">
            Join us to unlock 15% off on all products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-charcoal-black mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-gray/20 focus:outline-none focus:border-gold-accent bg-warm-ivory/30"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal-black mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-gray/20 focus:outline-none focus:border-gold-accent bg-warm-ivory/30"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal-black mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-gray/20 focus:outline-none focus:border-gold-accent bg-warm-ivory/30"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal-black mb-2">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-gray/20 focus:outline-none focus:border-gold-accent bg-warm-ivory/30"
              placeholder="+91 9876543210"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-charcoal-black text-gold-accent font-bold rounded-lg hover:bg-black transition-colors shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-xs text-slate-gray text-center">
            Your account will need admin approval before you can log in.
          </p>
        </form>

        <div className="mt-6 text-center text-sm text-slate-gray">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gold-accent font-semibold hover:underline"
          >
            Log In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientSignupPage;
