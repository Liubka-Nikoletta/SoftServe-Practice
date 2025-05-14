import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieHero from "./components/MovieHero/MovieHero";
import TrailerSection from "./components/TrailerSection/TrailerSection";
import "./MovieDetailsPage.css";
import bgImage from "../../../assets/image.png";
import ActorCarousel from "./components/ActorCarousel/ActorCarousel";
import SessionsSidebar from "./components/SessionsSidebar/SessionsSidebar";
import { useForm } from "../../../context/FormProvider.jsx";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const localStorageKey = `favorite_movie_${movieId}`;
  const [isFavorite, setIsFavorite] = useState(() => {
    const storedValue = localStorage.getItem(localStorageKey);
    return storedValue === "true";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [movieStorage, setMovieStorage] = useState(null);

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
      const allSchedules = JSON.parse(localStorage.getItem("allSchedules") || "[]");
      const filteredSchedule = allSchedules.filter(
        (item) => item.film_id === movieId
      );
      setScheduleData(filteredSchedule);
    };
    loadFilteredSchedule();
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
    const allSchedules = JSON.parse(localStorage.getItem("allSchedules") || "[]");
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

  useEffect(() => {
    const loadMovie = () => {
      const moviesFromStorage = localStorage.getItem("currentlyPlaying");
      const parsedMovies = JSON.parse(moviesFromStorage) || [];
      const movie = parsedMovies.find((m) => m.id === movieId);
      if (movie) {
        setMovieStorage(movie);
      } else {
        const deletedMovies = JSON.parse(
          localStorage.getItem("deletedMovies") || "[]"
        );
        if (!deletedMovies.includes(movieId)) {
          console.warn(`Movie with ID ${movieId} not found. Redirecting...`);
        }
      }
    };

    loadMovie(); // Initial load

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

  if (!movieStorage) {
    const deletedMovies = JSON.parse(
      localStorage.getItem("deletedMovies") || "[]"
    );
    if (deletedMovies.includes(movieId)) {
      return <div className="movie-hero-section loading">Redirecting...</div>;
    }
    return <div className="movie-hero-section loading">Loading...</div>;
  }

  const handleEditMovie = () => {
    openForm("edit", movieStorage);
  };

  const movieData = {
    id: movieId,
    title: "A Minecraft Movie",
    year: 2025,
    ageRating: "16+",
    duration: "1h 41m",
    genres: ["Action", "Adventure", "Comedy"],
    description:
      "Four misfits are suddenly pulled through a mysterious portal into a bizarre cubic wonderland that thrives on imagination. To get back home they'll have to master this world while embarking on a quest with an unexpected expert crafter.",
    buyPrice: "$32.50",
    rating: 4.6,
    posterUrl: "/minecraft-poster.png",
    heroImageUrl: bgImage,
    trailerVideoId: "8B1EtVPBSMw",
    cast: [
      {
        id: 1,
        name: "Jason Momoa",
        character: "Garrett",
        imageUrl: "/cast-momoa.png",
      },
      {
        id: 2,
        name: "Jack Black",
        character: "Steve",
        imageUrl: "/cast-black.png",
      },
      {
        id: 3,
        name: "Sebastian Hansen",
        character: "Henry",
        imageUrl: "/cast-hansen.png",
      },
      {
        id: 4,
        name: "Emma Myers",
        character: "Natalie",
        imageUrl: "/cast-myers.png",
      },
      {
        id: 5,
        name: "Danielle Brooks",
        character: "Dawn",
        imageUrl: "/cast-brooks.png",
      },
      {
        id: 6,
        name: "Jennifer Coolidge",
        character: "Principal",
        imageUrl: "/cast-coolidge.png",
      },
    ],
  };

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
        movie={movieStorage}
        isFavorite={isFavorite}
        onSessionsClick={handleSessionsClick}
        onFavoriteClick={handleFavoriteClick}
        onDeleteMovie={handleDeleteMovie}
        onEditMovie={handleEditMovie}
      />
      <TrailerSection videoId={movieData.trailerVideoId} />
      <ActorCarousel cast={movieData.cast} />
    </div>
  );
};

export default MovieDetailsPage;