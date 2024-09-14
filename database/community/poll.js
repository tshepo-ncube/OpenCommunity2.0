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
import UserDB from "./users";

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

        // if(doc.data().PollCloseDate)

        pollsArray.push({ ...object2, ...doc.data() });
      });

      setPolls(pollsArray);
    } catch (error) {
      console.error("Error getting poll Data: ", error);
      alert(error);
    }
  };

  static getPollFromCommunityIDForUser = async (communityID, setPolls) => {
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

        // if(doc.data().PollCloseDate)

        const date1 = new Date(
          "Wed Jul 17 2024 00:00:00 GMT+0200 (South Africa Standard Time)"
        );
        const date2 = new Date(
          "Thu Jul 18 2024 00:00:00 GMT+0200 (South Africa Standard Time)"
        );

        const givenDate = new Date(doc.data().PollCloseDate);
        const currentDate = new Date();

        if (givenDate > currentDate) {
          console.log("The given date has passed.");
          pollsArray.push({ ...object2, ...doc.data() });
          console.log("User can still vote");
          // Perform your action here
        } else {
          console.log("The given date has not passed.");
          console.log("User can not vote on the poll");
        }
      });

      setPolls(pollsArray);
    } catch (error) {
      console.error("Error getting poll Data: ", error);
      alert(error);
    }
  };

  static voteFromPollId = async (community_id, pollId, selectedOption) => {
    console.log("starting transaction soon...");

    const poll_ref = doc(DB, "polls", pollId);

    try {
      // Start a transaction
      await runTransaction(DB, async (transaction) => {
        // Get the current data of the document
        const docSnapshot = await transaction.get(poll_ref);

        // Check if the document exists
        if (!docSnapshot.exists()) {
          throw new Error("Poll document does not exist!");
        }

        const pollData = docSnapshot.data();

        // Creating a copy of pollData instead of a reference.
        const newPollData = JSON.parse(JSON.stringify(pollData));

        // Find the option that matches the selected option and increment its votes
        const optionIndex = newPollData.Opt.findIndex(
          (option) => option.title === selectedOption
        );

        if (optionIndex !== -1) {
          newPollData.Opt[optionIndex].votes += 1;
        } else {
          throw new Error("Selected option not found in poll data!");
        }

        // Update the document with the new poll data
        transaction.update(poll_ref, newPollData);
      });

      console.log("Vote incremented successfully!");
      // Example usage

      const docID = localStorage.getItem("UserID"); // Replace with your actual user document ID
      //const communityID = "3aRAVKLx6yysV4LZyLow"; // Replace with actual community ID
      const newPoll = {
        poll_id: pollId,
        selected_option: selectedOption,
      };
      UserDB.addPoints(16);
      ManageUser.addPollToCommunity(docID, community_id, newPoll);
    } catch (error) {
      console.error("Transaction failed: ", error);
    }
  };

  static checkIfPollExists = async (userId, communityId, pollId) => {
    const userRef = doc(DB, "users", userId);

    try {
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("User document does not exist!");
      }

      const userData = userDoc.data();
      const { MyCommunities } = userData;

      // Find the community by community_id
      const community = MyCommunities.find(
        (comm) => comm.community_id === communityId
      );

      if (!community) {
        throw new Error("Community does not exist for the user!");
      }

      // Check if the poll_id exists in polls_engaged
      const pollEngaged = community.polls_engaged.find(
        (poll) => poll.poll_id === pollId
      );

      if (pollEngaged) {
        console.log(
          `Poll ID ${pollId} exists in polls_engaged with selected option: ${pollEngaged.selected_option}`
        );
        return pollEngaged.selected_option;
      } else {
        console.log(`Poll ID ${pollId} does not exist in polls_engaged.`);
        return null;
      }
    } catch (error) {
      console.error("Error checking poll existence: ", error);
      return null;
    }
  };
}
