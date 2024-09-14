import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import DB from "../DB";

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
      const userRef = doc(DB, "Users", userID);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("No such user!");
        return null;
      }

      return userDoc.data();
    } catch (e) {
      console.error("Error getting user data: ", e);
      alert("Error getting user data.");
    }
  };

  static getAllUsers = async (setUsers) => {
    try {
      const usersRef = collection(DB, "Users");
      const snapshot = await getDocs(usersRef);

      if (snapshot.empty) {
        console.log("No users found.");
        setUsers([]);
        return;
      }

      let usersArray = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Document data: ", data); // Debugging statement
        usersArray.push({ id: doc.id, ...data });
      });

      console.log("Fetched users: ", usersArray); // Debugging statement
      setUsers(usersArray);
    } catch (error) {
      console.error("Error getting users: ", error);
      alert("Error getting users.");
    }
  };
}
