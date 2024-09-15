"use client";
import React, { useState, useEffect } from "react";
import Header from "../_Components/header";
import { toast, Toaster } from "react-hot-toast";
import RecommendationDB from "@/database/community/recommendation";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { ChevronDown, Send, Sparkles, Users, Target, Zap } from "lucide-react";

const Alert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-gradient-to-r from-[#f0f4e1] to-gray-100 border-l-4 border-[#bcd727] text-gray-700 p-4 rounded-lg shadow-md">
    {children}
  </div>
);

const CommunityRecommendationPage: React.FC = () => {
  const [communityName, setCommunityName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("general");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(false);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    setTimeout(() => setShowTip(true), 3000);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userEmail = localStorage.getItem("Email");
      if (!userEmail) {
        throw new Error("User email not found. Please log in.");
      }

      await RecommendationDB.createRecommendation(communityName, description, {
        userEmail,
        category,
      });

      setCommunityName("");
      setDescription("");
      setCategory("general");

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

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4e1] via-gray-100 to-[#e6edc3]">
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
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left column */}
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-white via-white 60% to-[#bcd727] text-black">
              <motion.h1
                variants={itemVariants}
                className="text-4xl font-bold mb-4"
              >
                Recommend a Community
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl mb-8">
                Help us grow together by suggesting a new community group!
              </motion.p>
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 mr-4" />
                  <p>Connect with like-minded individuals</p>
                </div>
                <div className="flex items-center">
                  <Target className="w-8 h-8 mr-4" />
                  <p>Share common goals and interests</p>
                </div>
                <div className="flex items-center">
                  <Zap className="w-8 h-8 mr-4" />
                  <p>Empower each other to achieve more</p>
                </div>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="md:w-1/2 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    placeholder="Enter an inspiring name"
                    required
                    className="w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bcd727] transition-all duration-300 bg-gray-50"
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the purpose and goals of your community"
                    required
                    className="w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bcd727] min-h-[150px] transition-all duration-300 bg-gray-50"
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="relative">
                  <label
                    htmlFor="category"
                    className="block text-lg font-semibold text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-4 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bcd727] transition-all duration-300 bg-gray-50 appearance-none"
                  >
                    <option value="general">General</option>
                    <option value="Sports">Sports</option>
                    <option value="Social">Social</option>
                    <option value="Development">Development</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-[60%] text-gray-500 pointer-events-none" />
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-[#c8e034] text-white py-4 px-6 text-lg rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isSubmitting
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:shadow-xl"
                  }`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      <span>Submit Recommendation</span>
                    </>
                  )}
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Alert>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    <span className="font-bold">Pro Tip!</span>
                  </div>
                  <p>
                    Be specific about your community's goals to attract
                    like-minded individuals.
                  </p>
                </Alert>
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
            <h3 className="font-bold text-xl mb-2 text-[#bcd727]">Quick Tip</h3>
            <p className="text-gray-700">
              A great community name is memorable and reflects its purpose!
            </p>
            <button
              onClick={() => setShowTip(false)}
              className="mt-4 text-[#bcd727] hover:text-[#a8c122] font-semibold"
            >
              Got it, thanks!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityRecommendationPage;
