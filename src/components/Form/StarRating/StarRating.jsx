import React, { useState } from "react";
import StarIcon from "../StarIcon/StarIcon";
import "./StarRating.css";

const StarRating = ({
  maxRating = 10,
  rating,
  onRatingChange,
  disabled = false,
  allowHalf = true,
  errorMessage,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const calculateInteractiveValue = (starBaseValue, event) => {
    if (!allowHalf || !event || !event.currentTarget) {
      return starBaseValue;
    }
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    if (mouseX < target.offsetWidth / 2) {
      return starBaseValue - 0.5;
    }
    return starBaseValue;
  };

  const handleStarHover = (starBaseValue, event) => {
    if (!disabled) {
      setHoverRating(calculateInteractiveValue(starBaseValue, event));
    }
  };

  const handleStarClick = (starBaseValue, event) => {
    if (!disabled && onRatingChange) {
      onRatingChange(calculateInteractiveValue(starBaseValue, event));
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  const handleStarKeyDown = (starIterationValue, event) => {
    if (!disabled && (event.key === "Enter" || event.key === " ")) {
      if (onRatingChange) {
        onRatingChange(starIterationValue);
      }
    }
  };

  const displayRating = hoverRating !== 0 ? hoverRating : rating || 0;

  return (
    <div className="form-field">
      <span className="form-field__label">Rating:</span>
      <div className="star-rating__container" onMouseLeave={handleMouseLeave}>
        {[...Array(maxRating)].map((_, index) => {
          const starIterationValue = index + 1;
          return (
            <StarIcon
              key={starIterationValue}
              starValue={starIterationValue}
              displayRating={displayRating}
              disabled={disabled}
              allowHalf={allowHalf}
              maxRating={maxRating}
              onClick={(e) => handleStarClick(starIterationValue, e)}
              onMouseEnter={(e) => handleStarHover(starIterationValue, e)}
              onStarKeyDown={(e) => handleStarKeyDown(starIterationValue, e)} // Передаємо обробник
            />
          );
        })}
      </div>
      {errorMessage && (
        <span className="star-rating__error">{errorMessage}</span>
      )}
    </div>
  );
};

export default StarRating;
