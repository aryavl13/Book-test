import React from 'react';

interface HighlightProp {
    text: string;
    query: string;
}

const SearchHighlight: React.FC<HighlightProp> = ({ text, query }): JSX.Element => {
    // Split the text into parts based on the query
    const parts = text.split(new RegExp(`(${query})`, 'gi'));

    // Initialize the highlighted text
    let highlightedText: JSX.Element[] = [];

    // Iterate over each part
    parts.forEach((part, index) => {
        // Check if the current part matches the query
        if (part.toLowerCase() === query.toLowerCase()) {
            // If it's an exact match, push a span element with the highlighted class to the array
            highlightedText.push(<span key={index} className="text-red-500">{part}</span>);
        } else {
            // If it's not a match, push the part as is to the array
            highlightedText.push(<span key={index}>{part}</span>);
        }
    });

    // Return the array of JSX elements wrapped in a span element
    return <span>{highlightedText}</span>;
};

export default SearchHighlight;
