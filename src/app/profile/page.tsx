"use client"
import Link from 'next/link';
import React, { useState } from 'react';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 ${isOpen ? 'block' : 'hidden'} sm:block sm:relative sm:static`}>
        <div className="p-5">
          <h2 className="text-xl font-bold">Sidebar</h2>
          {/* Add your sidebar links here */}
          <div className="mt-4 flex flex-col">
            <Link href="/profile" className="py-2">Profile</Link>
            <Link href={'/profile/collections'} className="py-2">Collections</Link>
            <Link href={'/logout'} className="py-2">Logout</Link>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 p-5">
        {/* Button to toggle sidebar */}
        <button className="block sm:hidden" onClick={toggleSidebar}>
          {isOpen ? 'Close' : 'Open'} Sidebar
        </button>
        {/* Main content */}
        <div>
          <h1 className="text-2xl font-bold">Profile Page</h1>
          {/* Add your profile content here */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
