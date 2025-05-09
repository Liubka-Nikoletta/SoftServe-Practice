import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import MovieHero from "./components/MovieHero/MovieHero";
import TrailerSection from "./components/TrailerSection/TrailerSection";
import "./MovieDetailsPage.css";
import bgImage from "../../../assets/image.png";
import ActorCarousel from "./components/ActorCarousel/ActorCarousel";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const localStorageKey = `favorite_movie_${movieId}`;

  const getInitialFavoriteState = () => {
    const storedValue = localStorage.getItem(localStorageKey);
    return storedValue === "true";
  };

  const [isFavorite, setIsFavorite] = useState(getInitialFavoriteState);

  useEffect(() => {
    localStorage.setItem(localStorageKey, String(isFavorite));
  }, [isFavorite, localStorageKey]);

  const handleSessionsClick = () => {
    console.log("Go to sessions for movie:", movieId);
  };

  const handleFavoriteClick = () => {
    setIsFavorite((currentIsFavorite) => !currentIsFavorite);
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
