import React, { useState, useEffect, useRef } from "react";
import ActorCard from "../ActorCard/ActorCard.jsx";
import "./ActorCarousel.css";
import { useForm } from "../../../../../context/FormProvider.jsx"; 

const ActorCarousel = ({ cast, movieId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);
  const containerRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { openForm } = useForm();
  const [deletedActorIds, setDeletedActorIds] = useState(() => {
    const storedDeletedActors = localStorage.getItem("deletedActors");
    return storedDeletedActors ? JSON.parse(storedDeletedActors) : [];
  });

  useEffect(() => {
    const calculateCardsToShow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 220;
        const maxCards = Math.floor(containerWidth / cardWidth);
        setCardsToShow(Math.max(1, maxCards));
      }
    };
    calculateCardsToShow();
    window.addEventListener("resize", calculateCardsToShow);
    return () => window.removeEventListener("resize", calculateCardsToShow);
  }, []);

  useEffect(() => {
    const checkAdminStatus = () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      setIsAdmin(currentUser && currentUser.role === "admin");
    };
    checkAdminStatus();
    const handleAuthChange = () => checkAdminStatus();
    document.addEventListener("authStatusChanged", handleAuthChange);
    return () => document.removeEventListener("authStatusChanged", handleAuthChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("deletedActors", JSON.stringify(deletedActorIds));
  }, [deletedActorIds]);

  const goLeft = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0 && visibleCast.length > 0) return Math.max(visibleCast.length - cardsToShow, 0);
      return Math.max(0, prevIndex - 1);
    });
  };
  const goRight = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= visibleCast.length - cardsToShow && visibleCast.length > 0) return 0;
      return Math.min(visibleCast.length - cardsToShow, prevIndex + 1);
    });
  };

  const handleAddActor = () => {
    if (movieId) {
      openForm("addActor", { movieId: movieId });
    } else {
      console.error("Cannot add actor: movieId is missing from ActorCarousel props.");
    }
  };

  const handleEditActor = (actorIdToEdit) => {
    console.log(`Attempting to edit actor with ID: ${actorIdToEdit}`);
    const allActorsString = localStorage.getItem('allActors') || '[]';
    const allActors = JSON.parse(allActorsString);
    const actorToEdit = allActors.find(actor => actor.id === actorIdToEdit);

    if (actorToEdit) {
      openForm("editActor", { actorData: actorToEdit });
    } else {
      console.error(`Actor with ID "${actorIdToEdit}" not found in localStorage for editing.`);
    }
  };

  const handleDeleteActor = (actorId) => {
    console.log(`Видалити актора з ID: ${actorId}`);
    setDeletedActorIds((prevIds) => {
      if (!prevIds.includes(actorId)) {
        return [...prevIds, actorId];
      }
      return prevIds;
    });

    document.dispatchEvent(new CustomEvent('actorsUpdated'));
  };

  const visibleCast = cast ? cast.filter(actor => !deletedActorIds.includes(actor.id)) : [];
  const hasActors = visibleCast.length > 0;

  return (
    <section className="actor-carousel-wrapper">
      <div className="actor-carousel-header">
        <h2 className="carousel-title">Cast</h2>
        {isAdmin && (
          <button className="add-actor-button-wrapper" onClick={handleAddActor}>
            <i className="fa-solid fa-plus"></i>
            <span className="add-actor-text">Add actor</span>
          </button>
        )}
      </div>
      <div className="actor-carousel" ref={containerRef}>
        {hasActors ? (
          <>
            <button onClick={goLeft} className="carousel-btn left">{"<"}</button>
            <div className="actor-cards-container">
              {visibleCast.slice(currentIndex, currentIndex + cardsToShow).map((actor) => (
                <div key={actor.id || actor.name} className="actor-card-with-actions">
                  <ActorCard actor={actor} />
                  {isAdmin && (
                    <div className="actor-actions">
                      <button
                        className="actor-action-btn delete-actor-btn"
                        onClick={() => handleDeleteActor(actor.id)}
                        aria-label="Delete actor"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                      <button
                        className="actor-action-btn edit-actor-btn"
                        onClick={() => handleEditActor(actor.id)}
                      >
                        <i className="fa-solid fa-edit"></i>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={goRight} className="carousel-btn right">{">"}</button>
          </>
        ) : (
          <p className="no-actors-message">Cast information is not available.</p>
        )}
      </div>
    </section>
  );
};

export default ActorCarousel;