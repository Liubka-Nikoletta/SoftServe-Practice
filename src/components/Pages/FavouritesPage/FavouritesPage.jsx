import React, { useState, useEffect } from 'react';
import './FavouritesPage.css';
import Sidebar from '../../Sidebar/Sidebar.jsx';
import MovieCard from "../../MovieCard/MovieCard.jsx";
import FilterButton from "../../FilterButton/FilterButton";


const FavouritePage = () => {
  const [favouriteFilms, setFavouriteFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFilterClick = () => {
    console.log('Кнопка фільтра натиснута');
  };

  const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

  useEffect(() => {
    const loadFavouriteMovies = async () => {
      try {
        
        const response = await import('../../../assets/films.json');
        
        const filmsData = response.default || []; 

        setFavouriteFilms(filmsData);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
        console.error("Помилка завантаження улюблених фільмів:", e);
      }
    };

  
    
    loadFavouriteMovies();
  }, []);

  if (loading) {
    return <div className="favourite-page">Завантаження улюблених фільмів...</div>;
  }

  if (error) {
    return <div className="favourite-page">Помилка завантаження улюблених фільмів.</div>;
  }
  
  return (
    <div className="favourite-page">
      <div className="header-with-filter">
        <h1>Your Favourites</h1>
        <FilterButton onClick={handleToggleSidebar} />
      </div>
      {favouriteFilms.length === 0 ? (
        <div className="no-favourites-message">
          Улюблених фільмів немає. Тут мають бути ваші улюблені фільми.
        </div>
      ) : (
        <div className="movie-grid">
          {favouriteFilms.map(movie => (
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

      )}
       <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} /> 
    </div>
  );
};

export default FavouritePage;