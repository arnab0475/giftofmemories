import React from "react";

const TrustStrip = () => {
  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8 md:w-10 md:h-10 text-gold-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      text: "Premium Quality Materials",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 md:w-10 md:h-10 text-gold-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      text: "Fast & Secure Shipping",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 md:w-10 md:h-10 text-gold-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      text: "Secure Payments",
    },
    {
      icon: (
        <svg
          className="w-8 h-8 md:w-10 md:h-10 text-gold-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      ),
      text: "Loved by Professionals",
    },
  ];

  return (
    <div className="bg-warm-ivory border-t border-b border-muted-beige/50">
      <div className="max-w-[1240px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center gap-4 group"
            >
              <div className="bg-muted-beige/30 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <span className="font-semibold text-charcoal-black text-sm md:text-base">
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;
