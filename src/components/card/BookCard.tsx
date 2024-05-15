"use client"
import UserServices from '@/services/UserServices';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaStar } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";


interface CategoryType {
  _id: string;
  name: string;
  __v: number;
}

interface PublicationType {
  _id: string;
  published: boolean;
}

interface Book {
  id?: string;
  _id?: string;
  title: string;
  author: string;
  rating: number;
  description?: string;
  category?: CategoryType;
  publication?: PublicationType;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface BookCardProps {
  book: Book;
}
interface CollectionProp{
  _id: string;
  books: Book[];
}
const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [collectionData, setCollectionData] = useState<CollectionProp[] | null>(null);
  const [isInCollection, setIsInCollection] = useState<boolean>(false);
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
  useEffect(() => {
    if (collectionData) {
      for (const collection of collectionData) {
        if (collection.books.some(b => b._id === book._id)) {
          setIsInCollection(true);
          break;
        }
      }
    }
  }, [collectionData, book._id]);


  const handleCollection = async(bookId:string)=>{
    if (isInCollection) {
      
    } else {
      
      const res = await UserServices.postBookCollection({ bookIds: [bookId] });
      console.log(res);
    }
    
  }
  const content = book._id ? (
    <div className="border w-[200px] h-[300px] bg-slate-200 rounded-lg flex flex-col px-4 items-center justify-center group gap-4">
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <div className="flex flex-row items-center mt-1">
                {/*  */}
                <ReactStars
                  value={book?.rating}
                  edit={false}
                  emptyIcon={<FaStar size={16} color="#CCCCCC" />}
                  filledIcon={<FaStar size={16} color="#FF8A00" />}
                />
              </div>
              <div>
                <Link href={`/books/${book._id}`} className='bg-blue-500 text-white px-4 py-2 rounded-lg '>View Book</Link>
              </div>
              <button onClick={()=>handleCollection(book._id!)} className="hidden group-hover:block transition-all  bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">
              {isInCollection ? 'Remove from Collection' : 'Add to Collection'}
      </button>
    </div>
  ) : (
    <div className="border w-[200px] h-[300px] bg-slate-200 rounded-lg flex flex-col px-4 items-center justify-center">
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <div className="flex flex-row items-center mt-1">
                {/*  */}
                <ReactStars
                  value={book?.rating}
                  edit={false}
                  emptyIcon={<FaStar size={16} color="#CCCCCC" />}
                  filledIcon={<FaStar size={16} color="#FF8A00" />}
                />
              </div>
    </div>
  );

  return content;
};

export default BookCard;
