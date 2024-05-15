import requests from "./httpServices";

interface DataBody {
    query: string;
}
const LandingPageServices = {
    graphqlData : async(body:DataBody)=>{
        return requests.post("/graphql", body);
    }
}
export default LandingPageServices