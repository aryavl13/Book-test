import requests from "./httpServices"
interface PostBookBody {
    bookIds: string[];
}
const UserServices=({
    getAllCollections:async()=>{
        return requests.get('/collections')
    },
    postBookCollection:async(body:PostBookBody)=>{
        return requests.post('/collections', body);
    }
})

export default UserServices