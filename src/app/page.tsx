"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useStateUseSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setData } from "@/redux/features/home";
import LandingPageServices from "@/services/LandingpageServices";
import BookCard from "@/components/card/BookCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomeBanner from "@/components/banner/HomeBanner";


const Home = () => {
  const dispatch = useAppDispatch();
  const user = useStateUseSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [data, setData] = useState<GraphqlData | null>(null);
  // for getting user reading history

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `
          query {
            categories {
              id
              name
            }
            recommendations {
              id
              title
              author
              rating
            }
            newBooks {
              id
              title
              author
              rating
            }
            topRatedBooks {
              id
              title
              author
              rating
            }
            readingEntries {
                          pageNumber
                          cfi
                          timestamp
                          book {
                          id
                          title
                          author
                          description
                          rating
                          }
                   
                    }          
          
          }
        `;
       
        const { data } = await LandingPageServices.graphqlData({ query });
        console.log(data.readingEntries);
        
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <ToastContainer />
      <main>
        {user ? (
          <>
          <HomeBanner />
            {/* logic for user continue reading  */}
            {/* logic for no history */}

            {/* <HomeBanner/> */}
            <div className="w-[95%] md:w-[80%] mx-auto py-14">
          <h2 className="text-2xl text-gray-800 font-bold pb-8">Continue Reading</h2>
          {data && data.readingEntries ? (
            <div className="flex mt-6 mx-1 gap-4">
              <div className="w-full">
                <Slider {...settings}>
                  {data.readingEntries.map((book) => (
                    <Link
                      href={`/book-reader/${book.book.id}`}
                      key={book.pageNumber}
                      className="border w-[200px] h-[300px] bg-slate-200 rounded-lg flex flex-col px-4 items-center justify-center text-center  "
                    >
                      <Link href={`/book-reader/${book.book.id}`}>
                        {book.book.title}
                      </Link>
                    </Link>
                  ))}
                </Slider>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
            <div className="w-[95%] md:w-[80%] mx-auto py-14">
          <h2 className="text-2xl text-gray-800 font-bold pb-8">Categories</h2>
          {data && data.categories ? (
            <div className="flex mt-6 mx-1 gap-4">
              <div className="w-full">
                <Slider {...settings}>
                  {data.categories.map((category) => (
                    <Link
                      href={`/category/${category.name}`}
                      key={category.id}
                      className="border w-[200px] h-[300px] bg-slate-200 rounded-lg flex flex-col px-4 items-center justify-center text-center  "
                    >
                      <Link href={`/category/${category.name}`}>
                        {category.name}
                      </Link>
                    </Link>
                  ))}
                </Slider>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="w-[95%] md:w-[80%] mx-auto py-14">
          <div className="flex items-center justify-between w-full ">
            <h2 className="text-2xl text-gray-800 font-bold pb-8">New Books</h2>
            <div className="">
              <Link href={"/books"} className="hover:underline">
                View more
              </Link>
            </div>
          </div>
          {data && data.newBooks ? (
            <div className="flex mt-6 mx-1 gap-4">
              <div className="w-full">
                <Slider {...settings}>
                  {data.newBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </Slider>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="w-[95%] md:w-[80%] mx-auto py-14">
          <h2 className="text-2xl text-gray-800 font-bold pb-8">
            Top Rated Books
          </h2>
          {data && data.topRatedBooks ? (
            <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full py-2 px-4">
              {data.topRatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
          </>
        ) : (
          <>
            <div className="w-[95%] md:w-[80%] h-auto mx-auto grid grid-cols-1 md:grid-cols-2 py-14 min-h-[40%] gap-2 sm:gap-3">
              <div className="h-[100%] px-4">
                <h1 className="text-2xl text-teal-900 my-5">
                  Lorem ipsum dolor sit amet
                </h1>
                <p className="text-sm text-gray-600 py-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Delectus aut est, maxime iste animi ipsa. Sit excepturi nobis
                  velit, culpa vitae, voluptate amet impedit ipsam, quis saepe
                  magnam optio quisquam! Facere rerum inventore odit
                  reprehenderit natus quam, molestias fuga quasi accusamus. A
                  natus labore esse delectus architecto eum cum unde harum
                  placeat in consequuntur, animi sint repellat, tenetur
                  voluptatibus. Molestiae?
                </p>
                <button className="bg-emerald-500 px-4 py-1 rounded-full text-white hover:bg-emerald-400 ">
                  Read More
                </button>
              </div>
              <div className="h-[100%] w-[100%] ">
                <img
                  src={
                    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt="image"
                  height={500}
                  width={500}
                  className="rounded-md"
                />
              </div>
            </div>
          </>
        )}

        
      </main>
    </>
  );
};

export default Home;
