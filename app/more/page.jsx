// "use client";
// import React, { useState } from "react";
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey:
//     "sk-bpVg50afhh0TSnh3EgewxTyiUgN_5ZiJc8iMx5QqI2T3BlbkFJrTZEo-YBWqDSMnfFbHYtJAn8RgktF9INtMjGjUVwYA",
//   dangerouslyAllowBrowser: true,
// });
// const MAX_KEEP_IMAGES = 3;

// const DallEImageGenerator = () => {
//   const [generatedImages, setGeneratedImages] = useState([]); // Store current generated images
//   const [keptImages, setKeptImages] = useState([]); // Store user "kept" images
//   const [loading, setLoading] = useState(false); // Handle loading state
//   const [error, setError] = useState(null); // Handle errors

//   // Function to generate 3 new images
//   const generateImages = async () => {
//     setLoading(true);
//     setError(null); // Reset previous errors
//     try {
//       const response = await openai.images.generate({
//         model: "dall-e-2",
//         prompt: "a white siamese cat", // You can customize this prompt
//         n: 3, // Generate 3 images
//         size: "1024x1024",
//       });

//       const imageUrls = response.data.map((item) => item.url); // Extract image URLs
//       setGeneratedImages(imageUrls); // Update the generated images state
//     } catch (err) {
//       setError("Failed to generate images. Please try again.");
//       console.log(err);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to keep an image
//   const keepImage = (url) => {
//     if (keptImages.length >= MAX_KEEP_IMAGES) {
//       alert(`You can only keep a maximum of ${MAX_KEEP_IMAGES} images.`);
//       return;
//     }

//     if (!keptImages.includes(url)) {
//       setKeptImages((prevKeptImages) => [...prevKeptImages, url]);
//     }
//   };

//   // Function to regenerate images (it keeps the previously kept ones)
//   const regenerateImages = async () => {
//     // Ensure the kept images are retained
//     setGeneratedImages([]); // Clear out current generated images
//     await generateImages(); // Regenerate images
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-4">
//       <h2 className="text-2xl font-bold mb-4">DALL-E2 Image Generator</h2>

//       <button
//         onClick={generateImages}
//         className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 mb-4"
//         disabled={loading}
//       >
//         {loading ? "Generating..." : "Generate Images"}
//       </button>

//       {error && <p className="text-red-500 mb-4">{error}</p>}

//       {/* Show Kept Images */}
//       {keptImages.length > 0 && (
//         <div className="flex flex-wrap justify-center mt-4">
//           <h3 className="text-lg font-bold mb-2 w-full text-center">
//             Kept Images ({keptImages.length}/{MAX_KEEP_IMAGES})
//           </h3>
//           {keptImages.map((imageUrl, index) => (
//             <div key={index} className="m-2 w-32 h-32">
//               <img
//                 src={imageUrl}
//                 alt={`kept-${index}`}
//                 className="w-full h-full object-cover rounded-lg shadow-lg"
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Generated Images */}
//       {generatedImages.length > 0 && (
//         <div className="flex flex-wrap justify-center mt-4">
//           <h3 className="text-lg font-bold mb-2 w-full text-center">
//             Generated Images
//           </h3>
//           {generatedImages.map((imageUrl, index) => (
//             <div key={index} className="relative m-2 w-64 h-64">
//               <img
//                 src={imageUrl}
//                 alt={`generated-${index}`}
//                 className="w-full h-full object-cover rounded-lg shadow-lg"
//               />
//               <button
//                 onClick={() => keepImage(imageUrl)}
//                 className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
//               >
//                 Keep
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Regenerate Button */}
//       {generatedImages.length > 0 && keptImages.length < MAX_KEEP_IMAGES && (
//         <button
//           onClick={regenerateImages}
//           className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300 mt-4"
//           disabled={loading}
//         >
//           {loading ? "Regenerating..." : "Regenerate Images"}
//         </button>
//       )}

//       <p className="text-sm text-gray-500 mt-4">
//         You can keep a maximum of {MAX_KEEP_IMAGES} images.
//       </p>
//     </div>
//   );
// };

// export default DallEImageGenerator;
"use client";
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
// Make sure to import your Firebase config
import DB from "../../database/DB";
function CommunityScoreChecker() {
  const [communityID, setCommunityID] = useState("0xUi0rR83ka9F1pOg1to");
  // Function to check community score
  const checkCommunityScore = async (communityID) => {
    const communityRef = doc(DB, "communities", communityID);

    try {
      // Get the community document
      const docSnapshot = await getDoc(communityRef);

      if (docSnapshot.exists()) {
        const communityData = docSnapshot.data();
        const score = communityData.score || 0; // Default to 0 if score doesn't exist
        console.log(`Community ${communityID} has a score of: `, score);

        // Update lastCheck to current date after checking the score
        const today = new Date();
        await updateDoc(communityRef, { lastCheck: today });
        console.log("Community Score checked and lastCheck updated to:", today);
      } else {
        console.error("No such document for community:", communityID);
      }
    } catch (error) {
      console.error("Error fetching community score:", error);
    }
  };

  // Check if today is the first of the month
  const isFirstOfMonth = () => {
    const today = new Date();
    return today.getDate() === 1;
  };

  // Check if the score was already checked this month
  const shouldCheckScore = async (communityID) => {
    const communityRef = doc(DB, "communities", communityID);

    try {
      const docSnapshot = await getDoc(communityRef);

      if (docSnapshot.exists()) {
        const communityData = docSnapshot.data();
        const lastCheck = communityData.lastCheck
          ? new Date(communityData.lastCheck.seconds * 1000)
          : null;

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // If lastCheck exists, check if it is in the current month and year
        if (
          lastCheck &&
          lastCheck.getMonth() === currentMonth &&
          lastCheck.getFullYear() === currentYear
        ) {
          console.log(
            "Score has already been checked for this month. Skipping..."
          );
          return false; // No need to check again
        }
        return true; // Need to check
      } else {
        console.error("Community document does not exist!");
        return false; // No document, no check
      }
    } catch (error) {
      console.error("Error checking lastCheck:", error);
      return false; // Error, don't check
    }
  };

  // useEffect to run the check only on the first of each month and only if it hasn't been checked
  useEffect(() => {
    console.log("About to check");
    const checkIfNeeded = async () => {
      if (isFirstOfMonth()) {
        const shouldCheck = await shouldCheckScore(communityID);
        if (shouldCheck) {
          await checkCommunityScore(communityID); // Perform score check and update lastCheck
        }
      } else {
        console.log("its not the first of the month");
      }
    };

    checkIfNeeded(); // Call the function to see if a check is needed
  }, [communityID]);

  return (
    <>
      <h1>Checkher bro</h1>
    </>
  );
}

export default CommunityScoreChecker;
