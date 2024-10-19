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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import StorageDB from "../StorageDB"; // Import the Firebase storage instance

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
        router.push(`/Home`);
      } else {
        setSignedIn(false);
        setUser(null);
        // No user is signed in.
        console.log("No user is logged in");
      }
    });
  };

  static setProfileImage = (image) => {
    console.log(image);
    const storageRef = ref(
      StorageDB,
      `images/${localStorage.getItem("UserID")}/profileImage`
    ); // Reference to where the file will be stored

    // Upload the file to Firebase Storage
    const uploadTask = uploadBytes(storageRef, image);
    uploadTask
      .then((snapshot) => {
        console.log("Image uploaded successfully!");

        // Get the download URL and set it to state
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          //setUrl(downloadURL);
          console.log("File available at", downloadURL);
          ManageUser.setProfileImageFirebase(downloadURL);
        });
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  static setProfileImageFirebase = async (imageURL) => {
    const userRef = doc(DB, "users", localStorage.getItem("UserID"));
    const object = { profileImage: imageURL };

    // Set the "capital" field of the city 'DC'
    await updateDoc(userRef, object);
  };

  static forgotPassword = (email, setError, setForgotPassword) => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        setForgotPassword(false);
        alert("Password Reset Link Sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  static storeUserID = async (userEmail) => {
    const candidatesCollectionRef = collection(DB, "users");
    console.log(`Email : ${userEmail}`);
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
    }
  };

  static editPassword = (newPassword, setError) => {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log("user, :", user);

    updatePassword(user, newPassword)
      .then(() => {
        // Update successful.
        alert("You have now updated your password");
      })
      .catch((error) => {
        alert(error);
        console.log(error);
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

        setUser({
          email: user.email,
          name: user.displayName,
          profilePicture: user.photoURL,
        });

        this.getProfileData(user.email, setProfile);
      }
    });
  };

  static editProfileData = async (id, object, selectedInterests) => {
    const communityRef = doc(DB, "users", id);

    object.Interests = selectedInterests;

    // Set the "capital" field of the city 'DC'
    await updateDoc(communityRef, object);

    return true;
  };

  static getProfileData = async (
    email,
    setProfile,
    setUserCommunities,
    setIsAdmin
  ) => {
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

        const userData = doc.data();
        const object2 = { id: doc.id };

        // Check if the user is an admin
        if (userData.Role === "admin") {
          console.log("User is an admin");
          setIsAdmin(true); // Set admin status
        } else {
          console.log("User is not an admin");
          setIsAdmin(false); // Set non-admin status
        }

        CommunityDB.getAllUserCommunities(
          doc.data().CommunitiesJoined,
          setUserCommunities
        );
        setProfile({ ...userData, ...object2 });
      });
    } catch (error) {
      console.error("Error getting Profile Data: ", error);
    }
  };

  static setIsSuperAdmin = async (setIsSuperAdmin) => {
    const candidatesCollectionRef = collection(DB, "users");
    console.log(`Email : ${localStorage.getItem("Email")}`);
    const q = query(
      candidatesCollectionRef,
      where("Email", "==", localStorage.getItem("Email"))
    );

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());

        const userData = doc.data();

        // Check if the user is an admin
        if (userData.role === "super_admin") {
          console.log("User is an admin");
          setIsSuperAdmin(true); // Set admin status
        } else {
          console.log("User is not an admin");
          setIsSuperAdmin(false); // Set non-admin status
        }
      });
    } catch (error) {
      console.error("Error getting Profile Data: ", error);
    }
  };
  static logoutUser = (setLoggedIn, router) => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setLoggedIn(false);
        router.push("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
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
    }
  };

  static addPollToCommunity = async (docID, communityID, newPoll) => {
    const docRef = doc(DB, "users", docID);
    console.log("starting... addPollToCommunity");
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const myCommunities = data.MyCommunities || [];

        const communityIndex = myCommunities.findIndex(
          (community) => community.community_id === communityID
        );

        if (communityIndex !== -1) {
          //myCommunities[communityIndex].polls_engaged.push(newPoll);
          console.log(
            "Poll id Existsssssssss before adddding : ",
            myCommunities[communityIndex].polls_engaged.some(
              (poll) => poll.poll_id === newPoll.poll_id
            )
          );

          const existingPoll = myCommunities[communityIndex].polls_engaged.find(
            (poll) => poll.poll_id === newPoll.poll_id
          );

          if (existingPoll) {
            console.log(
              "----------------------------------exits------------------------------------"
            );
            // If such a poll exists, update its selected_option
            existingPoll.selected_option = newPoll.selected_option;
            console.log(`Poll with poll_id '${newPoll.poll_id}' updated.`);
          } else {
            console.log(
              "----------------------------------do exists------------------------------------"
            );
            // If no such poll exists, push the newPoll to polls_engaged
            myCommunities[communityIndex].polls_engaged.push(newPoll);
            console.log("New poll added to polls_engaged.");
          }

          console.log(
            "----------------------------------communityIndex !== -1------------------------------------"
          );
          // await updateDoc(docRef, {
          //   MyCommunities: myCommunities,
          // });
        } else {
          console.log(
            "----------------------------------communityIndex === -1------------------------------------"
          );
          myCommunities.push({
            community_id: communityID,
            polls_engaged: [newPoll],
          });

          console.log(`New community ${communityID} created and poll added`);
        }

        await updateDoc(docRef, {
          MyCommunities: myCommunities,
        });

        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log(
          "MYYYYY COMMUNITIES _______________---------: ",
          myCommunities
        );
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");
        console.log("-------------------------");

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
