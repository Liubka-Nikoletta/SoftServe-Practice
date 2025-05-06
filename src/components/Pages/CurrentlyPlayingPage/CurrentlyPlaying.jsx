import React, { useState, useEffect } from 'react';
import './CurrentlyPlaying.css';
import MovieCard from "../../MovieCard/MovieCard.jsx";
import FilterButton from "../../FilterButton/FilterButton";

const CurrentlyPlaying = () => {
  const [currentlyPlayingFilms, setCurrentlyPlayingFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleFilterClick = () => {
    console.log('Кнопка фільтра натиснута');
  };
  useEffect(() => {
    const loadCurrentlyPlayingMovies = async () => {
      try {
        const response = await import('../../../assets/films.json');
        setCurrentlyPlayingFilms(response.default || []);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
        console.error("Помилка завантаження фільмів:", e);
      }
    };

    loadCurrentlyPlayingMovies();
  }, []);

  if (loading) {
    return <div className="currently-playing">Завантаження фільмів...</div>;
  }

  if (error) {
    return <div className="currently-playing">Помилка завантаження фільмів.</div>;
  }

  return (
    <div className="currently-playing">
      <div className="header-with-filter"> {}
        <h1>Currently Playing</h1>
        <FilterButton onClick={handleFilterClick} />
      </div>
      <div className="movie-grid">
        {currentlyPlayingFilms.map(movie => (
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