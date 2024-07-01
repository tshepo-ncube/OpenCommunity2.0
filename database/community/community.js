import DB from "../DB";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import ManageUser from "../auth/ManageUser";

export default class CommunityDB {
  static createCommunity = async (item, setCommunities, setLoading) => {
    setLoading(true);
    const object = {
      users: [],
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

  static joinCommunity = async (CommunityData) => {
    const communityRef = doc(DB, "communities", CommunityData.id);

    const communityDoc = await getDoc(communityRef);

    if (communityDoc.exists()) {
      const communityData = communityDoc.data();
      let users = communityData.users;
      const currentUser = localStorage.getItem("Email");
      if (users.includes(currentUser)) {
        alert("You already joined the community.");
      } else {
        users.push(currentUser);

        console.log("users: ", users);

        try {
          // Update the status field
          await updateDoc(communityRef, {
            users: users,
          });
          ManageUser.joinCommunity(CommunityData.id);
          console.log("Community Users updated successfully.");
        } catch (error) {
          console.error("Error updating community status:", error);
          throw error;
        }
      }

      //console.log("Document data:", communityDoc.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };
}
