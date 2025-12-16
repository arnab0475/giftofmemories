import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ShieldCheck, Aperture } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "admin1234") {
        setIsLoading(false);
        setIsSuccess(true);
        console.log("Login successful, redirecting...");
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 800);
      } else {
        setIsLoading(false);
        setError("Invalid credentials. Access denied.");
        setTimeout(() => setError(""), 3000);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-inter overflow-hidden">
      {/* LEFT PANEL - BRAND IDENTITY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 bg-[#0F0F0F] relative flex flex-col justify-center items-center p-12 text-center overflow-hidden"
      >
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--color-gold-accent)_1px,_transparent_1px)] bg-[size:24px_24px]"></div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Aperture
            size={48}
            className="text-[#C9A24D] mb-6"
            strokeWidth={1.5}
          />
        </motion.div>
        {/* Vertical Gold Line Decoration - "Thin vertical gold line" option */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100px" }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-[1px] bg-[#C9A24D] mb-8"
        ></motion.div>

        <div className="z-10 flex flex-col items-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-[#FAF9F6] mb-4 tracking-wide">
            Photography Club
          </h1>

          <div className="h-[1px] w-12 bg-[#2B2B2B] my-4"></div>

          <p className="text-[#EDE6DB] text-lg font-light tracking-wide">
            Admin Control & Management Portal
          </p>
        </div>

        <div className="absolute bottom-8 left-8 text-[#2B2B2B] text-xs tracking-wider uppercase">
          Authorized personnel only
        </div>
      </motion.div>

      {/* RIGHT PANEL - LOGIN FORM */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full md:w-1/2 bg-[#FAF9F6] flex flex-col justify-center items-center p-6 md:p-12 relative"
      >
        <div className="w-full max-w-[420px] bg-white/50 backdrop-blur-sm rounded-[14px] p-10 md:p-12 shadow-[0_12px_32px_rgba(0,0,0,0.06)] border border-[#2B2B2B]/5">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-3xl font-semibold text-[#0F0F0F] mb-2">
              Admin Login
            </h2>
            <p className="text-[#2B2B2B] text-sm flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-[#C9A24D]" />
              Secure access to dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2 group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#0F0F0F] ml-1 transition-colors"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="admin@domain.com"
                  className={`
                    w-full h-[48px] px-4 rounded-[10px] bg-white border outline-none transition-all duration-300
                    text-[#0F0F0F] placeholder:text-gray-400
                    ${
                      focusedField === "email"
                        ? "border-[#C9A24D] shadow-[0_0_0_4px_rgba(201,162,77,0.1)]"
                        : "border-[#2B2B2B]/20 hover:border-[#2B2B2B]/40"
                    }
                  `}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#0F0F0F] ml-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`
                    w-full h-[48px] px-4 pr-12 rounded-[10px] bg-white border outline-none transition-all duration-300
                    text-[#0F0F0F] placeholder:text-gray-400
                    ${
                      focusedField === "password"
                        ? "border-[#C9A24D] shadow-[0_0_0_4px_rgba(201,162,77,0.1)]"
                        : "border-[#2B2B2B]/20 hover:border-[#2B2B2B]/40"
                    }
                  `}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A24D] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full h-[48px] rounded-[10px] font-medium text-[#0F0F0F]
                flex items-center justify-center gap-2 transition-all duration-300
                ${
                  isSuccess
                    ? "bg-[#2ECC71] text-white shadow-lg"
                    : "bg-[#C9A24D] hover:shadow-[0_0_20px_rgba(201,162,77,0.4)]"
                }
              `}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isSuccess ? (
                <>
                  Success <ShieldCheck size={18} />
                </>
              ) : (
                "Login to Dashboard"
              )}
            </motion.button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#E74C3C] text-sm text-center font-medium mt-4"
              >
                {error}
              </motion.div>
            )}
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-[13px] text-[#2B2B2B]/60 font-inter">
              This system is protected and monitored.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
