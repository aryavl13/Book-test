"use client"
import BookCard from '@/components/card/BookCard';
import BookServices from '@/services/BookServices'
import React, { useEffect, useState } from 'react'


interface CategoryType{
    _id:string;
    name:string;
    __v:number
  }
  interface PublicationType{
    _id:string;
    published:boolean;
  }
  interface BookType{
    _id:string;
    author:string;
    title:string;
    description:string;
    category: CategoryType,
    publication:PublicationType;
    rating : number;
    createdAt:string;
    updatedAt:string;
    __v:number
  
  }
  interface CategoryType{
    totalBooks:number;
    totalPages:number;
    currentPage:number;
    books: BookType[]
  }
const Books = () => {
    const [data,setData]=useState<CategoryType | null>(null)
    useEffect(()=>{
        const fetchData=async()=>{
            const data = await BookServices.getAllBooks()
            console.log(data,"all books");
            
            setData(data)
        }
        fetchData()
    },[])
  return (
    <div className="w-[95%] md:w-[80%] h-[100vh] mx-auto py-10">
        
        <div className="text-center">
      <h1 className="text-2xl font-bold">Books</h1>
    </div>
        {data && data.books ? (
            <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full py-2 px-4 mt-4 h-[100vh]">
              {data.books.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <p>No new books available</p>
          )}
        </div>
  )
}

export default Books