"use client";
import React, { useEffect } from "react";
import strings from "../../Utils/strings.json";
import axios from "axios";
import CommunityDB from "../../database/community/community";
export default function page() {
  useEffect(() => {}, []);

  const handleChannel = async () => {
    // const name = "Tshepo";
    // const description = "Tshepo";
    // const category = "Tshepo";
    // const status = "Tshepo";
    // try {
    //   const res = await axios.post(
    //     strings.server_endpoints.createChannel,
    //     { name, description, category, status },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );

    //   console.log(res.data);
    // } catch (err) {
    //   console.log("error  - ", err);
    // }

    CommunityDB.incrementCommunityScore("0xUi0rR83ka9F1pOg1to", 1);
  };

  return (
    <>
      <h2>Hey There</h2>
      <button onClick={handleChannel} className="bg-blue-500 p-4">
        increment
      </button>
    </>
  );
}
