import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import allComingSoonMoviesData from "../../../assets/coming_soon.json";
import allActorsData from "../../../assets/actors.json";

import MovieHero from "./components/MovieHero/MovieHero";
import TrailerSection from "./components/TrailerSection/TrailerSection";
import ActorCarousel from "./components/ActorCarousel/ActorCarousel";
import "./MovieDetailsPage.css";
import SessionsSidebar from "./components/SessionsSidebar/SessionsSidebar";
import { useForm } from "../../../context/FormProvider.jsx";

const getVideoIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const parts = url.split("/");
  const potentialId = parts.pop();
  return potentialId && potentialId.length > 0 ? potentialId : null;
};

const getAbsoluteImageUrl = (relativePath) => {
  if (!relativePath) return "";

  if (relativePath.startsWith("http") || relativePath.startsWith("/")) {
    return relativePath;
  }

  return `/${relativePath}`;
};

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const localStorageKey = `favorite_movie_${movieId}`;

  const [currentMovieData, setCurrentMovieData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(() => {
    const storedValue = localStorage.getItem(localStorageKey);
    return storedValue === "true";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);

  const { openForm } = useForm();

  useEffect(() => {
    const deletedMovies = JSON.parse(
      localStorage.getItem("deletedMovies") || "[]"
    );
    if (deletedMovies.includes(movieId)) {
      window.location.href = "/"; // redirect if deleted
    }
  }, [movieId]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, String(isFavorite));
  }, [isFavorite, localStorageKey]);

  useEffect(() => {
    const loadFilteredSchedule = () => {
      const allSchedules = JSON.parse(
        localStorage.getItem("allSchedules") || "[]"
      );
      const filteredSchedule = allSchedules.filter(
        (item) => item.film_id === movieId
      );
      setScheduleData(filteredSchedule);
    };
    loadFilteredSchedule();
  }, [movieId]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setCurrentMovieData(null);

    const loadMovie = () => {
      const moviesFromStorage = localStorage.getItem("currentlyPlaying");
      const parsedMovies = JSON.parse(moviesFromStorage) || [];
      let foundMovie = parsedMovies.find((m) => m.id === movieId);

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

        const processedMovieData = {
          id: foundMovie.id,
          title: foundMovie.title,
          release_date: foundMovie.release_date,
          age: foundMovie.age,
          duration: foundMovie.duration,
          genre: foundMovie.genre,
          description: foundMovie.description,
          ticket_price: foundMovie.ticket_price,
          rating: foundMovie.rating,
          poster: getAbsoluteImageUrl(foundMovie.poster),
          background_image: getAbsoluteImageUrl(foundMovie.background_image),
          trailer_url: foundMovie.trailer_url,
          cast: actorDetails,
        };
        console.log(processedMovieData);
        setCurrentMovieData(processedMovieData);
      } else {
        const deletedMovies = JSON.parse(
          localStorage.getItem("deletedMovies") || "[]"
        );
        if (!deletedMovies.includes(movieId)) {
          setError(`Film with ID "${movieId}" not found.`);
        }
      }
    };

    loadMovie();

    setIsLoading(false);

    const handleMoviesUpdate = (event) => {
      const { updatedMovie, mode, deletedMovieId } = event.detail;
      if (mode === "edit" && updatedMovie && updatedMovie.id === movieId) {
        setMovieStorage(updatedMovie);
      }
    };

    document.addEventListener("moviesUpdated", handleMoviesUpdate);

    return () => {
      document.removeEventListener("moviesUpdated", handleMoviesUpdate);
    };
  }, [movieId]);

  const handleSessionsClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen((prev) => !prev);
      setIsClosing(false);
    }, 300);
  };

  const handleFavoriteClick = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleScheduleUpdate = (updatedSchedule) => {
    const allSchedules = JSON.parse(
      localStorage.getItem("allSchedules") || "[]"
    );
    const otherSchedules = allSchedules.filter(
      (item) => item.film_id !== movieId
    );
    const newAllSchedules = [...otherSchedules, ...updatedSchedule];
    localStorage.setItem("allSchedules", JSON.stringify(newAllSchedules));
    setScheduleData(updatedSchedule);
  };

  const handleDeleteMovie = (id) => {
    const deletedMovies = JSON.parse(
      localStorage.getItem("deletedMovies") || "[]"
    );
    if (!deletedMovies.includes(id)) {
      deletedMovies.push(id);
      localStorage.setItem("deletedMovies", JSON.stringify(deletedMovies));
    }
    window.location.href = "/";
  };

  const handleEditMovie = () => {
    openForm("edit", currentMovieData);
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
      <SessionsSidebar
        isOpen={isSidebarOpen}
        onClose={handleSessionsClick}
        isClosing={isClosing}
        schedule={scheduleData}
        onScheduleUpdate={handleScheduleUpdate}
        movieId={movieId} // Передаємо movieId в SessionsSidebar
      />
      <MovieHero
        movie={currentMovieData}
        isFavorite={isFavorite}
        onSessionsClick={handleSessionsClick}
        onFavoriteClick={handleFavoriteClick}
        onDeleteMovie={handleDeleteMovie}
        onEditMovie={handleEditMovie}
      />
      {currentMovieData.trailer_url ? (
        <TrailerSection
          videoId={getVideoIdFromUrl(currentMovieData.trailer_url)}
        />
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
