import DB from "../DB";
import ManageUser from "./ManageUser";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  runTransaction,
} from "firebase/firestore";

export default class RegisterUser {
  static registerUser = (userData, setUser, setError) => {
    if (typeof window === "undefined") return;

    const { name, surname, email, password, diet } = userData;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("Email", user.email);

        RegisterUser.storeUserData(userData, setUser, user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        //alert(errorMessage);
        setError(errorMessage);
      });
  };

  static storeUserData = async (userData, setUser, user) => {
    try {
      const data = {
        Name: userData.name,
        Surname: userData.surname,
        Email: userData.email,
        Diet: userData.diet,
        DateUserCreated: new Date(),
        CommunitiesJoined: [],
        MyCommunities: [],
        Telephone: "0728496291",
      };
      const docRef = await addDoc(collection(DB, "users"), data);
      console.log("User Data Stored with ID: ", docRef.id);
      ManageUser.storeUserID(user.email);
      setUser(user);
    } catch (e) {
      console.error("Error adding document: ", e);
      //alert(e);
    }
  };
}
