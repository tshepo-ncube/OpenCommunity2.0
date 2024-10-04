import React, { useState, useEffect } from "react";
import CommunityDB from "../database/community/community";
export default function RecommendedCommunities() {
  const [recommendedCommunities, setRecommendedCommunities] = useState([]);

  useEffect(() => {
    CommunityDB.RecommendedCommunities(setRecommendedCommunities);
  }, []);
  return (
    <>
      <h1>Hey there...</h1>
    </>
  );
}
