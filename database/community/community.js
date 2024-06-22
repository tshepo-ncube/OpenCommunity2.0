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
  deleteDoc,
  getDocs,
  runTransaction,
} from "firebase/firestore";

import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export default class CommunityDB {
  static createCommunity = async (item, setCommunities, setLoading) => {
    setLoading(true);
    const object = {
      name: item.name,
      description: item.description,
      category: item.category,
      status: item.status || "active", // Include status field with default value "active"
    };
    try {
      const docRef = await addDoc(collection(DB, "communities"), object);
      console.log("Document ID: ", docRef.id);

      // Upload image if item.picture is not null
      if (item.picture) {
        const imgRef = ref(StorageDB, `files/${docRef.id}`);
        await uploadBytes(imgRef, item.picture);
      }
    } catch (e) {
      console.log("Error adding document: ", e);
    }

    await this.getCommunitiesWithImages(setCommunities, setLoading); // Wait for communities to be fetched with images
    setLoading(false);
  };

  static editCommunity = async (id, object) => {
    const communityRef = doc(DB, "communities", id);

    // Update the community document
    await updateDoc(communityRef, object);
  };

  static deleteCommunity = async (id) => {
    // Delete the community document
    await deleteDoc(doc(DB, "communities", id));
  };

  static archiveCommunity = async (id) => {
    const communityRef = doc(DB, "communities", id);

    try {
      // Update the status field to 'archived'
      await updateDoc(communityRef, {
        status: "archived",
      });
      console.log("Community archived successfully.");
    } catch (error) {
      console.error("Error archiving community:", error);
      throw error;
    }
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
          category: data.category,
          status: data.status, // Include status in the fetched data
          picture: imgUrl,
        });
      }

      setCommunities(communities);
    } catch (e) {
      console.error("Error fetching communities with images: ", e);
    }
    setLoading(false);
  };
}
