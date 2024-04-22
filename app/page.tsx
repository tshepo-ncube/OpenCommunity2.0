
"use client"
import React, { useState } from "react";
import Link from "next/link";


const Page = () => {
  return (
    <div>
      <Link href="/Login">
        
          <button>Login</button>
        
      </Link>
      <Link href="/Register">
        
          <button>Register</button>
        
      </Link>
    </div>
  );
};

export default Page;
