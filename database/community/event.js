import DB from "../DB";
import { StorageDB } from "../StorageDB";
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
import { v4 } from "uuid";

export default class EventDB {
  static deleteEvent = async (id) => {
    await deleteDoc(doc(DB, "events", id));
  };

  static createEvent = async (eventObject) => {
    // Ensure the status field is included with a default value if not provided
    const eventWithStatus = {
      ...eventObject,
      status: eventObject.status || "active",
    };

    try {
      const eventRef = await addDoc(collection(DB, "events"), eventWithStatus);
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

  static updateEventStatus = async (id, status) => {
    const eventRef = doc(DB, "events", id);

    try {
      // Update the status field
      await updateDoc(eventRef, {
        status: status,
      });
      console.log("Event status updated successfully.");
    } catch (error) {
      console.error("Error updating event status:", error);
      throw error;
    }
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
        const data = doc.data();
        const object2 = { id: doc.id };
        eventsArray.push({ ...object2, ...data });
      });

      setEvents(eventsArray);
    } catch (error) {
      console.error("Error getting Event Data: ", error);
      alert(error);
    }
  };
}
