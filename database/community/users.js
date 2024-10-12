import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  runTransaction,
  updateDoc,
  getDocs,
  query, // Import the query function
  where, // Import the where function
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

      // Map through each document and extract user data, including the document ID
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id, // Add the document ID here
        Name: doc.data().Name,
        Surname: doc.data().Surname,
        Points: doc.data().Points,
        Email: doc.data().Email,
        Role: doc.data().Role,
        profileImage: doc.data().profileImage,
      }));

      return usersList; // Return the list with document IDs included
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
