import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import MovieHero from "./components/MovieHero/MovieHero";
import TrailerSection from "./components/TrailerSection/TrailerSection";
import "./MovieDetailsPage.css";
import bgImage from "../../../assets/image.png";
import ActorCarousel from "./components/ActorCarousel/ActorCarousel";
import SessionsSidebar from "./components/SessionsSidebar/SessionsSidebar";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const localStorageKey = `favorite_movie_${movieId}`;

  const getInitialFavoriteState = () => {
    const storedValue = localStorage.getItem(localStorageKey);
    return storedValue === "true";
  };

  const [isFavorite, setIsFavorite] = useState(getInitialFavoriteState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, String(isFavorite));
  }, [isFavorite, localStorageKey]);

  useEffect(() => {
    const loadFilteredSchedule = async () => {
      try {
        const storedSchedule = localStorage.getItem(
          `schedule_movie_${movieId}`
        );
        if (storedSchedule) {
          setScheduleData(JSON.parse(storedSchedule));
        } else {
          const scheduleModule = await import("../../../assets/schedule.json");
          const schedule = scheduleModule.default;

          const filteredSchedule = schedule.filter(
            (item) => item.film_id === movieId
          );
          setScheduleData(filteredSchedule);
        }
      } catch (error) {
        console.error("Error loading schedule data:", error);
      }
    };

    loadFilteredSchedule();
  }, [movieId]);

  const handleSessionsClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen((prevState) => !prevState);
      setIsClosing(false);
    }, 300);
  };

  const handleFavoriteClick = () => {
    setIsFavorite((currentIsFavorite) => !currentIsFavorite);
  };

  const handleScheduleUpdate = (updatedSchedule) => {
    setScheduleData(updatedSchedule);
    localStorage.setItem(
      `schedule_movie_${movieId}`,
      JSON.stringify(updatedSchedule)
    );
  };

  const movieData = {
    title: "A Minecraft Movie",
    year: 2025,
    ageRating: "16+",
    duration: "1h 41m",
    genres: ["Action", "Adventure", "Comedy"],
    description:
      "Four misfits are suddenly pulled through a mysterious portal into a bizarre cubic wonderland that thrives on imagination. To get back home they'll have to master this world while embarking on a quest with an unexpected expert crafter.",
    buyPrice: "$32.50",
    rating: 4.6,
    posterUrl: "/minecraft-poster.png",
    heroImageUrl: bgImage,
    trailerVideoId: "8B1EtVPBSMw",
    cast: [
      {
        id: 1,
        name: "Jason Momoa",
        character: "Garrett",
        imageUrl: "/cast-momoa.png",
      },
      {
        id: 2,
        name: "Jack Black",
        character: "Steve",
        imageUrl: "/cast-black.png",
      },
      {
        id: 3,
        name: "Sebastian Hansen",
        character: "Henry",
        imageUrl: "/cast-hansen.png",
      },
      {
        id: 4,
        name: "Emma Myers",
        character: "Natalie",
        imageUrl: "/cast-myers.png",
      },
      {
        id: 5,
        name: "Danielle Brooks",
        character: "Dawn",
        imageUrl: "/cast-brooks.png",
      },
      {
        id: 6,
        name: "Jennifer Coolidge",
        character: "Principal",
        imageUrl: "/cast-coolidge.png",
      },
    ],
  };

  return (
    <div className="movie-details-page">
      <SessionsSidebar
        isOpen={isSidebarOpen}
        onClose={handleSessionsClick}
        isClosing={isClosing}
        schedule={scheduleData}
        onScheduleUpdate={handleScheduleUpdate}
      />
      <MovieHero
        movie={movieData}
        isFavorite={isFavorite}
        onSessionsClick={handleSessionsClick}
        onFavoriteClick={handleFavoriteClick}
      />
      <TrailerSection videoId={movieData.trailerVideoId} />
      <ActorCarousel cast={movieData.cast} />
    </div>
  );
};

export default MovieDetailsPage;
