import React from "react";
import "./StarIcon.css";

const StarIcon = ({
  starValue,
  displayRating,
  disabled,
  allowHalf,
  maxRating,
  onClick,
  onMouseEnter,
  onStarKeyDown,
}) => {
  let iconClass;
  if (displayRating >= starValue) {
    iconClass = "fa-solid fa-star";
  } else if (displayRating >= starValue - 0.5) {
    iconClass = "fa-regular fa-star-half-stroke";
  } else {
    iconClass = "fa-regular fa-star";
  }

  return (
    <i
      className={`${iconClass} star-rating__star ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{ cursor: disabled ? "default" : "pointer" }}
      aria-label={`Оцінити ${starValue}${
        allowHalf ? ` або ${starValue - 0.5}` : ""
      } з ${maxRating}`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onStarKeyDown}
    ></i>
  );
};

export default StarIcon;
