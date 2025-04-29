import React from "react";
import "./CastMemberCard.css";

const CastMemberCard = ({ member }) => {
  return (
    <div className="cast-member-card">
      <img
        src={member.imageUrl}
        alt={member.name}
        className="cast-member-photo"
      />
      <p className="cast-member-name">{member.name}</p>
      <p className="cast-member-character">{member.character}</p>
    </div>
  );
};

export default CastMemberCard;
