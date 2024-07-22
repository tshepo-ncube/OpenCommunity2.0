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

export default class ManageUser {
  static manageUserState = (setUser, setSignedIn) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        console.log("User is logged in:", user);
        setSignedIn(true);

        // User is signed in.
        setUser(user);

        window.location.href = "http://localhost:3000/Home";
      } else {
        setSignedIn(false);
        setUser(null);
        // No user is signed in.
        console.log("No user is logged in");
      }
    });

    // To stop listening for changes (unsubscribe) - optional
    //return () => unsubscribe();
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

  static editPassword = (newPassword, setError) => {
    const auth = getAuth();

    const user = auth.currentUser;
    //const newPassword = getASecureRandomPassword();

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
          email: "nontshangela@gmail.com",
          name: user.displayName,
          profilePicture: user.photoURL,
        });

        this.getProfileData("nontshangela@gmail.com", setProfile);
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
    const q = query(candidatesCollectionRef, where("Email", "==", "nontshangela@gmail.com"));

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
      alert(error);
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
      alert(error);
    }
  };

  // static getAllCommunities = async () => {
  //    const currentUser = localStorage.getItem("Email");

  //    const candidatesCollectionRef = collection(DB, "users");

  //    const q = query(
  //      candidatesCollectionRef,
  //      where("Email", "==", currentUser)
  //    );

  //    try {
  //      const snapshot = await getDocs(q);
  //      if (snapshot.empty) {
  //        console.log("No matching documents.");
  //        return;
  //      }

  //      let userID;
  //      snapshot.forEach((doc) => {
  //        userID = doc.id;
  //      });
  //      const userRef = doc(DB, "users", userID);
  //      const userDoc = await getDoc(userRef);

  //      if (userDoc.exists()) {
  //        const userData = userDoc.data();
  //        let joinedCommunities = userData.CommunitiesJoined;

  //        if (joinedCommunities.includes(communityID)) {
  //          alert("You already joined the community");
  //        } else {
  //          joinedCommunities.push(communityID);
  //          try {
  //            // Update the status field
  //            await updateDoc(userRef, {
  //              CommunitiesJoined: joinedCommunities,
  //            });
  //            console.log("Community Joined Updated successfully.");
  //          } catch (error) {
  //            console.error("Error updating community joined:", error);
  //            throw error;
  //          }
  //        }
  //      }
  //    } catch (error) {
  //      console.error("Error getting user ID: ", error);
  //      alert(error);
  //    }
  // }
}
