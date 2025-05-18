import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";
import Button from "../Button/Button";
import { useFavorite } from "../../hooks/useFavorite";

const MovieCard = ({
                     id,
                     title,
                     releaseDate,
                     ageRating,
                     posterUrl,
                     onDelete,
                     onEdit,
                   }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { isLiked, toggleLike } = useFavorite(id);

  useEffect(() => {
    const checkAdminStatus = () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      setIsAdmin(currentUser && currentUser.role === "admin");
    };

    checkAdminStatus();

    const handleAuthChange = () => {
      checkAdminStatus();
    };

    document.addEventListener("authStatusChanged", handleAuthChange);

    return () => {
      document.removeEventListener("authStatusChanged", handleAuthChange);
    };
  }, []);

  const confirmAndDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  return (
      <div className="movie-card__container">
        <div className="movie-card__poster-wrapper">
          <img
              src={posterUrl}
              alt={`Poster of movie: ${title}`}
              className="movie-card__poster-image"
          />
          <div className="movie-card__gradient"></div>
        </div>
        <div className="movie-card__content">
          <h3 className="movie-card__title">{title}</h3>
          <p className="movie-card__release-date">{releaseDate}</p>
          <span className="movie-card__age-rating">{ageRating}</span>
          <div className="movie-card__button-wrapper">
            <Link to={`/movie/${id || "unknown"}`} className="movie-card__link">
              <Button text="Details" />
            </Link>

            <Button
                icon={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}
                size="small"
                onClick={toggleLike}
                className={isLiked ? "liked" : ""}
            />
          </div>

          {isAdmin && (
              <div className="admin-buttons-container">
                <button onClick={onEdit} className="admin-button edit-button">
                  <i className="fa-solid fa-edit"></i> Edit
                </button>
                <button
                    onClick={confirmAndDelete}
                    className="admin-button delete-button"
                >
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
          )}
        </div>
      </div>
  );
};

export default MovieCard;
