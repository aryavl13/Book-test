interface Category {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  description?: string;
}
interface Reading {
  pageNumber: number;
  timestamp: string;
  cfi: string;
  book: Book;
}
interface GraphqlData {
  categories: Category[];
  recommendations: Book[];
  newBooks: Book[];
  topRatedBooks: Book[];
  readingEntries: Reading[];
}

interface SelectedText {
  text: string;
  cfi: string;
  note?: string;
}
interface Note {
  cfi: string;
  comment: string;
  createdAt: string;
  highlightColor: string;
  page?: number;
  position: number;
  _id: string;
  selectedText: string;
}
interface AddNote{
    cfi: string;
  comment?: string;
  highlightColor: string;
  selectedText: string;
  page?:number
}
interface AddBookmark{
    title?:string | undefined;
    page:number;
    cfi:string;
    _id?:string | undefined;
    createdAt?:string | undefined
}
interface PositionProp{
  left:number;
  top:number;
  width?:number;
  height?:number;
  bottom?:number;
  right?:number;
}
interface Section{
  href:string;
level:number;
order:number;
page:number;
title:string;
tocId:string;
}
interface ChapterProp{
  
href:string;
level:number;
order:number;
page:number;
title:string;
tocId:string;
sections?:Section[]
}

interface SearchProp {
  cfi: string;
  excerpt: string;
}