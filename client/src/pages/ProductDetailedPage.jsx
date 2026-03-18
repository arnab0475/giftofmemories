
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";

import Loader from "../components/Loader";
import TrustStrip from "../components/products/TrustStrip";
import CTASection from "../components/products/CTASection";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stockInfo, setStockInfo] = useState({
    available: 0,
    purchased: 0,
  });

  const optimizeUrl = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    if (url.includes("f_auto,q_auto")) return url;
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/shop/get-product/${id}`
        );

        const optimizedMedia =
          res.data.media?.map((file) => optimizeUrl(file)) || [];

        setProduct({
          ...res.data,
          media: optimizedMedia,
        });

        setSelectedMedia(optimizedMedia[0]);

        const available = Math.floor(Math.random() * 19) + 2;
        const purchased = Math.floor(Math.random() * 150) + 50;

        setStockInfo({
          available,
          purchased,
        });
      } catch (err) {
        console.error("Product fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <Loader color="#C9A24D" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-40 text-charcoal-black">
        Product not found
      </div>
    );
  }

  const isVideo =
    selectedMedia?.includes(".mp4") ||
    selectedMedia?.includes(".webm") ||
    selectedMedia?.includes(".mov");

  const handleWhatsAppOrder = () => {
    const phoneNumber = "918335934679";

    const message = `Hello Karukarjo!

I want to order this product:

Product: ${product.name}
Price: ₹${product.price}
Product Link: ${window.location.href}

