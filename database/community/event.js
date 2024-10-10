// EventDB.jsx
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
  Timestamp,
  arrayRemove,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import StorageDB from "../StorageDB";
import UserDB from "./users";
import { eventScheduler, pollScheduler } from "../../Utils/scheduleEmails";
import { notify } from "../../Utils/Notification/notification";
import {
  notifyRsvpdUsersOfEventChange,
  notifyCommunityOfEventChange,
} from "../../Utils/Notification/notification";
import CommunityDB from "./community";

export default class EventDB {
  static convertToFirebaseTimestamp = (dateString) => {
    // Convert string date like "2024-09-28T01:46" to Firestore Timestamp
    return Timestamp.fromDate(new Date(dateString));
  };
  static prepareEventDataForFirebase = (data) => {
    console.log("prepareEventData for firebase", data);
    return {
      Name: data.eventName,
      StartDate: EventDB.convertToFirebaseTimestamp(data.startDateTime),
      EndDate: EventDB.convertToFirebaseTimestamp(data.endDateTime),
      RsvpEndTime: EventDB.convertToFirebaseTimestamp(data.rsvpEndDateTime),
      Location: data.location,
      EventDescription: data.description,
      status: data.status,
    };
  };
  // Existing methods...

  static editEventFromUI = async (eventData) => {
    //convertToFirebaseTimestamp();

    // console.log("THIS IS EVENT DATA: ", eventData);
    // return;
    const id = eventData.eventID;
    const eventObjectForFirebase =
      EventDB.prepareEventDataForFirebase(eventData);
    console.log(eventObjectForFirebase);
    // var object = {
    //   Name: data.eventName,
    //   startDateTime: convertToFirebaseTimestamp(data.startDateTime),
    //   endDateTime: convertToFirebaseTimestamp(data.endDateTime),
    //   rsvpEndDateTime: convertToFirebaseTimestamp(data.rsvpEndDateTime),
    //   location: data.location,
    //   description: data.description,
    //   status: data.status,
    // };

    console.log(id, eventObjectForFirebase);
    EventDB.editEvent(id, eventObjectForFirebase);
  };

