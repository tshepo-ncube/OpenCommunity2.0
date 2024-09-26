"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

import { toast, Toaster } from "react-hot-toast";
import {
  ChevronDown,
  Send,
  Sparkles,
  Users,
  Target,
  Zap,
  X,
} from "lucide-react";
import RecommendationDB from "@/database/community/recommendation";

import Header from "../../../_Components/header";

const CommunityRecommendationPage = () => {
  // const [communityName, setCommunityName] = useState < string > "";
  // const [description, setDescription] = useState < string > "";
  // const [category, setCategory] = useState < string > "general";
  // const [showConfetti, setShowConfetti] = useState < boolean > false;
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const [formData, setFormData] = useState({
    communityName: "",
    description: "",
    category: "General",
  });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    setTimeout(() => setShowTip(true), 3000);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (typeof window === "undefined") return;

      const userEmail = localStorage.getItem("Email");
      if (!userEmail) throw new Error("User email not found. Please log in.");

      await RecommendationDB.createRecommendation(
        formData.communityName,
        formData.description,
        { userEmail, category: formData.category }
      );

      setFormData({ communityName: "", description: "", category: "General" });
      toast.success("Your community recommendation has been submitted!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } catch (error) {
      console.error("Error submitting recommendation:", error);
      toast.error("Failed to submit recommendation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#f0f4e1] via-gray-100 to-[#e6edc3]"
    >
      <Header />
      <Toaster position="bottom-right" reverseOrder={false} />

      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="max-w-7xl mx-auto p-8 mt-8"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
          <div className="md:flex">
            {/* Left column */}
            <div className="md:w-1/2 p-12 bg-gradient-to-br from-white via-white 60% to-[#bcd727]">
              <motion.h1
                variants={itemVariants}
                className="text-5xl font-bold mb-6 text-gray-800"
              >
                Recommend a Community
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-xl mb-12 text-gray-600"
              >
                Help us grow together by suggesting an innovative community
                group!
              </motion.p>
              <motion.div variants={itemVariants} className="space-y-8">
                {[
                  {
                    Icon: Users,
                    text: "Connect with forward-thinking individuals",
                  },
                  { Icon: Target, text: "Share ambitious goals and interests" },
                  { Icon: Zap, text: "Empower each other to push boundaries" },
                ].map(({ Icon, text }, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 text-gray-700"
                    whileHover={{ scale: 1.05, color: "#bcd727" }}
                  >
                    <Icon className="w-8 h-8" />
                    <p className="text-lg">{text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right column */}
            <div className="md:w-1/2 p-12 bg-gray-50">
              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="communityName"
                    className="block text-lg font-semibold text-gray-700 mb-2"
                  >
                    Community Name
                  </label>
                  <input
                    type="text"
                    id="communityName"
                    name="communityName"
                    value={formData.communityName}
                    onChange={handleInputChange}
                    placeholder="Enter an inspiring name"
                    required
                    className="w-full p-4 text-lg bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bcd727] focus:border-[#bcd727] transition-all duration-300 shadow-sm"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="description"
                    className="block text-lg font-semibold text-gray-700 mb-2"
                  >
                    Community Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the innovative purpose and ambitious goals of your community"
                    required
                    className="w-full p-4 text-lg bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bcd727] focus:border-[#bcd727] min-h-[150px] transition-all duration-300 shadow-sm"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="category"
                    className="block text-lg font-semibold text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-4 text-lg bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#bcd727] focus:border-[#bcd727] appearance-none transition-all duration-300 shadow-sm"
                    >
                      {["General", "Sports", "Social", "Development"].map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 text-lg rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#c8e034] hover:bg-[#bcd727] text-white transform hover:scale-105"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6 mr-2" />
                        <span>Submit Recommendation</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <div className="bg-[#f0f4e1] rounded-lg p-4 flex items-start shadow-md">
                  <Sparkles className="h-5 w-5 text-[#bcd727] mr-2 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    Pro Tip: Be specific about your community's innovative goals
                    to attract visionary individuals.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-xl max-w-sm"
          >
            <h3 className="font-bold text-xl mb-2 text-[#bcd727]">
              Innovation Insight
            </h3>
            <p className="text-gray-700">
              A cutting-edge community name reflects its forward-thinking
              purpose and inspires action!
            </p>
            <button
              onClick={() => setShowTip(false)}
              className="mt-4 text-[#grey] hover:text-[#grey] font-semibold"
            >
              Got it, thanks!
            </button>
            <button
              onClick={() => setShowTip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommunityRecommendationPage;
