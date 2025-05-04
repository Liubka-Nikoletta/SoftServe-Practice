import React, { useState } from 'react';
import MovieCard from "../MovieCard/MovieCard.jsx";
import films from '../../assets/films.json';
import './MovieCarousel.css'

const MovieCarousel = ({ cardsToShow, carouselTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goLeft = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex === 0) {
                return films.length - cardsToShow;
            }
            return prevIndex - 1;
        });
    };

    const goRight = () => {
        setCurrentIndex((prevIndex) => {
            if (prevIndex >= films.length - cardsToShow) {
                return 0;
            }
            return prevIndex + 1;
        });
    };

    return (
        <div className="movie-carousel-wrapper">
            <h2 className="carousel-title">{carouselTitle}</h2>
            <div className="movie-carousel">
                <button onClick={goLeft} className="carousel-btn left">{"<"}</button>

                <div className="movie-cards-container">
                    {films.slice(currentIndex, currentIndex + cardsToShow).map((movie) => (
                        <MovieCard
                            key={movie.id}
                            title={movie.title}
                            releaseDate={movie.release_date}
                            ageRating={movie.age}
                            posterUrl={movie.poster}
                        />
                    ))}
                </div>

                <button onClick={goRight} className="carousel-btn right">{">"}</button>
            </div>
        </div>
    );
};

export default MovieCarousel;
