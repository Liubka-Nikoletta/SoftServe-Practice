import React from "react";
import CastMemberCard from "../CastMemberCard/CastMemberCard";
import "./CastSection.css";

const CastSection = ({ cast }) => {
  return (
    <section className="cast-section">
      <h2 className="section-title">Cast</h2>
      <div className="cast-list-flex">
        {cast.map((member) => (
          <CastMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
};

export default CastSection;
