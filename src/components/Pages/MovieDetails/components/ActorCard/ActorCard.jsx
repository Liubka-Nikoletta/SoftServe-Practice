import React from "react";
import "./ActorCard.css";

const ActorCard = ({ actor }) => {
  return (
    <div className="actor-card">
      <img src={actor.imageUrl} alt={actor.name} className="actor-photo" />
      <p className="actor-name">{actor.name}</p>
      <p className="actor-character">{actor.character}</p>
    </div>
  );
};

export default ActorCard;
