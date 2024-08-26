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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import StorageDB from "../StorageDB";

export default class EventDB {
  static deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(DB, "events", id));
      console.log(`Event ${id} deleted successfully.`);
    } catch (e) {
      console.error("Error deleting document:", e);
      throw e;
    }
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
      console.error("Error adding document:", e);
      throw e;
    }
  };

  static editEvent = async (eventID, eventObject) => {
    const eventRef = doc(DB, "events", eventID);
    try {
      await updateDoc(eventRef, eventObject);
      console.log(`Event ${eventID} updated successfully.`);
    } catch (e) {
      console.error("Error updating document:", e);
      throw e;
    }
  };

  static updateEventStatus = async (id, status) => {
    const eventRef = doc(DB, "events", id);
    try {
      await updateDoc(eventRef, { status });
      console.log("Event status updated successfully.");
    } catch (e) {
      console.error("Error updating event status:", e);
      throw e;
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
    } catch (e) {
      console.error("Error getting event data:", e);
      throw e;
    }
  };

  static addRSVP = async (eventID, email) => {
    const eventRef = doc(DB, "events", eventID);
    try {
      await updateDoc(eventRef, {
        rsvp: arrayUnion(email),
      });
      console.log("RSVP added successfully.");
    } catch (e) {
      console.error("Error adding RSVP:", e);
      throw e;
    }
  };

  static removeRSVP = async (eventID, email) => {
    const eventRef = doc(DB, "events", eventID);
    try {
      await updateDoc(eventRef, {
        rsvp: arrayRemove(email),
      });
      console.log("RSVP removed successfully.");
    } catch (e) {
      console.error("Error removing RSVP:", e);
      throw e;
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
    } catch (e) {
      console.error("Error checking RSVP status:", e);
      throw e;
    }
  };

  static getRSVPList = async (eventID) => {
    const eventRef = doc(DB, "events", eventID);
    try {
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        console.log("RSVP Data:", eventData.rsvp); // Debugging line
        return eventData.rsvp || [];
      }
      return [];
    } catch (e) {
      console.error("Error getting RSVP list:", e);
      throw e;
    }
  };

  static getEventRsvpEmails = async (eventID) => {
    const eventRef = doc(DB, "events", eventID);
    try {
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        return eventData.rsvp || [];
      }
      return [];
    } catch (e) {
      console.error("Error getting RSVP emails:", e);
      throw e;
    }
  };

  // Function to add a new review
  static addReview = async (documentId, imageUrls, newReview) => {
    // Reference to the document where you want to add the review
    const reviewDocRef = doc(DB, "events", documentId); // Replace 'yourCollection' with your collection name
    newReview.ReviewImages = imageUrls;
    try {
      // Add the new review to the 'Reviews' array field
      await updateDoc(reviewDocRef, {
        Reviews: arrayUnion(newReview), // Use arrayUnion to avoid duplicates
      });
      console.log("Review added successfully");
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  static handleImageUpload = async (
    document_id,
    array_files,
    review_object
  ) => {
    // const files = Array.from(event.target.files);

    // Array to hold URLs of uploaded images
    const imageUrls = [];

    for (const file of array_files) {
      // Create a storage reference
      const storageRef = ref(StorageDB, `images/${file.name}`);

      try {
        // Upload file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const url = await getDownloadURL(snapshot.ref);
        imageUrls.push(url);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    // Optionally, store the image URLs in Firestore or use them as needed
    console.log("Uploaded image URLs:", imageUrls);
    EventDB.addReview(document_id, imageUrls, review_object);
  };

  // static addImagesToFirestore = async (
  //   documentId,
  //   imageUrls,
  //   review_object
  // ) => {
  //   const docRef = doc(DB, "events", documentId); // Replace with your collection and document ID

  //   try {
  //     await updateDoc(docRef, {
  //       Images: arrayUnion(...imageUrls), // Add new image URLs to the existing array
  //     });
  //     console.log("Image URLs added to Firestore successfully");
  //   } catch (error) {
  //     console.error("Error adding image URLs to Firestore:", error);
  //   }
  // };
}
