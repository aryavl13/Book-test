"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import ePub, { Book, Rendition, EpubCFI, Location, Contents } from "epubjs";
import { useAppDispatch, useStateUseSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import SelectedNoteModal from "@/components/modal/SelectedNoteModal";
import { FaExpand, FaCompress, FaSearch } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import axios from "axios";
import EpubjsServices from "@/services/EpubjsServices";
import LandingPageServices from "@/services/LandingpageServices";
import BookServices from "@/services/BookServices";
import { MdClose } from "react-icons/md";
import NoteModal from "@/components/modal/NoteModal";
import { formatDate } from "@/utils/helper";
import { BsBookmark } from "react-icons/bs";
import BookmarkModal from "@/components/modal/BookmarkModal";
import { getRect, handleTextSelection, query } from "@/utils/epubHelper";
import ActiveTab from "@/components/sidebar-active-tab/ActiveTab";
import View from "epubjs/types/managers/view";
import { setRenditionRef } from "@/redux/features/home";
import SearchSuggestions from "@/components/SearchSuggestion";
import useFetch from "@/hooks/useFetch";
import { EpubContext } from "@/context/EpubContext";
import Sidebar from "@/components/navbar/Sidebar";

// import {SpineItem } from "epubjs/types/section";

interface ParamsProp {
  params: {
    bookId: string;
  };
}
interface SearchProp {
  cfi: string;
  excerpt: string;
}
const BookReader: React.FC<ParamsProp> = ({ params }) => {
  // console.log(params);
  const epubContext = useContext(EpubContext);
  if (!epubContext) {
    // Handle case where context value is undefined
    throw new Error("useEpubContext must be used within a EpubProvider");
  }

  // Destructure the properties from epubContext
  const {
    notes,
    setNotes,
    activeTab,
    setActiveTab,
    addNotes,
    setAddNotes,
    setNoteModal,
    noteModal,
    showSideNavbar,
    setShowSideNavbar,
    handleToggleSideNavbar,
    renditionRef,
    showRightSidebar,
    setIsBookLoaded,
  } = epubContext;
  const [data, setData] = useState<GraphqlData | null>(null);
  const [bookHistory, setBookHistrory] = useState<Reading | null>(null);
  const [selectedTexts, setSelectedTexts] = useState<SelectedText[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");
  const [hightLightColor, setHightLightColor] = useState<string>("yellow");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  // const [noteModal, setNoteModal] = useState<boolean>(false);
  const [bookmarkModal, setBookmarkModal] = useState<boolean>(false);
  const [isbookmark, setIsbookmark] = useState<boolean>(false);
  const user = useStateUseSelector((state: RootState) => state.auth.user);
  const bearerToken = user?.authentication.accessToken;
  const [renditionReady, setRenditionReady] = useState<boolean>(false);
  // const [showSideNavbar, setShowSideNavbar] = useState<boolean>(false);

  const [addBookmark, setAddBookmark] = useState<AddBookmark | null>(null);
  const [chapters, setChapters] = useState<ChapterProp[]>([]);
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [position, setPosition] = useState<PositionProp>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchProp[]>([]);
  const [showSearchbox, setShowSearchBox] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  // let rendition: Rendition | null = null;
  // const renditionRef = useRef<Rendition | null>(null);
  const locationRef = useRef<Location | null>(null);

  // const dispatch = useAppDispatch();
  // Ref to store rendition instance
  const addUserReadingHistory = async (location: Location) => {
    // console.log("add user reading history",location);

    let page = location.start.displayed.page;
    let cfi = location.start.cfi;
    // let page=location.end.displayed.page
    let id = params.bookId;
    try {
      const response = await EpubjsServices.postReadEntries({
        pageNumber: page,
        bookId: id,
        cfi: cfi,
      });
      // console.log('User reading history entry added:', response);
    } catch (error) {
      console.error("Error adding user reading history entry:", error);
    }
    localStorage.setItem("readingLocation", location.start.cfi);
  };
  //

  useEffect(() => {
    // Fetch book chapters only once during component initialization
    const fetchChapters = async () => {
      try {
        const chapterList = await BookServices.getBookChapters(params.bookId);
        setChapters(chapterList);
      } catch (error) {
        console.error("Error fetching book chapters:", error);
      }
    };

    fetchChapters();
  }, [params.bookId]);

  // reading history
  const {
    data: history,
    loading: historyLoading,
    error: historyERror,
  } = useFetch(() => LandingPageServices.graphqlData({ query }));

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
        // console.log(data.readingEntries);

        setData(data);
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  function findElementById(
    array: GraphqlData | null,
    givenId: string,
    bookId?: string
  ) {
    return array?.readingEntries.find((element) => element.book.id === givenId);
  }

  useEffect(() => {
    if (data) {
      const foundElement = findElementById(data, params.bookId);
      if (foundElement) {
        // console.log("Found element:", foundElement);
        setBookHistrory(foundElement);
      } else {
        console.log("Element not found for givenId:");
      }
    }
  }, [data, params.bookId]);
  // get epub ready
  useEffect(() => {
    let bookInstance: Book | null = null;
    let storedCfi: string | null = null;
    const fetchEpubFile = async (url: string) => {
      setIsLoading(true);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch EPUB file: ${response.statusText}`);
      }
      return response.arrayBuffer();
    };
    const getChapters = async (book: Book) => {
      const toc = (await book.loaded.navigation).toc;
      // Flatten the TOC to get all chapters
      const chapters = flattenToc(toc);
      // console.log("All Chapters:", chapters);
      // setChapters(chapters);
      // You can now use 'chapters' state or do further processing
    };

    const flattenToc = (toc: any[]): any[] => {
      const chapters: any[] = [];

      toc.forEach((item) => {
        if (item.href) {
          // If item has href, it's a chapter
          chapters.push(item);
        }

        // If item has subitems, recurse through them
        if (item.subitems) {
          chapters.push(...flattenToc(item.subitems));
        }
      });

      return chapters;
    };
    fetchEpubFile(
      `http://172.206.238.83/api/books/${params.bookId}/reader/file.epub`
    )
      .then((epubData) => {
        const book: any = ePub(epubData);
        console.log(book);
        setIsLoading(false);
        setIsBookLoaded(true);
        bookInstance = book;

        book.ready.then(async () => {
          await book.ready;

          await getChapters(book);

          const newRendition = book.renderTo("viewer", {
            width: "100%",
            height: "90vh",
          });
          renditionRef.current = newRendition;
          // dispatch(setRenditionRef(newRendition));

          if (bookHistory?.cfi) {
            newRendition.display(bookHistory.cfi);
          } else {
            // Check if there's persisted location information
            const persistedLocation = localStorage.getItem("readingLocation");
            if (persistedLocation) {
              newRendition.display(persistedLocation);
            } else {
              // If no reading history or persisted location, display initial page
              newRendition.display();
            }
          }
          newRendition.on("relocated", (location: Location) => {
            // Store the current location's CFI
            storedCfi = location.start.cfi;
            locationRef.current = location;
            addUserReadingHistory(location);
            // console.log("relocati...");

            const cfi = locationRef.current?.end.cfi;
            const pageNo = locationRef.current.end.displayed.page;
            // console.log(locationRef.current);
            setAddBookmark({ cfi: cfi, page: pageNo });
          });

          newRendition.on("selected", async (cfiRange: EpubCFI) => {
            try {
              const cfiString = cfiRange.toString();
              const range = await book.getRange(cfiString);
              const text = range.toString();
              const location = book.locations.locationFromCfi(cfiString);

              if (!location) {
                console.error("Location not found for CFI:", cfiString);
                renditionRef.current?.annotations.remove(cfiString, "hl");
                notes.forEach((note) =>
                  renditionRef.current?.annotations.remove(note.cfi, "hl")
                );
                return;
              }
              await renditionRef.current?.display(cfiString);
              // setNoteModal(true);
              // Update state with selected text
              setSelectedText(text);
              setSelectedTexts((prevSelectedTexts) => [
                ...prevSelectedTexts,
                { text, cfi: cfiString },
              ]);
              renditionRef.current?.annotations.highlight(
                cfiString,
                {},
                () => {},
                "hl",
                {
                  fill: hightLightColor,
                  "fill-opacity": "0.3",
                  "mix-blend-mode": "multiply",
                }
              );
              // console.log(locationRef, "locationrefff");

              setAddNotes({
                cfi: cfiString,

                highlightColor: hightLightColor,
                selectedText: text,
                page: locationRef.current?.start.displayed.page,
              });

              return false;
            } catch (error) {
              console.error("Error adding note:", error);
            }
          });

          setRenditionReady(true);
          console.log(renditionRef.current, "rendEJRKLE");

          // Event listener for keyboard navigation
          const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
              case "ArrowLeft":
                newRendition?.prev();
                break;
              case "ArrowRight":
                newRendition?.next();
                break;
              case "ArrowUp":
                event.preventDefault(); // Prevent default scrolling behavior
                window.scrollBy(0, -window.innerHeight * 0.8); // Scroll up by 80% of viewport height
                break;
              case "ArrowDown":
                event.preventDefault(); // Prevent default scrolling behavior
                window.scrollBy(0, window.innerHeight * 0.8); // Scroll down by 80% of viewport height
                break;
              default:
                break;
            }
          };

          // Add event listener for keyboard navigation
          document.addEventListener("keydown", handleKeyDown);
        });
      })
      .catch((error) => {
        // console.error("Error fetching EPUB file:", error);
      });

    return () => {
      if (bookInstance) {
        bookInstance.destroy();
      }
      if (renditionRef && renditionRef.current) {
        renditionRef.current.destroy();
        renditionRef.current.hooks.content.clear();
      }
      // document.removeEventListener("mouseup", handleTextSelection);
    };
  }, [params.bookId, bearerToken]);
  const getRect = (range: any, frame: any) => {
    const rect = range.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();

    // Calculate position relative to the viewport
    const left = rect.left + window.scrollX + rect.width; // Adjust for horizontal scroll
    const top = rect.top + window.screenY; // Adjust for vertical scroll

    return {
      left: left,
      top: top,
      width: rect.width,
      height: rect.height,
      bottom: frameRect.bottom,
      right: rect.right,
    };
  };

  const handleSelection = (content: any) => {
    console.log("handle selec", content);
    const selection = content.window.getSelection();
    console.log(selection, "selection");

    const range = selection.getRangeAt(0);
    const frame = content.document.defaultView.frameElement;

    const position = getRect(range, frame);
    // console.log(position);
    var text = selection.toString();
    // console.log("Selected text: ", text);
    if (text.trim() != "") {
      setNoteModal(true);
      const viewerRect = (
        document.getElementById("viewer") as HTMLElement
      ).getBoundingClientRect();
      const modalElement = document.getElementById("noteModal") as HTMLElement;
      // Ensure that modalElement exists before accessing its properties
      if (modalElement) {
        const modalWidth = modalElement.offsetWidth; // Get the width of the modal element
        const modalHeight = modalElement.offsetHeight; // Get the height of the modal element
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let modalLeft = position.left - viewerRect.left;
        // Ensure the modal doesn't overflow the viewerRect horizontally
        if (modalLeft + modalWidth > viewerRect.width) {
          modalLeft = viewerRect.width - modalWidth;
        }
        // Calculate the vertical position of the modal
        let modalTop = position.bottom - viewerRect.top + window.scrollY; // Adjust for vertical scroll
        // Ensure the modal doesn't overflow the viewerRect vertically
        if (modalTop + modalHeight > viewerRect.height) {
          modalTop = viewerRect.height - modalHeight;
        }
        setPosition({ left: modalLeft, top: modalTop });
      } else {
        console.error("Element with ID 'noteModal' not found in the DOM.");
      }
    } else {
      // hideModal();
    }
  };
  renditionRef.current?.hooks.content.register((content: any) => {
    // console.log(content,"content");
    content.documentElement.addEventListener("mouseup", () =>
      handleSelection(content)
    );
  });

  // Persisting location
  useEffect(() => {
    // Check if there's persisted location information and set the location when the rendition is ready
    if (renditionReady) {
      const persistedLocation = localStorage.getItem("readingLocation");
      if (persistedLocation) {
        renditionRef.current?.display(persistedLocation);
      }
    }
  }, [renditionReady, notes]);
  const handleTextClick = (cfi: string) => {
    renditionRef?.current?.display(cfi);
  };
  // console.log(renditionRef,"RENDITION outside");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBottomNavBar, setShowBottomNavBar] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the page is scrolling
      if (window.scrollY > 0) {
        setShowBottomNavBar(true);
      } else {
        setShowBottomNavBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // for getting all selected notes
  useEffect(() => {
    const fetchSelectedNotes = async () => {
      try {
        const response = await BookServices.getBookNotes(params.bookId);
        // console.log(response, "all book notes");
        setNotes(response);
      } catch (error) {
        console.error("Error fetching selected notes:", error);
        // Handle error: You might want to display an error message to the user
      }
    };

    fetchSelectedNotes();
  }, [bearerToken, params.bookId, !noteModal]);
  // Function to toggle full-screen mode
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Enter full-screen mode
      document.documentElement.requestFullscreen();
    } else {
      // Exit full-screen mode
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
    // Toggle the state
    setIsFullScreen(!isFullScreen);
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // handle delete note
  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(
        `http://devapis.booksnai.net/api/books/${params.bookId}/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete selected note: ${response.statusText}`
        );
      }

      // Remove the deleted note from the notes state
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting selected note:", error);
      // Handle error: You might want to display an error message to the user
    }
  };

  const navigateToNote = (cfi: string, highlight: string) => {
    renditionRef.current?.display(cfi);
    renditionRef.current?.annotations.highlight(
      cfi,
      {}, // Pass any necessary options here
      () => {}, // Pass any necessary callbacks here
      "hl", // Pass the annotation type here
      {
        fill: highlight, // Use hightLightColor directly here
        "fill-opacity": "0.3",
        "mix-blend-mode": "multiply",
      }
    );
  };
  const navigateTobookmark = (cfi: string) => {
    renditionRef.current?.display(cfi);
  };
  // handle chapter
  const handleChapterClick = (href: string) => {
    // setCurrentChapter(index);
    renditionRef.current?.display(href);
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
    setShowSearchBox(!showSearchbox);
  };
  const handleSuggestionClick = (result: SearchProp) => {
    // Handle the click action, such as navigating to the result
    console.log("Suggestion clicked:", result);
    setShowSearchBox(!showSearchbox);
    // setSearchQuery(" ")
    setSearchResults([]);
    renditionRef.current?.display(result.cfi);
    renditionRef.current?.annotations.highlight(
      result.cfi,
      {}, // Pass any necessary options here
      () => {}, // Pass any necessary callbacks here
      "hl", // Pass the annotation type here
      {
        fill: "yellow", // Use hightLightColor directly here
        "fill-opacity": "0.3",
        "mix-blend-mode": "multiply",
      }
    );
  };

  // console.log(searchResults,"WJHYYY");
  return (
    <>
      <div className="bg-white flex justify-center items-center h-screen w-full relative my-5 ">
        {/* Right Sidebar */}
        {showRightSidebar && (
          <div className="absolute right-0 top-1rem h-full w-64 bg-white z-50 shadow overflow-y-auto">
            <>
              <div className="flex gap-2 mt-4 w-full">
                {/* Render tab buttons */}
                <button
                  className={
                    "py-2 px-4 text-gray-600 hover:text-gray-800 focus:outline-none" +
                    (activeTab === "Chapters"
                      ? " border-b-2 border-blue-500"
                      : "")
                  }
                  onClick={() => handleTabClick("Chapters")}
                >
                  Chapters
                </button>
                <button
                  className={
                    "py-2 px-4 text-gray-600 hover:text-gray-800 focus:outline-none" +
                    (activeTab === "Notes" ? " border-b-2 border-blue-500" : "")
                  }
                  onClick={() => handleTabClick("Notes")}
                >
                  Notes
                </button>
                <button
                  className={
                    "py-2 px-4 text-gray-600 hover:text-gray-800 focus:outline-none" +
                    (activeTab === "Bookmark"
                      ? " border-b-2 border-blue-500"
                      : "")
                  }
                  onClick={() => handleTabClick("Bookmark")}
                >
                  Bookmark
                </button>
              </div>
              {/* Render content based on active tab */}
              <ActiveTab
                activeTab={activeTab}
                chapters={chapters}
                handleChapterClick={handleChapterClick}
                handleDeleteNote={handleDeleteNote}
                navigateToNote={navigateToNote}
                notes={notes}
                bookId={params.bookId}
                bookmarkModal={bookmarkModal}
                navigateTobookmark={navigateTobookmark}
                bearerToken={bearerToken}
              />
            </>
          </div>
        )}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Render side navbar if showSideNavbar is true */}
            {showSideNavbar && (
              <div className="flex flex-col items-center  w-64 h-[100vh] shadow-xl border-r">
                <Sidebar />
              </div>
            )}

            {renditionReady && (
              <div className="relative flex ">
                <div className="flex justify-between ">
                  <button
                    className="hover:scale-110 text-black font-bold py-2 px-4 rounded focus:outline-none"
                    onClick={() => renditionRef?.current?.prev()} // Call rendition.prev() for navigating to previous page
                  >
                    <FaAngleLeft size={24} color="grey" />
                  </button>
                  {/* <div id="viewer" className="w-full h-screen "> */}
                  <div
                    id="viewer"
                    className="w-full h-screen max-w-screen-lg border border-gray-300 bg-white rounded-2xl shadow-xl overflow-hidden   z-1"
                  >
                    <div className="px-2 py-1">
                      <button onClick={() => setBookmarkModal(true)}>
                        <BsBookmark
                          className={isbookmark ? "text-blue-700" : ""}
                        />
                      </button>
                    </div>
                    {/* <>
            <div className="absolute inset-0 flex justify-center items-center  shadow-lg pointer-events-none">
             <div className="w-[0.15rem] h-full bg-gray-300 shadow-lg"></div>
             </div>
          </>  */}

                    {/* note modal */}
                    {noteModal && (
                      <NoteModal
                        isOpen={true}
                        onClose={() => setNoteModal(!noteModal)}
                        setAddNotes={setAddNotes}
                        addNote={addNotes}
                        bookId={params.bookId}
                        bearerToken={bearerToken}
                        setHightLightColor={setHightLightColor}
                        position={position}
                      />
                    )}

                    {/* {showBottomNavBar && (
              <div className="fixed bottom-0 left-0 right-0 flex gap-2 mx-auto w-[50%] bg-slate-400 px-6 py-2 rounded-full">
                <button
                  className="hover:scale-110 text-white font-bold py-2 px-4 rounded focus:outline-none"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? <FaCompress /> : <FaExpand />}
                </button>
                <button
                  className="hover:scale-110 text-white font-bold py-2 px-4 rounded focus:outline-none"
                  onClick={() => setShowModal(true)}
                >
                  <BsList color="#fff" />
                </button>
              </div>
            )} */}
                  </div>
                  <button
                    className="hover:scale-110 text-black font-bold py-2 px-4 rounded focus:outline-none"
                    onClick={() => renditionRef?.current?.next()} // Call rendition.next() for navigating to next page
                  >
                    <FaAngleRight size={24} color="grey" />
                  </button>
                </div>
              </div>
            )}

            {bookmarkModal && (
              <BookmarkModal
                onClose={() => setBookmarkModal(!bookmarkModal)}
                addBookmark={addBookmark}
                bookId={params.bookId}
                setBookmark={setAddBookmark}
                setIsbookmark={setIsbookmark}
              />
            )}
            {showModal && (
              <SelectedNoteModal
                selectedTexts={selectedTexts}
                handleTextClick={handleTextClick}
                setShowModal={setShowModal}
                bookId={params.bookId}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default BookReader;
