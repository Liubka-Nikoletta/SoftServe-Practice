import React, { useState, useEffect } from "react";
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
  const [allSchedules, setAllSchedules] = useState([]);

  const loadMovieData = async () => {
    console.log("[MainPage.jsx] loadMovieData called");
    const deletedMovies = JSON.parse(
      localStorage.getItem("deletedMovies") || "[]"
    );

    const storedCurrentlyPlaying = localStorage.getItem("currentlyPlaying");
    let rawCurrentlyPlaying = [];
    if (storedCurrentlyPlaying) {
      try {
        rawCurrentlyPlaying = JSON.parse(storedCurrentlyPlaying);
      } catch (e) {
        console.error("Error parsing currentlyPlaying from localStorage", e);
        rawCurrentlyPlaying = [];
      }
    } else {
      rawCurrentlyPlaying =
        (await import("../../../assets/films.json")).default || [];
      localStorage.setItem(
        "currentlyPlaying",
        JSON.stringify(rawCurrentlyPlaying)
      );
    }
    const filteredCurrentlyPlaying = rawCurrentlyPlaying.filter(
      (movie) => movie && movie.id && !deletedMovies.includes(movie.id)
    );
    setCurrentlyPlayingFilms(filteredCurrentlyPlaying.slice(0, 8));

    const storedComingSoon = localStorage.getItem("comingSoon");
    let rawComingSoon = [];
    if (storedComingSoon) {
      try {
        rawComingSoon = JSON.parse(storedComingSoon);
      } catch (e) {
        console.error("Error parsing comingSoon from localStorage", e);
        rawComingSoon = [];
      }
    } else {
      rawComingSoon =
        (await import("../../../assets/coming_soon.json")).default || [];
      localStorage.setItem("comingSoon", JSON.stringify(rawComingSoon));
    }
    const filteredComingSoon = rawComingSoon.filter(
      (movie) => movie && movie.id && !deletedMovies.includes(movie.id)
    );
    setComingSoonFilms(filteredComingSoon.slice(0, 8));

    const allMoviesMap = new Map();
    [
      ...(Array.isArray(rawCurrentlyPlaying) ? rawCurrentlyPlaying : []),
      ...(Array.isArray(rawComingSoon) ? rawComingSoon : []),
    ].forEach((movie) => {
      if (movie && movie.id) {
        allMoviesMap.set(movie.id, movie);
      }
    });
    const allAvailableMovies = Array.from(allMoviesMap.values());
    const actualFavoriteFilms = allAvailableMovies
      .filter((movie) => movie && movie.id && !deletedMovies.includes(movie.id))
      .filter((movie) => {
        const favoriteKey = `favorite_movie_${movie.id}`;
        return localStorage.getItem(favoriteKey) === "true";
      });
    setFavoriteFilms(actualFavoriteFilms.slice(0, 12));
    console.log(
      "[MainPage.jsx] Favorite films loaded count:",
      actualFavoriteFilms.length,
      actualFavoriteFilms.slice(0, 12)
    );
  };

  const loadScheduleData = async () => {
    console.log("[MainPage.jsx] loadScheduleData called");
    const storedSchedules = localStorage.getItem("allSchedules");
    if (storedSchedules) {
      try {
        setAllSchedules(JSON.parse(storedSchedules));
        console.log("[MainPage.jsx] Schedules loaded from localStorage");
      } catch (error) {
        console.error("Error parsing allSchedules from localStorage", error);
        setAllSchedules([]);
        const scheduleModule = await import("../../../assets/schedule.json");
        localStorage.setItem("allSchedules", JSON.stringify(scheduleModule.default));
        setAllSchedules(scheduleModule.default);
        console.log("[MainPage.jsx] Schedules loaded from JSON and saved to localStorage");
      }
    } else {
      const scheduleModule = await import("../../../assets/schedule.json");
      localStorage.setItem("allSchedules", JSON.stringify(scheduleModule.default));
      setAllSchedules(scheduleModule.default);
      console.log("[MainPage.jsx] Schedules loaded from JSON and saved to localStorage");
    }
  };

  useEffect(() => {
    loadMovieData();
    loadScheduleData(); // Завантаження даних про сесії

    const handleMovieDataUpdated = () => {
      loadMovieData();
    };

    document.addEventListener("movieDataUpdated", handleMovieDataUpdated);

    return () => {
      document.removeEventListener("movieDataUpdated", handleMovieDataUpdated);
    };
  }, []);

  const handleMovieDeletedOnMainPage = (deletedMovieId) => {
    setCurrentlyPlayingFilms((prevFilms) =>
      prevFilms.filter((movie) => movie.id !== deletedMovieId)
    );
    setComingSoonFilms((prevFilms) =>
      prevFilms.filter((movie) => movie.id !== deletedMovieId)
    );
    setFavoriteFilms((prevFilms) =>
      prevFilms.filter((movie) => movie.id !== deletedMovieId)
    );
  };

  const handleSeeMoreClick = (carouselId) => {
    console.log(`Перехід на повну сторінку категорії: ${carouselId}`);

    let targetUrl = "";

    switch (carouselId) {
      case "currentlyPlaying":
        targetUrl = "/now-playing";
        break;
      case "comingSoon":
        targetUrl = "/coming-soon";
        break;
      case "favourites":
        targetUrl = "/favorites";
        break;
      default:
        targetUrl = "/movies";
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
        onMovieDeleted={handleMovieDeletedOnMainPage}
      />

      <MovieCarousel
        carouselId="comingSoon"
        carouselTitle="Coming Soon"
        cardsToShow={4}
        movieData={comingSoonFilms}
        currentIndex={comingSoonIndex}
        setCurrentIndex={setComingSoonIndex}
        onSeeMoreClick={handleSeeMoreClick}
        hideSeeMoreButton={true}
        onMovieDeleted={handleMovieDeletedOnMainPage}
      />

      <MovieCarousel
        carouselId="favourites"
        carouselTitle="Your Favourites"
        cardsToShow={4}
        movieData={favoriteFilms}
        currentIndex={favouritesIndex}
        setCurrentIndex={setFavouritesIndex}
        onSeeMoreClick={handleSeeMoreClick}
        onMovieDeleted={handleMovieDeletedOnMainPage}
      />

      <div className="about-us">
        <div className="about-us-content">
          <h2 className="about-us-title">About us</h2>
          <div className="about-us-description">
            <h3 className="about-us-slogan">We bring stories to life.</h3>
            <p className="about-us-text">
              Our cinema offers the latest releases, indie films, and
              unforgettable experiences for every movie lover. With cozy halls
              and modern technology, we make every visit special.
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