import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { Rendition } from "epubjs";
interface Category {
    id: string;
    name: string;
}

interface Book {
    id: string;
    title: string;
    author: string;
    rating: number;
}

interface GraphqlData {
    categories: Category[];
    recommendations: Book[];
    newBooks: Book[];
    topRatedBooks: Book[];
}
interface HomeState {
    graphqlData: GraphqlData | null;
    renditionRef:React.MutableRefObject<Rendition | null>

}


const initialState: HomeState = {
    graphqlData: null,
    renditionRef: { current: null },
};
const homeSlice = createSlice({
    name:"home",
    initialState,
    reducers:{
        setData: (state, action: PayloadAction<GraphqlData>) => {
            state.graphqlData = action.payload;
        },
        setRenditionRef:(state,action: PayloadAction<Rendition>)=>{
            state.renditionRef.current = action.payload
        }
    }
})
export const { setData,setRenditionRef } = homeSlice.actions;

export default homeSlice.reducer;