import React, { useState, useEffect, useCallback } from 'react';
import './FavouritesPage.css';
import MovieCard from "../../MovieCard/MovieCard.jsx";
import FilterButton from "../../FilterButton/FilterButton";
import FilterPanel from "../../FilterPanel/FilterPanel";
import { useForm } from "../../../context/FormProvider.jsx";

const TODAY_AT_MIDNIGHT = new Date();
TODAY_AT_MIDNIGHT.setHours(0, 0, 0, 0);

const getTargetDateString = (sessionDateFilterType, specificDate) => {
  if (sessionDateFilterType === 'today') {
    const today = new Date(TODAY_AT_MIDNIGHT);
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  } else if (sessionDateFilterType === 'tomorrow') {
    const tomorrow = new Date(TODAY_AT_MIDNIGHT);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`;
  } else if (sessionDateFilterType === 'specific' && specificDate) {
    return specificDate;
  }
  return null;
};

const monthMap = {
  'січень': '01', 'лютий': '02', 'березень': '03', 'квітень': '04',
  'травень': '05', 'червень': '06', 'липень': '07', 'серпень': '08',
  'вересень': '09', 'жовтень': '10', 'листопад': '11', 'грудень': '12'
};

const FavouritePage = () => {
  const [allFavouriteFilms, setAllFavouriteFilms] = useState([]);
  const [displayedFilms, setDisplayedFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
    const { openForm } = useForm();

  const loadFavouriteMovies = useCallback(() => {
    setLoading(true);
    try {
      const storedCurrentlyPlaying = localStorage.getItem("currentlyPlaying");
      const storedComingSoon = localStorage.getItem("comingSoon");
      const deletedMovies = JSON.parse(localStorage.getItem("deletedMovies") || "[]");

      let allSourceMovies = [];
      if (storedCurrentlyPlaying) {
        allSourceMovies = allSourceMovies.concat(JSON.parse(storedCurrentlyPlaying));
      }
      if (storedComingSoon) {
        allSourceMovies = allSourceMovies.concat(JSON.parse(storedComingSoon));
      }

      const uniqueMovies = allSourceMovies.filter((movie, index, self) =>
        movie && movie.id && index === self.findIndex((m) => m && m.id === movie.id)
      );

      const favouriteMovies = uniqueMovies.filter(movie => {
        const favoriteKey = `favorite_movie_${movie.id}`;
        return localStorage.getItem(favoriteKey) === "true" && !deletedMovies.includes(movie.id);
      });

      setAllFavouriteFilms(favouriteMovies);
      setDisplayedFilms(favouriteMovies);
      setError(null);
    } catch (e) {
      setError(e);
      console.error("Помилка завантаження улюблених фільмів:", e);
      setAllFavouriteFilms([]);
      setDisplayedFilms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavouriteMovies();

    const storedSchedules = localStorage.getItem("allSchedules");
    if (storedSchedules) {
      setSchedules(JSON.parse(storedSchedules));
    } else {
       console.warn("No 'allSchedules' found in localStorage for FavouritesPage.");
    }

    const handleMovieDataUpdated = () => {
      loadFavouriteMovies();
    };
    window.addEventListener("movieDataUpdated", handleMovieDataUpdated);
    return () => {
      window.removeEventListener("movieDataUpdated", handleMovieDataUpdated);
    };
  }, [loadFavouriteMovies]);

  const handleFilterClick = () => {
    setIsFilterPanelOpen(true);
  };

  const handleCloseFilterPanel = () => {
    setIsFilterPanelOpen(false);
  };

  const handleDeleteMovie = (movieIdToDelete) => {
    const updatedFavourites = allFavouriteFilms.filter(
      (movie) => movie.id !== movieIdToDelete
    );
    setAllFavouriteFilms(updatedFavourites);
    setDisplayedFilms(updatedFavourites);

    const deletedMovies = JSON.parse(localStorage.getItem("deletedMovies") || "[]");
    if (!deletedMovies.includes(movieIdToDelete)) {
      deletedMovies.push(movieIdToDelete);
      localStorage.setItem("deletedMovies", JSON.stringify(deletedMovies));
    }
  };

  
  const handleFilterChange = useCallback((filters) => {
    console.log("Застосовані фільтри в FavouritesPage:", filters);
    let filteredMovies = [...allFavouriteFilms];
    const currentYearForSchedule = new Date().getFullYear();
    const { sessionDateFilter, sessionStartTime, sessionEndTime } = filters;
    const targetDateString = getTargetDateString(sessionDateFilter.type, sessionDateFilter.date);

    if (targetDateString || (sessionStartTime > 0 || sessionEndTime < (24 * 60 - 1))) {
        filteredMovies = filteredMovies.filter(movie => {
            if (!movie || !movie.id) return false;
            const movieSchedules = schedules.filter(s => s.film_id === movie.id);
            if (!movieSchedules.length) return false;

            return movieSchedules.some(schedule => {
                let scheduleDateMatches = !targetDateString;
                if (targetDateString) {
                    const scheduleMonthStr = schedule.month ? schedule.month.toLowerCase() : '';
                    const scheduleMonthNum = monthMap[scheduleMonthStr];
                    if (!scheduleMonthNum) return false;
                    const scheduleDayPadded = schedule.day.toString().padStart(2, '0');
                    const scheduleFullDate = `${currentYearForSchedule}-${scheduleMonthNum}-${scheduleDayPadded}`;
                    scheduleDateMatches = scheduleFullDate === targetDateString;
                }
                if (targetDateString && !scheduleDateMatches) return false;

                const isTimeFiltered = sessionStartTime > 0 || sessionEndTime < (24 * 60 - 1);
                if (!isTimeFiltered) return scheduleDateMatches;

                if (!schedule.showtimes || schedule.showtimes.length === 0) return false;

                return schedule.showtimes.some(timeStr => {
                    const [hours, minutes] = timeStr.split(':').map(Number);
                    const timeInMinutes = hours * 60 + minutes;
                    return timeInMinutes >= sessionStartTime && timeInMinutes <= sessionEndTime;
                });
            });
        });
    }

    filteredMovies = filteredMovies.filter(movie => movie.rating >= filters.minRating && movie.rating <= filters.maxRating);

    if (filters.genres && filters.genres.length > 0) {
      filteredMovies = filteredMovies.filter(movie => {
        const movieGenres = Array.isArray(movie.genre) ? movie.genre : [movie.genre].filter(Boolean);
        return filters.genres.some(selectedGenre => movieGenres.includes(selectedGenre));
      });
    }
    if (filters.ageRatings && filters.ageRatings.length > 0) {
      const selectedAges = filters.ageRatings.map(age => parseInt(age.replace('+', ''), 10)).sort((a, b) => a - b);

      filteredMovies = filteredMovies.filter(movie => {
        const movieAge = parseInt(movie.age.replace('+', ''), 10);
        if (selectedAges.length === 1) {
          return movieAge >= selectedAges[0];
        } else if (selectedAges.length > 1) {
          return movieAge >= selectedAges[0] && movieAge <= selectedAges[selectedAges.length - 1];
        }
        return true; 
      });
    }

    if (filters.sortBy) {
      const parseDate = (dateStr) => {
        if (!dateStr || typeof dateStr !== 'string') return new Date(0);
        const parts = dateStr.split('.');
        if (parts.length === 3) {
          return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return new Date(0);
      };
      switch (filters.sortBy) {
        case 'newest':
          filteredMovies.sort((a, b) => parseDate(b.release_date) - parseDate(a.release_date));
          break;
        case 'oldest':
          filteredMovies.sort((a, b) => parseDate(a.release_date) - parseDate(b.release_date));
          break;
        case 'title_asc':
          filteredMovies.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
          break;
        case 'title_desc':
          filteredMovies.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
          break;
        case 'rating_desc':
          filteredMovies.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'rating_asc':
          filteredMovies.sort((a, b) => (a.rating || 0) - (b.rating || 0));
          break;
        default:
          break;
      }
    }

    setDisplayedFilms(filteredMovies);
  }, [allFavouriteFilms, schedules]);

  if (loading) {
    return <div className="favourite-page">Завантаження улюблених фільмів...</div>;
  }

  if (error) {
    return <div className="favourite-page">Помилка завантаження улюблених фільмів: {error.message}</div>;
  }

  return (
    <div className="favourite-page">
      <div className="header-with-filter">
        <h1>Your Favourites</h1>
        <FilterButton onClick={handleFilterClick} />
      </div>
      {displayedFilms.length === 0 ? (
        <div className="no-favourites-message">
          Улюблених фільмів за обраними критеріями немає.
        </div>
      ) : (
        <div className="movie-grid">
          {displayedFilms.map(movie => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              releaseDate={movie.release_date}
              ageRating={movie.age}
              posterUrl={movie.poster}
              rating={movie.rating}
              onDelete={handleDeleteMovie}
              onEdit={() => openForm("edit", movie)}
            />
          ))}
        </div>
      )}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={handleCloseFilterPanel}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default FavouritePage;