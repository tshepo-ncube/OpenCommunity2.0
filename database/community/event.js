import DB from "../DB";
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
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export default class EventDB {
  static deleteEvent = async (id) => {
    await deleteDoc(doc(DB, "events", id));
  };

  static createEvent = async (eventObject) => {
    const eventWithStatus = {
      ...eventObject,
      status: eventObject.status || "active",
    };

    try {
      const eventRef = await addDoc(collection(DB, "events"), eventWithStatus);
      console.log("Document ID: ", eventRef.id);
    } catch (e) {
      alert("Error adding document");
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
      await updateDoc(eventRef, { status });
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

  static addRSVP = async (eventID, email) => {
    const eventRef = doc(DB, "events", eventID);

    try {
      await updateDoc(eventRef, {
        rsvp: arrayUnion(email),
      });
      console.log("RSVP added successfully.");
    } catch (error) {
      console.error("Error adding RSVP:", error);
      throw error;
    }
  };

  static removeRSVP = async (eventID, email) => {
    const eventRef = doc(DB, "events", eventID);

    try {
      await updateDoc(eventRef, {
        rsvp: arrayRemove(email),
      });
      console.log("RSVP removed successfully.");
    } catch (error) {
      console.error("Error removing RSVP:", error);
      throw error;
    }
  };

  static isUserRSVPed = async (eventID, email) => {
    const eventRef = doc(DB, "events", eventID);

    try {
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        return eventData.rsvp && eventData.rsvp.includes(email);
      }
      return false;
    } catch (error) {
      console.error("Error checking RSVP status:", error);
      throw error;
    }
  };
}
