import DB from "../DB";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
<<<<<<< HEAD
  updatePassword,
=======
>>>>>>> 0e91a268613b35a153850079c96964e210f792d1
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

<<<<<<< HEAD
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

  static getProfileData = async (email, setProfile) => {
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

        //const combinedObject = { ...object1, ...object2 };
        setProfile({ ...doc.data(), ...object2 });
      });
    } catch (error) {
      console.error("Error getting Profile Data: ", error);
      alert(error);
    }
  };

=======
>>>>>>> 0e91a268613b35a153850079c96964e210f792d1
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
}
