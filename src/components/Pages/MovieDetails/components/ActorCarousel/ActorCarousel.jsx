import React, { useState, useEffect, useRef } from "react";
import ActorCard from "../ActorCard/ActorCard.jsx";
import "./ActorCarousel.css";

const ActorCarousel = ({ cast }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const calculateCardsToShow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 220;
        const maxCards = Math.floor(containerWidth / cardWidth);
        setCardsToShow(Math.max(1, maxCards));
      }
    };

    calculateCardsToShow();
    window.addEventListener("resize", calculateCardsToShow);
    return () => window.removeEventListener("resize", calculateCardsToShow);
  }, []);

  const goLeft = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return Math.max(cast.length - cardsToShow, 0);
      }
      return prevIndex - 1;
    });
  };

  const goRight = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= cast.length - cardsToShow) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  return (
    <section className="actor-carousel-wrapper">
      <h2 className="carousel-title">Cast</h2>
      <div className="actor-carousel" ref={containerRef}>
        <button onClick={goLeft} className="carousel-btn left">
          {"<"}
        </button>

        <div className="actor-cards-container">
          {cast.slice(currentIndex, currentIndex + cardsToShow).map((actor) => (
            <ActorCard key={actor.id || actor.name} actor={actor} />
          ))}
        </div>

        <button onClick={goRight} className="carousel-btn right">
          {">"}
        </button>
      </div>
    </section>
  );
};

export default ActorCarousel;
