import React, { useState, useEffect } from 'react';
import "./MainPage.css";
import cinemaImg from "../../../assets/cinema.png";
import MovieCarousel from "../../MovieCarousel/MovieCarousel.jsx";
import BannerCarousel from "./BannerCarousel/BannerCarousel.jsx";

const MainPage = () => {
    const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(0);
    const [comingSoonIndex, setComingSoonIndex] = useState(0);
    const [favouritesIndex, setFavouritesIndex] = useState(0);

    const [currentlyPlayingFilms, setCurrentlyPlayingFilms] = useState([]);
    const [comingSoonFilms, setComingSoonFilms] = useState([]);
    const [favoriteFilms, setFavoriteFilms] = useState([]);
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const films = (await import("../../../assets/films.json")).default || [];
                const comingSoon = (await import("../../../assets/coming_soon.json")).default || [];
                
                console.log("films.json має елементів:", films.length);
                console.log("coming_soon.json має елементів:", comingSoon.length);
                
                setCurrentlyPlayingFilms(films.slice(0, 8));
                setComingSoonFilms([...comingSoon]);
                setFavoriteFilms(films.slice(8, 12));
                
                console.log("Coming Soon перший фільм:", comingSoon[0]?.title || "Немає даних");
                console.log("Favourites перший фільм:", films[8]?.title || "Немає даних");
            } catch (error) {
                console.error("Помилка завантаження даних:", error);
                setComingSoonFilms([
                    {
                        id: "test1",
                        title: "Тестовий фільм 1",
                        release_date: "01.06.2023",
                        age: "16+",
                        poster: "placeholder.jpg"
                    },
                    {
                        id: "test2",
                        title: "Тестовий фільм 2",
                        release_date: "15.06.2023",
                        age: "12+",
                        poster: "placeholder.jpg"
                    }
                ]);
            }
        };
        
        loadData();
    }, []);

    const handleDetailsClick = () => {
        console.log('Перехід на сторінку фільму');
    };
    
    const handleSeeMoreClick = (carouselId) => {
        console.log(`Перехід на повну сторінку категорії: ${carouselId}`);
        
        let targetUrl = '';
        
        switch(carouselId) {
            case 'currentlyPlaying':
                targetUrl = '/now-playing';
                break;
            case 'comingSoon':
                targetUrl = '/coming-soon';
                break;
            case 'favourites':
                targetUrl = '/favorites';
                break;
            default:
                targetUrl = '/movies';
        }

        window.location.href = targetUrl;
    };

    return (
        <div className="main-page">
            <BannerCarousel films={currentlyPlayingFilms} />

            <MovieCarousel
                carouselId="currentlyPlaying"
                carouselTitle="Currently Playing"
                cardsToShow={4}
                movieData={currentlyPlayingFilms}
                currentIndex={currentlyPlayingIndex}
                setCurrentIndex={setCurrentlyPlayingIndex}
                onSeeMoreClick={handleSeeMoreClick}
            />

            <MovieCarousel
                carouselId="comingSoon"
                carouselTitle="Coming Soon"
                cardsToShow={4}
                movieData={comingSoonFilms}
                currentIndex={comingSoonIndex}
                setCurrentIndex={setComingSoonIndex}
                onSeeMoreClick={handleSeeMoreClick}
            />

            <MovieCarousel
                carouselId="favourites"
                carouselTitle="Your Favourites"
                cardsToShow={4}
                movieData={favoriteFilms}
                currentIndex={favouritesIndex}
                setCurrentIndex={setFavouritesIndex}
                onSeeMoreClick={handleSeeMoreClick}
            />

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