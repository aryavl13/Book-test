"use client";
import BookCard from "@/components/card/BookCard";
import CategoryServices from "@/services/CategoryServices";
import React, { useEffect, useState } from "react";
interface ParamsType {
  params: {
    catName: string;
  };
}
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
const SingleCategory = ({ params }: ParamsType) => {

  console.log(params.catName);
  const [data,setData] = useState<CategoryType | null>(null)
  useEffect(() => {
    const fetchDAta = async () => {
      const data = await CategoryServices.getSingleCategoryDate(params.catName);
      console.log(data, "cat dataa");
      setData(data)
    };
    fetchDAta();
  }, []);
  return <div className="w-[95%] md:w-[80%] h-[100vh] mx-auto py-10">
    <div className="text-center">
      <h1 className="text-2xl font-bold">{params.catName} Category Details</h1>
    </div>
    {data && data.books ? (
            <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full py-2 px-4 mt-4">
              {data.books.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          ) : (
            <p>Loading ...</p>
          )}
     

  </div>;
};

export default SingleCategory;