Please assist me with the order.
`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24 font-inter">

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12">

        <div className="grid lg:grid-cols-2 gap-10">

          <div className="flex flex-col lg:flex-row gap-4">

            {product.media?.length > 1 && (
              <div className="flex lg:flex-col gap-3 overflow-x-auto">

                {product.media.map((file, index) => {
                  const isVid =
                    file.includes(".mp4") ||
                    file.includes(".webm") ||
                    file.includes(".mov");

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedMedia(file)}
                      className={`cursor-pointer border-2 rounded-sm overflow-hidden ${
                        selectedMedia === file
                          ? "border-gold-accent"
                          : "border-transparent"
                      }`}
                    >
                      {isVid ? (
                        <video className="w-20 h-20 lg:w-24 lg:h-24 object-cover" src={file} />
                      ) : (
                        <img
                          src={file}
                          className="w-20 h-20 lg:w-24 lg:h-24 object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 rounded-[2rem] overflow-hidden shadow-xl bg-white"
            >
              {isVideo ? (
                <video
                  src={selectedMedia}
                  className="w-full h-[400px] sm:h-[500px] object-cover"
                  controls
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img
                  src={selectedMedia}
                  alt={product.name}
                  className="w-full h-[400px] sm:h-[500px] object-cover"
                />
              )}
            </motion.div>
          </div>

          <div className="space-y-6">

            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-accent font-bold">
                {product.category?.name}
              </p>

              <h1 className="text-3xl sm:text-4xl font-playfair font-bold mt-2">
                {product.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              {product.tag && (
                <span className="px-3 py-1 bg-gold-accent/10 text-gold-accent text-xs rounded-full font-bold">
                  {product.tag}
                </span>
              )}

              {product.isBestseller && (
                <span className="px-3 py-1 bg-black text-white text-xs rounded-full font-bold">
                  Bestseller
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-2xl sm:text-3xl font-bold">
                ₹{product.price}
              </span>

              {product.oldPrice && (
                <span className="line-through text-gray-400">
                  ₹{product.oldPrice}
                </span>
              )}
            </div>

            <div className="border-y border-red-200 py-4">

              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  🔥
                </span>

                <p className="text-sm font-semibold">
                  Only{" "}
                  <span className="text-red-600 font-bold">
                    {stockInfo.available}
                  </span>{" "}
                  pieces available
                </p>
              </div>

              <div className="w-full bg-red-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-red-700"
                  style={{
                    width: `${(stockInfo.available / 20) * 100}%`,
                  }}
                />
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-gray-600">
                <span>
                  <strong>{stockInfo.purchased}</strong> customers purchased this
                </span>
              </div>

            </div>

            <div className="flex items-center gap-2 text-gold-accent">
              <Star size={16} />
              <span className="text-sm font-semibold">
                Popularity Score: {product.popularity}
              </span>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              className="flex items-center gap-3 bg-charcoal-black text-gold-accent px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-gold-accent hover:text-charcoal-black transition-all shadow-lg"
            >
              <ShoppingCart size={16} />
              Buy Now
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pb-16">

        <div className="grid md:grid-cols-2 gap-12 border-t pt-10">

          <div>
            <h2 className="text-2xl font-playfair font-bold mb-4">
              Description
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-playfair font-bold mb-4">
              Handle with Care
            </h2>

            <ul className="space-y-3 text-gray-600 list-disc pl-5">
              <li>
                Keep away from direct sunlight for long periods to prevent color fading.
              </li>
              <li>
                Wipe gently with a soft, dry cloth if dust accumulates; avoid water or harsh chemicals.
              </li>
              <li>
                Store in a dry, cool place when not in use.
              </li>
              <li>
                Avoid folding or bending forcefully.
              </li>
              <li>
                Handle delicately during rituals and storage.
              </li>
            </ul>
          </div>

        </div>
      </section>
{/* STORE POLICIES */}
<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pb-20">

  <div className="grid md:grid-cols-2 gap-10 border-t border-charcoal-black/10 pt-12">

    {/* RETURN & EXCHANGE */}
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

      <h2 className="text-2xl font-playfair font-bold mb-4 text-charcoal-black">
        Return & Exchange
      </h2>

      <p className="text-sm text-gray-700 leading-relaxed font-semibold mb-2">
        GiftOfMemories Return Policy
      </p>

      <p className="text-sm text-gray-600 leading-relaxed">
        At <strong>GiftOfMemories</strong>, every product is carefully crafted
        to create meaningful and memorable gifts. Since many of our items are
        handmade or made-to-order, we only accept returns in the following cases:
      </p>

      <ul className="list-disc pl-5 text-sm text-gray-600 mt-3 space-y-2">
        <li>If the product is <strong>damaged during delivery</strong></li>
        <li>If the <strong>wrong item was delivered</strong></li>
      </ul>

      <p className="text-sm text-gray-600 mt-3">
        Issues must be reported within <strong>48 hours of delivery</strong>
        with clear photos of the product and packaging.
      </p>

      <p className="text-sm text-gray-600 mt-3">
        Customized or personalized products and items without prior communication
        are <strong>non-returnable</strong>.
      </p>

      <p className="text-sm text-gray-600 mt-3">
        Orders can be cancelled within <strong>12 hours of placing the order</strong>.
      </p>

      <p className="text-sm text-gray-600 mt-3">
        Approved refunds are processed within
        <strong> 7–10 business days</strong>.
      </p>

    </div>


    {/* PRIVACY POLICY */}
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">

      <h2 className="text-2xl font-playfair font-bold mb-4 text-charcoal-black">
        Privacy Policy
      </h2>

      <p className="text-sm text-gray-700 leading-relaxed font-semibold mb-2">
        GiftOfMemories Privacy Policy
      </p>

      <p className="text-sm text-gray-600 leading-relaxed">
        At <strong>GiftOfMemories</strong>, we respect and protect your privacy.
        We collect personal, account, and browsing information to process
        orders, improve your shopping experience, and communicate with you.
      </p>

      <p className="text-sm text-gray-600 mt-3">
        Your information is securely stored and only shared with trusted
        partners when necessary, such as payment processors or shipping
        providers.
      </p>

      <p className="text-sm text-gray-600 mt-3">
        We <strong>never sell or trade your personal information</strong>.
      </p>

      <p className="text-sm text-gray-600 mt-3">
        You may request access, correction, or deletion of your data by
        contacting us at:
      </p>

      <p className="text-sm font-semibold text-charcoal-black mt-2">
        giftofmemories.ofc@gmail.com
      </p>

      <p className="text-sm text-gray-600 mt-3">
        We may update this policy periodically to reflect improvements
        or legal requirements.
      </p>

    </div>

  </div>

</section>
      <section className="bg-white border-t border-charcoal-black/5">
        <TrustStrip />
        <CTASection />
      </section>

    </div>
  );
};

export default ProductDetailsPage;

