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

export default class ManageUser {
  static userIsSignedIn = () => {
    return true;
  };
}
