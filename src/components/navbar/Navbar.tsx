"use client";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MdMenu, MdClose } from "react-icons/md";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAppDispatch, useStateUseSelector } from "@/redux/hooks";
import { loggedInUser } from "@/redux/features/auth";
import Cookies from "js-cookie";
import { AppDispatch, RootState } from "@/redux/store";
import Avatar from "../Avatar";
import { FaSearch } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { EpubContext } from "@/context/EpubContext";
import { CiMenuKebab } from "react-icons/ci";
interface User {
  email: string;
  firstname: string;
  role: string;
  accessToken: string;
}

const Navbar = () => {
  const epubContext = useContext(EpubContext);
  if (!epubContext) {
    // Handle case where context value is undefined
    throw new Error("useEpubContext must be used within a EpubProvider");
  }

  // Destructure the properties from epubContext
  const { showSideNavbar, handleToggleSideNavbar, renditionRef,setShowHomeSideNavbar,setSearchResults,setShowSearchBox,showSearchbox,setShowSideNavbar,handleBookSideBar,handleRightSideBar,isBookLoaded } = epubContext;
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dispatch = useAppDispatch<AppDispatch>();
  const user = useStateUseSelector((state: RootState) => state.auth.user);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const pRef = useRef<HTMLDivElement>(null);
  const nRef = useRef<HTMLAnchorElement>(null);
  console.log(renditionRef, "navbar");

  const handleProfileOpen = () => {
    setProfileOpen(!profileOpen);
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileOpen &&
        pRef.current &&
        !pRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);
  useEffect(() => {
    const userInfo = Cookies.get("userInfo");
    console.log(userInfo, "NAVBAR");

    if (userInfo) {
      const user = JSON.parse(userInfo);
      dispatch(loggedInUser(user));
    }
  }, [dispatch]);

  console.log(user);

  const handleLogout = () => {
    dispatch(loggedInUser(null));
    Cookies.remove("userInfo");
  };
  async function searchInBook() {
    try {
      const rendition = renditionRef.current;
      // Ensure that renditionRef.current is available
      if (rendition && rendition.book) {
        const book: any = rendition.book;

        // Loop through each spine item to perform the search
        for (const item of book.spine.spineItems) {
          try {
            // Load the spine item
            await item.load(book.load.bind(book));

            // Search within the loaded content for the query
            const foundItem = await item.find(searchQuery);
            if (foundItem) {
              // If the search is successful, add the item to the results
              console.log(foundItem);

              setSearchResults(foundItem);
            }

            // Unload the spine item to free up resources
            await item.unload();
            // return
          } catch (error) {
            console.error("Error searching in spine item:", error);
          }
        }
      } else {
        throw new Error("Rendition or book is not properly loaded.");
      }
    } catch (error) {
      console.error("Error searching book:", error);
      return []; // Return an empty array if there's an error
    }
  }

  const handleSearchClick = () => {
    searchInBook();
    // setShowSearchBox(!showSearchbox);
    setShowSideNavbar(!showSideNavbar);
    

  };
  console.log(renditionRef.current !==null, "navbar",renditionRef.current);
  

  return (
    <div className="bg-grey-200">
      <div className="w-[95%] md:w-[80%] mx-auto flex items-center justify-between py-4">
        <div className="flex gap-6 items-center justify-between">
          <div className="  text-[14px] text-gray-800 relative flex">
            <Link href={"/"} className="font-bold text-xl">XYOPST</Link>
            {/* <Link href={"/books"}>Books</Link>
          <Link href={"/"}>Pages</Link>
          <Link href={"/"}>Blog</Link>
          <Link href={"/"}>About Us</Link>
          <Link href={"/"}>Contact Us</Link> */}
          </div>
          <div className="  flex items-center gap-5">
            {/* Toggle button for side navbar */}
            <button
              onClick={handleBookSideBar}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {showSideNavbar ? <MdClose size={18}/> : <BsList size={18}/>}
            </button>
            <div className="flex items-center justify-between gap-2 relative shadow-xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-b px-4 focus:outline-none py-2"
                  />
                  <button onClick={handleSearchClick}>
                    <FaSearch size={18} color="grey"/>
                  </button>
                </div>
          </div>
        </div>

        <div className="flex gap-2 items-center relative">
        <IoNotificationsOutline size={24}/>

          {user?.success ? (
            <>
            <button
              className="rounded-full dark:bg-gray-500 bg-emerald-500 text-white h-8 w-8 font-medium mx-auto focus:outline-none"
              onClick={handleProfileOpen}
            >
              <Avatar
                imageUrl={user?.authentication?.profile_image}
                altText={user?.authentication?.firstname}
                firstName={user?.authentication?.firstname}
              />
            </button>
            {isBookLoaded && (
              <button className="" onClick={handleRightSideBar}>
              <CiMenuKebab color="" size={24}/>
              </button>
            )}
            </>
          ) : (

            <Link href={"/login"}>Login</Link>
          )}
          {profileOpen && (
            <div className="origin-top-right absolute right-0 top-8 mt-2 flex flex-col gap-1  rounded-md shadow-lg bg-gray-800 focus:outline-none text-white px-6 py-2 z-[99999999]">
              <Link href="/profile">Profile</Link>
              <Link href="/profile/collections">Collections</Link>
              <Link href={"/"} onClick={handleLogout}>
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default Navbar;
