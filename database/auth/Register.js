import DB from "../DB";
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
    const { name, surname, email, password, diet } = userData;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        RegisterUser.storeUserData(userData);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        //alert(errorMessage);
        setError(errorMessage);
      });
  };

  static storeUserData = async (userData) => {
    try {
      const data = {
        Name: userData.name,
        Surname: userData.surname,
        Email: userData.email,
        Diet: userData.diet,
        DateUserCreated: new Date(),
      };
      const docRef = await addDoc(collection(DB, "users"), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert(e);
    }
  };
}
