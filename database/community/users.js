import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  runTransaction,
  arrayRemove,
  arrayUnion,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import DB from "../DB";
import { Interests } from "@mui/icons-material";

export default class UserDB {
  static deleteUser = async (id) => {
    try {
      await deleteDoc(doc(DB, "Users", id));
      console.log("User deleted successfully.");
    } catch (e) {
      console.error("Error deleting user: ", e);
      alert("Error deleting user.");
    }
  };

  static createUser = async (userObject) => {
    try {
      const userRef = await addDoc(collection(DB, "Users"), userObject);
      console.log("User Document ID: ", userRef.id);
    } catch (e) {
      console.error("Error adding user: ", e);
      alert("Error adding user.");
    }
  };

  static editUser = async (userID, userObject) => {
    try {
      const userRef = doc(DB, "Users", userID);
      await updateDoc(userRef, userObject);
      console.log("User updated successfully.");
    } catch (e) {
      console.error("Error updating user: ", e);
      alert("Error updating user.");
    }
  };

  static getUser = async (userID) => {
    try {
      const userRef = doc(DB, "users", userID);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("No such user!");
        return null;
      }

      const userData = userDoc.data();
      console.log("User data retrieved:", userData); // Add this line for logging
      return {
        Name: userData.Name,
        Surname: userData.Surname,
        Email: userData.Email,
        Interests: userData.Interests,
      };
    } catch (e) {
      console.error("Error getting user data: ", e);
      alert("Error getting user data.");
    }
  };

  static getAllUsers = async () => {
    try {
      const usersCollection = collection(DB, "users");
      const usersSnapshot = await getDocs(usersCollection);
      //const usersList = usersSnapshot.docs.map((doc) => doc.data());
      const usersList = usersSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Extract only Name, Surname, and Points
      return usersList.map((user) => ({
        Name: user.Name,
        Surname: user.Surname,
        Points: user.Points,
        profileImage: user.profileImage,
        Email: user.Email,
        Role: user.Role ? user.Role : "user",
        id: user.id,
      }));
    } catch (e) {
      console.error("Error getting users: ", e);
      alert("Error getting users.");
    }
  };

  static addPoints = async (point) => {
    if (typeof window === "undefined") return;

    const userRef = doc(DB, "users", localStorage.getItem("UserID"));

    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      await runTransaction(DB, async (transaction) => {
        // Get the current data of the document
        const docSnapshot = await transaction.get(userRef);

        // Check if the document exists
        if (!docSnapshot.exists()) {
          throw new Error("Poll document does not exist!");
        }

        const userData = docSnap.data();

        // Creating a copy of pollData instead of a reference.
        const newUserData = JSON.parse(JSON.stringify(userData));

        // Check if the 'Points' field exists and is a number, if not set it to 0
        if (typeof newUserData.Points === "undefined") {
          newUserData.Points = 0;
        }

        // Increment 'Points' by 5
        newUserData.Points += point;

        console.log(newUserData);

        // Update the document with the new poll data
        transaction.update(userRef, newUserData);
      });
    } else {
      console.log(`${localStorage.getItem("UserID")} does not exist!`);
    }
  };

  // static addCommunityToUserArray = async (communityID) => {
  //   // try {
  //   //   const userRef = doc(DB, "users", localStorage.getItem("UserID"));
  //   //   await updateDoc(userRef, userObject);
  //   //   console.log("User updated successfully.");
  //   // } catch (e) {
  //   //   console.error("Error updating user: ", e);
  //   //   alert("Error updating user.");
  //   // }
  //   console.log("addCommunityToUserArray");
  //   try {
  //     const userRef = doc(DB, "users", localStorage.getItem("UserID"));
  //     await updateDoc(userRef, {
  //       CommunitiesJoined: arrayUnion(communityID),
  //     });
  //     console.log(
  //       "Community added successfully to the user's CommunitiesJoined array."
  //     );
  //   } catch (e) {
  //     console.error("Error updating user: ", e);
  //     alert("Error updating user.");
  //   }
  // };

  static addCommunityToUserArray = async (communityID) => {
    try {
      const userRef = doc(DB, "users", localStorage.getItem("UserID"));
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const communitiesJoined = userData.CommunitiesJoined || [];

        if (communitiesJoined.length < 20) {
          await updateDoc(userRef, {
            CommunitiesJoined: arrayUnion(communityID),
          });
          console.log(
            "Community added successfully to the user's CommunitiesJoined array."
          );
        } else {
          console.log(
            "The user is already a member of 20 communities. Cannot add more."
          );
          alert("You cannot join more than 20 communities.");
        }
      } else {
        console.log("User document does not exist.");
        alert("User document not found.");
      }
    } catch (e) {
      console.error("Error updating user: ", e);
      alert("Error updating user.");
    }
  };

  static removeCommunityFromUserArray = async (communityID) => {
    try {
      const userID = localStorage.getItem("UserID");
      console.log(
        `Attempting to remove communityID: ${communityID} for user: ${userID}`
      );
      const userRef = doc(DB, "users", userID);

      await updateDoc(userRef, {
        CommunitiesJoined: arrayRemove(communityID),
      });

      console.log(
        "Community removed successfully from the user's CommunitiesJoined array."
      );
    } catch (e) {
      console.error("Error removing community from user: ", e);
      alert("Error removing community.");
    }
  };

  static removePoints = async (point) => {
    if (typeof window === "undefined") return;

    const userRef = doc(DB, "users", localStorage.getItem("UserID"));

    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      await runTransaction(DB, async (transaction) => {
        // Get the current data of the document
        const docSnapshot = await transaction.get(userRef);

        // Check if the document exists
        if (!docSnapshot.exists()) {
          throw new Error("Poll document does not exist!");
        }

        const userData = docSnap.data();

        // Creating a copy of pollData instead of a reference.
        const newUserData = JSON.parse(JSON.stringify(userData));

        // Check if the 'Points' field exists and is a number, if not set it to 0
        if (typeof newUserData.Points === "undefined") {
          newUserData.Points = 0;
        }

        // Increment 'Points' by 5
        newUserData.Points -= point;

        console.log(newUserData);

        // Update the document with the new poll data
        transaction.update(userRef, newUserData);
      });
    } else {
      console.log(`${localStorage.getItem("UserID")} does not exist!`);
    }
  };
}
