// import { useStateUseSelector } from "@/redux/hooks";
// import { RootState } from "@/redux/store";
// import { Rendition } from "epubjs";

import { Rendition } from "epubjs";
import { Dispatch, SetStateAction } from "react";

// interface SearchProp{
//     query?:string ;
//     renditionRef?:React.MutableRefObject<Rendition | null>
// }
// export const handleSearch = async ({ query, renditionRef }: SearchProp) => {
//     if (!query || !renditionRef || !renditionRef.current) {
//       return; // Add appropriate handling or return logic
//     }
  
//     try {
//       const results = await renditionRef.current.search(query);
//       console.log("Search results:", results);
//       // Handle search results
//     } catch (error) {
//       console.error("Search failed:", error);
//       // Handle search failure
//     }
//   };

// Import useContext hook to access the context

 // Update the path as necessary

// Define your searchInBook function
// interface SearchInbookProp{  
//     renditionRef:React.MutableRefObject<Rendition | null>;
//     searchQuery:string;
    
//     setSearchResults:Dispatch<SetStateAction<SearchProp[]>>;

// }
// export async function searchInBook({renditionRef,searchQuery,setSearchResults}:SearchInbookProp) {
//     // Access the context
    
   

//     try {
//         const rendition = renditionRef.current;
//         // Ensure that renditionRef.current is available
//         if (rendition && rendition.book) {
//             const book: any = rendition.book;

//             // Loop through each spine item to perform the search
//             for (const item of book.spine.spineItems) {
//                 try {
//                     // Load the spine item
//                     await item.load(book.load.bind(book));

//                     // Search within the loaded content for the query
//                     const foundItem = await item.find(searchQuery);
//                     if (foundItem) {
//                         // If the search is successful, add the item to the results
//                         console.log(foundItem);

//                         setSearchResults(foundItem);
//                     }

//                     // Unload the spine item to free up resources
//                     await item.unload();
//                 } catch (error) {
//                     console.error("Error searching in spine item:", error);
//                 }
//             }
//         } else {
//             throw new Error("Rendition or book is not properly loaded.");
//         }
//     } catch (error) {
//         console.error("Error searching book:", error);
//         return []; // Return an empty array if there's an error
//     }
// }
