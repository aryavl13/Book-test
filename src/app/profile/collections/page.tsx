"use client"
import BookCard from '@/components/card/BookCard';
import { useStateUseSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import BookServices from '@/services/BookServices';
import UserServices from '@/services/UserServices';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
interface Book {
    id?: string;
    _id?: string;
    title: string;
    author: string;
    rating: number;
    description?: string;
    
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }
  
interface CollectionProp{
    _id: string;
    books: Book[];
}
const Collections = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [collectionData, setCollectionData] = useState<CollectionProp[] | null>(null);


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const user = useStateUseSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await UserServices.getAllCollections();
        console.log(data, "collection data");
        setCollectionData(data)

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

  }, []);
console.log(collectionData,"collectiondataaa")

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 ${isOpen ? 'block' : 'hidden'} sm:block sm:relative sm:static`}>
        <div className="p-5">
          <h2 className="text-xl font-bold">Hi {user?.authentication.firstname}</h2>
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
        <div className=''>
          <h1 className="text-2xl font-bold">Collections </h1>
          {collectionData ? (
            <div >
              {collectionData.map(collection => (
                <div key={collection._id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full py-2 px-4 mt-4 h-[100vh]">

                  {collection.books.map(book => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p>No collections available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collections;
    