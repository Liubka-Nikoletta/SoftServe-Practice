import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";
import Button from "../Button/Button";

const MovieCard = ({ id, title, releaseDate, ageRating, posterUrl }) => {
  const [isLiked, setIsLiked] = useState(false);
  
  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    console.log(`${title} liked status: ${!isLiked}`);
  };

  return (
    <div className="movie-card__container">
      <div className="movie-card__poster-wrapper">
        <img
          src={posterUrl}
          alt={`Poster of movie: ${title}`}
          className="movie-card__poster-image"
        />
        <div className="movie-card__gradient"></div>
      </div>
      <div className="movie-card__content">
        <h3 className="movie-card__title">{title}</h3>
        <p className="movie-card__release-date">{releaseDate}</p>
        <span className="movie-card__age-rating">{ageRating}</span>
        <div className="movie-card__button-wrapper">
          
          <Link to={`/movie/${id || 'unknown'}`} className="movie-card__link">
            <Button text="Details" />
          </Link>
          <button 
            className={`heart-button ${isLiked ? 'liked' : ''}`} 
            onClick={handleLikeClick}
          >
            {isLiked ? '❤️' : '♡'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;