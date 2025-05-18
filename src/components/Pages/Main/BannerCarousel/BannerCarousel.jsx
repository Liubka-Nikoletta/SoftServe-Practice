import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BannerCarousel.css";
import Button from "../../../Button/Button.jsx";
import { useFavorite } from "../../../../hooks/useFavorite.js";

const AUTO_SCROLL_INTERVAL = 5000;

const BannerCarousel = ({ films }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentFilm = films[currentSlide];
  const navigate = useNavigate();

  const { isLiked, toggleLike } = useFavorite(currentFilm?.id);

  useEffect(() => {
    if (films.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % films.length);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [films]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + films.length) % films.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % films.length);
  };

  if (!currentFilm || !currentFilm.background_image) return null;

  const handleDetailsClick = () => {
    if (currentFilm && currentFilm.id) {
      navigate(`/movie/${currentFilm.id}`);
    } else {
      console.error("Movie not found.", currentFilm);
    }
  };

  return (
    <div
      className="hero-carousel"
      style={{
        backgroundImage: `url(${currentFilm.background_image})`,
      }}
    >
      <div className="overlay"></div>
      <div className="hero-content">
        <div className="hero-title-nav">
          <button className="nav-btn" onClick={handlePrev}>
            &lt;
          </button>
          <h1>{currentFilm.title}</h1>
          <button className="nav-btn" onClick={handleNext}>
            &gt;
          </button>
        </div>
        <p>{currentFilm.description}</p>
        <div className="hero-buttons">
          <Button text="Детально" onClick={handleDetailsClick} size="medium" />
          <Button
            icon={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}
            onClick={toggleLike}
            size="small"
            className={isLiked ? "liked" : ""}
          />
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
