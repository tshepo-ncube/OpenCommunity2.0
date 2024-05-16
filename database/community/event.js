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
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  runTransaction,
} from "firebase/firestore";

import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
//import { truncateSync } from "fs";
import { v4 } from "uuid";

export default class EventDB {
  static deleteEvent = async (id) => {
    await deleteDoc(doc(DB, "events", id));
  };

  static createEvent = async (eventObject) => {
    try {
      const eventRef = await addDoc(collection(DB, "events"), eventObject);
      console.log("Document ID: ", eventRef.id);
    } catch (e) {
      alert("error");
      console.log("Error adding document: ", e);
    }
  };

  static editEvent = async (eventID, eventObject) => {
    const eventRef = doc(DB, "events", eventID);

    await updateDoc(eventRef, eventObject);
  };

  static getEventFromCommunityID = async (communityID, setEvents) => {
    const eventsRef = collection(DB, "events");
    const q = query(eventsRef, where("CommunityID", "==", communityID));

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      let eventsArray = [];
      snapshot.forEach((doc) => {
        //console.log(doc.id, "=>", doc.data());

        const object2 = { id: doc.id };

        //const combinedObject = { ...object1, ...object2 };

        eventsArray.push({ ...object2, ...doc.data() });
      });

      setEvents(eventsArray);
    } catch (error) {
      console.error("Error getting Event Data: ", error);
      alert(error);
    }
  };
}
