"use client";
import Link from 'next/link';


const Header = () => {
  return (
    <div>
      {/* Green strip with "OPEN COMMUNITY" */}
      <div className="bg-green-500 py-4 text-white text-center">
        <h1 className="text-3xl font-bold">OPEN COMMUNITY</h1>
      </div>

      {/* White strip with "My Communities" and "Discover Communities" */}
      <div className="bg-white py-4 text-center">
        <div className="flex justify-center">
          <div className="px-4">
            <Link href="/mycommunities">
              <div className="text-green-500 font-semibold">My Communities</div>
            </Link>
          </div>
          <div className="px-4">
            <Link href="/DiscoverCommunities">
              <div className="text-green-500 font-semibold">Discover Communities</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
