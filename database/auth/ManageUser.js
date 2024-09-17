import DB from "../DB";
import CommunityDB from "../community/community";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  updateDoc,
  getDocs,
  deleteDoc,
  runTransaction,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default class ManageUser {
  static manageUserState = (setUser, setSignedIn) => {
    const router = useRouter();
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        console.log("User is logged in:", user);
        setSignedIn(true);

        // User is signed in.
        setUser(user);

        //window.location.href = "http://localhost:3000/Home";
        router.push(`/Home`);
      } else {
        setSignedIn(false);
        setUser(null);
        // No user is signed in.
        console.log("No user is logged in");
      }
    });
  };

  static forgotPassword = (email, setError, setForgotPassword) => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        setForgotPassword(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
        // ..
      });
  };

  static storeUserID = async (userEmail) => {
    const candidatesCollectionRef = collection(DB, "users");
    console.log(`Email : ${email}`);
    const q = query(candidatesCollectionRef, where("Email", "==", userEmail));
    if (typeof window === "undefined") return;

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("No matching user from Email : ", userEmail);
        return;
      }

      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());

        localStorage.setItem("UserID", doc.id);

        const object2 = { id: doc.id };
        console.log(
          "doc.data().CommunitiesJoined,",
          doc.data().CommunitiesJoined
        );

        CommunityDB.getAllUserCommunities(
          doc.data().CommunitiesJoined,
          setUserCommunities
        );
        setProfile({ ...doc.data(), ...object2 });
      });
    } catch (error) {
      console.error("Error getting Profile Data: ", error);
      //alert(error);
    }
  };
  static editPassword = (newPassword, setError) => {
    const auth = getAuth();

    const user = auth.currentUser;

    updatePassword(user, newPassword)
      .then(() => {
        // Update successful.
        alert("You have now updated your password");
      })
      .catch((error) => {
        // An error ocurred
        // ...
        alert("Error!!!");

        setError(error);
      });
  };

  static getProfile = async (setProfile) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        console.log("User is logged in:", user);
        setSignedIn(true);

        // User is signed in.
        setUser({
          email: user.email,
          name: user.displayName,
          profilePicture: user.photoURL,
        });

        this.getProfileData(user.email, setProfile);
      } else {
      }
    });
  };

  static editProfileData = async (id, object) => {
    const communityRef = doc(DB, "users", id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(communityRef, object);
  };

  static getProfileData = async (email, setProfile, setUserCommunities) => {
    const candidatesCollectionRef = collection(DB, "users");
    console.log(`Email : ${email}`);
    const q = query(candidatesCollectionRef, where("Email", "==", email));

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());

        const object2 = { id: doc.id };
        console.log(
          "doc.data().CommunitiesJoined,",
          doc.data().CommunitiesJoined
        );
        //const combinedObject = { ...object1, ...object2 };
        CommunityDB.getAllUserCommunities(
          doc.data().CommunitiesJoined,
          setUserCommunities
        );
        setProfile({ ...doc.data(), ...object2 });
      });
    } catch (error) {
      console.error("Error getting Profile Data: ", error);
      //alert(error);
    }
  };

  static logoutUser = (setLoggedIn, router) => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setLoggedIn(false);
        router.push("/");
        //window.location.href = "http://localhost:3000/sign-in";
      })
      .catch((error) => {
        // An error happened.
      });
  };

  static joinCommunity = async (communityID) => {
    if (typeof window === "undefined") return;

    const currentUser = localStorage.getItem("Email");

    const candidatesCollectionRef = collection(DB, "users");

    const q = query(candidatesCollectionRef, where("Email", "==", currentUser));

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      let userID;
      snapshot.forEach((doc) => {
        userID = doc.id;
      });
      const userRef = doc(DB, "users", userID);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        let joinedCommunities = userData.CommunitiesJoined;

        if (joinedCommunities.includes(communityID)) {
          alert("You already joined the community");
        } else {
          joinedCommunities.push(communityID);
          try {
            // Update the status field
            await updateDoc(userRef, {
              CommunitiesJoined: joinedCommunities,
            });
            console.log("Community Joined Updated successfully.");
          } catch (error) {
            console.error("Error updating community joined:", error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Error getting user ID: ", error);
      //alert(error);
    }
  };

  //here i am adding the polls to the engaged user field in /users collection
  static addPollToCommunity = async (docID, communityID, newPoll) => {
    const docRef = doc(DB, "users", docID); // Replace with your actual collection name and document ID
    console.log("starting...");
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Get the data
        const data = docSnap.data();
        const myCommunities = data.MyCommunities || [];

        // Find the index of the community
        const communityIndex = myCommunities.findIndex(
          (community) => community.community_id === communityID
        );

        if (communityIndex !== -1) {
          // Community exists, update the polls_engaged array
          myCommunities[communityIndex].polls_engaged.push(newPoll);

          // Update the document in Firestore
          await updateDoc(docRef, {
            MyCommunities: myCommunities,
          });

          console.log(`Poll added to community ${communityID}`);
        } else {
          // Community does not exist, create a new one
          myCommunities.push({
            community_id: communityID,
            polls_engaged: [newPoll],
          });
          console.log(`New community ${communityID} created and poll added`);
        }

        // Update the document in Firestore
        await updateDoc(docRef, {
          MyCommunities: myCommunities,
        });

        console.log(`Document ${docID} updated successfully`);
      } else {
        console.log(`Document ${docID} does not exist`);
      }
    } catch (error) {
      console.error("Error adding poll to community:", error);
    }
  };

  static addUserToGlobalIfNotThere = async (email) => {
    const glocalCommunity = doc(DB, "communities", "jf9rDPUP2v5CJ2S9aoKt");
    if (typeof window === "undefined") return;

    try {
      const globalCommunityDoc = await getDoc(glocalCommunity);
      console.log("GLOBAL COMMUNITY>.........");
      console.log(globalCommunityDoc.data());

      if (
        !globalCommunityDoc.data().users.includes(localStorage.getItem("Email"))
      ) {
        console.log("User is not in the global community");
        console.log(
          CommunityDB.joinCommunity(
            "jf9rDPUP2v5CJ2S9aoKt",
            localStorage.getItem("Email")
          )
        );
      } else {
        console.log("user is a member of global community");
      }
    } catch (error) {
      console.log(error);
    }
  };
}
