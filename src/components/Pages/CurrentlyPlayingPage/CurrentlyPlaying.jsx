import React, { useState, useEffect, useCallback } from "react";
import "./CurrentlyPlaying.css";
import MovieCard from "../../MovieCard/MovieCard.jsx";
import FilterButton from "../../FilterButton/FilterButton";
import FilterPanel from "../../FilterPanel/FilterPanel";

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

const CurrentlyPlaying = () => {
  const [allCurrentlyPlayingFilms, setAllCurrentlyPlayingFilms] = useState([]);
  const [displayedFilms, setDisplayedFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const storedCurrentlyPlaying = localStorage.getItem("currentlyPlaying");
        const deletedMovies = JSON.parse(localStorage.getItem("deletedMovies") || "[]");
        let filmsData = [];

        if (storedCurrentlyPlaying) {
          filmsData = JSON.parse(storedCurrentlyPlaying).filter(
            (movie) => movie && movie.id && !deletedMovies.includes(movie.id)
          );
        } else {
          console.warn("No 'currentlyPlaying' films found in localStorage. Consider seeding initial data.");
        }
        setAllCurrentlyPlayingFilms(filmsData);
        setDisplayedFilms(filmsData);

        const storedSchedules = localStorage.getItem("allSchedules");
        if (storedSchedules) {
          setSchedules(JSON.parse(storedSchedules));
        } else {
          console.warn("No 'allSchedules' found in localStorage.");
        }
        setError(null);
      } catch (err) {
        console.error("Помилка завантаження даних CurrentlyPlaying:", err);
        setError(err);
        setAllCurrentlyPlayingFilms([]);
        setDisplayedFilms([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFilterClick = () => {
    setIsFilterPanelOpen(true);
  };

  const handleCloseFilterPanel = () => {
    setIsFilterPanelOpen(false);
  };

  const handleFilterChange = useCallback((filters) => {
    console.log("Застосовані фільтри в CurrentlyPlaying:", filters);
    let filteredMovies = [...allCurrentlyPlayingFilms];
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
  }, [allCurrentlyPlayingFilms, schedules]);
  if (loading) {
    return <div className="currently-playing">Завантаження фільмів...</div>;
  }

  if (error) {
    return (
      <div className="currently-playing">Помилка завантаження фільмів: {error.message}</div>
    );
  }

  return (
    <div className="currently-playing">
      <div className="header-with-filter">
        <h1>Currently Playing</h1>
        <FilterButton onClick={handleFilterClick} />
      </div>
      {displayedFilms.length > 0 ? (
        <div className="movie-grid">
          {displayedFilms.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              releaseDate={movie.release_date}
              ageRating={movie.age}
              posterUrl={movie.poster}
              rating={movie.rating}
            />
          ))}
        </div>
      ) : (
        <div className="no-movies-message">Фільмів за обраними критеріями не знайдено.</div>
      )}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={handleCloseFilterPanel}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default CurrentlyPlaying;