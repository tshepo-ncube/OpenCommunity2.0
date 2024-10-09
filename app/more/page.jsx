"use client";
import React, { useState } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    "sk-bpVg50afhh0TSnh3EgewxTyiUgN_5ZiJc8iMx5QqI2T3BlbkFJrTZEo-YBWqDSMnfFbHYtJAn8RgktF9INtMjGjUVwYA",
  dangerouslyAllowBrowser: true,
});
const MAX_KEEP_IMAGES = 3;

const DallEImageGenerator = () => {
  const [generatedImages, setGeneratedImages] = useState([]); // Store current generated images
  const [keptImages, setKeptImages] = useState([]); // Store user "kept" images
  const [loading, setLoading] = useState(false); // Handle loading state
  const [error, setError] = useState(null); // Handle errors

  // Function to generate 3 new images
  const generateImages = async () => {
    setLoading(true);
    setError(null); // Reset previous errors
    try {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: "a white siamese cat", // You can customize this prompt
        n: 3, // Generate 3 images
        size: "1024x1024",
      });

      const imageUrls = response.data.map((item) => item.url); // Extract image URLs
      setGeneratedImages(imageUrls); // Update the generated images state
    } catch (err) {
      setError("Failed to generate images. Please try again.");
      console.log(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to keep an image
  const keepImage = (url) => {
    if (keptImages.length >= MAX_KEEP_IMAGES) {
      alert(`You can only keep a maximum of ${MAX_KEEP_IMAGES} images.`);
      return;
    }

    if (!keptImages.includes(url)) {
      setKeptImages((prevKeptImages) => [...prevKeptImages, url]);
    }
  };

  // Function to regenerate images (it keeps the previously kept ones)
  const regenerateImages = async () => {
    // Ensure the kept images are retained
    setGeneratedImages([]); // Clear out current generated images
    await generateImages(); // Regenerate images
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">DALL-E Image Generator</h2>

      <button
        onClick={generateImages}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 mb-4"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Images"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}
    </div>
  );
};

export default DallEImageGenerator;
