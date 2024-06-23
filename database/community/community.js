import DB from "../DB";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

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
    } catch (e) {
      console.log("Error adding document: ", e);
    }

    await this.getAllCommunities(setCommunities, setLoading); // Wait for communities to be fetched
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

  static updateCommunityStatus = async (id, status) => {
    const communityRef = doc(DB, "communities", id);

    try {
      // Update the status field
      await updateDoc(communityRef, {
        status: status,
      });
      console.log("Community status updated successfully.");
    } catch (error) {
      console.error("Error updating community status:", error);
      throw error;
    }
  };

  static getAllCommunities = async (setCommunities, setLoading) => {
    setLoading(true);
    const communities = [];
    try {
      const querySnapshot = await getDocs(collection(DB, "communities"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        communities.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          category: data.category,
          status: data.status, // Include status in the fetched data
        });
      });

      setCommunities(communities);
    } catch (e) {
      console.error("Error fetching communities: ", e);
    }
    setLoading(false);
  };
}
