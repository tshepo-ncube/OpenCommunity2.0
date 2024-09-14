import React from "react";
import UserDB from "../../database/community/users";
export default function page() {
  const handleClick = () => {
    UserDB.addPoints(10);
  };
  return (
    <>
      <button onClick={handleClick}>Click me</button>
    </>
  );
}
