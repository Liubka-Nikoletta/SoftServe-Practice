import React from "react";
import "./MovieCard.css";
import Button from "../Button/Button";

const MovieCard = ({ title, releaseDate, ageRating, posterUrl }) => {
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
          <Button text="Details" />
          <Button text="Like" />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
