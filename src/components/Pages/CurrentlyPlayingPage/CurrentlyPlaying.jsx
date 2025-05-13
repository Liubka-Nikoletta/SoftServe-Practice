import React, { useState, useEffect } from "react";
import "./CurrentlyPlaying.css";
import MovieCard from "../../MovieCard/MovieCard.jsx";
import FilterButton from "../../FilterButton/FilterButton";

const CurrentlyPlaying = () => {
  const [currentlyPlayingFilms, setCurrentlyPlayingFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleFilterClick = () => {
    console.log("Кнопка фільтра натиснута");
  };
  useEffect(() => {
    const loadData = async () => {
      const storedCurrentlyPlaying = localStorage.getItem("currentlyPlaying");
      const deletedMovies = JSON.parse(
        localStorage.getItem("deletedMovies") || "[]"
      );
      setLoading(true);
      if (storedCurrentlyPlaying) {
        const parsed = JSON.parse(storedCurrentlyPlaying).filter(
          (movie) => !deletedMovies.includes(movie.id)
        );
        setCurrentlyPlayingFilms(parsed.slice(0, 8));
        setLoading(false);
      } else {
        const films =
          (await import("../../../assets/films.json")).default || [];
        setCurrentlyPlayingFilms(films.slice(0, 8));
        localStorage.setItem("currentlyPlaying", JSON.stringify(films));
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="currently-playing">Завантаження фільмів...</div>;
  }

  if (error) {
    return (
      <div className="currently-playing">Помилка завантаження фільмів.</div>
    );
  }

  return (
    <div className="currently-playing">
      <div className="header-with-filter">
        {" "}
        {}
        <h1>Currently Playing</h1>
        <FilterButton onClick={handleFilterClick} />
      </div>
      <div className="movie-grid">
        {currentlyPlayingFilms.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            releaseDate={movie.release_date}
            ageRating={movie.age}
            posterUrl={movie.poster}
          />
        ))}
      </div>
    </div>
  );
};

export default CurrentlyPlaying;
