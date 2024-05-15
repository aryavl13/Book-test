"use client";
import BookCard from "@/components/card/BookCard";
import BookServices from "@/services/BookServices";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStateUseSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
interface ParamsType {
  params: {
    bookId: string;
  };
}
interface CategoryType {
  _id: string;
  name: string;
  __v: number;
}
interface PublicationType {
  _id: string;
  published: boolean;
}
interface BookType {
  _id: string;
  author: string;
  title: string;
  description: string;
  category: CategoryType;
  publication: PublicationType;
  rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const SingleBookDetail = ({ params }: ParamsType) => {
  //   console.log(params);
  const [data, setDAta] = useState<BookType | null>(null);
  //   const [imageUrl, setImageUrl] = useState<string>("/cover.png");
  const [imageSrc, setImageSrc] = useState<any>("");
  useEffect(() => {
    const fetchData = async () => {
      const data = await BookServices.getSingleBook(params.bookId);
      const image = await BookServices.getSingleBookThumbnail(params.bookId);
      console.log(image, "single book thumbnail");
      setDAta(data);
      setImageSrc(image);
    };
    fetchData();
  }, []);
  const user = useStateUseSelector((state: RootState) => state.auth.user);

  const [imageData, setImageData] = useState("");
  const bearerToken = user?.authentication.accessToken


  useEffect(() => {
    // Configure Axios instance with the bearer token
    const axiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        // Authorization: `Bearer ${user?.authentication.accessToken}`,
      },
    });

    // Make an API call to fetch the image data using the configured Axios instance
    axiosInstance
      .get(`http://172.206.238.83/api/books/${params.bookId}/image`, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        // Convert the received array buffer to a base64 string
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        // Set the base64 string to state
        setImageData(`data:image/jpeg;base64,${base64}`);
      })
      .catch((error) => {
        console.error("Error fetching image data:", error);
      });
  }, [bearerToken]);
  return (
    <>
      {data ? (
        <div className="flex items-center justify-center h-[100vh] gap-4 w-full py-2 px-4 mt-4">
          <div>
            {/* <Image
              src={imageSrc}
              width={500}
              height={300}
              alt="Image description"
            /> */}
            {imageData ? (
              <img src={imageData} alt="API Image" />
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-2xl font-bold pb-10">{data.title} </h1>
            <p>Author : {data.author}</p>
            <p>Description : {data.description}</p>
            <Link href={`/category/${data.category?.name}`}>
              Category : {data.category?.name}
            </Link>
            <p></p>
            <button>Download</button>
            <Link
              href={`/book-reader/${data._id}`}
              className="bg-gray-800 text-white py-2 rounded-sm"
            >
              Read online
            </Link>
          </div>
        </div>
      ) : (
        <p>Loading ...</p>
      )}
    </>
  );
};

export default SingleBookDetail;
