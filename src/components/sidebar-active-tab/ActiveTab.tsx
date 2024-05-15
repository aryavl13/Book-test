import { EpubContext } from "@/context/EpubContext";
import BookServices from "@/services/BookServices";
import { formatDate } from "@/utils/helper";
import React, { useContext, useEffect, useState } from "react";
interface ActiveTabProp {
  activeTab: string;
  chapters: ChapterProp[];
  handleChapterClick: (href: string) => void;
  notes: Note[];
  navigateToNote: (cfi: string, highlight: string) => void;
  navigateTobookmark: (cfi: string) => void;
  handleDeleteNote: (noteId: string) => void;
  bookmarkModal: boolean;
  bookId: string;
  bearerToken: string | undefined;
}
interface Bookmark{
    _id:string;
    createdAt:string;
    title:string;
    cfi:string;
    page:number;


}
const ActiveTab = ({
  activeTab,
  chapters,
  handleChapterClick,
  notes,
  navigateToNote,
  handleDeleteNote,
  bookId,
  bookmarkModal,
  navigateTobookmark,
  bearerToken
}: ActiveTabProp) => {
  const [bookmark, setBookMark] = useState<Bookmark[]>([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await BookServices.getBookmark(bookId);
        setBookMark(response)
      } catch (error) {
        console.error("Error fetching selected notes:", error);
        // Handle error: You might want to display an error message to the user
      }
    };

    fetchBookmarks();
  }, [bookId, !bookmarkModal]);

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      const response = await fetch(
        `http://devapis.booksnai.net/api/books/${bookId}/bookmark`,
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
    //   setBookMark((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting selected note:", error);
      // Handle error: You might want to display an error message to the user
    }
  };
  console.log(chapters);
  const epubContext= useContext(EpubContext)
  if (!epubContext) {
    // Handle case where context value is undefined
    throw new Error("useEpubContext must be used within a EpubProvider");
  }
  
  // Destructure the properties from epubContext
  const { setSelectedChapterIndex,selectedChapterIndex } = epubContext;
  return (
    <div className="flex flex-col gap-2 mt-4 overflow-y-auto px-4 w-full">
     {activeTab === "Chapters" && (
        <div>
          {/* Content for Chapters tab */}
          {chapters.map((chapter, index) => (
            <div key={index} className="px-2 cursor-pointer w-full mb-1">
              <h1
                className="text-md font-bold text-blue-800"
                onClick={() =>{
                  setSelectedChapterIndex(selectedIndex =>
                    selectedIndex === index ? null : index
                  )
                  handleChapterClick(chapter.href)
                }
              }
              >
                {chapter.title}
              </h1>
              {selectedChapterIndex === index && chapter?.sections && (
                <div className="px-2">
                  {chapter?.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} onClick={()=>{handleChapterClick(section.href)}} className="bg-gray-100 mb-1 w-full">
                      <h2 className="text-md font-bold text-blue-700">
                        {section.title}
                      </h2>
                     
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "Notes" && (
        <div>
          {/* Content for Notes tab */}

          {notes.length > 0 ? (
            <>
              {notes.map((selected, index) => (
                <div key={index}>
                  <div
                   
                    className="flex justify-between items-center gap-2"
                  >
                    <div
                      onClick={() =>
                        navigateToNote(selected.cfi, selected.highlightColor)
                      }
                      className="cursor-pointer"
                    >
                      <h1 className="text-xl font-bold text-gray-800 ">
                        {selected.comment}
                      </h1>
                      <p
                        className="text-sm text-black pt-1 shadow-md rounded-md px-2"
                        style={{
                          backgroundColor: selected.highlightColor,
                          opacity: 0.6,
                        }}
                      >
                        {selected.selectedText.slice(0, 20)}
                      </p>

                      <p className="text-sm text-gray-500">
                        {formatDate(selected.createdAt)}
                      </p>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => handleDeleteNote(selected._id)}
                    >
                      <button onClick={() => handleDeleteNote(selected._id)}>
                        x
                      </button>
                    </div>
                  </div>

                  <hr />
                </div>
              ))}
            </>
          ) : (
            <h1 className="px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
              No available notes
            </h1>
          )}
        </div>
      )}
      {activeTab === "Bookmark" && (
        <div>
          {/* Content for Notes tab */}

          {bookmark.length > 0 ? (
            <>
              {bookmark.map((selected, index) => (
                
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2  border px-2 rounded-full"
                  >
                    <div
                      onClick={() =>
                        navigateTobookmark(selected.cfi)
                      }
                      className="cursor-pointer "
                    >
                    
                      <p
                        className="text-sm text-gray-500"
                        
                      >
                        Page {selected.page}
                      </p>

                      <p className="text-sm text-gray-500">
                        {/* {formatDate(selected.createdAt)} */}
                      </p>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => handleDeleteBookmark(selected._id)}
                    >
                      <button 
                      onClick={() => handleDeleteBookmark(selected?._id)}
                      >
                        x
                      </button>
                    </div>
                  </div>

                
                
              ))}
            </>
          ) : (
            <h1 className="px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
              No available Bookmarks
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveTab;
