import DB from "../DB";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
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

  static haveCommonItem = (arr1, arr2) => {
    console.log(arr1, arr2);
    const set1 = new Set(arr1);
    return arr2.some((item) => set1.has(item));
  };

  static RecommendedCommunities = async (setCommunities, setLoading) => {
    setLoading(true);
    if (typeof window === "undefined") return;

    const userDetails = await UserDB.getUser(localStorage.getItem("UserID"));

    console.log("userDetails :", userDetails);

    const communities = [];
    var i = 0;
    try {
      const querySnapshot = await getDocs(collection(DB, "communities"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // console.log("this is a community ", i);
        console.log(data);

        //console.log("data.selectedInterests : ", data.selectedInterests);

        // console.log(
        //   "Have commont item : ",
        //   this.haveCommonItem(data.selectedInterests, userDetails.Interests)
        // );

        if (this.haveCommonItem(data.selectedInterests, userDetails.Interests))
          console.log(
            "Found community user might be interested in. : ",
            data.name
          );

        {
          if (data.users.includes(localStorage.getItem("Email"))) {
            console.log("the user already joined the recommened communities");
          } else {
            communities.push({
              id: doc.id,
              name: data.name,
              description: data.description,
              category: data.category,
              status: data.status, // Include status in the fetched data
              communityImage: data.communityImage,
              selectedInterests: data.selectedInterests,
            });
          }
        }

        i += 1;
      });
      console.log("Length :", communities.length);
      //setCommunities(communities);
      setCommunities(communities.slice(0, 5));
      setLoading(false);
    } catch (e) {
      console.error("Error fetching communities: ", e);
      console.log("Length :", communities.length);
      //setCommunities(communities);
      setCommunities(communities.slice(0, 5));
      setLoading(false);
    }
  };

  static createCommunity = async (
    item,
    image,
    setCommunities,
    setLoading,
    selectedInterests,
    showSnackBar
  ) => {
    setLoading(true);
    const communityURL = await CommunityDB.uploadCommunityImage(image);
    const object = {
      users: [],
      name: item.name,
      description: item.description,
      category: item.category,
      status: item.status || "active", // Include status field with default value "active"
      communityImage: communityURL,
      selectedInterests: selectedInterests,
      createdAt: new Date(),
      admin: localStorage.getItem("Email"),
    };
    try {
      const docRef = await addDoc(collection(DB, "communities"), object);
      console.log("Document ID: ", docRef.id);
      showSnackBar(true);
    } catch (e) {
      console.log("Error adding document: ", e);
    }

    await this.getAllCommunities(setCommunities, setLoading); // Wait for communities to be fetched
    setLoading(false);
  };

  static editCommunity = async (id, object, image) => {
    const communityRef = doc(DB, "communities", id);

    if (image) {
      const new_image = await CommunityDB.uploadCommunityImage(image);

      object.communityImage = new_image;
    }

    console.log("about to update");
    // Update the community document
    console.log("The Object: ", object);
    await updateDoc(communityRef, object);
    console.log("Done editing a community.");
    location.reload();
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

        // const score = data.scoreEE;
        // var communityHot = false;

        //var counter = await CommunityDB.getUpcomingEventsCount(doc.id);
        communities.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status, // Include status in the fetched data
          communityImage: data.communityImage,
          selectedInterests: data.selectedInterests,

          //UpcomingEventsCount: counter,
          //Tshepo: "Tshspoe",
          //admin: data.admin,
          admin: data.admin ? data.admin : "no admin",
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
            selectedInterests: data.selectedInterests,
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
          selectedInterests: data.selectedInterests,
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
          UserDB.addCommunityToUserArray(CommunityData.id);
          ManageUser.joinCommunity(CommunityData.id);
          console.log("Community Users updated successfully.");

          UserDB.addPoints(5);
          //alert("Community Joined");
          window.location.href = window.location.href;
          return true;
        } catch (error) {
          console.error("Error updating community status:", error);
          return false;
          throw error;
        }
      }

      //console.log("Document data:", communityDoc.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return false;
    }

    return false;
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

  // static getAllCommunities = async (setCommunities, setLoading) => {
  //   setLoading(true);
  //   const communities = [];
  //   try {
  //     const querySnapshot = await getDocs(collection(DB, "communities"));
  //     querySnapshot.forEach(async (doc) => {
  //       var upcomingEventsCount = await CommunityDB.getUpcomingEventsCount(
  //         doc.id
  //       );
  //       if (upcomingEventsCount === undefined) {
  //         upcomingEventsCount = 0;
  //       }
  //       console.log("Upcoming events: ", upcomingEventsCount);
  //       const data = doc.data();
  //       communities.push({
  //         id: doc.id,
  //         name: data.name,
  //         description: data.description,
  //         category: data.category,
  //         status: data.status, // Include status in the fetched data
  //         users: data.users || [], // Ensure users field is included,
  //         communityImage: data.communityImage,
  //         UpcomingEventsCount: upcomingEventsCount,
  //       });
  //     });

  //     setCommunities(communities);
  //   } catch (e) {
  //     console.error("Error fetching communities: ", e);
  //   }
  //   setLoading(false);
  // };
  static getAllCommunities = async (setCommunities, setLoading) => {
    setLoading(true);
    const communities = [];

    let highestScore = -90; // To track the highest score
    let hotCommunityIndex = -1; // To track the index of the community with the highest score

    try {
      const querySnapshot = await getDocs(collection(DB, "communities"));

      for (const doc of querySnapshot.docs) {
        // let upcomingEventsCount = await CommunityDB.getUpcomingEventsCount(
        //   doc.id
        // );
        // if (upcomingEventsCount === undefined) {
        //   upcomingEventsCount = 0;
        // }
        //console.log("Upcoming events: ", upcomingEventsCount);

        const data = doc.data();
        // Check if score exists, if undefined assign a default value like 0
        const score = data.score !== undefined ? data.score : 0;

        communities.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status, // Include status in the fetched data
          users: data.users || [], // Ensure users field is included
          communityImage: data.communityImage,
          UpcomingEventCount: data.UpcomingEventCount
            ? data.UpcomingEventCount
            : 0,
          selectedInterests: data.selectedInterests,
          score: score,
          admin: data.admin ? data.admin : "no admin",
        });

        //Check if this community has the highest score
      }
      // Mark the community with the highest score as hot
      // if (hotCommunityIndex !== -1) {
      //   //communities[hotCommunityIndex].isHot = true; // Set isHot to true for the highest-scored community
      // }

      communities.sort((a, b) => (b.score || 0) - (a.score || 0));

      // Mark the first community (with the highest score) as `isHot: true`
      if (communities.length > 0) {
        communities[0].isHot = true;
      }
      setCommunities(communities);
    } catch (e) {
      console.error("Error fetching communities: ", e);
    }
    setLoading(false);
  };

  static decrementUpcomingEventCount = async (communityID) => {
    console.log("Community ID: ", communityID);
    console.log("starting incrementUpcomingEventCount transaction...");
    if (false) {
    }
    try {
      const communityRef = (0,
      firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.doc)(
        _DB__WEBPACK_IMPORTED_MODULE_0__["default"],
        "communities",
        communityID
      );
      // Reference to the community document
      console.log("CommunityRef:", communityRef);
      console.log("got ref");
      // Start a transaction
      await (0, firebase_firestore__WEBPACK_IMPORTED_MODULE_1__.runTransaction)(
        _DB__WEBPACK_IMPORTED_MODULE_0__["default"],
        async (transaction) => {
          console.log("run transaction ref");
          // Get the current data of the document
          const docSnapshot = await transaction.get(communityRef);
          // Check if the document exists
          if (!docSnapshot.exists()) {
            console.log("Community not exist");
            throw new Error("Community document does not exist!");
          }
          const CommunityData = docSnapshot.data();
          // Create a copy of the current community data
          const newCommunityData = {
            ...CommunityData,
          };
          // Ensure that a score field exists in the document, default to 0 if not present
          const currentUpcomingEventCount =
            newCommunityData.UpcomingEventCount || 0;
          // Increment the community score by the provided increment value
          newCommunityData.UpcomingEventCount = currentUpcomingEventCount - 1;
          // Update the document with the new community data and incremented score
          transaction.update(communityRef, {
            UpcomingEventCount: newCommunityData.UpcomingEventCount,
          });
        }
      );
      console.log("Community Upcoming Event incremented successfully!");
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

  static incrementUpcomingEventCount = async (communityID) => {
    console.log("Community ID: ", communityID);
    console.log("starting incrementUpcomingEventCount transaction...");
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
          console.log("Community not exist");
          throw new Error("Community document does not exist!");
        }

        const CommunityData = docSnapshot.data();

        // Create a copy of the current community data
        const newCommunityData = { ...CommunityData };

        // Ensure that a score field exists in the document, default to 0 if not present
        const currentUpcomingEventCount =
          newCommunityData.UpcomingEventCount || 0;

        // Increment the community score by the provided increment value
        newCommunityData.UpcomingEventCount = currentUpcomingEventCount + 1;

        // Update the document with the new community data and incremented score
        transaction.update(communityRef, {
          UpcomingEventCount: newCommunityData.UpcomingEventCount,
        });
      });

      console.log("Community Upcoming Event incremented successfully!");
    } catch (error) {
      console.error("Transaction failed: ", error);
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
          UserDB.addCommunityToUserArray(communityId);

          // alert("Community Joined");
          // window.location.href = window.location.href;
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
          //await UserDB.removePoints(5);
          UserDB.removeCommunityFromUserArray(communityId);
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

  static getUpcomingEventsCount = async (communityID) => {
    const eventsRef = collection(DB, "events");
    const q = query(eventsRef, where("CommunityID", "==", communityID));
    var counter = 0;
    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "past") {
        } else {
          counter += 1;
        }
      });

      return counter;
    } catch (e) {
      console.error("Error getting event data:", e);
      return 0;
      throw e;
    }

    return counter;
  };
}
