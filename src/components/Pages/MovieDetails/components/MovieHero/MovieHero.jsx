import React from "react";
import DisplayTag from "../../../../DisplayTag/DisplayTag";
import Button from "../../../../Button/Button";
import "./MovieHero.css";

const STAR_SOLID = "fas fa-star";
const STAR_REGULAR = "far fa-star";
const HEART_SOLID = "fas fa-heart";
const HEART_REGULAR = "far fa-heart";

const renderStars = (ratingValue) => {
  const stars = [];
  const totalStars = 5;
  const scaledRating = Math.max(0, Math.min(5, (Number(ratingValue) || 0) / 2));
  const fullStars = Math.floor(scaledRating);
  const fractionalPart = scaledRating % 1;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <i key={`star-full-${i}`} className={`${STAR_SOLID} rating-star`}></i>
    );
  }

  if (fractionalPart > 0 && stars.length < totalStars) {
    const fillPercentage = fractionalPart * 100;

    stars.push(
      <div
        key="star-fractional"
        className="fractional-star-container rating-star"
      >
        <i className={STAR_REGULAR}></i>
        <div className="filled-part" style={{ width: `${fillPercentage}%` }}>
          <i className={STAR_SOLID}></i>
        </div>
      </div>
    );
  }

  while (stars.length < totalStars) {
    stars.push(
      <i
        key={`star-empty-${stars.length}`}
        className={`${STAR_REGULAR} rating-star`}
      ></i>
    );
  }
  return stars;
};

const MovieHero = ({ movie, isFavorite, onSessionsClick, onFavoriteClick }) => {
  const heroStyle = {
    backgroundImage: `url(${movie.heroImageUrl})`,
  };

  console.log(movie);

  return (
    <div className="movie-hero-section" style={heroStyle}>
      <div className="hero-backdrop"></div>
      <div className="hero-content-wrapper">
        <div className="hero-text-content">
          <p className="movie-meta">
            <span>{movie.year}</span>
            <span> • {movie.ageRating}</span>
            <span> • {movie.duration}</span>
          </p>
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-genres">
            {movie.genres &&
              movie.genres.map((genre) => (
                <DisplayTag key={genre} className="genre-tag">
                  {genre}
                </DisplayTag>
              ))}
          </div>
          <p className="movie-description">{movie.description}</p>
          <div className="movie-info-bar">
            <DisplayTag>{movie.buyPrice || "N/A"}</DisplayTag>

            <Button text="Sessions" size="medium" onClick={onSessionsClick} />

            <Button
              icon={isFavorite ? HEART_SOLID : HEART_REGULAR}
              size="small"
              onClick={onFavoriteClick}
              ariaLabel={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            />

            <DisplayTag className="star-rating">
              {renderStars(movie.rating)}
            </DisplayTag>
          </div>
        </div>

        <div className="hero-poster-content">
          <img
            src={movie.posterUrl}
            alt={`${movie.title} Poster`}
            className="hero-movie-poster"
          />
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
