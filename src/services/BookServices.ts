import requests from "./httpServices"
interface BodyProp {
    title: string;
    page?: number | undefined; // Make page property optional
    cfi?: string | undefined;
}
const BookServices=({
        getAllBooks : async()=>{
            return requests.get('/books')
        },
        getSingleBook : async(id:string)=>{
            return requests.get(`/books/${id}`)
        },
        getSingleBookThumbnail : async(id:string)=>{
            
            return requests.get(`/books/660a8bae75e3a427c1e9d9c9/image`)
        },
        // getSingleBookThumbnail: async (id: string) => {
        //     try {
        //       const response = await requests.get(`/books/${id}/image`, {
        //         responseType: 'arraybuffer', // Specify arraybuffer responseType to get binary data
        //       });
        //       const data = Buffer.from(response.data, 'binary').toString('base64'); // Convert binary data to base64 string
        //       return `data:image/png;base64,${data}`; // Return the data URL
        //     } catch (error) {
        //       console.error('Error fetching image:', error);
        //       throw error;
        //     }
        //   }
        getBookNotes:async(id:string)=>{
            return requests.get(`/books/${id}/notes`)
        },
        postBookmark:async(id:string,body:BodyProp)=>{
            return requests.post(`/books/${id}/bookmarks`,body)
        },
        getBookmark:async(id:string)=>{
            return requests.get(`/books/${id}/bookmarks`)
        },
        deleteBookmark:async(id:string)=>{
            return requests.delete(`/books/${id}/bookmarks`)
        },
        getBookChapters:async(id:string)=>{
            return requests.get(`/books/${id}/chapters`)
        }
          

})
export default BookServices