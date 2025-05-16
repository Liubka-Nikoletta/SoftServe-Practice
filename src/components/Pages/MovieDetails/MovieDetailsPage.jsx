import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import allMoviesData from "../../../assets/films.json";
import allComingSoonMoviesData from "../../../assets/coming_soon.json";
import allActorsData from "../../../assets/actors.json";

import MovieHero from "./components/MovieHero/MovieHero";
import TrailerSection from "./components/TrailerSection/TrailerSection";
import ActorCarousel from "./components/ActorCarousel/ActorCarousel";
import "./MovieDetailsPage.css";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const localStorageKey = `favorite_movie_${movieId}`;

  const [currentMovieData, setCurrentMovieData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getInitialFavoriteState = () => {
    const storedValue = localStorage.getItem(localStorageKey);
    return storedValue === "true";
  };

  const [isFavorite, setIsFavorite] = useState(getInitialFavoriteState);

  useEffect(() => {
    localStorage.setItem(localStorageKey, String(isFavorite));
  }, [isFavorite, localStorageKey]);

  const getAbsoluteImageUrl = (relativePath) => {
    if (!relativePath) return '';

    if (relativePath.startsWith('http') || relativePath.startsWith('/')) {
      return relativePath;
    }

    return `/${relativePath}`;
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setCurrentMovieData(null);

    let foundMovie = allMoviesData.find((movie) => movie.id === movieId);

    if (!foundMovie) {
      foundMovie = allComingSoonMoviesData.find(
        (movie) => movie.id === movieId
      );
    }

    if (foundMovie) {
      const actorDetails = foundMovie.actors
        .map((actorId) => {
          const foundActor = allActorsData.find(
            (actor) => actor.id === actorId
          );
          if (foundActor) {
            return {
              id: foundActor.id,
              name: `${foundActor.name} ${foundActor.surname}`,
              character: foundActor.role,
              imageUrl: getAbsoluteImageUrl(foundActor.photo),
            };
          }
          console.warn(
            `Actor with ID "${actorId}" referenced in movie "${foundMovie.title}" not found in actors.json`
          );
          return null;
        })
        .filter((actor) => actor !== null);

      const getYearFromDate = (dateString) => {
        if (!dateString || typeof dateString !== "string") return "N/A";
        const parts = dateString.split(".");
        return parts.length === 3 ? parts[2] : dateString;
      };

      const getVideoIdFromUrl = (url) => {
        if (!url || typeof url !== "string") return null;
        const parts = url.split("/");
        const potentialId = parts.pop();
        return potentialId && potentialId.length > 0 ? potentialId : null;
      };

      const formatPrice = (price) => {
        if (typeof price !== "number") return "N/A";
        return `${price.toFixed(0)}₴`;
      };

      const processedMovieData = {
        id: foundMovie.id,
        title: foundMovie.title,
        year: getYearFromDate(foundMovie.release_date),
        ageRating: foundMovie.age,
        duration: foundMovie.duration,
        genres: foundMovie.genre,
        description: foundMovie.description,
        buyPrice: formatPrice(foundMovie.ticket_price),
        rating: foundMovie.rating,
        posterUrl: getAbsoluteImageUrl(foundMovie.poster),
        heroImageUrl: getAbsoluteImageUrl(foundMovie.background_image),
        trailerVideoId: getVideoIdFromUrl(foundMovie.trailer_url),
        cast: actorDetails,
      };

      setCurrentMovieData(processedMovieData);
    } else {
      setError(`Film with ID "${movieId}" not found.`);
    }

    setIsLoading(false);
  }, [movieId]);

  const handleSessionsClick = () => {
    console.log("Go to sessions for movie:", movieId);
  };

  const handleFavoriteClick = () => {
    setIsFavorite((currentIsFavorite) => !currentIsFavorite);
  };

  if (isLoading) {
    return (
      <div className="movie-details-page-loading">Loading movie details...</div>
    );
  }

  if (error) {
    return <div className="movie-details-page-error">Error: {error}</div>;
  }

  if (!currentMovieData) {
    return (
      <div className="movie-details-page-error">Failed to load movie data.</div>
    );
  }

  return (
    <div className="movie-details-page">
      <MovieHero
        movie={currentMovieData}
        isFavorite={isFavorite}
        onSessionsClick={handleSessionsClick}
        onFavoriteClick={handleFavoriteClick}
      />
      {currentMovieData.trailerVideoId ? (
        <TrailerSection videoId={currentMovieData.trailerVideoId} />
      ) : (
        <p className="info">The trailer for this movie is not available.</p>
      )}
      {currentMovieData.cast && currentMovieData.cast.length > 0 ? (
        <ActorCarousel cast={currentMovieData.cast} />
      ) : (
        <p className="info">Cast information is not available.</p>
      )}
    </div>
  );
};

export default MovieDetailsPage;
