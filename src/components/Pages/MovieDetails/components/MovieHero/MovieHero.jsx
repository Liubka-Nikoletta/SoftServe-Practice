import React, { useState, useEffect } from "react";
import DisplayTag from "../../../../DisplayTag/DisplayTag";
import Button from "../../../../Button/Button";
import "./MovieHero.css";

const STAR_SOLID = "fas fa-star";
const STAR_REGULAR = "far fa-star";
const HEART_SOLID = "fas fa-heart";
const HEART_REGULAR = "far fa-heart";

const renderStars = (ratingValue) => {
  const stars = [];
  const totalStars = 10;
  const scaledRating = Math.max(0, Math.min(10, Number(ratingValue) || 0));
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

const MovieHero = ({
  movie,
  isFavorite,
  onSessionsClick,
  onFavoriteClick,
  onDeleteMovie,
  onEditMovie,
}) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "null"
      );
      setIsAdmin(currentUser && currentUser.role === "admin");
    };

    checkAdminStatus();

    const handleAuthChange = () => {
      checkAdminStatus();
    };

    document.addEventListener("authStatusChanged", handleAuthChange);

    return () => {
      document.removeEventListener("authStatusChanged", handleAuthChange);
    };
  }, []);

  const heroStyle = {
    backgroundImage: `url(${movie.background_image})`,
  };

  console.log(movie);

  return (
    <div className="movie-hero-section" style={heroStyle}>
      <div className="hero-backdrop"></div>
      <div className="hero-content-wrapper">
        <div className="hero-text-content">
          <p className="movie-meta">
            <span>{movie.release_date}</span>
            <span> • {movie.age}</span>
            <span> • {movie.duration}</span>
          </p>
          <h1 className="movie-title">{movie.title}</h1>
          <div className="movie-genres">
            {movie.genre &&
              movie.genre.map((genre) => (
                <DisplayTag key={genre} className="genre-tag">
                  {genre}
                </DisplayTag>
              ))}
          </div>
          <p className="movie-description">{movie.description}</p>
          <div className="movie-info-bar">
            <DisplayTag>{movie.ticket_price + " грн" || "N/A"}</DisplayTag>

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
          {isAdmin && (
            <div className="admin-movie-actions">
              <Button
                icon="fa-edit"
                text="Edit"
                className="admin-button"
                onClick={() => onEditMovie(movie.id)}
              />
              <Button
                icon="fa-trash"
                text="Delete"
                className="admin-button"
                onClick={() => onDeleteMovie(movie.id)}
              />
            </div>
          )}
        </div>

        <div className="hero-poster-content">
          <img
            src={movie.poster}
            alt={`${movie.title} Poster`}
            className="hero-movie-poster"
          />
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
