import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button/Button.jsx';
import './MainPage.css';
import bgImage from '../../../assets/image.png';
import cinemaImg from '../../../assets/cinema.png';
import MovieCarousel from "../../MovieCarousel/MovieCarousel.jsx";

const MainPage = () => {
    const navigate = useNavigate();

    const handleDetailsClick = () => {
        navigate('/movie');
    };

    return (
        <div className="main-page">
            <div className="main-page-background" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="main-page-content">
                    <h1>A Minecraft Movie</h1>
                    <h2>
                        Four misfits are suddenly pulled through a mysterious portal into a bizarre
                        cubic wonderland that thrives on imagination...
                    </h2>
                    <div className="main-page-btn">
                        <Button text="Details" onClick={handleDetailsClick} size="medium" />
                        <Button icon="fa-regular fa-heart" size="small" onClick={handleDetailsClick}/>
                    </div>
                </div>
            </div>

            <MovieCarousel cardsToShow={4} carouselTitle="Currently playing" />

            <div className="about-us">
                <div className="about-us-content">
                    <h2 className="about-us-title">About us</h2>
                    <div className="about-us-description">
                        <h3 className="about-us-slogan">We bring stories to life.</h3>
                        <p className="about-us-text">
                            Our cinema offers the latest releases, indie films, and unforgettable
                            experiences for every movie lover. With cozy halls and modern technology,
                            we make every visit special.
                        </p>
                    </div>
                    <h3 className="about-us-cta">Enjoy the magic of cinema with us.</h3>
                </div>
                <img src={cinemaImg} alt="Cinema" className="about-us-image" />
            </div>
        </div>
    );
};

export default MainPage;
