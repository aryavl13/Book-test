import { Location, Rendition } from "epubjs";

// export const getRect = (range: Range, frameElement: any): { x: number; y: number } => {
//     const rect = range.getBoundingClientRect();
//     const frameRect = frameElement.getBoundingClientRect();
//     return {
//       x: rect.left - frameRect.left,
//       y: rect.top - frameRect.top,
//     };
//   };
 export const getRect = (
    range: Range | null,
    frameElement: any
  ): { x: number; y: number } => {
    const rect = range?.getBoundingClientRect();

    if (frameElement) {
      const frameRect = frameElement.getBoundingClientRect();

      if (rect) {
        return {
          x: rect.left - frameRect.left,
          y: rect.top - frameRect.top,
        };
      }
    }

    // Handle cases where either frameElement or rect is undefined
    return { x: 0, y: 0 }; // Or any other default value you prefer
  };

  
 export const handleTextSelection = (contents: any) => {
    return (e: MouseEvent) => {
      const selection = contents.window.getSelection();
      if (!selection) return;
  
      const range = selection.getRangeAt(0);
      const position = getRect(
        range,
        contents.document.defaultView.frameElement
      );
  
      const selectedText = selection.toString().trim();
      
      if (selectedText !== "") {
        // Show the button at the end position of the selected text
        const button = document.createElement("button");
        button.textContent = "Add Note"; // Change button text as needed
        button.style.position = "absolute";
        button.style.top = position.y + "px";
        button.style.left = position.x + range.getBoundingClientRect().width + "px";
        button.onclick = () => {
          // Handle button click event
          // You can call a function to show a modal or perform any other action
          console.log("Button clicked");
        };
  
        // Append the button to the body
        document.body.appendChild(button);
      } else {
        // If no text is selected, remove the button if exists
        const button = document.querySelector("button");
        if (button) {
          button.remove();
        }
      }
    };
  };

  export const navigatePreviousPage = (renditionRef: React.MutableRefObject<Rendition | null>) => {
    // Check if renditionRef and current are not null or undefined before calling prev()
    renditionRef.current?.prev();
};

  // Function to navigate to the next page
  export const navigateNextPage = (renditionRef: React.MutableRefObject<Rendition | null>) => {
    renditionRef.current?.next();
  };
export const query = `
query {
  categories {
    id
    name
  }
  recommendations {
    id
    title
    author
    rating
  }
  newBooks {
    id
    title
    author
    rating
  }
  topRatedBooks {
    id
    title
    author
    rating
  }
  readingEntries {
                pageNumber
                cfi
                timestamp
                book {
                id
                title
                author
                description
                rating
                }                  
          }          
}
`;


  