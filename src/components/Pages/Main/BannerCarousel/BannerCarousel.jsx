import React, { useEffect, useState } from "react";
import "./BannerCarousel.css";
import Button from "../../../Button/Button.jsx";

const AUTO_SCROLL_INTERVAL = 5000;

const BannerCarousel = ({ films }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (films.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % films.length);
        }, AUTO_SCROLL_INTERVAL);

        return () => clearInterval(interval);
    }, [films]);

    if (!films || films.length === 0) return null;

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + films.length) % films.length);
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % films.length);
    };

    const currentFilm = films[currentSlide];

    if (!currentFilm || !currentFilm.background_image) {
        return null;
    }

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
                    <button className="nav-btn" onClick={handlePrev}>&lt;</button>
                    <h1>{currentFilm.title}</h1>
                    <button className="nav-btn" onClick={handleNext}>&gt;</button>
                </div>
                <p>{currentFilm.description}</p>
                <div className="hero-buttons">
                    <Button text="Детально" onClick={() => console.log("Перейти")} size="medium"/>
                    <Button icon="fa-regular fa-heart" onClick={() => console.log("Like")} size="small"/>
                </div>
            </div>
        </div>
    );
};

export default BannerCarousel;
