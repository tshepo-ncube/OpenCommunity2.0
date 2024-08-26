import DB from "../DB";
import { StorageDB } from "../StorageDB";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import ManageUser from "../auth/ManageUser";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
  getDocs,
  runTransaction,
} from "firebase/firestore";

import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
//import { truncateSync } from "fs";
import { v4 } from "uuid";

export default class AnalyticsDB {
  static getUsersDetailsByEmails = async (emails) => {
    const userDetailsList = [];

    try {
      // Reference to the collection where your documents are stored
      const usersRef = collection(DB, "users");

      for (const email of emails) {
        // Query for the document with the given email

        // const querySnapshot = await usersRef.where("Email", "==", email).get();

        const q = query(usersRef, where("Email", "==", email));

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.log(`No matching documents for email: ${email}`);

          continue;
        }

        // Assuming email is unique and we have only one matching document

        snapshot.forEach((doc) => {
          const userData = doc.data();

          const userDetails = {
            Email: userData.Email,
            Name: userData.Name,

            Surname: userData.Surname,

            Diet: userData.Diet,
            Allergies: userData.Allergies,
            Telephone: userData.Telephone,
          };

          userDetailsList.push(userDetails);
        });
      }
    } catch (error) {
      console.error("Error getting user details: ", error);
    }

    return userDetailsList;
  };
}
