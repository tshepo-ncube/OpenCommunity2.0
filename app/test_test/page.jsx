"use client";
import React, { useState, useEffect } from "react";
import AnalyticsDB from "../../database/community/analytics";
export default function page() {
  const getThings = () => {
    const emails = [
      "ncbmkh005@myuct.ac.za",
      "anotheremail@example.com",
      "moreemail@example.com",
    ];
    AnalyticsDB.getUsersDetailsByEmails(emails).then((userDetailsList) => {
      console.log(userDetailsList);
    });
  };
  return (
    <>
      <button className="bg-blue-500 p-4" onClick={getThings}>
        get things
      </button>
    </>
  );
}
