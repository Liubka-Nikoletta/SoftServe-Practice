import React from "react";
import "./MovieHero.css";

const MovieHero = ({ movie }) => {
  const heroStyle = {
    backgroundImage: `url(${movie.heroImageUrl})`,
  };

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
          <p className="movie-description">{movie.description}</p>
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
