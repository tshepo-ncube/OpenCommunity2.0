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

import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
//import { truncateSync } from "fs";

export default class CommunityDB {
  static createCommunity = async (item, setCommunities, setLoading) => {
    setLoading(true);
    const object = {
      name: item.name,
      description: item.description,
    };
    try {
      const docRef = await addDoc(collection(DB, "communities"), object);
      console.log("Document ID: ", docRef.id);

      //this.uploadImage(item.picture, docRef.id);

      const imgRef = ref(StorageDB, `files/${docRef.id}`);
      uploadBytes(imgRef, item.picture);
    } catch (e) {
      console.log("Error adding document: ", e);
    }
    this.getCommunitiesWithImages(setCommunities);
    setLoading(false);
  };

  static editCommunity = async (id, object) => {
    const communityRef = doc(DB, "communities", id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(communityRef, object);
  };

  static getCommunitiesWithImages = async (setCommunities, setLoading) => {
    setLoading(true);
    const communities = [];
    try {
      const querySnapshot = await getDocs(collection(DB, "communities"));
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const imgRef = ref(StorageDB, `files/${doc.id}`);

        const imgUrl = await getDownloadURL(imgRef);
        console.log(imgUrl);
        communities.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          picture: imgUrl,
        });
      }

      setCommunities(communities);
      //return communities;
    } catch (e) {
      console.error("Error fetching communities with images: ", e);
      //return null; // or handle the error as needed
    }
    setLoading(false);
  };
}
