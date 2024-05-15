import requests from "./httpServices";

const CategoryServices=({
    getSingleCategoryDate:async(name:string)=>{
        console.log(name,"service");
        
        return requests.get(`/books?category=${name}`);
    }
})
export default CategoryServices