  static deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(DB, "events", id));
      console.log(`Event ${id} deleted successfully.`);
    } catch (e) {
      console.error("Error deleting document:", e);
      throw e;
    }
  };

  static editEvent = async (id, object) => {
    try {
      const eventRef = doc(DB, "events", id);

      console.log("about to update an event");
      // Update the community document
      await updateDoc(eventRef, object);
      console.log("Done editing an event.");

      const boolString = localStorage.getItem(`EDIT_EVENT_RSVP_CLOSED_${id}`);

      // Convert the string into a boolean
      const boolValue = boolString === "true";

      console.log(boolValue);

      const docSnap = await getDoc(eventRef);
      if (docSnap.exists()) {
        console.log("Event Data:", docSnap.data());
        if (boolValue) {
          console.log("RSVP closed, so send notification to oONLY rsvps");

          notifyRsvpdUsersOfEventChange(id);
        } else {
          console.log(
            "RSVP still open, so send notification to entire community"
          );
          notifyCommunityOfEventChange(docSnap.data().CommunityID);
        }
      } else {
        // Document does not exist
        console.log("No such document!");
      }

      //  handleSnackbarClick();
      window.location.reload();
    } catch (err) {
      console.log("Error Editing Snackbar : ", err);
    }
  };

  static createEvent = async (eventObject, selectedImage) => {
    if (variable instanceof File) {
      // The variable is a File
      console.log("event imag is a file");
      const eventImage = await EventDB.uploadEventImage(selectedImage);

      const eventWithStatus = {
        ...eventObject,
        status: eventObject.status || "active",
        EventImages: eventImage,
      };

      try {
        const eventRef = await addDoc(
          collection(DB, "events"),
          eventWithStatus
        );
        console.log("Document ID: ", eventRef.id);

        // eventScheduler(eventRef.id);
        // pollScheduler(eventRef.id);
      } catch (e) {
        console.error("Error adding document:", e);
        throw e;
      }
    } else {
      // The variable is not a File
      console.log("Event Image is AI gen");

      const eventWithStatus = {
        ...eventObject,
        status: eventObject.status || "active",
        EventImages: selectedImages,
      };

      try {
        const eventRef = await addDoc(
          collection(DB, "events"),
          eventWithStatus
        );
        console.log("Document ID: ", eventRef.id);

        // eventScheduler(eventRef.id);
        // pollScheduler(eventRef.id);
      } catch (e) {
        console.error("Error adding document:", e);
        throw e;
      }
    }

    const eventWithStatus = {
      ...eventObject,
      status: eventObject.status || "active",
      EventImages: eventImages,
    };

    try {
      const eventRef = await addDoc(collection(DB, "events"), eventWithStatus);
      console.log("Document ID: ", eventRef.id);

      // eventScheduler(eventRef.id);
      // pollScheduler(eventRef.id);
    } catch (e) {
      console.error("Error adding document:", e);
      throw e;
    }
  };

  // static uploadEventImages = async (eventID, imagesList) => {
  //   const storageRef = ref(StorageDB, `images/events/${eventID}/`);
  //   try {
  //     // Upload the file
  //     const snapshot = await uploadBytes(storageRef, image);

  //     // Get the download URL
  //     const downloadURL = await getDownloadURL(snapshot.ref);

  //     console.log("File available at", downloadURL);
  //     return downloadURL;
  //   } catch (err) {
  //     // setError(Failed to upload image: ${err.message});
  //     return "no image was saved to firebase";
  //   }
  // };

  static uploadEventImage = async (image) => {
    // Array to store the download URLs
    var downloadURL = "";

    // Create a unique reference for each image
    const storageRef = ref(StorageDB, `images/events/${image.name}`);

    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, image);

      // Get the download URL
      const url = await getDownloadURL(snapshot.ref);

      console.log(`Event Image available at`, url);

      // Add the download URL to the array
      downloadURL = url;
    } catch (err) {
      console.error(`Failed to upload image ${image.name}:`, err);
      //downloadURLs.push("Failed to upload");
      downloadURL = "Failed to upload";
    }

    // Return the array of download URLs (or errors)
    return downloadURL;
  };

  static createCommunity = async (item, image, setCommunities, setLoading) => {
    setLoading(true);
    const communityURL = await CommunityDB.uploadCommunityImage(image);
    const object = {
      users: [],
      name: item.name,
      description: item.description,
      category: item.category,
      status: item.status || "active", // Include status field with default value "active"
      communityImage: communityURL,
    };
    try {
      const docRef = await addDoc(collection(DB, "communities"), object);
      console.log("Document ID: ", docRef.id);
    } catch (e) {
      console.log("Error adding document: ", e);
    }

    await this.getAllCommunities(setCommunities, setLoading); // Wait for communities to be fetched
    setLoading(false);
  };

  // static editEvent = async (eventID, eventObject) => {
  //   const eventRef = doc(DB, "events", eventID);
  //   try {
  //     await updateDoc(eventRef, eventObject);
  //     console.log(`Event ${eventID} updated successfully.`);
  //   } catch (e) {
  //     console.error("Error updating document:", e);
  //     throw e;
  //   }
  // };

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
      UserDB.addPoints(10);

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
      UserDB.removePoints(10);
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
    const reviewDocRef = doc(DB, "events", documentId);

    // Add uploaded image URLs to the review object
    newReview.ReviewImages = imageUrls;

    try {
      // Add the new review to the 'Reviews' array field in Firestore
      await updateDoc(reviewDocRef, {
        Reviews: arrayUnion(newReview), // Use arrayUnion to avoid duplicates
      });
      console.log("Review added successfully");
      UserDB.addPoints(15); // Assuming this adds points to the user
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  // Function to handle image uploads and add the review
  static handleImageUpload = async (
    document_id,
    array_files,
    review_object
  ) => {
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

    // Get user details from local storage or any authenticated source
    const userName = localStorage.getItem("Name");
    const userSurname = localStorage.getItem("Surname");
    const userEmail = localStorage.getItem("Email");

    // Add user details to the review object
    const updatedReviewObject = {
      ...review_object,
      UserName: userName,
      UserSurname: userSurname,
      UserEmail: userEmail,
    };

    // Call addReview function to save the review with the uploaded image URLs and user details
    EventDB.addReview(document_id, imageUrls, updatedReviewObject);
  };

  // Function to add a comment with rating
  static addComment = async (eventID, comment, rating) => {
    const eventRef = doc(DB, "events", eventID);
    try {
      await updateDoc(eventRef, {
        Comments: arrayUnion({
          userEmail: "user@example.com", // Replace with the actual user email
          comment,
          rating,
        }),
      });
      console.log("Comment added successfully.");
    } catch (e) {
      console.error("Error adding comment:", e);
      throw e;
    }
  };

  // Function to fetch all comments and ratings for an event
  static getCommentsAndRatings = async (eventID) => {
    const eventRef = doc(DB, "events", eventID);
    try {
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        return eventData.Comments || [];
      }
      return [];
    } catch (e) {
      console.error("Error getting comments and ratings:", e);
      throw e;
    }
  };
}
