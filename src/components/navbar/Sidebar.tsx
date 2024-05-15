import { EpubContext } from '@/context/EpubContext';
import React, { useContext } from 'react'
import SearchHighlight from '../search/SearchHighlight';
import { MdMenu, MdClose } from "react-icons/md";

const Sidebar = () => {
  const epubContext = useContext(EpubContext);
  if (!epubContext) {
  
    throw new Error("useEpubContext must be used within a EpubProvider");
  }

  const { searchResults,setShowSearchBox,showSearchbox ,setSearchResults,renditionRef,searchQuery,handleToggleSideNavbar} = epubContext;

  const handleSuggestionClick = (result: SearchProp) => {
    // Handle the click action, such as navigating to the result
    console.log("Suggestion clicked:", result);
    setShowSearchBox(!showSearchbox);
    // setSearchQuery(" ")
    // setSearchResults([])
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
  

  return (
    <div className="flex flex-col gap-2 mt-4 overflow-y-auto px-4 w-full ">
      <div className='flex items-center justify-between'>
      <h1 className='uppercase font-bold'>Search Results</h1>
      <button onClick={handleToggleSideNavbar}>
        <MdClose size={18}/>
      </button>
      </div>
      <hr />
      {searchResults?.length > 0 && (
        <ul className='transition-all delay-300 ease-in-out'>
          {searchResults.map((result, index) => (
            <React.Fragment key={index}>
            <li key={index} onClick={() => handleSuggestionClick(result)} className='cursor-pointer py-2 mb-1 mt-1 hover:bg-slate-200'>
            <SearchHighlight text={result.excerpt} query={searchQuery}  />
            </li>
            <hr/>
            </React.Fragment>
          ))}
        </ul>
      )}
        
    </div>
  )
}

export default Sidebar