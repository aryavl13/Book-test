import React from 'react';

interface SearchResult {
  cfi: string;
  excerpt: string;
}

interface SearchSuggestionsProps {
  searchResults: SearchResult[];
  handleSuggestionClick: (result: SearchResult) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  searchResults,
  handleSuggestionClick,
}) => {
  return (
    <div className="suggestion-box max-h-48 overflow-y-auto px-2 py-3">
      {searchResults?.length > 0 && (
        <ul className='border shadow-lg'>
          {searchResults.map((result, index) => (
            <li key={index} onClick={() => handleSuggestionClick(result)} className='cursor-pointer'>
              {result.excerpt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchSuggestions;
