import requests from "./httpServices"
interface BodyProps{
  pageNumber:number;
  bookId:string;
  cfi:string
}
const EpubjsServices = ({
    getEpubBook: async(id:string)=>{
      return  requests.get(`/books/${id}/reader/file.epub`)
    },
    postReadEntries: async(body:BodyProps)=>{
      return requests.post('reading/entries',body)
    }
})
export default EpubjsServices