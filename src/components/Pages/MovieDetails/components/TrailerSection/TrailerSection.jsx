import React from "react";
import "./TrailerSection.css";

const TrailerSection = ({ videoId }) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <section className="trailer-section">
      <h2 className="section-title">Trailer</h2>
      <div className="video-responsive-container">
        <iframe
          className="video-iframe"
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default TrailerSection;
