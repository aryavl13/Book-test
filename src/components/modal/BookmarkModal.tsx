import BookServices from '@/services/BookServices';
import React, { useState } from 'react'
interface ModalProps{

    onClose: () => void;
    bookId: string;
    setIsbookmark:(isBookmark:boolean)=>void
    addBookmark: AddBookmark | null;
    setBookmark: (addNotes: AddBookmark | null) => void;
    setHightLightColor?: (color: string) => void;
    bearerToken?: string | undefined;
    cfi?:string | undefined
}
const BookmarkModal: React.FC<ModalProps> = ({
    
    onClose,
   
    bookId,
    setIsbookmark,
    setBookmark,
    addBookmark
  }) => {
    console.log("BOOK MARK MODAL",addBookmark);
    
  const [title, setTitle] = useState<string>("");
  const handleSave = async () => {
    const id = bookId
    const body= {
        title:title,
        cfi:addBookmark?.cfi,
        page:addBookmark?.page
    }
    const response = await BookServices.postBookmark(id,body);
    onClose();
    setIsbookmark(true)
    console.log("Note added successfully:", response);
    if(response.status===200){
    
      setTitle(""); 
      onClose();
    }
    
  }
  return (

    <>
            <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Enter Bookmark title</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-4">
              <input type="text" className="w-full p-2 border border-gray-300 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Type your title here..." />
            </div>

            <div className="flex justify-between gap-2">
              <button
                className="px-4 py-2 bg-white border text-black rounded hover:bg-blue-100 focus:outline-none"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
    </>
  )
}

export default BookmarkModal