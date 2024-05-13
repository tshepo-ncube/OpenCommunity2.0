"use client";
import Link from 'next/link';

const Header = () => {
  return (
    <div>
      {/* Green strip with "OPEN COMMUNITY" */}
      <div className="bg-openbox-green py-4 text-white text-center relative">
        {/* Button for adding community */}
        <Link href="/DiscoverCommunities">
          <div className="absolute top-0 right-0 mt-2 mr-4 bg-white text-green-500 px-4 py-2 rounded-lg hover:bg-green-100">
            + Add Community </div>
        </Link>
        <h1 className="text-3xl font-bold">OPEN COMMUNITY</h1>
      </div>

      {/* White strip with "My Communities" and "Discover Communities" */}
      <div className="bg-white py-4 text-center">
        <div className="flex justify-center">
          <div className="px-4">
            <Link href="/Home">
              <div className="text-hover-obgreen font-semibold">My Communities</div>
            </Link>
          </div>
          <div className="px-4">
            <Link href="/DiscoverCommunities">
              <div className="text-hover-obgreen font-semibold">Discover Communities</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
