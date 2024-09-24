import DB from "../DB";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default class RecommendationDB {
  // Function to create a recommendation
  static createRecommendation = async (
    name,
    description,
    additionalData = {}
  ) => {
    if (typeof window === "undefined") return;

    const userEmail = localStorage.getItem("Email"); // Get the logged-in user's email

    if (!userEmail) {
      throw new Error("User email not found. Please log in.");
    }

    const recommendationObject = {
      name,
      description,
      userEmail, // Include the user's email in the recommendation
      category: additionalData.category, // Include the category from additionalData
      createdAt: new Date(), // Timestamp for when the recommendation was created
    };

    try {
      // Add the recommendation to the "recommendations" collection in Firestore
      const recommendationRef = await addDoc(
        collection(DB, "recommendations"),
        recommendationObject
      );
      console.log("Recommendation created with ID: ", recommendationRef.id);
    } catch (e) {
      console.error("Error adding recommendation:", e);
      throw e;
    }
  };
  // Function to delete a recommendation by ID
  static deleteRecommendation = async (id) => {
    try {
      await deleteDoc(doc(DB, "recommendations", id));
      console.log(`Recommendation ${id} deleted successfully.`);
    } catch (e) {
      console.error("Error deleting recommendation:", e);
      throw e;
    }
  };

  // Function to edit/update a recommendation by ID
  static editRecommendation = async (id, updatedData) => {
    const recommendationRef = doc(DB, "recommendations", id);
    try {
      await updateDoc(recommendationRef, updatedData);
      console.log(`Recommendation ${id} updated successfully.`);
    } catch (e) {
      console.error("Error updating recommendation:", e);
      throw e;
    }
  };

  // Function to get a recommendation by ID
  static getRecommendationByID = async (id) => {
    const recommendationRef = doc(DB, "recommendations", id);
    try {
      const recommendationDoc = await getDoc(recommendationRef);
      if (recommendationDoc.exists()) {
        console.log("Recommendation Data:", recommendationDoc.data());
        return recommendationDoc.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (e) {
      console.error("Error getting recommendation:", e);
      throw e;
    }
  };

  // Function to get all recommendations
  static getAllRecommendations = async () => {
    try {
      const recommendationsSnapshot = await getDocs(
        collection(DB, "recommendations")
      );
      let recommendationsArray = [];
      recommendationsSnapshot.forEach((doc) => {
        recommendationsArray.push({ id: doc.id, ...doc.data() });
      });
      console.log("All Recommendations:", recommendationsArray);
      return recommendationsArray;
    } catch (e) {
      console.error("Error getting recommendations:", e);
      throw e;
    }
  };

  // Function to query recommendations by user email
  static getRecommendationsByEmail = async (userEmail) => {
    const recommendationsRef = collection(DB, "recommendations");
    const q = query(recommendationsRef, where("userEmail", "==", userEmail));

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("No matching documents.");
        return [];
      }

      let recommendationsArray = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        recommendationsArray.push({ id: doc.id, ...data });
      });

      console.log("Recommendations for user:", recommendationsArray);
      return recommendationsArray;
    } catch (e) {
      console.error("Error querying recommendations:", e);
      throw e;
    }
  };
}
