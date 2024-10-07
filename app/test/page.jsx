"use client";
import React, { useEffect } from "react";
import strings from "../../Utils/strings.json";
import axios from "axios";
export default function page() {
  useEffect(() => {}, []);

  const handleChannel = async () => {
    const name = "Tshepo";
    const description = "Tshepo";
    const category = "Tshepo";
    const status = "Tshepo";
    try {
      const res = await axios.post(
        strings.server_endpoints.createChannel,
        { name, description, category, status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res.data);
    } catch (err) {
      console.log("error  - ", err);
    }
  };

  return (
    <>
      <h2>Hey There</h2>
      <button onClick={handleChannel}>create channel</button>
    </>
  );
}
