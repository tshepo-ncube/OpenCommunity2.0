import DB from "../DB";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import ManageUser from "../auth/ManageUser";
import UserDB from "./users";
import StorageDB from "../StorageDB";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default class CommunityDB {
  static testFunction = () => {
    console.log("----------------------------------------------");
    console.log("Test function works!");
    console.log("----------------------------------------------");
  };
  static incrementCommunityScore = async (communityID, incrementValue) => {
    console.log("starting transaction soon...");
    if (typeof window === "undefined") return;
    try {
      const communityRef = doc(DB, "communities", communityID); // Reference to the community document
      console.log("CommunityRef:", communityRef);

      console.log("got ref");

      // Start a transaction
      await runTransaction(DB, async (transaction) => {
        console.log("run transaction ref");
        // Get the current data of the document
        const docSnapshot = await transaction.get(communityRef);

        // Check if the document exists
        if (!docSnapshot.exists()) {
          throw new Error("Community document does not exist!");
        }

        const CommunityData = docSnapshot.data();

        // Create a copy of the current community data
        const newCommunityData = { ...CommunityData };

        // Ensure that a score field exists in the document, default to 0 if not present
        const currentScore = newCommunityData.score || 0;

        // Increment the community score by the provided increment value
        newCommunityData.score = currentScore + incrementValue;

        // Update the document with the new community data and incremented score
        transaction.update(communityRef, { score: newCommunityData.score });
      });

      console.log("Community Score incremented successfully!");
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };
  static uploadCommunityImage = async (image) => {
    const storageRef = ref(StorageDB, `images/${image.name}`);
    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, image);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("File available at", downloadURL);
      return downloadURL;
    } catch (err) {
      // setError(Failed to upload image: ${err.message});
      return "no image was saved to firebase";
    }
  };

  static RecommendedCommunities = async (setCommunities) => {
    if (typeof window === "undefined") return;

    const userDetails = await UserDB.getUser(localStorage.getItem("UserID"));
    //the above line of code is an array of Interests, which all belong to the interests below
    //e.g. userDetails = ["Running","Yoga"]
    // console.log(userDetails);
    console.log("userDetails :", userDetails);

    const interests = [
      { interest: "Running", category: "Sports" },
      { interest: "Yoga", category: "Sports" },
      { interest: "Team Sports", category: "Sports" },
      { interest: "Strength Training", category: "Sports" },
      { interest: "Outdoor Adventure", category: "Sports" },

      { interest: "Movies and TV", category: "General" },
      { interest: "Reading", category: "General" },
      { interest: "Music", category: "General" },
      { interest: "Cooking", category: "General" },
      { interest: "Board Games", category: "General" },

      { interest: "Team-Building Activities", category: "Social" },
      { interest: "Workshops", category: "Social" },
      { interest: "Outdoor Activities", category: "Social" },
      { interest: "Cultural Experiences", category: "Social" },
      { interest: "Relaxation Sessions", category: "Social" },

      { interest: "Networking", category: "Development" },
      {
        interest: "Workshops and Seminars",
        category: "Development",
      },
      { interest: "Public Speaking", category: "Development" },
      { interest: "Leadership Training", category: "Development" },
      { interest: "Mentorship", category: "Development" },
    ];

    //now I would like to get communities with a category belonging to the interests of userDetails
    //not all the communities

    const userInterestCategories = interests
      .filter((interestObj) =>
        userDetails.Interests.includes(interestObj.interest)
      ) // Get interest objects for the user's interests
      .map((interestObj) => interestObj.category); // Extract the categories

    // Remove duplicates in categories
    const uniqueCategories = [...new Set(userInterestCategories)];

    console.log("unique Cate: ", uniqueCategories);

    // Step 2: Fetch communities and filter based on matching categories
    const communities = [];
    try {
      const querySnapshot = await getDocs(collection(DB, "communities"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Only push communities that match one of the user's interest categories
        if (uniqueCategories.includes(data.category)) {
          communities.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            category: data.category,
            status: data.status, // Include status in the fetched data
            communityImage: data.communityImage,
          });
        }
      });
      setCommunities(communities);
    } catch (e) {
      console.error("Error fetching communities: ", e);
      setCommunities([]);
    }

    // const communities = [];
    // try {
    //   const querySnapshot = await getDocs(collection(DB, "communities"));
    //   querySnapshot.forEach((doc) => {
    //     const data = doc.data();
    //     communities.push({
    //       id: doc.id,
    //       name: data.name,
    //       description: data.description,
    //       category: data.category,
    //       status: data.status, // Include status in the fetched data
    //       communityImage: data.communityImage,
    //     });
    //   });
    // } catch (e) {
    //   console.error("Error fetching communities: ", e);
    // }
  };

  static createCommunity = async (item, image, setCommunities, setLoading) => {
    setLoading(true);
    const communityURL = await CommunityDB.uploadCommunityImage(image);
    const object = {
      users: [],
      name: item.name,
      description: item.description,
      category: item.category,
      status: item.status || "active", // Include status field with default value "active"
      communityImage: communityURL,
    };
    try {
      const docRef = await addDoc(collection(DB, "communities"), object);
      console.log("Document ID: ", docRef.id);
    } catch (e) {
      console.log("Error adding document: ", e);
    }

    await this.getAllCommunities(setCommunities, setLoading); // Wait for communities to be fetched
    setLoading(false);
  };

  static editCommunity = async (id, object) => {
    const communityRef = doc(DB, "communities", id);

    console.log("about to update");
    // Update the community document
    await updateDoc(communityRef, object);
    console.log("Done editing a community.");
  };

  static deleteCommunity = async (id) => {
    // Delete the community document
    await deleteDoc(doc(DB, "communities", id));
  };

  static updateCommunityStatus = async (id, status) => {
    const communityRef = doc(DB, "communities", id);

    try {
      // Update the status field
      await updateDoc(communityRef, {
        status: status,
      });
      console.log("Community status updated successfully.");
    } catch (error) {
      console.error("Error updating community status:", error);
      throw error;
    }
  };

  static getAllCommunities = async (setCommunities, setLoading) => {
    setLoading(true);
    const communities = [];
    try {
      const querySnapshot = await getDocs(collection(DB, "communities"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        communities.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status, // Include status in the fetched data
          communityImage: data.communityImage,
        });
      });

      setCommunities(communities);
    } catch (e) {
      console.error("Error fetching communities: ", e);
    }
    setLoading(false);
  };

  static getAllAdminCommunities = async (setCommunities, setLoading) => {
    setLoading(true);
    const communities = [];
    const adminEmail = localStorage.getItem("Email"); // Get the current admin email

    try {
      const querySnapshot = await getDocs(collection(DB, "communities"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Only push communities where the admin field matches the logged-in admin's email
        if (data.admin === adminEmail) {
          communities.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            category: data.category,
            status: data.status, // Include status in the fetched data
            communityImage: data.communityImage,
          });
        }
      });

      setCommunities(communities);
    } catch (e) {
      console.error("Error fetching communities: ", e);
    }
    setLoading(false);
  };

  static getHottestCommunity = async (setHotCommunity) => {
    let hottestCommunity = null;

    try {
      const querySnapshot = await getDocs(collection(DB, "communities"));

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Assign a score of 0 if the community has no score field
        const community = {
          id: doc.id,
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status, // Include status in the fetched data
          communityImage: data.communityImage,
          score: data.score || 0, // Assign 0 if score is undefined or null
        };

        // Compare score and track the community with the highest score
        if (!hottestCommunity || community.score > hottestCommunity.score) {
          hottestCommunity = community;
        }
      });

      // Set the hottest community (the one with the highest score)
      setHotCommunity(hottestCommunity);
    } catch (e) {
      console.error("Error fetching communities: ", e);
    }
  };

  static joinCommunity = async (CommunityData) => {
    if (typeof window === "undefined") return;

    const communityRef = doc(DB, "communities", CommunityData.id);

    const communityDoc = await getDoc(communityRef);

    if (communityDoc.exists()) {
      const communityData = communityDoc.data();
      let users = communityData.users;
      const currentUser = localStorage.getItem("Email");
      if (users.includes(currentUser)) {
        alert("You already joined the community.");
      } else {
        users.push(currentUser);

        console.log("users: ", users);

        try {
          // Update the status field
          await updateDoc(communityRef, {
            users: users,
          });
          ManageUser.joinCommunity(CommunityData.id);
          console.log("Community Users updated successfully.");
          UserDB.addPoints(5);
        } catch (error) {
          console.error("Error updating community status:", error);
          throw error;
        }
      }

      //console.log("Document data:", communityDoc.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  static getAllUserCommunities = async (
    JoinedCommunities,
    setJoinedCommunities
  ) => {
    console.log("getAllUserCommunities, ", JoinedCommunities);
    // Assuming DB is your Firestore instance
    const communitiesCollection = collection(DB, "communities");

    const promises = JoinedCommunities.map(async (id) => {
      try {
        const docRef = doc(communitiesCollection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log(docSnap.id, "=>", docSnap.data());
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          console.log("Document does not exist for ID:", id);
          return null; // or handle as needed
        }
      } catch (error) {
        console.error("Error fetching document:", id, error);
        throw error; // or handle as needed
      }
    });

    // Execute all promises concurrently
    try {
      const results = await Promise.all(promises);
      console.log("All Communities fetched:", results);
      setJoinedCommunities(results);
      // Handle results here
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Handle error here
    }
  };

  static updateCommunityStatus = async (id, status) => {
    const communityRef = doc(DB, "communities", id);
    try {
      await updateDoc(communityRef, {
        status: status,
      });
      console.log("Community status updated successfully.");
    } catch (error) {
      console.error("Error updating community status:", error);
      throw error;
    }
  };

  static joinCommunity = async (communityId, userEmail) => {
    const communityRef = doc(DB, "communities", communityId);
    const communityDoc = await getDoc(communityRef);

    if (communityDoc.exists()) {
      const communityData = communityDoc.data();
      let users = communityData.users || [];

      if (users.includes(userEmail)) {
        // User already joined
        return { success: false, message: "You already joined the community." };
      } else {
        users.push(userEmail);

        try {
          await updateDoc(communityRef, {
            users: users,
          });
          console.log("Community Users updated successfully.");
          UserDB.addPoints(5);
          return {
            success: true,
            message: "You have successfully joined the community!",
          };
        } catch (error) {
          console.error("Error updating community users:", error);
          throw error;
        }
      }
    } else {
      console.log("No such document!");
      return { success: false, message: "Community does not exist." };
    }
  };

  static leaveCommunity = async (communityId, userEmail) => {
    const communityRef = doc(DB, "communities", communityId);
    const communityDoc = await getDoc(communityRef);

    if (communityDoc.exists()) {
      const communityData = communityDoc.data();
      let users = communityData.users || [];

      if (!users.includes(userEmail)) {
        // User is not in the community
        return {
          success: false,
          message: "You are not a member of this community.",
        };
      } else {
        users = users.filter((user) => user !== userEmail);

        try {
          await updateDoc(communityRef, {
            users: users,
          });
          console.log("User removed from community successfully.");
          UserDB.removePoints(5);
          return {
            success: true,
            message: "You have successfully left the community.",
          };
        } catch (error) {
          console.error("Error updating community users:", error);
          throw error;
        }
      }
    } else {
      console.log("No such document!");
      return { success: false, message: "Community does not exist." };
    }
  };

  static getAllUserCommunities = async (
    joinedCommunities,
    setJoinedCommunities
  ) => {
    console.log("getAllUserCommunities, ", joinedCommunities);
    const communitiesCollection = collection(DB, "communities");

    const promises = joinedCommunities.map(async (id) => {
      try {
        const docRef = doc(communitiesCollection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log(docSnap.id, "=>", docSnap.data());
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          console.log("Document does not exist for ID:", id);
          return null;
        }
      } catch (error) {
        console.error("Error fetching document:", id, error);
        throw error;
      }
    });

    try {
      const results = await Promise.all(promises);
      console.log("All Communities fetched:", results);
      setJoinedCommunities(results);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  static getCommunityUsers = async (communityId) => {
    try {
      const communityRef = doc(DB, "communities", communityId);
      const communityDoc = await getDoc(communityRef);

      if (communityDoc.exists()) {
        const communityData = communityDoc.data();
        return {
          success: true,
          users: communityData.users || [],
          message: "Users retrieved successfully.",
        };
      } else {
        console.log("No such community!");
        return {
          success: false,
          users: [],
          message: "Community does not exist.",
        };
      }
    } catch (error) {
      console.error("Error fetching community users:", error);
      return {
        success: false,
        users: [],
        message: "Error fetching community users.",
      };
    }
  };

  static getCommunity = async (communityID, setCommunities) => {
    const communityRef = doc(DB, "communities", communityID);
    const docSnap = await getDoc(communityRef);

    try {
      if (docSnap.exists()) {
        console.log(docSnap.data());
        setCommunities(docSnap.data());
      } else {
        console.log("Community does not exists");
      }
    } catch (error) {
      console.log(error);
    }
  };
}
