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

export default class PollDB {
  static deletePoll = async (id) => {
    await deleteDoc(doc(DB, "polls", id));
  };

  static createPoll = async (pollObject) => {
    try {
      const pollRef = await addDoc(collection(DB, "polls"), pollObject);
      console.log("Document ID: ", pollRef.id);
    } catch (e) {
      console.log("Error adding document: ", e);
    }
  };

  static editPoll = async (pollID, pollObject) => {
    const pollRef = doc(DB, "polls", pollID);

    await updateDoc(pollRef, pollObject);
  };

  static getPollFromCommunityID = async (communityID, setPolls) => {
    const pollsRef = collection(DB, "polls");
    const q = query(pollsRef, where("CommunityID", "==", communityID));

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      let pollsArray = [];
      snapshot.forEach((doc) => {
        //console.log(doc.id, "=>", doc.data());

        const object2 = { id: doc.id };

        //const combinedObject = { ...object1, ...object2 };

        pollsArray.push({ ...object2, ...doc.data() });
      });

      setPolls(pollsArray);
    } catch (error) {
      console.error("Error getting poll Data: ", error);
      alert(error);
    }
  };
}
