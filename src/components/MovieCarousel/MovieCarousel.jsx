import React, { useEffect } from "react";
import MovieCard from "../MovieCard/MovieCard.jsx";
import "./MovieCarousel.css";
import { useForm } from "../../context/FormProvider.jsx";

const MovieCarousel = ({
  carouselId,
  carouselTitle,
  cardsToShow = 4,
  movieData = [],
  currentIndex,
  setCurrentIndex,
  onSeeMoreClick,
  hideSeeMoreButton = false,
  onMovieDeleted,
}) => {
  const hasValidData = Array.isArray(movieData) && movieData.length > 0;
  const canScroll = hasValidData && movieData.length > cardsToShow;
  const { openForm } = useForm();

  useEffect(() => {
    if (hasValidData) {
      if (currentIndex >= movieData.length && movieData.length > 0) {
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex !== 0) {
        setCurrentIndex(0);
      }
    }
  }, [movieData, currentIndex, setCurrentIndex, hasValidData]);

  const goLeft = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev <= 0 ? Math.max(movieData.length - 1, 0) : prev - 1;
      console.log(
        `${carouselTitle} - гортання вліво, новий індекс: ${newIndex}`
      );
      return newIndex;
    });
  };

  const goRight = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev >= movieData.length - 1 ? 0 : prev + 1;
      console.log(
        `${carouselTitle} - гортання вправо, новий індекс: ${newIndex}`
      );
      return newIndex;
    });
  };

  const handleSeeMoreClick = () => {
    if (onSeeMoreClick) {
      onSeeMoreClick(carouselId);
    }
  };

  const getVisibleMovies = () => {
    if (!hasValidData) return [];

    console.log(
      `${carouselTitle} - ДЕБАГ: movieData.length = ${movieData.length}, currentIndex = ${currentIndex}`
    );

    if (movieData.length <= cardsToShow) {
      return movieData;
    }

    let visibleMovies = [];
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % movieData.length;
      visibleMovies.push(movieData[index]);
    }

    console.log(
      `${carouselTitle} - Вибрано ${visibleMovies.length} фільмів починаючи з ${currentIndex}`
    );

    return visibleMovies;
  };

  const handleDeleteMovieInCarousel = (movieId) => {
    const deletedMovies = JSON.parse(
      localStorage.getItem("deletedMovies") || "[]"
    );
    if (!deletedMovies.includes(movieId)) {
      deletedMovies.push(movieId);
      localStorage.setItem("deletedMovies", JSON.stringify(deletedMovies));
    }
    if (onMovieDeleted) {
      onMovieDeleted(movieId);
    }
  };

  return (
    <div className={`movie-carousel-wrapper ${carouselId}`}>
      <div className="carousel-header">
        <h2 className="carousel-title">{carouselTitle}</h2>
        {!hideSeeMoreButton && (
          <button className="see-more-button" onClick={handleSeeMoreClick}>
            see more <span className="see-more-arrow">→</span>
          </button>
        )}
      </div>
      <div className="movie-carousel">
        <button
          onClick={goLeft}
          className="carousel-btn left"
          style={{ opacity: hasValidData ? 1 : 0.3 }}
        >
          {"<"}
        </button>

        <div className="movie-cards-container">
          {!hasValidData ? (
            <p>Немає доступних фільмів</p>
          ) : (
            getVisibleMovies().map((movie, index) => (
              <MovieCard
                key={`${movie.id || carouselId}-${index}`}
                id={movie.id}
                title={movie.title || "Назва фільму"}
                releaseDate={movie.release_date || "Немає дати"}
                ageRating={movie.age || "0+"}
                posterUrl={movie.poster || "placeholder.jpg"}
                onDelete={handleDeleteMovieInCarousel}
                onEdit={() => openForm("edit", movie)}
              />
            ))
          )}
        </div>

        <button
          onClick={goRight}
          className="carousel-btn right"
          style={{ opacity: hasValidData ? 1 : 0.3 }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;
