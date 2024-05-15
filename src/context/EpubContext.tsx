"use client"
import { Rendition } from "epubjs";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useRef, useState } from "react";

type ContextType = { 
    notes: Note[];
    setNotes: Dispatch<SetStateAction<Note[]>>
    activeTab:string;
    setActiveTab:Dispatch<SetStateAction<string>>;
    addNotes:AddNote | null;
    setAddNotes:Dispatch<SetStateAction<AddNote | null>>;
    noteModal:boolean;
    setNoteModal:Dispatch<SetStateAction<boolean>>;
    showSideNavbar:boolean;
    setShowSideNavbar:Dispatch<SetStateAction<boolean>>;
    showHomeSideNavbar:boolean;
    setShowHomeSideNavbar:Dispatch<SetStateAction<boolean>>;
    selectedChapterIndex:number | null;
    setSelectedChapterIndex:Dispatch<SetStateAction<number | null>>
    searchQuery:string;
    setSearchQuery:Dispatch<SetStateAction<string>>;
    showSearchbox:boolean;
    setShowSearchBox:Dispatch<SetStateAction<boolean>>;
    searchResults:SearchProp[];
    setSearchResults:Dispatch<SetStateAction<SearchProp[]>>;
    showRightSidebar:boolean;
    setShowRightSidebar:Dispatch<SetStateAction<boolean>>;
    isBookLoaded:boolean;
    setIsBookLoaded:Dispatch<SetStateAction<boolean>>;
    handleToggleSideNavbar: () => void;
    handleBookSideBar:()=>void;
    handleRightSideBar:()=>void;
    renditionRef: React.MutableRefObject<Rendition | null>;
    };
export const EpubContext = createContext<ContextType | undefined>(undefined);

// EpubProvider component
export const EpubProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Chapters"); // State to track active tab
  const [addNotes, setAddNotes] = useState<AddNote | null>(null);
  const [noteModal, setNoteModal] = useState<boolean>(false);
  const [showSideNavbar, setShowSideNavbar] = useState<boolean>(false);
  const [showHomeSideNavbar, setShowHomeSideNavbar] = useState<boolean>(true);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const renditionRef = useRef<Rendition | null>(null);
  const [showSearchbox, setShowSearchBox] = useState<boolean>(true);
  const [isBookLoaded, setIsBookLoaded] = useState<boolean>(false);
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchProp[]>([]);




  const handleToggleSideNavbar = () => {
    setShowSideNavbar(!showSideNavbar);
    // setShowHomeSideNavbar(!showHomeSideNavbar)
  };
const handleBookSideBar = ()=>{
  setShowHomeSideNavbar(!showHomeSideNavbar)
}
const handleRightSideBar=()=>{
  setShowRightSidebar(!showRightSidebar)
}
  
  return (
    <EpubContext.Provider
      value={{
        notes,
        setNotes,
        activeTab,
        setActiveTab,
        addNotes,
        setAddNotes,
        noteModal,
        setNoteModal,
        showSideNavbar,
        setShowSideNavbar,
        handleToggleSideNavbar,
        selectedChapterIndex,
        setSelectedChapterIndex,
        searchQuery,
        setSearchQuery,
        renditionRef,
        setShowSearchBox,
        showSearchbox,
        searchResults,
        setSearchResults,
        setShowHomeSideNavbar,
        showHomeSideNavbar,
        handleBookSideBar,
        setShowRightSidebar,
        showRightSidebar,
        handleRightSideBar,
        isBookLoaded,
        setIsBookLoaded
      }}
    >
      {children}
    </EpubContext.Provider>
  );
};

