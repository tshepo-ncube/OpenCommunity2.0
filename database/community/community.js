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
      channelID: item.id,
      name: item.displayName,
      createdDateTime: item.createdDateTime,
      webUrl: item.webUrl,
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
    await updateDoc(communityRef, object);
  };

  static deleteCommunity = async (id) => {
    await deleteDoc(doc(DB, "communities", id));
  };

  static updateCommunityStatus = async (id, status) => {
    const communityRef = doc(DB, "communities", id);
    try {
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
          users: data.users || [], // Ensure users field is included
        });
      });

      setCommunities(communities);
    } catch (e) {
      console.error("Error fetching communities: ", e);
    }
    setLoading(false);
  };

  static joinCommunity = async (communityId, userEmail) => {
    const communityRef = doc(DB, "communities", communityId);
    const communityDoc = await getDoc(communityRef);

    if (communityDoc.exists()) {
      const communityData = communityDoc.data();
      let users = communityData.users || [];

      if (users.includes(userEmail)) {
        // User already joined
        return { success: false, message: "You already joined the community." };
      } else {
        users.push(userEmail);

        try {
          await updateDoc(communityRef, {
            users: users,
          });
          console.log("Community Users updated successfully.");
          return {
            success: true,
            message: "You have successfully joined the community!",
          };
        } catch (error) {
          console.error("Error updating community users:", error);
          throw error;
        }
      }
    } else {
      console.log("No such document!");
      return { success: false, message: "Community does not exist." };
    }
  };

  static leaveCommunity = async (communityId, userEmail) => {
    const communityRef = doc(DB, "communities", communityId);
    const communityDoc = await getDoc(communityRef);

    if (communityDoc.exists()) {
      const communityData = communityDoc.data();
      let users = communityData.users || [];

      if (!users.includes(userEmail)) {
        // User is not in the community
        return {
          success: false,
          message: "You are not a member of this community.",
        };
      } else {
        users = users.filter((user) => user !== userEmail);

        try {
          await updateDoc(communityRef, {
            users: users,
          });
          console.log("User removed from community successfully.");
          return {
            success: true,
            message: "You have successfully left the community.",
          };
        } catch (error) {
          console.error("Error updating community users:", error);
          throw error;
        }
      }
    } else {
      console.log("No such document!");
      return { success: false, message: "Community does not exist." };
    }
  };

  static getAllUserCommunities = async (
    joinedCommunities,
    setJoinedCommunities
  ) => {
    console.log("getAllUserCommunities, ", joinedCommunities);
    const communitiesCollection = collection(DB, "communities");

    const promises = joinedCommunities.map(async (id) => {
      try {
        const docRef = doc(communitiesCollection, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log(docSnap.id, "=>", docSnap.data());
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          console.log("Document does not exist for ID:", id);
          return null;
        }
      } catch (error) {
        console.error("Error fetching document:", id, error);
        throw error;
      }
    });

    try {
      const results = await Promise.all(promises);
      console.log("All Communities fetched:", results);
      setJoinedCommunities(results);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
}
