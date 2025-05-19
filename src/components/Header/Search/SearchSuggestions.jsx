import React from 'react';
import { Link } from 'react-router-dom';
import './SearchSuggestions.css';

const SearchSuggestions = ({
    suggestions,
    isVisible,
    onSuggestionClick,
    onMouseEnter,
    onMouseLeave
}) => {
    if (!isVisible || !suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div
            className="search-suggestions"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {suggestions.map((movie, index) => (
                <Link
                    to={`/movie/${movie.id || 'unknown'}`}
                    key={`suggestion-${movie.id || index}`}
                    className="suggestion-item"
                    onClick={() => onSuggestionClick(movie)}
                >
                    <div className="suggestion-poster">
                        <img
                            src={movie.poster}
                            alt={`${movie.title} poster`}
                            className="suggestion-poster-img"
                        />
                    </div>
                    <div className="suggestion-info">
                        <div className="suggestion-details">
                            {movie.release_date?.split('.')[2] || 'Unknown'} • {movie.age || 'N/A'} • {movie.duration || 'N/A'}
                        </div>
                        <div className="suggestion-title">{movie.title}</div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default SearchSuggestions;