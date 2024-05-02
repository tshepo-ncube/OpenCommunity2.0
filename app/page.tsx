"use client"; 
import Link from 'next/link';

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Open Community</h1>
        <div className="flex justify-center">
          <Link href="/Login">
            <button className="btn bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 focus:outline-none focus:ring-2 focus:ring-primary-300">Login</button>
          </Link>
          <Link href="/Register">
            <button className="btn bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300">Register</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
