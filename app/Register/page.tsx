"use client";

import React, { useState, useEffect } from "react";
import Register from "../../_Components/Register";
import ManageUser from "../../database/auth/ManageUser";
function page() {
  const [user, setUser] = useState();

  useEffect(() => {
    //setSignState(ManageUser.userIsSignedIn());
  }, []);

  return (
    <>
      <h1>Register Component Tshepo</h1>
      <Register />
    </>
  );
}

export default page;
