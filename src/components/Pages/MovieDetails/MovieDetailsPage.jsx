import React from "react";
import { useParams, Link } from "react-router-dom";
import MovieHero from "./components/MovieHero/MovieHero";
import CastSection from "./components/CastSection/CastSection";
import TrailerSection from "./components/TrailerSection/TrailerSection";
import "./MovieDetailsPage.css";

const MovieDetailsPage = () => {
  const { movieId } = useParams();

  const movieData = {
    title: "A Minecraft Movie",
    year: 2025,
    ageRating: "16+",
    duration: "1h 41m",
    genres: ["Action", "Adventure", "Comedy"],
    description:
      "Four misfits are suddenly pulled through a mysterious portal into a bizarre cubic wonderland that thrives on imagination. To get back home they'll have to master this world while embarking on a quest with an unexpected expert crafter.",
    buyPrice: "$32.50",
    rating: 4,
    posterUrl: "/minecraft-poster.png",
    heroImageUrl: "/image.png",
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
      <MovieHero movie={movieData} />
      <TrailerSection videoId={movieData.trailerVideoId} />
      <CastSection cast={movieData.cast} />
    </div>
  );
};

export default MovieDetailsPage;
