import EpubjsServices from "@/services/EpubjsServices";
import { Location } from "epubjs";

 // Ref to store rendition instance
 export const addUserReadingHistory = async (location: Location,bookId:string) => {
    // console.log("add user reading history",location);

    let page = location.start.displayed.page;
    let cfi = location.start.cfi;
    // let page=location.end.displayed.page
    let id = bookId;
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